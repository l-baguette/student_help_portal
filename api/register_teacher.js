import { createClient } from '@supabase/supabase-js';
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    try {
        const { teacherId, password } = req.body;

        if (!teacherId || !password) {
            return res.status(400).json({ error: 'Teacher ID and password are required.' });
        }

        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('student_id', teacherId)
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
                    student_id: teacherId,
                    password: hashedPassword,
                    role: 'teacher'
                }
            ]);

        if (insertError) {
            console.error('Error registering teacher:', insertError);
            return res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }

        res.status(200).json({ message: 'Teacher registration successful' });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};
