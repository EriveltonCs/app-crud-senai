// Importar as biblíotecas nescessárias
const express = require('express');
const router = express.Router(); // Criar um mini servidor
const senha = require('bcryptjs');

let usuariosFakes = [];

// Simulação de banco de dados
let tarefas = [];
let idAtualTarefa = 1; // Gera id único para tarefas



