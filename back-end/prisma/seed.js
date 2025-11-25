import prisma from "../src/database/client.js";
import { TipoUsuario } from "@prisma/client";

// Função para gerar uma data aleatória entre min e max horas atrás
function getRandomDate(minHoursAgo, maxHoursAgo) {
  const now = new Date();
  const minMs = minHoursAgo * 60 * 60 * 1000;
  const maxMs = maxHoursAgo * 60 * 60 * 1000;
  const randomMs = Math.random() * (maxMs - minMs) + minMs;
  return new Date(now.getTime() - randomMs);
}

// Função para gerar uma data futura baseada em uma data base (para horaSaida)
function getRandomFutureDate(baseDate, minHoursLater, maxHoursLater) {
  const minMs = minHoursLater * 60 * 60 * 1000;
  const maxMs = maxHoursLater * 60 * 60 * 1000;
  const randomMs = Math.random() * (maxMs - minMs) + minMs;
  return new Date(baseDate.getTime() + randomMs);
}

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
  const horaEntrada1 = getRandomDate(2, 24); // 2 a 24 horas atrás
  const horaSaida1 = getRandomFutureDate(horaEntrada1, 1, 4); // 1 a 4 horas depois
  
  await prisma.listaControle.create({
    data: {
      placa: carroLivia.placa,
      motivo: "Entrada de morador",
      veiculoId: carroLivia.id,
      horaEntrada: horaEntrada1,
      horaSaida: horaSaida1,
    },
  });

  const horaEntrada2 = getRandomDate(1, 12); // 1 a 12 horas atrás
  const horaSaida2 = getRandomFutureDate(horaEntrada2, 0.5, 3); // 30 min a 3 horas depois
  
  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteA.placa,
      motivo: "Visita para Livia",
      veiculoId: carroVisitanteA.id,
      horaEntrada: horaEntrada2,
      horaSaida: horaSaida2,
    },
  });

  const horaEntrada3 = getRandomDate(6, 48); // 6 a 48 horas atrás
  const horaSaida3 = getRandomFutureDate(horaEntrada3, 2, 6); // 2 a 6 horas depois
  
  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteB.placa,
      motivo: "Visita a Gustavo",
      veiculoId: carroVisitanteB.id,
      horaEntrada: horaEntrada3,
      horaSaida: horaSaida3,
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
  
  // Alguns registros com horaSaida (já saíram)
  const horaEntrada4 = getRandomDate(8, 72); // 8 a 72 horas atrás
  const horaSaida4 = getRandomFutureDate(horaEntrada4, 3, 8);
  
  await prisma.listaControle.create({
    data: {
      placa: carroGustavo.placa,
      motivo: "Entrada de morador",
      veiculoId: carroGustavo.id,
      horaEntrada: horaEntrada4,
      horaSaida: horaSaida4,
    },
  });

  // Registro sem horaSaida (ainda dentro)
  const horaEntrada5 = getRandomDate(0.5, 4); // 30 min a 4 horas atrás
  
  await prisma.listaControle.create({
    data: {
      placa: carroMaria.placa,
      motivo: "Entrada de morador",
      veiculoId: carroMaria.id,
      horaEntrada: horaEntrada5,
    },
  });

  const horaEntrada6 = getRandomDate(12, 96); // 12 a 96 horas atrás
  const horaSaida6 = getRandomFutureDate(horaEntrada6, 4, 10);
  
  await prisma.listaControle.create({
    data: {
      placa: carroCarlos.placa,
      motivo: "Entrada de morador",
      veiculoId: carroCarlos.id,
      horaEntrada: horaEntrada6,
      horaSaida: horaSaida6,
    },
  });

  // Registro sem horaSaida (ainda dentro)
  const horaEntrada7 = getRandomDate(1, 6); // 1 a 6 horas atrás
  
  await prisma.listaControle.create({
    data: {
      placa: carroAna.placa,
      motivo: "Entrada de morador",
      veiculoId: carroAna.id,
      horaEntrada: horaEntrada7,
    },
  });

  const horaEntrada8 = getRandomDate(4, 36); // 4 a 36 horas atrás
  const horaSaida8 = getRandomFutureDate(horaEntrada8, 2, 5);
  
  await prisma.listaControle.create({
    data: {
      placa: motoLivia.placa,
      motivo: "Entrada de morador",
      veiculoId: motoLivia.id,
      horaEntrada: horaEntrada8,
      horaSaida: horaSaida8,
    },
  });

  // Registro sem horaSaida (ainda dentro)
  const horaEntrada9 = getRandomDate(2, 8); // 2 a 8 horas atrás
  
  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteC.placa,
      motivo: "Visita a Maria",
      veiculoId: carroVisitanteC.id,
      horaEntrada: horaEntrada9,
    },
  });

  const horaEntrada10 = getRandomDate(24, 168); // 1 a 7 dias atrás
  const horaSaida10 = getRandomFutureDate(horaEntrada10, 1, 5);
  
  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteD.placa,
      motivo: "Visita a Carlos",
      veiculoId: carroVisitanteD.id,
      horaEntrada: horaEntrada10,
      horaSaida: horaSaida10,
    },
  });

  // Registro sem horaSaida (ainda dentro)
  const horaEntrada11 = getRandomDate(0.25, 2); // 15 min a 2 horas atrás
  
  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteE.placa,
      motivo: "Visita a Ana",
      veiculoId: carroVisitanteE.id,
      horaEntrada: horaEntrada11,
    },
  });

  const horaEntrada12 = getRandomDate(3, 24); // 3 a 24 horas atrás
  const horaSaida12 = getRandomFutureDate(horaEntrada12, 1, 4);
  
  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteF.placa,
      motivo: "Visita a Roberto",
      veiculoId: carroVisitanteF.id,
      horaEntrada: horaEntrada12,
      horaSaida: horaSaida12,
    },
  });

  // Registro sem horaSaida (ainda dentro)
  const horaEntrada13 = getRandomDate(1, 5); // 1 a 5 horas atrás
  
  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteG.placa,
      motivo: "Visita a Juliana",
      veiculoId: carroVisitanteG.id,
      horaEntrada: horaEntrada13,
    },
  });

  const horaEntrada14 = getRandomDate(6, 48); // 6 a 48 horas atrás
  const horaSaida14 = getRandomFutureDate(horaEntrada14, 2, 6);
  
  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteH.placa,
      motivo: "Visita a Pedro",
      veiculoId: carroVisitanteH.id,
      horaEntrada: horaEntrada14,
      horaSaida: horaSaida14,
    },
  });

  // Registro sem horaSaida (ainda dentro)
  const horaEntrada15 = getRandomDate(0.5, 3); // 30 min a 3 horas atrás
  
  await prisma.listaControle.create({
    data: {
      placa: carroVisitanteI.placa,
      motivo: "Visita a Lucas",
      veiculoId: carroVisitanteI.id,
      horaEntrada: horaEntrada15,
    },
  });

  const horaEntrada16 = getRandomDate(10, 120); // 10 a 120 horas atrás
  const horaSaida16 = getRandomFutureDate(horaEntrada16, 5, 12);
  
  await prisma.listaControle.create({
    data: {
      placa: carroRoberto.placa,
      motivo: "Entrada de morador",
      veiculoId: carroRoberto.id,
      horaEntrada: horaEntrada16,
      horaSaida: horaSaida16,
    },
  });

  // Registro sem horaSaida (ainda dentro)
  const horaEntrada17 = getRandomDate(3, 10); // 3 a 10 horas atrás
  
  await prisma.listaControle.create({
    data: {
      placa: carroJuliana.placa,
      motivo: "Entrada de morador",
      veiculoId: carroJuliana.id,
      horaEntrada: horaEntrada17,
    },
  });

  const horaEntrada18 = getRandomDate(18, 144); // 18 a 144 horas atrás
  const horaSaida18 = getRandomFutureDate(horaEntrada18, 6, 15);
  
  await prisma.listaControle.create({
    data: {
      placa: carroPedro.placa,
      motivo: "Entrada de morador",
      veiculoId: carroPedro.id,
      horaEntrada: horaEntrada18,
      horaSaida: horaSaida18,
    },
  });

  // Registro sem horaSaida (ainda dentro)
  const horaEntrada19 = getRandomDate(2, 7); // 2 a 7 horas atrás
  
  await prisma.listaControle.create({
    data: {
      placa: carroLucas.placa,
      motivo: "Entrada de morador",
      veiculoId: carroLucas.id,
      horaEntrada: horaEntrada19,
    },
  });

  const horaEntrada20 = getRandomDate(5, 60); // 5 a 60 horas atrás
  const horaSaida20 = getRandomFutureDate(horaEntrada20, 1, 3);
  
  await prisma.listaControle.create({
    data: {
      placa: motoGustavo.placa,
      motivo: "Entrada de morador",
      veiculoId: motoGustavo.id,
      horaEntrada: horaEntrada20,
      horaSaida: horaSaida20,
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