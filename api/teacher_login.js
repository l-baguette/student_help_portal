const supabase = require('../supabaseClient');
const bcrypt = require('bcryptjs');

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

        if (fetchError || !user) {
            console.error('Error fetching user:', fetchError);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Session handling can be implemented as needed
        res.status(200).json({ message: 'Login successful', role: user.role });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};
