const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Multer setup for handling file uploads in memory
const feedbackUpload = multer({ storage: multer.memoryStorage() });

app.post('/feedback/:id', feedbackUpload.single('revisedFile'), async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'teacher') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const feedbackData = {
        submission_id: req.params.id,
        teacher_id: req.session.user.id,
        feedback: req.body.feedback
    };

    if (req.file) {
        const fileName = `${Date.now()}_${req.file.originalname}`;
        const { data, error } = await supabase
            .storage
            .from('uploads')
            .upload(fileName, req.file.buffer);

        if (error) {
            console.error('Error uploading file to Supabase:', error);
            return res.status(500).json({ error: 'Error uploading file' });
        }

        feedbackData.revised_file_path = data.Key;
    }

    const { error } = await supabase
        .from('feedback')
        .insert([feedbackData]);

    if (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Error submitting feedback' });
    } else {
        res.status(200).json({ message: 'Feedback submitted successfully' });
    }
});

module.exports = app;
