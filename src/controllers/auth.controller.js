import { v4 as uuid } from "uuid";
import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";

export async function signup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!password) {
      return res.status(400).send("Senha não informada!");
    }

    if (password !== confirmPassword) {
      return res.status(400).send("As senhas precisan ser iguais!");
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await db.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
      [name, email, passwordHash]
    );

    res.status(201).send("Usuário criado com sucesso!");
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).send("Esse e-mail já está cadastrado");
    } else {
      res.status(500).send("Ocorreu um erro no servidor");
    }
  }
}

export async function signin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (user.rowCount === 0) {
      return res.status(401).send("E-mail não encontrado :(");
    }

    const comparePassword = await bcrypt.compare(password, user.rows[0].password);
    if (!comparePassword) {
      return res.status(401).send("Senha incorreta ");
    }

    const token = uuid();

    await db.query(
      'INSERT INTO sessions (userId, "token") VALUES ($1, $2)',
      [user.rows[0].id, token]
    );

    res.status(200).send(token);
  } catch (err) {
    res.status(500).send(err.message);
    console.error(err);
  }
}
