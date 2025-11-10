import axios from 'axios';
import Constants from "expo-constants";

const { BASE_URL } = Constants.expoConfig.extra;

const api = axios.create({
    baseURL: BASE_URL || "http://localhost:8080"
})

export default api;