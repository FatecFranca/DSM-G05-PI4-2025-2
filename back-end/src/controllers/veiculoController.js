import prisma from "../database/client.js";

const controller = {}

controller.create = async function (req, res) {
  try {
    const { modelo, cor, placa, usuarioId, visitanteId } = req.body;
    const veiculo = await prisma.veiculo.create({
      data: {
        modelo,
        cor,
        placa,
        usuarioId: usuarioId || null,
        visitanteId: visitanteId || null,
      },
    });

    res.status(201).json(veiculo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

controller.retrieveAll = async function (req, res) {
  try {
    const veiculos = await prisma.veiculo.findMany({
      include: {
        usuario: true,
        visitante: true,
      },
    });

    res.json(veiculos);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

controller.retrieveOne = async function (req, res) {
  try {
    const veiculo = await prisma.veiculo.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        usuario: true,
        visitante: true,
      },
    });
    if (!veiculo) return res.status(404).json({ error: "Veículo não encontrado" });

    res.json(veiculo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

controller.update = async function (req, res) {
  try {
    await prisma.veiculo.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

controller.delete = async function (req, res) {
  try {
    await prisma.veiculo.delete({
      where: { id: Number(req.params.id) }
    });

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export default controller