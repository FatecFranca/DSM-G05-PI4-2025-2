import prisma from "../database/client.js";

const controller = {};

controller.registrarEntrada = async function (req, res) {
  try {
    const { placa, motivo } = req.body;

    const veiculo = await prisma.veiculo.findUnique({
      where: { placa }
    });

    if (!veiculo) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }

    const registroAberto = await prisma.listaControle.findFirst({
      where: {
        placa,
        horaSaida: null
      }
    });

    if (registroAberto) {
      return res.status(400).json({
        error: "Este veículo ainda não registrou saída do condomínio."
      });
    }

    const registro = await prisma.listaControle.create({
      data: {
        placa,
        tipo,
        motivo,
        veiculoId: veiculo.id,
        horaEntrada: new Date()
      },
      include: {
        veiculo: {
          include: {
            visitante: true,
            usuario: true
          }
        }
      }
    });

    res.status(201).json(registro);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
};

controller.registrarSaida = async function (req, res) {
  try {
    const id = Number(req.params.id);

    const registro = await prisma.listaControle.findUnique({
      where: { id },
    });

    if (!registro) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    if (registro.horaSaida) {
      return res
        .status(400)
        .json({ error: "A saída já foi registrada para este veículo" });
    }

    await prisma.listaControle.update({
      where: { id },
      data: { horaSaida: new Date() },
    });

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

controller.listarRegistros = async function (req, res) {
  try {
    const registros = await prisma.listaControle.findMany({
      include: {
        veiculo: {
          include: {
            visitante: true,
            usuario: true
          }
        }
      }
    });

    res.json(registros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default controller;