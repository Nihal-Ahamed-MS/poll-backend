import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    description: {
        type: String,
        trim: true
    },
    choices: [{
        choiceName: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        votes: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'API.User'
        }]
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'API.User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('API.Poll', pollSchema);