import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, Dimensions } from "react-native";
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

// Estilos da página Main

export const Header = styled.View`
  flex-direction: row;
  background-color: #676cff;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 20px;
  padding-vertical: 15px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`;

export const MenuButton = styled.TouchableOpacity`
  background-color: #ffffff33;
  border-radius: 8px;
  padding: 5px;
`;

export const HeaderTitle = styled.Text`
  font-family: Montserrat_700Bold;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
`;

export const LogoHeader = styled.Image`
  width: 30px;
  height: 30px;
`;

export const Content = styled.View`
  flex: 1;
  align-items: center;
  margin-top: 40px;
  width: 100%;
`;

export const BoldText = styled.Text`
  font-family: Saira_700Bold;
  font-size: 18px;
  color: #333E63;
  margin-bottom: 30px;
  text-transform: uppercase;
  font-align: flex-start;
  width: 85%;
`;

export const Buttons = styled.TouchableOpacity`
  width: 85%;
  background-color: #bfc8ff;
  border-radius: 12px;
  padding-vertical: 15px;
  align-items: center;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-offset: 0px 3px;
  shadow-radius: 4px;
  elevation: 3;
`;

export const ButtonsText = styled.Text`
  font-family: Saira_700Bold;
  font-size: 18px;
  color: #333E63;
  text-transform: uppercase;
`;

export const BottomNav = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: #2E2F3E;
  height: 60px;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

export const IconWrapper = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 8px;
  ${(props) =>
    props.active &&
    `
    background-color: #ffffff33;
  `}
`;

// Estilos da página de Registros

export const Title = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

export const Card = styled.View`
  flex-direction: row;
  background-color: #fff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  align-items: center;
  width: 100%;
`;

export const Info = styled.View`
  flex: 1;
  margin-right: 10px;
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Name = styled.Text`
  font-weight: 700;
  font-size: 14px;
  color: #333;
`;

export const Placa = styled.Text`
  font-size: 12px;
  color: #999;
`;

export const Tipo = styled.Text`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

export const VehicleImage = styled.Image`
  width: 60px;
  height: 40px;
  border-radius: 8px;
`;

export const Loading = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

// Estilos da página de Veículos

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const CarInfo = styled.View`
  flex: 1;
  margin-left: 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CarModel = styled.Text`
  font-family: Montserrat_600SemiBold;
  font-size: 16px;
  font-weight: bold;
  color: #606470;
`;

export const CarPlate = styled.Text`
  font-family: Montserrat_400Regular;
  font-size: 14px;
  color: #999;
  margin-top: 3px;
`;

export const CarType = styled.Text`
  font-size: 14px;
  color: #635bff;
  font-weight: 500;
  margin-top: 3px;
`;

export const CarImage = styled.Image`
  width: 80px;
  height: 50px;
  border-radius: 8px;
`;

export const FlatList = styled.FlatList`
  width: 85%;
  padding-bottom: 60;
`;

export const CarLeft = styled.View`
  flex-direction: column;
`;

export const CarRight = styled.View`
  align-items: flex-end;
`;

export const CarOwner = styled.Text`
  font-size: 14px;
  color: #444;
  font-weight: 500;
`;

// Estilos da página Main

export const ChartTitle = styled.Text`
  font-family: Montserrat_700Bold;
  font-size: 14px;
  color: #333E63;
  margin-bottom: 10px;
`;

export const CardGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 90%;
  margin-bottom: 30px;
`;

export const StatCard = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  width: 45%;
  margin: 5px;
  padding: 15px;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-offset: 0px 2px;
  shadow-radius: 4px;
  elevation: 3;
`;

export const ValueText = styled.Text`
  font-family: Saira_700Bold;
  font-size: 16px;
  color: #2637a3;
  margin-top: 5px;
`;

export const ChartsSection = styled.View`
  width: 100%;
  align-items: center;
  padding-bottom: 40px;
`;

export const ChartCard = styled.View`
  width: 92%;
  background-color: #ffffff;
  border-radius: 18px;
  padding: 15px 10px 10px 10px;
  margin-bottom: 25px;
  elevation: 5;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-offset: 0px 4px;
  shadow-radius: 6px;
`;

export const ChartHeader = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: 10px;
`;

// Estilos da página Perfil

export const HeaderPerfil = styled.View`
  width: 85%;
  align-self: center;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const LogoutButton = styled.TouchableOpacity`
  padding: 6px;
  border-radius: 8px;
`;

export const LogoutIcon = styled.View`
  align-items: center;
  justify-content: center;
`;
