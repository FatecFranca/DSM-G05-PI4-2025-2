import React, { useState, useEffect } from "react";
import { Dimensions, View, Text } from "react-native";
import {
  Container,
  ScrollView,
  Content,
  BoldText,
  CardGrid,
  StatCard,
  ChartCard,
  ChartHeader,
  ChartTitle,
  ValueText,
  ChartsSection,
} from "../styles";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Saira_700Bold } from "@expo-google-fonts/saira";
import BottomNavCustom from "../components/BottomNavCustom";
import { BarChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Main() {
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({ Saira_700Bold });

  const fetchEstatisticas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return console.log("Nenhum token encontrado!");

      const responseRegistros = await api.get("/lista-controle", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const registros = Array.isArray(responseRegistros.data)
        ? responseRegistros.data
        : [];

      const responseEstat = await api.post(
        "/estatisticas",
        { registros },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEstatisticas({ ...responseEstat.data, registros });
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstatisticas();
  }, []);

  if (loading || !estatisticas) {
    return (
      <Container>
        <Content>
          <BoldText>Carregando...</BoldText>
        </Content>
      </Container>
    );
  }

  const { registros } = estatisticas;

  const registrosComTempo = registros.filter(
    (v) => v.horaEntrada && v.horaSaida
  );

  const intervalos = [];
  for (let h = 0; h < 24; h += 2.5) {
    intervalos.push(h);
  }
  const temposPorIntervalo = {};

  registrosComTempo.forEach((v) => {
    const hora = new Date(v.horaEntrada).getHours();
    const tempo = (new Date(v.horaSaida) - new Date(v.horaEntrada)) / 60000;
    const intervalo = Math.floor(hora / 2) * 2;
    if (!temposPorIntervalo[intervalo]) temposPorIntervalo[intervalo] = [];
    temposPorIntervalo[intervalo].push(tempo);
  });

  const intervalLabels = intervalos.map((h) => `${h}-${h + 1}h`);
  const intervalData = intervalos.map((h) => {
    const tempos = temposPorIntervalo[h] || [];
    if (tempos.length === 0) return 0;
    return Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length);
  });

  const picoHoras = {};
  registros.forEach((v) => {
    if (v.horaEntrada) {
      const hora = new Date(v.horaEntrada).getHours();
      picoHoras[hora] = (picoHoras[hora] || 0) + 1;
    }
  });

  const horasComRegistro = Object.keys(picoHoras)
    .map(Number)
    .sort((a, b) => a - b);

  const dataPicos = horasComRegistro.map((h) => picoHoras[h]);
  const labelsPicos = horasComRegistro.map((h) => `${h}h`);

  return (
    <Container>
      <Content>
        <BoldText>Estatísticas Gerais</BoldText>
        <ScrollView
          contentContainerStyle={{ alignItems: "center", paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <CardGrid>
            {[
              ["Média", `${estatisticas.media} min`],
              ["Mediana", `${estatisticas.mediana} min`],
              ["Moda", `${estatisticas.moda} min`],
              ["Desvio Padrão", `${estatisticas.desvio_padrao} min`],
              ["Assimetria", estatisticas.assimetria],
              ["Curtose", estatisticas.curtose],
              ["Prob. > 90 min", `${estatisticas["probabilidade_>90min"]}%`],
            ].map(([title, value], i) => (
              <StatCard key={i}>
                <ChartTitle>{title}</ChartTitle>
                <ValueText>{value}</ValueText>
              </StatCard>
            ))}
          </CardGrid>

          <ChartsSection>
            {intervalData.length > 0 && (
              <ChartCard>
                <ChartHeader>
                  <ChartTitle
                    style={{ fontFamily: fontsLoaded ? "Saira_700Bold" : "System" }}
                  >
                    Tempo Médio de Permanência por Intervalo de 2h (min)
                  </ChartTitle>
                </ChartHeader>
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BarChart
                    data={{
                      labels: intervalLabels,
                      datasets: [{ data: intervalData }],
                    }}
                    width={screenWidth * 0.9}
                    height={240}
                    fromZero
                    showValuesOnTopOfBars
                    withHorizontalLabels={false}
                    chartConfig={{
                      backgroundColor: "#eef0ff",
                      backgroundGradientFrom: "#eef0ff",
                      backgroundGradientTo: "#eef0ff",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(64, 80, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(90, 90, 120, ${opacity})`,
                      propsForLabels: {
                        rotation: 45,
                        fontSize: 12,
                        fontWeight: "bold",
                      },
                      propsForBackgroundLines: { stroke: "#dfe2ff" },
                    }}
                    style={{
                      borderRadius: 16,
                      marginVertical: 8,
                      paddingLeft: 0,
                      paddingRight: 0,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    barPercentage={0.5}
                    segments={5}
                  />
                </View>
              </ChartCard>
            )}

            {dataPicos.length > 0 && (
              <ChartCard>
                <ChartHeader>
                  <ChartTitle
                    style={{ fontFamily: fontsLoaded ? "Saira_700Bold" : "System" }}
                  >
                    Picos de Entrada por Hora
                  </ChartTitle>
                </ChartHeader>
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 8,
                    backgroundColor: "#eef0ff",
                    borderRadius: 16,
                  }}
                >
                  {dataPicos.map((value, index) => {
                    const maxBarWidth = screenWidth * 0.9 * 0.7;
                    const barraWidth = (maxBarWidth * value) / Math.max(...dataPicos);

                    return (
                      <View
                        key={index}
                        style={{
                          width: "90%",
                          marginVertical: 4,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            width: 40,
                            fontSize: 12,
                            fontWeight: "bold",
                            color: "#5a5a78",
                          }}
                        >
                          {labelsPicos[index]}
                        </Text>

                        <View
                          style={{
                            height: 24,
                            width: barraWidth,
                            backgroundColor: "rgba(64, 80, 255, 0.8)",
                            borderRadius: 8,
                            justifyContent: "center",
                            paddingHorizontal: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: "bold",
                              textAlign: "right",
                            }}
                          >
                            {value}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ChartCard>
            )}
          </ChartsSection>
        </ScrollView>
        <BottomNavCustom />
      </Content>
    </Container>
  );
}
