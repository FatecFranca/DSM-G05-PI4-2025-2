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
	BottomSection
} from "../styles";
import { useFonts, Saira_700Bold } from "@expo-google-fonts/saira";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, Alert } from "react-native";
import { getUsuario } from "../utils/getUsuario";
import BottomNavCustom from "../components/BottomNavCustom";

export default function RegistroVeiculo({ navigation }) {
	const [modelo, setModelo] = useState("");
	const [placa, setPlaca] = useState("");
	const [cor, setCor] = useState("");

	const [currentPage, setCurrentPage] = useState("registroVeiculo");

	const [fontsLoaded] = useFonts({
		Saira_700Bold,
	});

	const handleRegistro = async () => {
		if (!modelo || !placa || !cor) {
			alert("Preencha todos os campos.");
			return;
		}

		let usuario;

		try {
			usuario = await getUsuario();
			if (!usuario || !usuario.id) {
				alert("Usuário não encontrado. Faça login novamente.");
				return;
			}
		} catch (error) {
			console.error(error);
			alert("Falha ao recuperar usuário.");
			return;
		}

		try {
			const token = await AsyncStorage.getItem("token");

			const response = await fetch("http://192.168.100.88:8080/veiculos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify({
					modelo,
					placa,
					cor,
					usuarioId: usuario.id,
				}),
			});

			if (response.ok) {
				alert("Veículo cadastrado com sucesso!");
				navigation.navigate("veiculos");
			} else {
				alert("Erro ao cadastrar veículo.");
			}
		} catch (error) {
			console.error(error);
			alert("Erro de conexão com o servidor.");
		}
	};



	if (!fontsLoaded) return null;

	return (
		<Container>
			<Content>

				<ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
					<TopSection style={{ marginTop: 120 }}>
						<FieldContainer style={{ width: "90%" }}>
							<Label style={{ color: "#1A1A1A" }}>Modelo do Veículo</Label>
							<Input
								placeholder="Modelo"
								placeholderTextColor="#BBBBBB"
								value={modelo}
								onChangeText={setModelo}
								style={{ fontSize: 16 }}
							/>
						</FieldContainer>

						<FieldContainer style={{ width: "90%" }}>
							<Label style={{ color: "#1A1A1A" }}>Placa do Veículo</Label>
							<Input
								placeholder="Placa"
								placeholderTextColor="#BBBBBB"
								value={placa}
								onChangeText={setPlaca}
								style={{ fontSize: 16 }}
							/>
						</FieldContainer>

						<FieldContainer style={{ width: "90%" }}>
							<Label style={{ color: "#1A1A1A" }}>Cor do Veículo</Label>
							<Input
								placeholder="Cor"
								placeholderTextColor="#BBBBBB"
								value={cor}
								onChangeText={setCor}
								style={{ fontSize: 16 }}
							/>
						</FieldContainer>
					</TopSection>

					<BottomSection style={{ marginTop: 20 }}>
						<Button onPress={handleRegistro}>
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
			</Content>
			<BottomNavCustom
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
		</Container>
	);
}
