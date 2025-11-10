import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
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
  CarLeft
} from "../styles";
import BottomNavCustom from "../components/BottomNavCustom";
import api from "../services/api";

export default function Registros() {
  const [registros, setRegistros] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    let interval;

    const carregarRegistros = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await api.get("/lista-controle", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRegistros(
          response.data.sort((a, b) => new Date(b.horaEntrada) - new Date(a.horaEntrada))
        );
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

  const renderItem = ({ item }) => {
    const horaSaida = item.horaSaida
      ? new Date(item.horaSaida).toLocaleString("pt-BR")
      : "Ainda não saiu";

    return (
      <Card>
        <CarInfo>
          <CarLeft>
            <CarModel>{item.motivo}</CarModel>
            <CarPlate>{item.placa}</CarPlate>
          </CarLeft>

          <CarRight>
            <CarType>{item.horaSaida ? new Date(item.horaSaida).toLocaleString("pt-BR") : "Ainda não saiu"}</CarType>
          </CarRight>
        </CarInfo>
      </Card>
    );
  };

  if (loading) {
    return (
      <Loading>
        <ActivityIndicator size="large" color="#635BFF" />
      </Loading>
    );
  }

  return (
    <Container>
      <Content>
        <BoldText>Entrada/Saída</BoldText>
        <FlatList
          data={registros.slice(0, page * ITEMS_PER_PAGE)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          onEndReached={() => setPage(prev => prev + 1)}
          onEndReachedThreshold={0.2}
        />
        <BottomNavCustom />
      </Content>
    </Container>
  );
}