const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.get('/submissions', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'teacher') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { data: submissions, error } = await supabase
            .from('submissions')
            .select('*');

        if (error) throw error;

        res.json(submissions);
    } catch (error) {
        console.error('Error retrieving submissions:', error);
        res.status(500).json({ error: 'Error retrieving submissions' });
    }
});

module.exports = app;
