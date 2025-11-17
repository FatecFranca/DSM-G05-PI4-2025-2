import React, { useState, useEffect } from "react";
import {
	Container,
	Content,
	BoldText,
	Buttons,
	ButtonsText,
	HeaderPerfil,
	LogoutButton,
	LogoutIcon
} from "../styles";
import BottomNavCustom from '../components/BottomNavCustom';
import { useFonts, Saira_700Bold } from "@expo-google-fonts/saira";
import { getUsuario } from "../utils/getUsuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

export default function Perfil({ navigation }) {
	const [usuario, setUsuario] = useState(null);
	const [currentPage, setCurrentPage] = useState("perfil");

	const [fontsLoaded] = useFonts({
		Saira_700Bold,
	});

	useEffect(() => {
		async function carregar() {
			const usuarioDoToken = await getUsuario();
			setUsuario(usuarioDoToken);
		}
		carregar();
	}, []);

	const handleRegistros = () => {
		navigation.navigate('registros')
	}

	const handleVeiculos = () => {
		navigation.navigate('veiculos')
	}

	const handleRegistrarVeiculo = () => {
		navigation.navigate('registroVeiculo')
	}

	const handleRegistrarVisitante = () => {
		navigation.navigate('cadastroVisitante')
	}

	const handleLogout = async () => {
		await AsyncStorage.removeItem("token");
		navigation.reset({
			index: 0,
			routes: [{ name: 'login' }],
		});
	};

	if (!fontsLoaded) return null;

	return (
		<Container>
			<Content>
				<HeaderPerfil>
					<BoldText style={{ marginBottom: 0 }}>Olá, {usuario ? usuario.nome.split(" ")[0] : "Usuário"}!</BoldText>

					<LogoutButton onPress={handleLogout}>
						<LogoutIcon>
							<MaterialIcons name="logout" size={28} color="#333E63" />
						</LogoutIcon>
					</LogoutButton>
				</HeaderPerfil>

				{usuario && usuario.tipo === "PORTEIRO" ? (
					<>
						<Buttons onPress={handleRegistros}>
							<ButtonsText>Registro de entrada e saída</ButtonsText>
						</Buttons>

						<Buttons onPress={handleVeiculos}>
							<ButtonsText>Ver veículos</ButtonsText>
						</Buttons>

						<Buttons onPress={handleRegistrarVeiculo}>
							<ButtonsText>Registrar veículo</ButtonsText>
						</Buttons>
						<Buttons onPress={handleRegistrarVisitante}>
							<ButtonsText>Cadastrar visitante</ButtonsText>
						</Buttons>
					</>
				) : (
					<>
						<Buttons onPress={handleVeiculos}>
							<ButtonsText>Meus veículos</ButtonsText>
						</Buttons>
						<Buttons onPress={handleRegistrarVeiculo}>
							<ButtonsText>Registrar veículo</ButtonsText>
						</Buttons>
						<Buttons onPress={handleRegistrarVisitante}>
							<ButtonsText>Cadastrar visitante</ButtonsText>
						</Buttons>
					</>
				)}
			</Content>

			<BottomNavCustom
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
		</Container>
	);
}