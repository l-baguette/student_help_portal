// api/returned_submissions.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    const studentId = req.session.user.student_id;

    try {
        const { data: submissions, error: submissionError } = await supabase
            .from('submissions')
            .select('id')
            .eq('student_id', studentId);

        if (submissionError) {
            throw submissionError;
        }

        const submissionIds = submissions.map(submission => submission.id);

        const { data: feedbacks, error: feedbackError } = await supabase
            .from('feedback')
            .select('*')
            .in('submission_id', submissionIds);

        if (feedbackError) {
            throw feedbackError;
        }

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error retrieving returned submissions:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
}
