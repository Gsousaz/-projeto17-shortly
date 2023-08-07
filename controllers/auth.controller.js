import db from "../database/database.connection.js";
import bcrypt from "bcrypt";

export async function signup(req, res) {
    try{
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(422).send("As senhas precisam ser iguais");
      }
    
        const passwordHash = bcrypt.hashSync(password, 10);
    
        await db.query(
            `INSERT INTO users (name, email, password)VALUES($1, $2, $3)`,
            [name, email, passwordHash]
        );

        res.status(201).send("Usuário criado com sucesso!");
        
    } catch (err){
        if (err.code === '23505') {
            res.status(409).send("O e-mail já está cadastrado")
        }else {
            res.status(500).send("Ocorreu um erro no servidor");
        }        
    }
}

export async function signin(req, res) {}
