// api/student_submissions.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    const studentId = req.session.user.student_id;

    try {
        const { data: submissions, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('student_id', studentId);

        if (error) {
            throw error;
        }

        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error retrieving submissions:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
}
