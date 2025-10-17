import React, { useState } from "react";
import { useFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Container, TopSection, BottomSectionLogin, Logo, LogoText, LogoImage, FieldContainer, Input, Label, Button, ButtonGradient, ButtonText, Link } from "../styles";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Preencha e-mail e senha!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha:password }),
      });

      const data = await response.json();

      if (response.ok) {
        AsyncStorage.setItem("token", data.token);
        navigation.navigate("main");
      } else {
        alert(data.message || "E-mail ou senha inválidos!");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com a API");
    }
  };

  const handleCadastro = () => {
    navigation.navigate('cadastro')
  }

  return (
    <Container>
      <TopSection>
        <Logo>
          <LogoImage source={require('../../assets/logo.png')} />
          <LogoText>MONIT</LogoText>
        </Logo>

        <FieldContainer>
          <Label>E-mail</Label>
          <Input
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
          />
        </FieldContainer>

        <FieldContainer>
          <Label>Senha</Label>
          <Input
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </FieldContainer>
      </TopSection>

      <BottomSectionLogin>
        <Button onPress={handleLogin}>
          <ButtonGradient
            colors={["#969BFF", "#656CEE"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <ButtonText>Acessar</ButtonText>
          </ButtonGradient>
        </Button>
        <TouchableOpacity onPress={handleCadastro}>
          <Link>Ainda não tem uma conta? Cadastre-se.</Link>
        </TouchableOpacity>
      </BottomSectionLogin>
    </Container >
  );
};

export default Login;