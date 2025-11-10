import React from "react";
import { BoldText, Container, Content } from "../styles";
import BottomNavCustom from "../components/BottomNavCustom";

export default function RegistroVeiculo() {
    return (
        <Container>
            <Content>
                <BoldText>Registrar Veículo</BoldText>
                <BottomNavCustom />
            </Content>
        </Container>
    );
}