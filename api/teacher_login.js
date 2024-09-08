// api/teacher_login.js
import { createClient } from '@supabase/supabase-js';
import withSession from './session';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(req, res) {
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

            // Check if the session exists before assigning user to it
            if (!req.session) {
                return res.status(500).json({ error: 'Session not initialized' });
            }

            // Store the user in the session
            req.session.user = user;

            // Redirect the user to the teacher dashboard
            res.writeHead(302, { Location: '/teacher_dashboard.html' });
            res.end();
        } catch (error) {
            console.error('Error logging in teacher:', error);
            res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default withSession(handler);
