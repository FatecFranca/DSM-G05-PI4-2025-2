import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";
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
      console.error("Erro:", err);
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

  const picoHoras = {};
  registros.forEach((v) => {
    if (!v.horaEntrada) return;
    const d = new Date(v.horaEntrada);
    if (!isNaN(d)) {
      const h = d.getHours();
      picoHoras[h] = (picoHoras[h] || 0) + 1;
    }
  });

  const barData = Object.keys(picoHoras)
    .map(Number)
    .sort((a, b) => a - b)
    .map((h) => ({ hora: `${h}h`, quantidade: picoHoras[h] }));

  const registrosComTempo = registros.filter(
    (v) => v.horaEntrada && v.horaSaida
  );

  const temposPorIntervalo = {};

  registrosComTempo.forEach((v) => {
    const e = new Date(v.horaEntrada);
    const s = new Date(v.horaSaida);
    if (!isNaN(e) && !isNaN(s)) {
      const h = e.getHours();
      const tempo = (s - e) / 60000;
      const intervalo = Math.floor(h / 2) * 2;
      if (!temposPorIntervalo[intervalo]) temposPorIntervalo[intervalo] = [];
      temposPorIntervalo[intervalo].push(tempo);
    }
  });

  const intervalosComDados = Object.keys(temposPorIntervalo)
    .map(Number)
    .sort((a, b) => a - b);

  const intervalLabels = intervalosComDados.map((h) => `${h}-${h + 2}h`);

  const intervalData = intervalosComDados.map((h) => {
    const tempos = temposPorIntervalo[h];
    return Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length);
  });

  const entradasPorDia = {};

  registros.forEach((v) => {
    if (!v.horaEntrada) return;
    const d = new Date(v.horaEntrada);
    if (!isNaN(d)) {
      const dia = d.toISOString().split("T")[0];
      entradasPorDia[dia] = (entradasPorDia[dia] || 0) + 1;
    }
  });

  const diasOrdenados = Object.keys(entradasPorDia).sort();
  const lineLabels = diasOrdenados;
  const lineValues = diasOrdenados.map((d) => entradasPorDia[d]);

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
              ["Média", `${estatisticas.media.toFixed(2)} min`],
              ["Mediana", `${estatisticas.mediana.toFixed(2)} min`],
              ["Moda", `${estatisticas.moda.toFixed(2)} min`],
              ["Desvio Padrão", `${estatisticas.desvio_padrao.toFixed(2)} min`],
              ["Assimetria", estatisticas.assimetria?.toFixed(2) ?? "-"],
              ["Curtose", estatisticas.curtose?.toFixed(2) ?? "-"],
              ["Probabilidade > 90 min", `${estatisticas["probabilidade_>90min"]}%`],
              ["Tempo médio previsto", `${estatisticas.regressao.intercepto.toFixed(2)} min`],
            ].map(([title, value], i) => (
              <StatCard key={i}>
                <ChartTitle>{title}</ChartTitle>
                <ValueText>{value}</ValueText>
              </StatCard>
            ))}
          </CardGrid>

          {barData.length > 0 && (
            <ChartCard>
              <ChartHeader>
                <ChartTitle
                  style={{
                    fontFamily: fontsLoaded ? "Saira_700Bold" : "System",
                  }}
                >
                  Entradas por Hora do Dia
                </ChartTitle>
              </ChartHeader>

              <BarChart
                data={{
                  labels: barData.map((i) => i.hora),
                  datasets: [{ data: barData.map((i) => i.quantidade) }],
                }}
                width={screenWidth * 0.9}
                height={260}
                fromZero
                showValuesOnTopOfBars
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(64, 80, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForBackgroundLines: { stroke: "#e5e7eb", strokeDasharray: "" },
                  propsForLabels: { rotation: 0, fontSize: 12, fontFamily: fontsLoaded ? "Saira_700Bold" : "System" },
                }}
                style={{ borderRadius: 16, marginVertical: 8 }}
                barPercentage={0.55}
                segments={5}
              />
            </ChartCard>
          )}

          {intervalData.length > 0 && (
            <ChartCard>
              <ChartHeader>
                <ChartTitle
                  style={{
                    fontFamily: fontsLoaded ? "Saira_700Bold" : "System",
                  }}
                >
                  Tempo Médio de Permanência por Intervalo de 2h (min)
                </ChartTitle>
              </ChartHeader>

              <BarChart
                data={{
                  labels: intervalLabels,
                  datasets: [{ data: intervalData }],
                }}
                width={screenWidth * 0.9}
                height={260}
                fromZero
                showValuesOnTopOfBars
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(64, 80, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForBackgroundLines: { stroke: "#e5e7eb", strokeDasharray: "" },
                  propsForLabels: {
                    rotation: 0, fontSize: 12, fontFamily: fontsLoaded ? "Saira_700Bold" : "System",
                  },
                }}
                style={{ borderRadius: 16, marginVertical: 8 }}
                barPercentage={0.55}
                segments={5}
              />
            </ChartCard>
          )}

          {lineValues.length > 0 && (
            <ChartCard>
              <ChartHeader>
                <ChartTitle
                  style={{
                    fontFamily: fontsLoaded ? "Saira_700Bold" : "System",
                  }}
                >
                  Entradas por Dia
                </ChartTitle>
              </ChartHeader>

              <LineChart
                data={{
                  labels: lineLabels,
                  datasets: [
                    {
                      data: lineValues,
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={screenWidth * 0.9}
                height={260}
                fromZero
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(64, 80, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: "#4050FF",
                  },
                  propsForBackgroundLines: {
                    stroke: "#e5e7eb",
                  },
                  propsForLabels: {
                    fontSize: 12,
                    fontFamily: fontsLoaded ? "Saira_700Bold" : "System",
                  },
                }}
                style={{ borderRadius: 16, marginVertical: 8 }}
                bezier
              />
            </ChartCard>
          )}
        </ScrollView>

        <BottomNavCustom />
      </Content>
    </Container>
  );
}