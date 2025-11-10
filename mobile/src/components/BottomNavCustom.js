import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { BottomNav, IconWrapper } from "../styles";
import { useNavigation, useRoute  } from "@react-navigation/native";

export default function BottomNavCustom() {
  const navigation = useNavigation();
  const route = useRoute();

  const icons = [
    { name: "home-outline", page: "main" },
    { name: "car-outline", page: "veiculos" },
    { name: "person-outline", page: "perfil" },
  ];

  return (
    <BottomNav>
      {icons.map((icon) => (
        <IconWrapper
          key={icon.page}
          active={route.name === icon.page}
          onPress={() => navigation.navigate(icon.page)}
        >
          <Ionicons
            name={icon.name}
            size={26}
            color={route.name === icon.page ? "#fff" : "#aaa"}
          />
        </IconWrapper>
      ))}
    </BottomNav>
  );
}