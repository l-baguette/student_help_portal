// /api/feedback.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Feedback = require('../models/Feedback');
const app = express();

// Set up file storage configuration for feedback using Multer
const feedbackStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'feedback/');
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        cb(null, sanitizedFilename);
    }
});
const feedbackUpload = multer({ storage: feedbackStorage });

app.post('/feedback/:id', feedbackUpload.single('revisedFile'), async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'teacher') {
        return res.status(401).send('Unauthorized');
    }

    try {
        const feedbackData = {
            submissionId: req.params.id,
            teacherId: req.session.user.studentId,
            feedback: req.body.feedback
        };

        if (req.file) {
            feedbackData.revisedFilePath = `feedback/${req.file.filename}`;
            feedbackData.revisedFileName = req.file.originalname;
        }

        const newFeedback = new Feedback(feedbackData);
        await newFeedback.save();

        res.status(200).send('Feedback submitted successfully');
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).send('Error submitting feedback');
    }
});

module.exports = app;
