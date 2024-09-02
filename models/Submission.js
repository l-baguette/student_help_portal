const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    student_id: { type: String, ref: 'User' },
    desired_outcome: String,
    actual_outcome: String,
    problem: String,
    file_path: String,
    created_at: { type: Date, default: Date.now }
});

submissionSchema.statics.handleError = function (error) {
    console.error(error);
    return { error: 'An error occurred while processing your request.' };
};

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
