const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly'],
        default: 'daily'
    },
    completedDates: [
        {
            type: Date
        }
    ],
    streak: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);