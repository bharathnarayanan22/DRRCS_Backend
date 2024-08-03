const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const taskRoutes = require('./routes/taskRoutes');
const requestRoutes = require('./routes/requestRoutes');
const responseRoutes = require('./routes/responseRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyparser.json());
app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/resource', resourceRoutes);
app.use('/task', taskRoutes);
app.use('/request', requestRoutes);
app.use('/response', responseRoutes);

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error(err);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
