import React, { useState } from "react";
import { useFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Container, TopSection, BottomSectionLogin, Logo, LogoText, LogoImage, FieldContainer, Input, Label, Button, ButtonGradient, ButtonText, Link } from "../styles";
import api from "../services/api";

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
      const response = await api.post("/usuarios/login", {
        email,
        senha: password,
      });

      const data = response.data;

      await AsyncStorage.setItem("token", data.token);
      navigation.navigate("main");
    } catch (error) {
      console.error("Erro no login:", error.response?.data || error.message);
      alert(error.response?.data?.message || "E-mail ou senha inválidos!");
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