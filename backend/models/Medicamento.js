import mongoose from "mongoose";

const medicamentosSchema = mongoose.Schema({
    nome: {
        type: String,
        require: [true, 'Nome de Medicamento obrigatorio'],
        trim: true
    },
    dosagem: {
        type: String,
        required: true
    },
    frequencia: {
        type: String,
        required: true
    },
    horarios: [{
        hora: String,
        tomado: {
            type: Boolean,
            default: false
        }
    }],
    dataInicio: {
        type: Date,
        default: Date.now
    },
    dataFim: Date,
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente

})

export default mongoose.model('Medicamento', medicamentosSchema)