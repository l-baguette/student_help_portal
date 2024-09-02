const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    submissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
        required: true
    },
    teacherId: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    revisedFilePath: {
        type: String
    },
    revisedFileName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
