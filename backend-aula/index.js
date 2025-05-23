// Importar as biblíotecas nescessárias
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose(); // Banco sqlite
const authRouter = require('./routes/auth');

// Criando o servidor
const app = express();

// Configura o servidor
app.use(cors());
app.use(bodyParser.json());

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


// Criando tabelas
db.serialize(() =>
    {
        db.run(
            'CREATE TABLE IF NOT EXISTS usuarios(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL)'
        );
        db.run(
            'CREATE TABLE IF NOT EXISTS tarefas(id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT NOT NULL, userId INTEGER NOT NULL, FOREIGN KEY (userId) REFERENCES usuarios(id))'
        );
    }
);


// Fechando banco de dados ao encerrar o servidor
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar o SQlite');
        } else {
            console.error('SQlite fechado');
            process.exit(0);
        }
    });
});



// Definir uma rota para teste
app.get('/api/teste',(req, res) => {
    res.json({message: 'Backend funcionando e conectado'})
});

app.use('api/auth', authRouter);

// Definir a porta do servidor
const PORT = 3001;

// Iniciar o servidor
app.listen(PORT, () => {
    console.log('Servidor está rodando na porta 3001. Acesse localhost://3001')
});





