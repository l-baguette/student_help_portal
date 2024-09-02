const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const app = express();

app.use(express.json());

const feedbackStorage = multer.memoryStorage();
const feedbackUpload = multer({ storage: feedbackStorage });

app.post('/api/feedback/:id', feedbackUpload.single('revisedFile'), async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'teacher') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const feedbackData = {
            submissionId: req.params.id,
            teacherId: req.session.user.id,
            feedback: req.body.feedback
        };

        if (req.file) {
            const fileName = `${Date.now()}_${req.file.originalname}`;
            const { data, error } = await supabase
                .storage
                .from('feedback')
                .upload(fileName, req.file.buffer);

            if (error) {
                throw new Error('Error uploading file to Supabase');
            }

            feedbackData.revisedFilePath = data.Key;
            feedbackData.revisedFileName = req.file.originalname;
        }

        const { error } = await supabase
            .from('feedback')
            .insert([feedbackData]);

        if (error) {
            throw new Error('Error saving feedback data');
        }

        res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

module.exports = app;
