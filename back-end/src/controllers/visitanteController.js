import prisma from "../database/client.js";

const controller = {};

controller.create = async function (req, res) {
  try {
    let { nome, documento, usuarioId } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "Nome é obrigatório." });
    }

    if (!usuarioId) {
      return res.status(400).json({ error: "usuarioId é obrigatório." });
    }

    const visitante = await prisma.visitante.create({
      data: { nome, documento, usuarioId: Number(usuarioId) },
    });

    res.status(201).json(visitante);
  } catch (err) {
    console.error("Erro ao criar visitante:", err);
    res.status(500).json({ error: "Erro interno ao criar visitante", details: err.message });
  }
};

controller.retrieveAll = async function (req, res) {
  try {
    const visitantes = await prisma.visitante.findMany({
      include: {
        veiculos: true,
      },
    });

    res.json(visitantes);
  } catch (error) {
    console.error("Erro ao buscar visitantes:", error);
    res.status(500).json({ error: "Erro ao buscar visitantes" });
  }
};

controller.retrieveOne = async function (req, res) {
  try {
    const id = Number(req.params.id);

    const visitante = await prisma.visitante.findUnique({
      where: { id },
      include: {
        veiculos: true,
      }
    });

    if (!visitante) {
      return res.status(404).json({ error: "Visitante não encontrado" });
    }

    res.json(visitante);
  } catch (err) {
    console.error("Erro ao buscar visitante:", err);
    res.status(500).json({ error: err.message });
  }
};

controller.update = async function (req, res) {
  try {
    const id = Number(req.params.id);
    const { nome, documento } = req.body;

    const data = {};

    if (nome !== undefined) data.nome = nome;
    if (documento !== undefined) data.documento = documento;

    await prisma.visitante.update({
      where: { id },
      data,
    });

    res.status(204).end();
  } catch (err) {
    console.error("Erro ao atualizar visitante:", err);
    res.status(500).json({ error: err.message });
  }
};


controller.delete = async function (req, res) {
  try {
    const id = Number(req.params.id);

    await prisma.veiculo.deleteMany({
      where: { visitanteId: id }
    });

    await prisma.visitante.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (err) {
    console.error("Erro ao deletar visitante:", err);
    res.status(500).json({ error: err.message });
  }
};

export default controller;