const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    submission_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
        required: true
    },
    teacher_id: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    revised_file_path: {
        type: String
    },
    revised_file_name: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

FeedbackSchema.statics.handleError = function (error) {
    console.error(error);
    return { error: 'An error occurred while processing your request.' };
};

module.exports = mongoose.model('Feedback', FeedbackSchema);
