// /api/submit.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Submission = require('../models/Submission');
const app = express();

// Set up file storage configuration using Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        cb(null, sanitizedFilename);
    }
});
const upload = multer({ storage });

app.post('/submit', upload.single('fileUpload'), async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'student') {
        return res.status(401).send('Unauthorized');
    }

    const { desiredOutcome, actualOutcome, problem } = req.body;
    const newSubmission = new Submission({
        studentId: req.session.user.studentId,
        desiredOutcome,
        actualOutcome,
        problem,
        filePath: req.file.path,
        createdAt: new Date()
    });

    try {
        await newSubmission.save();
        res.status(200).send('Submission successful');
    } catch (error) {
        console.error('Error submitting data:', error);
        res.status(500).send('Error submitting data');
    }
});

module.exports = app;
