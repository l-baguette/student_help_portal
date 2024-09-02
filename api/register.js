// /api/register.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const app = express();

app.use(express.json());

app.post('/register', async (req, res) => {
    try {
        const { studentId, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ studentId, password: hashedPassword, role: 'student' });

        await newUser.save();
        res.status(200).send('Registration successful');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

module.exports = app;
