// /api/returned_submissions.js
const express = require('express');
const Feedback = require('../models/Feedback');
const Submission = require('../models/Submission');
const app = express();

app.get('/returned_submissions', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'student') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const submissions = await Submission.find({ studentId: req.session.user.studentId });
        const feedbacks = await Feedback.find({ submissionId: { $in: submissions.map(sub => sub._id) } });
        res.json(feedbacks);
    } catch (error) {
        console.error('Error retrieving returned submissions:', error);
        res.status(500).send('Error retrieving returned submissions');
    }
});

module.exports = app;
