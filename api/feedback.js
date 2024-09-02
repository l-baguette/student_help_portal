// api/feedback.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { feedback, revisedFilePath } = req.body;
        const teacherId = req.session.user.student_id;
        const { submissionId } = req.query;

        try {
            const { data, error } = await supabase
                .from('feedback')
                .insert([
                    { submission_id: submissionId, teacher_id: teacherId, feedback: feedback, revised_file_path: revisedFilePath }
                ]);

            if (error) {
                throw error;
            }

            res.status(200).json({ message: 'Feedback submitted successfully' });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
