import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { studentId, password } = req.body;

        try {
            const { data: user, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('student_id', studentId)
                .single();

            if (fetchError || !user) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            req.session.user = {
                id: user.id,
                studentId: user.student_id,
                role: user.role
            };

            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
