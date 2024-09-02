// api/teacher_login.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { teacherId, password } = req.body;

        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('student_id', teacherId)
                .eq('role', 'teacher')
                .single();

            if (error || !user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Add session logic here
            req.session.user = user;

            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            console.error('Error logging in teacher:', error);
            res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
