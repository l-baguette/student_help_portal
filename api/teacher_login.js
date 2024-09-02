const express = require('express');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const app = express();

app.use(express.json());

app.post('/teacher_login', async (req, res) => {
    try {
        const { teacherId, password } = req.body;
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('student_id', teacherId)
            .eq('role', 'teacher')
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.user = user;
        res.redirect('/teacher_dashboard.html');
    } catch (error) {
        console.error('Error logging in teacher:', error);
        res.status(500).json({ error: 'Error logging in teacher' });
    }
});

module.exports = app;
