const express = require('express');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(express.json());

app.post('/register_teacher', async (req, res) => {
    const { teacherId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from('users')
        .insert([{ student_id: teacherId, password: hashedPassword, role: 'teacher' }]);

    if (error) {
        console.error('Error registering teacher:', error);
        res.status(500).json({ error: 'Error registering teacher' });
    } else {
        res.status(200).json({ message: 'Teacher registration successful' });
    }
});

module.exports = app;
