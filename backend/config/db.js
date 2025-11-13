// conectar com o banco mongoDB
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // arquivo atual
const __dirname = path.dirname(__filename); // pasta atual

console.log(__filename)
console.log(__dirname)
// Carrega o .env da pasta backend
configDotenv({ path: path.resolve(__dirname, '../.env') });
const uri = process.env.MONGO;

if (!uri) {
  console.error('❌ MONGO_URI não encontrada no arquivo .env');
  console.log('Caminho procurado:', path.resolve(__dirname, '../.env'));
}

mongoose.connect(uri)
  .then(() => console.log("✅ Banco conectado!!"))
  .catch(e => {
    console.error('❌ Erro ao conectar ao banco:', e.message);
  });