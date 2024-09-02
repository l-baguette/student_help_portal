// api/register.js
import { createClient } from '@supabase/supabase-js';
import withSession from './session';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(req, res) {
    if (req.method === 'POST') {
        const { studentId, password } = req.body;

        try {
            const { data, error } = await supabase
                .from('users')
                .insert([
                    { student_id: studentId, password: password, role: 'student' }
                ]);

            if (error) {
                throw error;
            }

            res.status(200).json({ message: 'Registration successful' });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
export default withSession(handler);
