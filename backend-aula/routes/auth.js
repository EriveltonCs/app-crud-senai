// Importar as biblíotecas nescessárias
const express = require('express');
const bcrypt = require('bcryptjs'); // Protege as senhas
const criachaves = require('jsonwebtoken'); // Cria chaves
const sqlite3 = require('sqlite3').verbose(); // Banco sqlite

// Conecta ao Banco de dados
const db = new sqlite3.Database('./tarefas.db', (err) =>
{
    if (err) {
        console.error("Erro ao conectar ao Sqlite:", err);
    } else {
        console.error("Conectado ao Sqlite:");
    }
}
);

const router = express.Router(); // Cria o roteador
const JWT_SECRET = 'chave-secreta-super-segura'; // Cria uma chave secreta

// Rota para cadastro de usuário
router.post('/registro', (req, res) => 
{
    // Verifica se o email já existe
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: 'Email e senha são obrigatórios'});
    }

    db.get('SELECT * FROM WHERE email = ?', [email], (err, usuario) => {
        if (err) {
            return res.status(500).json({message: 'Erro no servidor'});
        }
        if (row) {
            return res.status(500).json({message: 'Email já cadastrado'});
        }

        // Criptograf a senha
        const hasehdPassword = bcrypt.hashSync(password, 10);
        //Insere usuário
        db.run('INSERT INTO usuarios (emai, senha) VALUES (?, ?)', [email, hasehdPassword], function (err){
            if (err) {
            return res.status(500).json({message: 'Erro no servidor'});
        }
        res.status(500).json({message: 'Cadastrado com sucesso'});
        });
    });
});

// Rota para login
router.post('/llogin', (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: 'Email e senha são obrigatórios'});
    }

    // Verifica se o email já existe
    db.get('SELECT * FROM WHERE email = ?', [email], (err, usuario) => {
        if (err) {
            return res.status(500).json({message: 'Erro no servidor'});
        }
        if (!usuario || !bcrypt.compareSync(password, usuarios.password)) {
            return res.status(401).json({message: 'Email ou senha incorretos'});
        }

        // Cria token
        const token = jwt.sign({userId}, JWT_SECRET, {expiresIn: '1h'});
        res.json({message: 'Login bem sucedido', token, useId: usuarios.id});
    });
});

module.exports = router;



