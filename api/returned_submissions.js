const supabase = require('../supabaseClient');

module.exports = async (req, res) => {
    try {
        const { studentId } = req.session.user;

        const { data: submissions, error: submissionsError } = await supabase
            .from('submissions')
            .select('id')
            .eq('student_id', studentId);

        if (submissionsError) {
            console.error('Error retrieving submissions:', submissionsError);
            return res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }

        const submissionIds = submissions.map(submission => submission.id);

        const { data: feedbacks, error: feedbacksError } = await supabase
            .from('feedback')
            .select('*')
            .in('submission_id', submissionIds);

        if (feedbacksError) {
            console.error('Error retrieving feedbacks:', feedbacksError);
            return res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};
