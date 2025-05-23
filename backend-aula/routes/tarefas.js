const express = require('express');
const jwt = require('jsonwebtoken'); // Corrigido o nome do módulo
const router = express.Router();
const JWT_SECRET = 'chave-secreta-super-segura'; // Chave secreta

// Middleware para verificação de token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato Bearer

    if (!token) {
        return res.status(401).json({message: 'Acesso negado! Token não fornecido.'})
    }

    try {
        // Verificar e decodificar o token
        const decoded = jwt.verify(token, JWT_SECRET)
        // Adiciona o id decodificado
        req.user = decoded;
        // Chama o próximo cabeçalho
        next();
    } catch (err) {
        // Retorna o erro caso o token for inválido
        return res.status(403).json({message: 'Token inválido ou expirado!'});
    }
};

module.exports = (db) => {
    // Definir rota para criar nova tarefa
    router.post('/', authenticateToken, (req, res) => {
        // Extraindo o título do corpo da requisição
        const {titulo} = req.body;
        // Extrair userid
        const userId = req.user.userId;

        // Verifica se o título foi fornecido
        if (!titulo) {
            return res.status(400).json({message: 'Título da tarefa é obrigatório.'});
        }

        // Inser tarefas
        db.run('INSERT INTO tarefas (titulo, userId) VALUES (?, ?)', [titulo, userId], function (err) {
            if (err) {
                return res.status(500).json({ message: 'Erro ao inserir a tarefa' });
            }
            res.status(201).json({ message: 'Tarefa inserida com sucesso', tarefaId: this.lastID });
        });
    });

    // Rota para listar todas as tarefas
    router.get('/', authenticateToken, (req, res) => {
        // Extrair userid
        const userId = req.user.userId;

        db.all('SELECT * FROM tarefas WHERE userId = ?', [userId], (err, row) =>{
             if (err) {
                return res.status(500).json({ message: 'Erro ao listar as tarefas' });
            }

            // Retornar a lista de tarefas
            res.json({tarefas: row});
        });
    });

    router.put('/', authenticateToken, (req, res) => {
        // Extrair o id da tarefa dos parametros
        const {id} = req.params;

        // Extraindo o título do corpo da requisição
        const {titulo} = req.body;

        // Extrair userid
        const userId = req.user.userId;

         // Verifica se o título foi fornecido
        if (!titulo) {
            return res.status(400).json({message: 'Título da tarefa é obrigatório.'});
        }

        // Insere a tarefa
        db.run('UPDATE tarefas SET titulo = ? WHERE id = ?', [titulo, id, userId], function (err) {
            if (err) {
                return res.status(500).json({ message: 'Erro ao editar tarefa'});
            }
            // Verificar se a tarefa foi atualizada
            if (this.change === 0) {
                return res.status(404).json({ message: 'Tarefa não encontrada'});
            }

            return res.json({message: 'Tarefa atualizada com sucesso.'})
        });
    });

    // Define a rota para excluir tarefas
    router.delete('/', authenticateToken, (req, res) => {
        // Extrair o id da tarefa dos parametros
        const {id} = req.params;

        // Extrair userid
        const userId = req.user.userId;

        // Deletar a tarefa
        db.run('DELETE FROM tarefas WHERE ID = ? WHERE id = ? AND userId = ?', [id, userId], function (err) {
            // Verifica se houve algum erro
            if (err) {
                return res.status(500).json({ message: 'Erro ao editar tarefa'});
            }
            // Verificar se a tarefa foi atualizada
            if (this.change === 0) {
                return res.status(404).json({ message: 'Tarefa não encontrada'});
            }

            return res.json({message: 'Tarefa deletada com sucesso.'})
        });
        
    });
};


