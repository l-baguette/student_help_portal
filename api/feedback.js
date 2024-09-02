const supabase = require('../supabaseClient');

module.exports = async (req, res) => {
    try {
        const { teacherId, feedback } = req.body;

        if (!teacherId || !feedback || !req.params.id) {
            return res.status(400).json({ error: 'Feedback and submission ID are required.' });
        }

        const feedbackData = {
            submission_id: req.params.id,
            teacher_id: teacherId,
            feedback: feedback,
            revised_file_path: req.file ? req.file.path : null
        };

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
};
