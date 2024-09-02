const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.get('/api/student_submissions', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'student') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { data: submissions, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('student_id', req.session.user.id);

        if (error) throw error;

        res.json(submissions);
    } catch (err) {
        console.error('Error retrieving student submissions:', err.message);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

module.exports = app;
