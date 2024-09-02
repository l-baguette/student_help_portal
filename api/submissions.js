import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'teacher') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

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
