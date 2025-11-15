import mongoose from "mongoose";

const dependenteSchema = mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do dependente é obrigatório'],
    trim: true
  },
  parentesco: {
    type: String,
    required: [true, 'Parentesco é obrigatório'],
    trim: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Dependente', dependenteSchema);