const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.get('/api/returned_submissions', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'student') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { data: submissions, error: submissionError } = await supabase
            .from('submissions')
            .select('id')
            .eq('student_id', req.session.user.id);

        if (submissionError) throw submissionError;

        const { data: feedbacks, error: feedbackError } = await supabase
            .from('feedback')
            .select('*')
            .in('submission_id', submissions.map(sub => sub.id));

        if (feedbackError) throw feedbackError;

        res.json(feedbacks);
    } catch (error) {
        console.error('Error retrieving returned submissions:', error.message);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

module.exports = app;
