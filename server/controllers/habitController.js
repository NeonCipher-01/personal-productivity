const Habit = require('../models/Habit');

const getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createHabit = async (req, res) => {
    const { title, frequency } = req.body;
    try {
        const habit = await Habit.create({ user: req.user._id, title, frequency });
        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        if (habit.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updated = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        if (habit.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await habit.deleteOne();
        res.json({ message: 'Habit removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getHabits, createHabit, updateHabit, deleteHabit };