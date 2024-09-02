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

        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('student_id', teacherId)
            .single();

        if (fetchError) {
            console.error('Error fetching user:', fetchError);
            return res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.user = user;
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};
