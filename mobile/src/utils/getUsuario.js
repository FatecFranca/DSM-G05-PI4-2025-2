import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export async function getUsuario() {
  const token = await AsyncStorage.getItem("token");
  if (!token) return null;

  return jwtDecode(token);
}