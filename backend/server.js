// gerenciar servidor
import express from 'express';
import cors from 'cors';

import './config/db.js';

import medicamentoRoutes from './routes/medicamentosRoutes.js'
import userRoutes from './routes/userRoutes.js'

app.use(cors({
  origin: '*', // Permite qualquer origem (desenvolvimento)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
const app = express()
const PORT = 3000
// permite requisições de outros dominios (frontend)
app.use(cors())
// permite receber JSON no body das requisições
app.use(express.json())
// Permite receber dados de formularios
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res)=>{
    res.json({
        mensagem: 'Hora Certa Rodando',
    })
})

app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta: ${PORT}`)
})

