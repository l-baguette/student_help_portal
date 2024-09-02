import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { teacherId, password } = req.body;

        try {
            // Fetch the user from the Supabase 'users' table based on the teacherId
            const { data: user, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('student_id', teacherId)  // Note: 'student_id' is used for both students and teachers
                .single();

            if (fetchError || !user || user.role !== 'teacher') {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            // Compare the provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            // Store user information in the session
            req.session.user = {
                id: user.id,
                studentId: user.student_id,
                role: user.role
            };

            // Respond with a success message
            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
