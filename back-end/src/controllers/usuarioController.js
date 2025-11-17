import prisma from "../database/client.js";
import bcrypt from "bcryptjs";
import { gerarToken } from "../utils/jwt.js";

const controller = {}

controller.create = async function (req, res) {
  try {
    const { nome, email, senha, tipo } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash, tipo },
    });

    res.status(201).json({
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    });
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    if (err.code === 'P2002') {
      return res.status(400).json({ err: 'Email já cadastrado' });
    }
    res.status(500).json({ err: 'Erro interno ao criar usuário', details: err.message });
  }
};

controller.login = async function (req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: "Senha incorreta" });

    const token = gerarToken({ id: usuario.id, tipo: usuario.tipo, nome: usuario.nome });

    res.json({ usuario, token });
  }
  catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

controller.retrieveAll = async function (req, res) {
  try {
    const usuarios = await prisma.usuario.findMany();

    res.json(usuarios);
  } catch {
    console.error(error)
    res.status(500).send(error)
  }
};

controller.retrieveOne = async function (req, res) {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: Number(req.params.id) } });
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(usuario);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
};

controller.update = async function (req, res) {
  try {
    const id = Number(req.params.id);

    const data = {};

    if (req.body.nome !== undefined) {
      data.nome = req.body.nome;
    }

    if (req.body.email !== undefined) {
      data.email = req.body.email;
    }

    if (req.body.senha !== undefined) {
      data.senha = await bcrypt.hash(req.body.senha, 10);
    }

    await prisma.usuario.update({
      where: { id },
      data
    });

    res.status(204).end();
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).json({ error: err.message });
  }
};

controller.delete = async function (req, res) {
  try {
    const id = Number(req.params.id);

    await prisma.veiculo.deleteMany({
      where: { usuarioId: id }
    });

    await prisma.visitante.deleteMany({
      where: { usuarioId: id }
    });

    await prisma.usuario.delete({
      where: { id }
    });

    res.status(204).end();
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    res.status(500).json({ error: err.message });
  }
};

export default controller