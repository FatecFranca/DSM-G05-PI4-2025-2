import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HeaderCustom from './components/HeaderCustom';
import AuthScreen from "./pages/authScreen";
import Login from "./pages/login";
import Cadastro from "./pages/cadastro"
import Main from "./pages/main";
import Perfil from "./pages/perfil";
import Veiculos from "./pages/veiculos";
import Registros from "./pages/registros";
import RegistroVeiculo from "./pages/registroVeiculo";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="authScreen"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="cadastro"
          component={Cadastro}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="perfil"
          component={Perfil}
          options={{
            header: (props) => <HeaderCustom {...props}/>,
          }}
        />
        <Stack.Screen
          name="registros"
          component={Registros}
          options={{
            header: (props) => <HeaderCustom {...props}/>,
          }}
        />
        <Stack.Screen
          name="main"
          component={Main}
          options={{
            header: (props) => <HeaderCustom {...props} />,
          }}
        />
        <Stack.Screen
          name="veiculos"
          component={Veiculos}
          options={{
            header: (props) => <HeaderCustom {...props} />,
          }}
        />
        <Stack.Screen
          name="registroVeiculo"
          component={RegistroVeiculo}
          options={{
            header: (props) => <HeaderCustom {...props} />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
