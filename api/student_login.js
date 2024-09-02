const express = require('express');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const app = express();

app.use(express.json());

app.post('/api/student_login', async (req, res) => {
    try {
        const { studentId, password } = req.body;
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('student_id', studentId)
            .eq('role', 'student')
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.user = user;
        res.redirect('/student_dashboard.html');
    } catch (err) {
        console.error('Error logging in student:', err.message);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

module.exports = app;
