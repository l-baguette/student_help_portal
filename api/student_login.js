// /api/student_login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const app = express();

app.use(express.json());

app.post('/student_login', async (req, res) => {
    try {
        const { studentId, password } = req.body;
        const user = await User.findOne({ studentId, role: 'student' });

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.redirect('/student_dashboard.html'); // Redirect to student dashboard
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error logging in student:', error);
        res.status(500).send('Error logging in student');
    }
});

module.exports = app;
