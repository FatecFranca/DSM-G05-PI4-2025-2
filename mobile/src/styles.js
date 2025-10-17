import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, TextInput, View, Text, Image, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;

// Estilos das páginas de Login e Cadastro

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  background-color: #F7F7FA;
`;

export const ScrollView = styled.ScrollView`
  width: 100%;
  flex-grow: 1;
`;

export const TopSection = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  margin-top: 80px;
`;

export const BottomSection = styled.View`
  width: 100%;
  align-items: center;
  justify-content: flex-end;
`;

export const BottomSectionLogin = styled(BottomSection)`
  margin-bottom: 80px;
`;

export const Logo = styled.View`
  margin-bottom: 20px;
  align-items: center;
`;

export const LogoText = styled.Text`
  font-family: Montserrat_400Regular;
  text-align: center;
  color: #5676E6;
  font-size: 12px;
  margin-top: 10px;
`;

export const FieldContainer = styled.View`
  width: 80%;
  align-items: flex-start;
  margin-bottom: 15px;
`;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: "#5B5B7E",
})`
  background-color: #fff;
  border-bottom-width: 2px;
  border-bottom-color: #ccc;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 10px;
  margin-vertical: 10px;
  width: 100%;
  color: #5B5B7E;
`;

export const Button = styled(TouchableOpacity)`
  border-radius: 15px;
  padding-vertical: 15px;
  padding-horizontal: 50px;
  width: ${screenWidth * 0.8}px;
  align-items: center;
`;

export const ButtonGradient = styled(LinearGradient)`
  border-radius: 15px;
  padding-vertical: 15px;
  padding-horizontal: 50px;
  width: ${screenWidth * 0.8}px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  font-family: Montserrat_600SemiBold;
  color: #fff;
  text-transform: uppercase;
  font-size: 18px;
`;

export const Link = styled.Text`
  font-family: Montserrat_400Regular;
  color: #203D65;
  font-size: 14px;
  margin-top: 10px;
`;

export const Label = styled.Text`
  font-family: Montserrat_600SemiBold;
  font-size: 12px;
  color: #9695A8;
`;

export const LogoImage = styled.Image`
  resize-mode: contain;
`;