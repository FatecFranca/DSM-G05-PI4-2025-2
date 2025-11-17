import { useState } from "react";
import styled from "styled-components/native";
import { ScrollView } from "react-native";
import BottomNavCustom from "../components/BottomNavCustom";
import { BoldText } from "../styles";

export default function DetalhesVeiculo({ route }) {
  const { veiculo } = route.params;
  const [currentPage, setCurrentPage] = useState("detalhesVeiculo");

  return (
    <Container>
      <ScrollView style={{ flex: 1 }}>
        <Content>
          <BoldText>Detalhes do Veículo</BoldText>

          <Field>
            <Label>Modelo</Label>
            <Value>{veiculo.modelo}</Value>
          </Field>

          <Field>
            <Label>Placa</Label>
            <Value>{veiculo.placa}</Value>
          </Field>

          <Field>
            <Label>Cor</Label>
            <Value>{veiculo.cor}</Value>
          </Field>

          <Field>
            <Label>Proprietário</Label>
            <Value>
              {veiculo.usuario
                ? `${veiculo.usuario.nome} (Morador)`
                : `${veiculo.visitante?.nome} (Visitante)`
              }
            </Value>
          </Field>
        </Content>

        <BottomSpace />
      </ScrollView>

      <BottomWrapper>
        <BottomNavCustom
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </BottomWrapper>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #f5f5ff;
`;

const Content = styled.View`
  margin-top: 40px;
  padding: 20px;
  margin: 20px;
  border-width: 1px;
  border-color: #dcdcff;
  border-radius: 14px;
  background-color: #e2dcff1f;
`;

const Field = styled.View`
  margin-bottom: 22px;
  padding-bottom: 14px;
  border-bottom-width: 1px;
  border-bottom-color: #ececff;
`;

const Label = styled.Text`
  font-family: Montserrat_600SemiBold;
  font-size: 18px;
  color: #3b3b3b;
  margin-bottom: 2px;
`;

const Value = styled.Text`
  font-family: Montserrat_400Regular;
  font-size: 16px;
  color: #2f58ff;
  margin-left: 4px;
`;

const BottomWrapper = styled.View`
  width: 100%;
`;

const BottomSpace = styled.View`
  height: 140px;
`;
