// /api/submissions.js
const express = require('express');
const Submission = require('../models/Submission');
const app = express();

app.get('/submissions', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'teacher') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const submissions = await Submission.find();
        res.json(submissions);
    } catch (error) {
        console.error('Error retrieving submissions:', error);
        res.status(500).send('Error retrieving submissions');
    }
});

module.exports = app;
