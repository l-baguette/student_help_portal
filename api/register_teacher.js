const express = require('express');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const app = express();

app.use(express.json());

app.post('/api/register_teacher', async (req, res) => {
    try {
        const { teacherId, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newTeacher = {
            student_id: teacherId,
            password: hashedPassword,
            role: 'teacher'
        };

        const { error } = await supabase
            .from('users')
            .insert([newTeacher]);

        if (error) {
            throw new Error('Error registering teacher');
        }

        res.status(200).json({ message: 'Teacher registration successful' });
    } catch (err) {
        console.error('Error registering teacher:', err.message);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

module.exports = app;
