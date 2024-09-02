const supabase = require('../supabaseClient');

module.exports = async (req, res) => {
    try {
        const { data: submissions, error } = await supabase
            .from('submissions')
            .select('*');

        if (error) {
            console.error('Error retrieving submissions:', error);
            return res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }

        res.status(200).json(submissions);
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};
