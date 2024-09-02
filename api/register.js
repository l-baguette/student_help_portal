import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { studentId, password, role } = req.body;

        try {
            // Check if user already exists
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('student_id', studentId)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                console.error('Error checking existing user:', fetchError);
                return res.status(500).json({ error: 'Internal server error. Please try again later.' });
            }

            if (existingUser) {
                return res.status(409).json({ error: 'User already exists.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        student_id: studentId,
                        password: hashedPassword,
                        role: role || 'student'
                    }
                ]);

            if (insertError) {
                console.error('Error registering user:', insertError);
                return res.status(500).json({ error: 'Internal server error. Please try again later.' });
            }

            res.status(200).json({ message: 'Registration successful' });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
