import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Main from "./pages/main";
import Login from "./pages/login";
import AuthScreen from "./pages/authScreen";
import User from "./pages/user";
import Cadastro from "./pages/cadastro"
import { Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";

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
          name="main"
          component={Main}
          options={{
            title: "HOME",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#656cee",
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            },
            headerTitleStyle: {
              fontFamily: Montserrat_600SemiBold,
              fontSize: 16,
              color: "#fff",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
