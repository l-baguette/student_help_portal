import { supabase } from './supabaseClient';
import multer from 'multer';
import path from 'path';

const upload = multer({ dest: '/tmp/uploads/' });

export default function handler(req, res) {
    if (req.method === 'POST') {
        upload.single('fileUpload')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'File upload error' });
            }

            const { desiredOutcome, actualOutcome, problem } = req.body;

            try {
                const { error: insertError } = await supabase
                    .from('submissions')
                    .insert([
                        {
                            student_id: req.session.user.id,
                            desired_outcome: desiredOutcome,
                            actual_outcome: actualOutcome,
                            problem,
                            file_path: req.file.path
                        }
                    ]);

                if (insertError) {
                    console.error('Error saving submission:', insertError);
                    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
                }

                res.status(200).json({ message: 'Submission successful' });
            } catch (error) {
                console.error('Unexpected error:', error);
                res.status(500).json({ error: 'Internal server error. Please try again later.' });
            }
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
