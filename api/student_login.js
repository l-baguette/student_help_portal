// api/student_login.js
import { createClient } from '@supabase/supabase-js';
import withSession from './session';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(req, res) {
    if (req.method === 'POST') {
        const { studentId, password } = req.body;

        try {
            // Fetch the user from the database
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('student_id', studentId)
                .eq('role', 'student')
                .single();

            // Handle errors or non-existent users
            if (error || !user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check if the session exists before assigning user to it
            if (!req.session) {
                return res.status(500).json({ error: 'Session not initialized' });
            }

            // Store the user in the session
            req.session.user = user;

            // Redirect the user to the student dashboard
            res.writeHead(302, { Location: '/student_dashboard.html' });
            res.end();
        } catch (error) {
            console.error('Error logging in user:', error);
            res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export default withSession(handler);
