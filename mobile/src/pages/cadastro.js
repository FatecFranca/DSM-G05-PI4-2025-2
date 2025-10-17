import React, { useState } from "react";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Container,
  TopSection,
  BottomSection,
  Logo,
  LogoText,
  LogoImage,
  FieldContainer,
  Input,
  Label,
  Button,
  ButtonGradient,
  ButtonText,
  Link,
  ScrollView,
} from "../styles";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleCadastro = async () => {
    if (!email || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    const user = { email, password };

    try {
      const response = await fetch(`http://localhost:8080/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome,
          nomeUsuario: nomeUsuario,
          email: email,
          senha: password,
          tipo: "morador",
        }),
      });

      if (response.ok) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        alert("Usuário cadastrado com sucesso!");
        navigation.navigate("login");
      } else {
        alert("Erro ao cadastrar usuário!");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          paddingBottom: 80,
        }}
      >
        <TopSection>
          <Logo>
            <LogoImage source={require("../../assets/logo.png")} />
            <LogoText>MONIT</LogoText>
          </Logo>

          <FieldContainer>
            <Label>Nome</Label>
            <Input placeholder="Nome" value={nome} onChangeText={setNome} />
          </FieldContainer>

          <FieldContainer>
            <Label>Nome de Usuário</Label>
            <Input
              placeholder="Nome de Usuário"
              value={nomeUsuario}
              onChangeText={setNomeUsuario}
            />
          </FieldContainer>

          <FieldContainer>
            <Label>E-mail</Label>
            <Input placeholder="E-mail" value={email} onChangeText={setEmail} />
          </FieldContainer>

          <FieldContainer>
            <Label>Senha</Label>
            <Input
              placeholder="Senha"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />
          </FieldContainer>

          <FieldContainer>
            <Label>Confirme a Senha</Label>
            <Input
              placeholder="Confirme a Senha"
              value={confirmPassword}
              secureTextEntry
              onChangeText={setConfirmPassword}
            />
          </FieldContainer>
        </TopSection>

        <BottomSection>
          <Button onPress={handleCadastro}>
            <ButtonGradient
              colors={["#969BFF", "#656CEE"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <ButtonText>Cadastrar</ButtonText>
            </ButtonGradient>
          </Button>
          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <Link>Já tem uma conta? Faça Login.</Link>
          </TouchableOpacity>
        </BottomSection>
      </ScrollView>
    </Container>
  );
}