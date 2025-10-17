import { useFonts, Montserrat_400Regular, Montserrat_700Bold, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
const screenWidth = Dimensions.get('window').width;
import { LinearGradient } from "expo-linear-gradient";

const AuthScreen = () => {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const navigation = useNavigation();

  if (!fontsLoaded) return null;

  const handleLogin = () => {
    navigation.navigate('login')
  }

  const handleCadastro = () => {
    navigation.navigate('cadastro')
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/carros_authScreen.png')}
        style={styles.image}
      />
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <LinearGradient
            colors={["#FFBA82", "#FF8B2D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <LinearGradient
            colors={["#FFBA82", "#FF8B2D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Cadastro</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#656cee",
  },
  image: {
    marginTop: 70,
    resizeMode: 'contain',
  },
  button: {
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 50,
    width: screenWidth * 0.8,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Montserrat_600SemiBold",
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 20
  },
  buttons: {
    marginBottom: 80,
  }
});

export default AuthScreen;