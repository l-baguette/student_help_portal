const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    student_id: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['student', 'teacher'], default: 'student' }
});

userSchema.statics.handleError = function (error) {
    console.error(error);
    return { error: 'An error occurred while processing your request.' };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
