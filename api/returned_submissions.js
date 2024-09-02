import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'student') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { data: submissions, error: submissionsError } = await supabase
            .from('submissions')
            .select('id')
            .eq('student_id', req.session.user.id);

        if (submissionsError) {
            console.error('Error retrieving submissions:', submissionsError);
            return res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }

        const submissionIds = submissions.map(sub => sub.id);

        const { data: feedbacks, error: feedbackError } = await supabase
            .from('feedback')
            .select('*')
            .in('submission_id', submissionIds);

        if (feedbackError) {
            console.error('Error retrieving feedback:', feedbackError);
            return res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};
