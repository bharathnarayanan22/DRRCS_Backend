const Task = require('../models/taskModel');

exports.createTask = async (req, res) => {
  const { description } = req.body;
  const coordinator = req.user;

  try {
    const task = new Task({ description, coordinator, volunteer: null, });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.acceptTask = async (req, res) => {
    const { id } = req.params;
    const volunteerId = req.user;
  
    try {
      const task = await Task.findById(id);
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      if (task.volunteer) {
        return res.status(400).json({ message: 'Task already assigned to a volunteer' });
      }
  
      task.volunteer = volunteerId;
      task.status = 'in-progress';
      await task.save();
  
      res.json(task);
    } catch (err) {
      console.error('Error accepting task:', err.message);
      res.status(500).send('Server error');
    }
  };

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('coordinator', ['name', 'email']).populate('volunteer', ['name', 'email']);
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
