// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    pollList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'API.Poll'
    }]
}, { timestamps: true });


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if password was modified

    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next();
    } catch (err) {
        return next(err);
    }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        return false;
    }
};

export default mongoose.model('API.User', userSchema);