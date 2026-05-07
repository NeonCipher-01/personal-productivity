const Goal = require('../models/Goal');

const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createGoal = async (req, res) => {
    const { title, description, targetDate } = req.body;
    try {
        const goal = await Goal.create({ user: req.user._id, title, description, targetDate });
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        if (goal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updated = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        if (goal.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await goal.deleteOne();
        res.json({ message: 'Goal removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };