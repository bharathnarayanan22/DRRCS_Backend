const Task = require('../models/taskModel');

exports.createTask = async (req, res) => {
  const { description, volunteersNeeded } = req.body;
  const coordinator = req.user;

  try {
    const task = new Task({
      description,
      volunteersNeeded,
      coordinator: coordinator._id,
    });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.acceptTask = async (req, res) => {
  const { id } = req.params;
  const volunteerId = req.user._id;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const existingVolunteer = task.volunteers.find((volunteer) => volunteer.user.toString() === volunteerId.toString());

    if (existingVolunteer) {
      if (existingVolunteer.status === 'accepted') {
        return res.status(400).json({ message: 'You have already accepted this task' });
      } else if (existingVolunteer.status === 'declined') {
        return res.status(400).json({ message: 'You have already declined this task' });
      } else {
        existingVolunteer.status = 'accepted';
      }
    } else {
      task.volunteers.push({ user: volunteerId, status: 'accepted' });
    }

    if (task.volunteers.filter((volunteer) => volunteer.status === 'accepted').length >= task.volunteersNeeded) {
      task.status = 'in-progress';
    }

    await task.save();

    res.json(task);
  } catch (err) {
    console.error('Error accepting task:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('coordinator', ['name', 'email']);
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(id, { status: "completed" }, { new: true });
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.declineTask = async (req, res) => {
  const { id } = req.params;
  const volunteerId = req.user._id;
  
  try {
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const existingVolunteer = task.volunteers.find((volunteer) => volunteer.user.toString() === volunteerId.toString());
    
    if (existingVolunteer) {
      if (existingVolunteer.status === 'accepted') {
        existingVolunteer.status = 'declined';
      }
    } else {
      task.volunteers.push({ user: volunteerId, status: 'declined' });
      task.status = 'pending';
      await task.save();
      
      return res.json(task);
    }
  }
  catch(err) {
    console.error('Error declining task:', err.message);
    res.status(500).send('Server error');
  }
}