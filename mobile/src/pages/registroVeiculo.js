import { useState } from "react";
import {
  Container,
  Content,
  FieldContainer,
  Label,
  Input,
  Button,
  ButtonGradient,
  ButtonText,
  TopSection,
  ScrollView,
  BottomSection
} from "../styles";
import { useFonts, Saira_700Bold } from "@expo-google-fonts/saira";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity, View, Text } from "react-native";
import { getUsuario } from "../utils/getUsuario";
import BottomNavCustom from "../components/BottomNavCustom";

export default function RegistroVeiculo({ navigation }) {
  const [tipo, setTipo] = useState("morador");
  const [currentPage, setCurrentPage] = useState("registroVeiculo");

  const [nomeVisitante, setNomeVisitante] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [cor, setCor] = useState("");

  const [fontsLoaded] = useFonts({
    Saira_700Bold,
  });

  const handleRegistro = async () => {
    let body = {};

    if (!modelo || !placa || !cor) {
      alert("Preencha todos os campos.");
      return;
    }

    const token = await AsyncStorage.getItem("token");

    if (tipo === "visitante") {
      const visitantes = await fetch(
        "http://192.168.100.88:8080/visitantes",
        { headers: { Authorization: `Bearer ${token}` } }
      ).then(res => res.json());

      const visitanteEncontrado = visitantes.find(
        (v) => v.documento === nomeVisitante
      );

      if (!visitanteEncontrado) {
        alert("Visitante não encontrado.");
        return;
      }

      body = {
        modelo,
        placa,
        cor,
        visitanteId: visitanteEncontrado.id
      };

    } else {
      const usuario = await getUsuario();

      if (!usuario?.id) {
        alert("Usuário não encontrado.");
        return;
      }

      body = {
        modelo,
        placa,
        cor,
        usuarioId: usuario.id
      };
    }

    const url = "http://192.168.100.88:8080/veiculos";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      alert("Cadastro realizado com sucesso!");
      navigation.navigate("veiculos");
    } else {
      alert("Erro ao cadastrar veículo.");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <Container>
      <Content>
        <ScrollView>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 40,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setTipo("morador")}
              style={{
                padding: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor: tipo === "morador" ? "#656CEE" : "#DDD",
                marginRight: 10,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Morador</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTipo("visitante")}
              style={{
                padding: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor: tipo === "visitante" ? "#656CEE" : "#DDD",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Visitante</Text>
            </TouchableOpacity>
          </View>

          <TopSection style={{ marginTop: 20 }}>

            {tipo === "visitante" && (
              <FieldContainer>
                <Label>Documento do Visitante</Label>
                <Input
                  placeholder="Documento (CPF ou RG)"
                  placeholderTextColor="#BBBBBB"
                  value={nomeVisitante}
                  onChangeText={setNomeVisitante}
                />
              </FieldContainer>
            )}

            <FieldContainer>
              <Label>Modelo do Veículo</Label>
              <Input
                placeholder="Modelo"
                placeholderTextColor="#BBBBBB"
                value={modelo}
                onChangeText={setModelo}
              />
            </FieldContainer>

            <FieldContainer>
              <Label>Placa do Veículo</Label>
              <Input
                placeholder="Placa"
                placeholderTextColor="#BBBBBB"
                value={placa}
                onChangeText={setPlaca}
              />
            </FieldContainer>

            <FieldContainer>
              <Label>Cor do Veículo</Label>
              <Input
                placeholder="Cor"
                placeholderTextColor="#BBBBBB"
                value={cor}
                onChangeText={setCor}
              />
            </FieldContainer>

          </TopSection>

          <BottomSection>
            <Button onPress={handleRegistro}>
              <ButtonGradient
                colors={["#969BFF", "#656CEE"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <ButtonText>
                  Cadastrar Veículo
                </ButtonText>
              </ButtonGradient>
            </Button>
          </BottomSection>

        </ScrollView>
      </Content>

      <BottomNavCustom
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

    </Container>
  );
}
