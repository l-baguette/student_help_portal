const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Multer setup for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/submit', upload.single('fileUpload'), async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'student') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { desiredOutcome, actualOutcome, problem } = req.body;
        let filePath = null;

        if (req.file) {
            const fileName = `${Date.now()}_${req.file.originalname}`;
            const { data, error } = await supabase
                .storage
                .from('uploads')
                .upload(fileName, req.file.buffer);

            if (error) {
                throw new Error('Error uploading file to Supabase');
            }

            filePath = data.Key;
        }

        const { error } = await supabase
            .from('submissions')
            .insert([{ student_id: req.session.user.id, desired_outcome: desiredOutcome, actual_outcome: actualOutcome, problem, file_path: filePath }]);

        if (error) {
            throw new Error('Error submitting data');
        }

        res.status(200).json({ message: 'Submission successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

module.exports = app;
