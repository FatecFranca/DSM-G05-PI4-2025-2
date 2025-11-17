import { useState } from "react";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
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
  ScrollView,
} from "../styles";
import BottomNavCustom from "../components/BottomNavCustom";
import api from "../services/api";
import { getUsuario } from "../utils/getUsuario";

export default function CadastroVisitante({ navigation }) {
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");

  const [currentPage, setCurrentPage] = useState("cadastroVisitante");

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleCadastroVisitante = async () => {
    if (!nome || !documento) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const usuario = await getUsuario();

      if (!usuario?.id) {
        alert("Usuário não encontrado. Faça login novamente.");
        return;
      }

      const response = await api.post("/visitantes", {
        nome,
        documento,
        usuarioId: usuario.id,
      });

      await AsyncStorage.setItem(
        "visitante",
        JSON.stringify({
          id: response.data.id,
          nome: response.data.nome,
          documento: response.data.documento,
          usuarioId: usuario.id,
        })
      );

      alert("Visitante cadastrado com sucesso!");
      navigation.navigate("perfil");
    } catch (error) {
      console.error("Erro no cadastro:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Erro ao conectar ao servidor.");
    }
  };

  return (
    <Container>
      <ScrollView>
        <TopSection>
          <Logo>
            <LogoImage source={require("../../assets/logo.png")} />
            <LogoText>MONIT</LogoText>
          </Logo>

          <FieldContainer>
            <Label>Nome</Label>
            <Input
              placeholder="Nome do visitante"
              value={nome}
              onChangeText={setNome}
            />
          </FieldContainer>

          <FieldContainer>
            <Label>Documento</Label>
            <Input
              placeholder="Documento (RG/CPF)"
              value={documento}
              onChangeText={setDocumento}
            />
          </FieldContainer>
        </TopSection>

        <BottomSection>
          <Button onPress={handleCadastroVisitante}>
            <ButtonGradient
              colors={["#969BFF", "#656CEE"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <ButtonText>Cadastrar</ButtonText>
            </ButtonGradient>
          </Button>
        </BottomSection>
      </ScrollView>

      <BottomNavCustom
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Container>
  );
}
