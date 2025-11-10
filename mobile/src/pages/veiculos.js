import React, { Component } from "react";
import { ActivityIndicator } from "react-native";
import api from "../services/api";
import {
  Container,
  LoadingContainer,
  Card,
  CarOwner,
  CarInfo,
  CarModel,
  CarPlate,
  BoldText,
  Content,
  FlatList,
  CarLeft,
  CarRight
} from "../styles";
import BottomNavCustom from '../components/BottomNavCustom';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUsuario } from "../utils/getUsuario";

export default class Veiculos extends Component {
  state = {
    veiculos: [],
    loading: true,
    usuario: null
  };

  async componentDidMount() {
    try {
      const usuario = await getUsuario();
      this.setState({ usuario });

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Nenhum token encontrado!");
        this.setState({ loading: false });
        return;
      }

      const response = await api.get("/veiculos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let veiculos = response.data;

      if (usuario?.tipo === "morador") {
        veiculos = veiculos.filter(
          (v) => v.usuario?.id === usuario.id
        );
      }

      this.setState({ veiculos, loading: false });
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      this.setState({ loading: false });
    }
  }

  renderItem = ({ item }) => (
    <Card>
      <CarInfo>
        <CarLeft>
          <CarModel>{item.modelo}</CarModel>
          <CarPlate>{item.placa}</CarPlate>
        </CarLeft>

        <CarRight>
          <CarOwner>{item.usuario?.nome}</CarOwner>
        </CarRight>
      </CarInfo>
    </Card>
  );

  render() {
    const { veiculos, loading } = this.state;

    if (loading) {
      return (
        <LoadingContainer>
          <ActivityIndicator size="large" color="#635BFF" />
        </LoadingContainer>
      );
    }

    return (
      <Container>
        <Content>
          <BoldText>Veículos</BoldText>

          <FlatList
            data={veiculos}
            keyExtractor={(item) => item.placa}
            renderItem={this.renderItem}
            showsVerticalScrollIndicator={false}
          />

          <BottomNavCustom />
        </Content>
      </Container>
    );
  }
}