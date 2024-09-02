const express = require('express');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const app = express();

app.use(express.json());

app.post('/api/register', async (req, res) => {
    try {
        const { studentId, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            student_id: studentId,
            password: hashedPassword,
            role: 'student'
        };

        const { error } = await supabase
            .from('users')
            .insert([newUser]);

        if (error) {
            throw new Error('Error registering student');
        }

        res.status(200).json({ message: 'Registration successful' });
    } catch (err) {
        console.error('Error registering user:', err.message);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

module.exports = app;
