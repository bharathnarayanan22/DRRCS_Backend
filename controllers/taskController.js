const Task = require('../models/taskModel');

exports.createTask = async (req, res) => {
  const { description, volunteersNeeded, startLocation, endLocation } = req.body;
  const coordinator = req.user;

  try {
    const task = new Task({
      description,
      volunteersNeeded,
      startLocation, 
      endLocation, 
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
      }
    }

    const acceptedVolunteers = task.volunteers.filter((volunteer) => volunteer.status === 'accepted');

    if (acceptedVolunteers.length >= task.volunteersNeeded) {
      return res.status(400).json({ message: 'Task already has enough volunteers' });
    }

    if (existingVolunteer) {
      existingVolunteer.status = 'accepted';
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
      existingVolunteer.status = 'declined';
    } else {
      task.volunteers.push({ user: volunteerId, status: 'declined' });
    }

    const acceptedVolunteers = task.volunteers.filter((volunteer) => volunteer.status === 'accepted');

    if (acceptedVolunteers.length < task.volunteersNeeded) {
      task.status = 'pending';
    }

    await task.save();

    res.json(task);
  } catch (err) {
    console.error('Error declining task:', err.message);
    res.status(500).send('Server error');
  }
}

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('coordinator', ['name', 'email']);
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const updatedTask = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, updatedTask, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating task' });
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

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

const Request = require('../models/requestModel');
const Response = require('../models/responseModel');

exports.createTaskFromRequest = async (req, res) => {
  const { requestId, responseId } = req.params;

  try {
    const request = await Request.findById(requestId).populate('coordinator');
    const response = await Response.findById(responseId).populate('donor');

    if (!request || !response) {
      return res.status(404).json({ message: 'Request or response not found' });
    }

    const task = new Task({
      description: `Deliver ${request.type} from ${request.location} to ${response.resource.location}`,
      volunteersNeeded: 1, 
      startLocation: request.location,
      endLocation: response.resource.location,
      coordinator: request.coordinator._id
    });

    await task.save();

    request.status = 'accepted';
    await request.save();

    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

