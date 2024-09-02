const supabase = require('../supabaseClient');

module.exports = async (req, res) => {
    try {
        const { studentId, desiredOutcome, actualOutcome, problem } = req.body;

        if (!studentId || !desiredOutcome || !actualOutcome || !problem || !req.file) {
            return res.status(400).json({ error: 'All fields and file upload are required.' });
        }

        const { error: insertError } = await supabase
            .from('submissions')
            .insert([
                {
                    student_id: studentId,
                    desired_outcome: desiredOutcome,
                    actual_outcome: actualOutcome,
                    problem: problem,
                    file_path: req.file.path
                }
            ]);

        if (insertError) {
            console.error('Error submitting data:', insertError);
            return res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }

        res.status(200).json({ message: 'Submission successful' });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};
