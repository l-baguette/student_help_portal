// /api/register_teacher.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const app = express();

app.use(express.json());

app.post('/register_teacher', async (req, res) => {
    const { teacherId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new User({ studentId: teacherId, password: hashedPassword, role: 'teacher' });

    try {
        await newTeacher.save();
        res.status(200).send('Teacher registration successful');
    } catch (error) {
        console.error('Error registering teacher:', error);
        res.status(500).send('Error registering teacher');
    }
});

module.exports = app;
