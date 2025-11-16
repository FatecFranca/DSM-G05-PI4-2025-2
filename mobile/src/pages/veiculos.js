import React, { Component } from "react";
import { ActivityIndicator, TouchableOpacity, Text, Alert, View } from "react-native";
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
import { Feather } from "@expo/vector-icons";

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
        this.setState({ loading: false });
        return;
      }

      const response = await api.get("/veiculos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let veiculos = response.data;

      if (usuario?.tipo === "MORADOR") {
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

  deleteVeiculo = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await api.delete(`/veiculos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.setState((prevState) => ({
        veiculos: prevState.veiculos.filter((v) => v.id !== id),
      }));
    } catch (error) {
      console.log("Erro ao excluir veículo:", error.response?.data || error);
    }
  };

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.navigate("detalhesVeiculo", { veiculo: item })
      }
    >
      <Card>
        <CarInfo>
          <CarLeft>
            <CarModel>{item.modelo}</CarModel>
            <CarPlate>{item.placa}</CarPlate>
          </CarLeft>

          <CarRight>
            {this.state.usuario?.tipo === "PORTEIRO" && (
              <CarOwner>{item.usuario?.nome}</CarOwner>
            )}

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Confirmar exclusão",
                  "Deseja realmente excluir este veículo?",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Excluir",
                      style: "destructive",
                      onPress: () => this.deleteVeiculo(item.id),
                    },
                  ]
                );
              }}
              style={{
                marginTop: 8,
                backgroundColor: "#FF4C4C",
                padding: 10,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="trash-2" size={20} color="#fff" />
            </TouchableOpacity>
          </CarRight>
        </CarInfo>
      </Card>
    </TouchableOpacity>
  );

  render() {
    const { veiculos, loading, usuario } = this.state;

    if (loading) {
      return (
        <LoadingContainer>
          <ActivityIndicator size="large" color="#635BFF" />
        </LoadingContainer>
      );
    }

    const mensagem =
      usuario?.tipo === "PORTEIRO"
        ? "Nenhum veículo cadastrado no sistema."
        : "Você ainda não possui veículos cadastrados.";

    return (
      <Container>
        <Content style={{ paddingBottom: 60 }}>
          <BoldText>Veículos</BoldText>

          {veiculos.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Text style={{ color: "#666", fontSize: 16 }}>{mensagem}</Text>
            </View>
          ) : (
            <FlatList
              data={veiculos}
              keyExtractor={(item) => String(item.id)}
              renderItem={this.renderItem}
              showsVerticalScrollIndicator={false}
            />
          )}

          <BottomNavCustom />
        </Content>
      </Container>
    );
  }
}