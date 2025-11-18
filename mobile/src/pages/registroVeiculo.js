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
  BottomSection,
} from "../styles";
import { useFonts, Saira_700Bold } from "@expo-google-fonts/saira";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity, View, Text } from "react-native";
import { getUsuario } from "../utils/getUsuario";
import BottomNavCustom from "../components/BottomNavCustom";
import api from "../services/api";

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

  const normalizeVisitantes = (parsed) => {
    if (!parsed) return [];
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.data)) return parsed.data;
    if (Array.isArray(parsed.visitantes)) return parsed.visitantes;

    const firstArray = Object.values(parsed).find((v) => Array.isArray(v));
    if (Array.isArray(firstArray)) return firstArray;

    return [];
  };

  const handleRegistro = async () => {
    if (!modelo.trim() || !placa.trim() || !cor.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      alert("Token não encontrado. Faça login novamente.");
      return;
    }

    let body = {};

    try {
      if (tipo === "visitante") {
        if (!nomeVisitante.trim()) {
          alert("Digite o documento ou nome do visitante.");
          return;
        }

        const res = await api.get("/visitantes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const parsed = res.data;
        const visitantes = normalizeVisitantes(parsed);

        if (!visitantes.length) {
          alert("Nenhum visitante cadastrado foi encontrado.");
          return;
        }

        const documentoBusca = nomeVisitante.replace(/\D/g, "");

        const visitanteEncontrado = visitantes.find((v) => {
          const documentoV = (v.documento || "")
            .toString()
            .replace(/\D/g, "");

          const nomeV = (v.nome || "").toLowerCase();

          return (
            documentoBusca === documentoV ||
            nomeVisitante.toLowerCase() === nomeV
          );
        });

        if (!visitanteEncontrado) {
          alert("Visitante não encontrado. Verifique o documento ou nome.");
          return;
        }

        body = {
          modelo: modelo.trim(),
          placa: placa.trim().toUpperCase(),
          cor: cor.trim(),
          visitanteId: visitanteEncontrado.id,
        };
      } else {
        const usuario = await getUsuario();

        if (!usuario?.id) {
          alert("Usuário não encontrado.");
          return;
        }

        body = {
          modelo: modelo.trim(),
          placa: placa.trim().toUpperCase(),
          cor: cor.trim(),
          usuarioId: usuario.id,
        };
      }

      await api.post("/veiculos", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Cadastro realizado com sucesso!");
      navigation.navigate("veiculos");

    } catch (error) {
      console.error("Erro inesperado em handleRegistro:", error);

      if (error.response?.data?.message) {
        alert("Erro: " + error.response.data.message);
      } else {
        alert("Erro inesperado. Veja o console.");
      }
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
                <Label>Documento ou Nome do Visitante</Label>
                <Input
                  placeholder="CPF, RG ou Nome"
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
                autoCapitalize="characters"
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
                <ButtonText>Cadastrar Veículo</ButtonText>
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