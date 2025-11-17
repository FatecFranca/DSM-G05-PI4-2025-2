import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Header, HeaderTitle, LogoHeader } from "../styles";
export default function HeaderCustom({ navigation, route }) {
  const routeTitles = {
    main: "Home",
    perfil: "Perfil",
    registros: "Registros",
    registroVeiculo: "Registro de Veículo",
    detalhesVeiculo: "Detalhes do Veículo",
    login: "Login",
    cadastro: "Cadastro",
    veiculos: "Veículos",
    cadastroVisitante: "Cadastro de Visitante"
  };

  const currentPage = routeTitles[route.name] || route.name;

  return (
    <Header>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <HeaderTitle>{currentPage}</HeaderTitle>

      <LogoHeader source={require('../../assets/logo.png')} />
    </Header>
  );
}