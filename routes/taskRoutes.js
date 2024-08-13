const express = require('express');
const Router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const { createTask, getTasks, updateTask, updateTaskStatus, acceptTask, declineTask, deleteTask, createTaskFromRequest,getAcceptedTasks, uploadPhotos, getPhoto,getPendingVerificationTasks  } = require('../controllers/taskController');

Router.post('/createTask', auth(['coordinator']), createTask);
Router.get('/getTask', getTasks);
Router.put('/acceptTask/:id', auth(['volunteer']), acceptTask)
Router.put('/updateTask/:id', auth(['volunteer', 'coordinator']), updateTask);
Router.put('/updateTaskStatus/:id', auth(['volunteer','coordinator']), updateTaskStatus);
Router.delete('/deleteTask/:id', auth(['coordinator']), deleteTask);
Router.put('/declineTask/:id', auth(['volunteer']), declineTask);
Router.post('/tasks/from-request/:requestId/response/:responseId', auth(['coordinator']), createTaskFromRequest);
Router.get('/acceptedTasks',auth(['volunteer']),getAcceptedTasks);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

Router.post('/uploadPhotos', upload.array('photos'), uploadPhotos);
Router.get('/photos/:filename', getPhoto);
Router.get('/pendingVerification', auth(['coordinator']), getPendingVerificationTasks);


module.exports = Router;