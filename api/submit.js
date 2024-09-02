import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        cb(null, sanitizedFilename);
    }
});

const upload = multer({ storage });

module.exports = async (req, res) => {
    upload.single('fileUpload')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'File upload error.' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error occurred during file upload.' });
        }

        if (!req.session.user || req.session.user.role !== 'student') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { desiredOutcome, actualOutcome, problem } = req.body;

        const newSubmission = {
            student_id: req.session.user.id,
            desired_outcome: desiredOutcome,
            actual_outcome: actualOutcome,
            problem,
            file_path: req.file.path,
            created_at: new Date()
        };

        try {
            const { error: insertError } = await supabase
                .from('submissions')
                .insert([newSubmission]);

            if (insertError) {
                console.error('Error submitting data:', insertError);
                return res.status(500).json({ error: 'Internal server error. Please try again later.' });
            }

            res.status(200).json({ message: 'Submission successful' });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    });
};
