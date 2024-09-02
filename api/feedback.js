import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const feedbackStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'feedback/');
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        cb(null, sanitizedFilename);
    }
});

const feedbackUpload = multer({ storage: feedbackStorage });

module.exports = async (req, res) => {
    feedbackUpload.single('revisedFile')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'File upload error.' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error occurred during file upload.' });
        }

        if (!req.session.user || req.session.user.role !== 'teacher') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const feedbackData = {
            submission_id: req.params.id,
            teacher_id: req.session.user.id,
            feedback: req.body.feedback,
            created_at: new Date()
        };

        if (req.file) {
            feedbackData.revised_file_path = `feedback/${req.file.filename}`;
        }

        try {
            const { error: insertError } = await supabase
                .from('feedback')
                .insert([feedbackData]);

            if (insertError) {
                console.error('Error submitting feedback:', insertError);
                return res.status(500).json({ error: 'Internal server error. Please try again later.' });
            }

            res.status(200).json({ message: 'Feedback submitted successfully' });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    });
};
