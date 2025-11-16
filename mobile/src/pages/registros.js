import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Container,
  Card,
  CarInfo,
  CarPlate,
  CarModel,
  CarType,
  Loading,
  Content,
  BoldText,
  FlatList,
  CarRight,
  CarLeft,
  CarOwner,
} from "../styles";
import BottomNavCustom from "../components/BottomNavCustom";
import api from "../services/api";
import { getUsuario } from "../utils/getUsuario";

export default function Registros() {
  const [registrosAgrupados, setRegistrosAgrupados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    let interval;

    const carregarRegistros = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const user = await getUsuario();
        setUsuario(user);

        const tipoUsuario = user?.tipo || user?.role;
        const idUsuario = user?.id;

        const response = await api.get("/lista-controle", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let registros = response.data;

        if (tipoUsuario === "MORADOR") {
          registros = registros.filter(
            (r) => r.usuario && r.usuario.id === idUsuario
          );
        }

        const registrosOrdenados = registros.sort(
          (a, b) => new Date(b.horaEntrada) - new Date(a.horaEntrada)
        );

        const agrupados = registrosOrdenados.reduce((acc, registro) => {
          const data = new Date(registro.horaEntrada).toLocaleDateString("pt-BR");
          if (!acc[data]) acc[data] = [];
          acc[data].push(registro);
          return acc;
        }, {});

        const grupos = Object.keys(agrupados).map((data) => ({
          data,
          registros: agrupados[data],
        }));

        setRegistrosAgrupados(grupos);
      } catch (error) {
        console.error("Erro ao carregar registros:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarRegistros();
    interval = setInterval(carregarRegistros, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !usuario) {
    return (
      <Loading>
        <ActivityIndicator size="large" color="#635BFF" />
      </Loading>
    );
  }

  const renderRegistro = (item) => {
    const horaSaida = item.horaSaida
      ? new Date(item.horaSaida).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
      : "Ainda não saiu";

    const horaEntrada = new Date(item.horaEntrada).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const nomeDono =
      usuario?.tipo === "MORADOR"
        ? null
        : item.usuario?.nome || "Visitante";

    return (
      <Card key={item.id}>
        <CarInfo>
          <CarLeft>
            <CarModel>{item.motivo}</CarModel>
            <CarPlate>{item.placa}</CarPlate>
          </CarLeft>

          <CarRight>
            {nomeDono && <CarOwner>{nomeDono}</CarOwner>}
            <CarType>
              {horaEntrada} - {horaSaida}
            </CarType>
          </CarRight>
        </CarInfo>
      </Card>
    );
  };

  return (
    <Container>
      <Content>
        <BoldText>Entrada/Saída</BoldText>

        {registrosAgrupados.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ color: "#666", fontSize: 16 }}>
              {usuario?.tipo === "PORTEIRO"
                ? "Nenhum registro encontrado no sistema."
                : "Você ainda não possui registros de entrada/saída."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={registrosAgrupados}
            keyExtractor={(item) => item.data}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#444",
                    marginBottom: 10,
                  }}
                >
                  {item.data}
                </Text>

                {item.registros.map((registro) => renderRegistro(registro))}
              </View>
            )}
          />
        )}
        <BottomNavCustom />
      </Content>
    </Container>
  );
}