const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    studentId: { type: String, ref: 'User' },
    desiredOutcome: String,
    actualOutcome: String,
    problem: String,
    filePath: String,
    feedback: String,
    revisedFilePath: String,
    createdAt: { type: Date, default: Date.now }  // Add this line
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;

