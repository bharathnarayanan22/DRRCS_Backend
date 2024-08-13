const User = require('../models/userModel');
const RoleChangeRequest = require('../models/roleChangeModel'); 


const changeRoleToVolunteer = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.role = 'volunteer';
    await user.save();
    res.json({ message: 'Role changed to volunteer successfully' });
  } catch (err) {
    console.error('Error changing role:', err.message);
    res.status(500).send('Server error');
  }
};

const changeRoleToDonor = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      user.role = 'donor';
      await user.save();
      res.json({ message: 'Role changed to Donor successfully' });
    } catch (err) {
      console.error('Error changing role:', err.message);
      res.status(500).send('Server error');
    }
  };

const requestChangeRoleToCoordinator = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const existingRequest = await RoleChangeRequest.findOne({ user: req.user._id });
    if (existingRequest) {
      return res.status(400).json({ message: 'You have already submitted a request' });
    }

    const roleChangeRequest = new RoleChangeRequest({
      user: req.user._id,
      currentRole: user.role,
      requestedRole: 'coordinator',
      status: 'pending',
    });

    await roleChangeRequest.save();
    res.json({ message: 'Role change request to coordinator submitted' });
  } catch (err) {
    console.error('Error requesting role change:', err.message);
    res.status(500).send('Server error');
  }
};

// const handleCoordinatorRequest = async (req, res) => {
//   const { requestId, action } = req.body; 
//   try {
//     const roleChangeRequest = await RoleChangeRequest.findById(requestId);
//     if (!roleChangeRequest) {
//       return res.status(404).json({ message: 'Request not found' });
//     }

//     if (action === 'approve') {
//       const user = await User.findById(roleChangeRequest.user);
//       user.role = 'coordinator';
//       await user.save();
//       roleChangeRequest.status = 'approved';
//     } else {
//       roleChangeRequest.status = 'rejected';
//     }

//     await roleChangeRequest.save();
//     res.json({ message: `Role change request ${action}ed successfully` });
//   } catch (err) {
//     console.error('Error handling role change request:', err.message);
//     res.status(500).send('Server error');
//   }
// };

const getAllRoleChangeRequests = async (req, res) => {
    try {
      const requests = await RoleChangeRequest.find({ status: 'pending' }).populate('user', 'name');
      res.json(requests);
    } catch (err) {
      console.error('Error fetching role change requests:', err.message);
      res.status(500).send('Server error');
    }
  };
  
  const handleRoleChangeRequest = async (req, res) => {
    const { requestId, action } = req.body;
  
    try {
      const roleChangeRequest = await RoleChangeRequest.findById(requestId);
      if (!roleChangeRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }
  
      if (action === 'approved') {
        const user = await User.findById(roleChangeRequest.user);
        user.role = 'coordinator';
        await user.save();
        roleChangeRequest.status = 'approved';
      } else if (action === 'rejected') {
        roleChangeRequest.status = 'rejected';
      } else {
        return res.status(400).json({ message: 'Invalid action' });
      }
  
      await roleChangeRequest.save();
      res.json({ message: `Role change request ${action} successfully` });
    } catch (err) {
      console.error('Error handling role change request:', err.message);
      res.status(500).send('Server error');
    }
  };
  
  

module.exports = { changeRoleToVolunteer, requestChangeRoleToCoordinator, changeRoleToDonor, getAllRoleChangeRequests, handleRoleChangeRequest };
