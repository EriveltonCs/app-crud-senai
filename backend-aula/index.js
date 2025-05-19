// Importar as biblíotecas nescessárias
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());


// Definir uma rota para teste
app.get('/api/teste',(req, res) => {
    res.json({message: 'Backend funcionando e conectado'})
});


// Definir a porta do servidor
const PORT = 3001;

// Iniciar o servidor
app.listen(PORT, () => {
    console.log('Servidor está rodando na porta 3001. Acesse localhost://3001')
});





