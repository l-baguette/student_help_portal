// /api/teacher_login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const app = express();

app.use(express.json());

app.post('/teacher_login', async (req, res) => {
    try {
        const { teacherId, password } = req.body;
        const user = await User.findOne({ studentId: teacherId, role: 'teacher' });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.redirect('/teacher_dashboard.html'); // Redirect to teacher dashboard
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error logging in teacher:', error);
        res.status(500).send('Error logging in teacher');
    }
});

module.exports = app;
