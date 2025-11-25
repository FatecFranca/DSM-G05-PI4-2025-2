import prisma from "../src/database/client.js";
import { TipoUsuario } from "@prisma/client";


async function main() {
  await prisma.listaControle.deleteMany();
  await prisma.veiculo.deleteMany();
  await prisma.visitante.deleteMany();
  await prisma.usuario.deleteMany();
  console.log("🌱 Iniciando seed...");

  // -------------------------
  // Usuários
  // -------------------------
  const gabriel = await prisma.usuario.create({
    data: {
      nome: "Gabriel",
      email: "gabriel@condominio.com",
      senha: "123456",
      tipo: TipoUsuario.ADMIN,
    },
  });

  const livia = await prisma.usuario.create({
    data: {
      nome: "Livia",
      email: "livia@condominio.com",
      senha: "123456",
      tipo: TipoUsuario.MORADOR,
    },
  });

  const eduardo = await prisma.usuario.create({
    data: {
      nome: "Eduardo",
      email: "eduardo@condominio.com",
      senha: "123456",
      tipo: TipoUsuario.PORTEIRO,
    },
  });

  const gustavo = await prisma.usuario.create({
    data: {
      nome: "Gustavo",
      email: "gustavo@condominio.com",
      senha: "123456",
      tipo: TipoUsuario.MORADOR,
    },
  });

  const maria = await prisma.usuario.create({
    data: {
      nome: "Maria",
      email: "maria@condominio.com",
      senha: "123456",
      tipo: TipoUsuario.MORADOR,
    },
  });

  // -------------------------
  // Visitantes
  // -------------------------
  const visitanteA = await prisma.visitante.create({
    data: {
      nome: "Visitante de Livia",
      documento: "11122233344",
      usuarioId: livia.id,
    },
  });

  const visitanteB = await prisma.visitante.create({
    data: {
      nome: "Visitante de Gustavo",
      documento: "55566677788",
      usuarioId: gustavo.id,
    },
  });

  const visitanteC = await prisma.visitante.create({
    data: {
      nome: "Visitante de Maria",
      documento: "10101010100",
      usuarioId: maria.id,
    },
  });

  // -------------------------
  // Veículos dos moradores
  // -------------------------
  const carroLivia = await prisma.veiculo.create({
    data: {
      modelo: "Onix",
      cor: "Branco",
      placa: "AAA1A11",
      usuarioId: livia.id,
    },
  });

  const carroGustavo = await prisma.veiculo.create({
    data: {
      modelo: "Civic",
      cor: "Preto",
      placa: "BBB2B22",
      usuarioId: gustavo.id,
    },
  });

  const carroMaria = await prisma.veiculo.create({
    data: {
      modelo: "HB20",
      cor: "Prata",
      placa: "CCC3C33",
      usuarioId: maria.id,
    },
  });

  // -------------------------
  // Veículos de visitantes
  // -------------------------
  const carroVisitanteA = await prisma.veiculo.create({
    data: {
      modelo: "Gol",
      cor: "Vermelho",
      placa: "DDD4D44",
      visitanteId: visitanteA.id,
    },
  });

  const carroVisitanteB = await prisma.veiculo.create({
    data: {
      modelo: "Uno",
      cor: "Preto",
      placa: "EEE5E55",
      visitanteId: visitanteB.id,
    },
  });

  const carroVisitanteC = await prisma.veiculo.create({
    data: {
      modelo: "Ka",
      cor: "Azul",
      placa: "FFF6F66",
      visitanteId: visitanteC.id,
    },
  });

  // -------------------------
  // Registros em lista de controle
  // -------------------------
  await prisma.listaControle.create({
    data: {
      placa: carroLivia.placa,
      motivo: "Entrada de morador",
      veiculoId: carroLivia.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteA.placa,
      motivo: "Visita para Livia",
      veiculoId: carroVisitanteA.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteB.placa,
      motivo: "Visita a Gustavo",
      veiculoId: carroVisitanteB.id
    },
  });

  // -------------------------
  // Mais Usuários
  // -------------------------
  const carlos = await prisma.usuario.create({
    data: {
      nome: "Carlos",
      email: "carlos@condominio.com",
      senha: "123456",
      tipo: TipoUsuario.MORADOR,
    },
  });

  const ana = await prisma.usuario.create({
    data: {
      nome: "Ana",
      email: "ana@condominio.com",
      senha: "123456",
      tipo: TipoUsuario.MORADOR,
    },
  });

  const roberto = await prisma.usuario.create({
    data: {
      nome: "Roberto",
      email: "roberto@condominio.com",
      senha: "123456",
      tipo: TipoUsuario.MORADOR,
    },
  });

  const juliana = await prisma.usuario.create({
    data: {
      nome: "Juliana",
      email: "juliana@condominio.com",
      senha: "123456",
      tipo: TipoUsuario.MORADOR,
    },
  });

  const pedro = await prisma.usuario.create({
    data: {
      nome: "Pedro",
      email: "pedro@condominio.com",
      senha: "123456",
      tipo: TipoUsuario.MORADOR,
    },
  });

  const fernanda = await prisma.usuario.create({
    data: {
      nome: "Fernanda",
      email: "fernanda@condominio.com",
      senha: "123456",
      tipo: TipoUsuario.PORTEIRO,
    },
  });

  const lucas = await prisma.usuario.create({
    data: {
      nome: "Lucas",
      email: "lucas@condominio.com",
      senha: "123456",
      tipo: TipoUsuario.MORADOR,
    },
  });

  // -------------------------
  // Mais Visitantes
  // -------------------------
  const visitanteD = await prisma.visitante.create({
    data: {
      nome: "João Silva",
      documento: "12345678900",
      usuarioId: carlos.id,
    },
  });

  const visitanteE = await prisma.visitante.create({
    data: {
      nome: "Mariana Santos",
      documento: "98765432100",
      usuarioId: ana.id,
    },
  });

  const visitanteF = await prisma.visitante.create({
    data: {
      nome: "Roberto Junior",
      documento: "45678912300",
      usuarioId: roberto.id,
    },
  });

  const visitanteG = await prisma.visitante.create({
    data: {
      nome: "Patricia Costa",
      documento: "78912345600",
      usuarioId: juliana.id,
    },
  });

  const visitanteH = await prisma.visitante.create({
    data: {
      nome: "Felipe Alves",
      documento: "32165498700",
      usuarioId: pedro.id,
    },
  });

  const visitanteI = await prisma.visitante.create({
    data: {
      nome: "Carla Mendes",
      documento: "65432198700",
      usuarioId: lucas.id,
    },
  });

  const visitanteJ = await prisma.visitante.create({
    data: {
      nome: "Rafael Oliveira",
      documento: "14725836900",
      usuarioId: livia.id,
    },
  });

  // -------------------------
  // Mais Veículos de Moradores
  // -------------------------
  const carroCarlos = await prisma.veiculo.create({
    data: {
      modelo: "Corolla",
      cor: "Prata",
      placa: "GGG7G77",
      usuarioId: carlos.id,
    },
  });

  const carroAna = await prisma.veiculo.create({
    data: {
      modelo: "Palio",
      cor: "Branco",
      placa: "HHH8H88",
      usuarioId: ana.id,
    },
  });

  const carroRoberto = await prisma.veiculo.create({
    data: {
      modelo: "HR-V",
      cor: "Preto",
      placa: "III9I99",
      usuarioId: roberto.id,
    },
  });

  const carroJuliana = await prisma.veiculo.create({
    data: {
      modelo: "KWID",
      cor: "Azul",
      placa: "JJJ0J00",
      usuarioId: juliana.id,
    },
  });

  const carroPedro = await prisma.veiculo.create({
    data: {
      modelo: "T-Cross",
      cor: "Vermelho",
      placa: "KKK1K11",
      usuarioId: pedro.id,
    },
  });

  const carroLucas = await prisma.veiculo.create({
    data: {
      modelo: "Renegade",
      cor: "Verde",
      placa: "LLL2L22",
      usuarioId: lucas.id,
    },
  });

  // Segundo veículo para alguns moradores
  const motoLivia = await prisma.veiculo.create({
    data: {
      modelo: "CG 160",
      cor: "Vermelha",
      placa: "MMM3M33",
      usuarioId: livia.id,
    },
  });

  const motoGustavo = await prisma.veiculo.create({
    data: {
      modelo: "Fazer 250",
      cor: "Branca",
      placa: "NNN4N44",
      usuarioId: gustavo.id,
    },
  });

  const carro2Carlos = await prisma.veiculo.create({
    data: {
      modelo: "Fusca",
      cor: "Amarelo",
      placa: "OOO5O55",
      usuarioId: carlos.id,
    },
  });

  // -------------------------
  // Mais Veículos de Visitantes
  // -------------------------
  const carroVisitanteD = await prisma.veiculo.create({
    data: {
      modelo: "Sandero",
      cor: "Branco",
      placa: "PPP6P66",
      visitanteId: visitanteD.id,
    },
  });

  const carroVisitanteE = await prisma.veiculo.create({
    data: {
      modelo: "Tracker",
      cor: "Cinza",
      placa: "QQQ7Q77",
      visitanteId: visitanteE.id,
    },
  });

  const carroVisitanteF = await prisma.veiculo.create({
    data: {
      modelo: "Argo",
      cor: "Laranja",
      placa: "RRR8R88",
      visitanteId: visitanteF.id,
    },
  });

  const carroVisitanteG = await prisma.veiculo.create({
    data: {
      modelo: "Siena",
      cor: "Prata",
      placa: "SSS9S99",
      visitanteId: visitanteG.id,
    },
  });

  const carroVisitanteH = await prisma.veiculo.create({
    data: {
      modelo: "EcoSport",
      cor: "Preto",
      placa: "TTT0T00",
      visitanteId: visitanteH.id,
    },
  });

  const carroVisitanteI = await prisma.veiculo.create({
    data: {
      modelo: "Mobi",
      cor: "Branco",
      placa: "UUU1U11",
      visitanteId: visitanteI.id,
    },
  });

  // -------------------------
  // Mais Registros em Lista de Controle
  // -------------------------
  await prisma.listaControle.create({
    data: {
      placa: carroGustavo.placa,
      motivo: "Entrada de morador",
      veiculoId: carroGustavo.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroMaria.placa,
      motivo: "Entrada de morador",
      veiculoId: carroMaria.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroCarlos.placa,
      motivo: "Entrada de morador",
      veiculoId: carroCarlos.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroAna.placa,
      motivo: "Entrada de morador",
      veiculoId: carroAna.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: motoLivia.placa,
      motivo: "Entrada de morador",
      veiculoId: motoLivia.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteC.placa,
      motivo: "Visita a Maria",
      veiculoId: carroVisitanteC.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteD.placa,
      motivo: "Visita a Carlos",
      veiculoId: carroVisitanteD.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteE.placa,
      motivo: "Visita a Ana",
      veiculoId: carroVisitanteE.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteF.placa,
      motivo: "Visita a Roberto",
      veiculoId: carroVisitanteF.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteG.placa,
      motivo: "Visita a Juliana",
      veiculoId: carroVisitanteG.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteH.placa,
      motivo: "Visita a Pedro",
      veiculoId: carroVisitanteH.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteI.placa,
      motivo: "Visita a Lucas",
      veiculoId: carroVisitanteI.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroRoberto.placa,
      motivo: "Entrada de morador",
      veiculoId: carroRoberto.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroJuliana.placa,
      motivo: "Entrada de morador",
      veiculoId: carroJuliana.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroPedro.placa,
      motivo: "Entrada de morador",
      veiculoId: carroPedro.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: carroLucas.placa,
      motivo: "Entrada de morador",
      veiculoId: carroLucas.id,
    },
  });

  await prisma.listaControle.create({
    data: {
      placa: motoGustavo.placa,
      motivo: "Entrada de morador",
      veiculoId: motoGustavo.id,
    },
  });

  console.log("🌱 Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });