// gerenciar servidor
import express from 'express';
import cors from 'cors';

import Medicamento from './models/Medicamento.js'
import User from './models/User.js'

const app = express()
app.use(cors())
app.use(express.json())