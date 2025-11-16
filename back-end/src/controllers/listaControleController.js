import prisma from "../database/client.js";

const controller = {};

controller.registrarEntrada = async function (req, res) {
  try {
    const { placa, tipo, motivo } = req.body;

    const registro = await prisma.listaControle.create({
      data: {
        placa,
        tipo,
        motivo,
        horaEntrada: new Date(),
      },
    });

    res.status(201).json(registro);
  } catch (err) {
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
    const registros = await prisma.listaControle.findMany();

    res.json(registros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default controller;