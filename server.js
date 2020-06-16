const express = require('express');
const connectDB = require('./utils/db_loader');

const app = express();

// Connecting to DB
connectDB();

// Applying global middleware
app.use(express.json());

// Connecting routers
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/course', require('./routes/api/course'));
app.use('/api/topic', require('./routes/api/topic'));
app.use('/api/comment', require('./routes/api/comment'));
app.use('/api/test', require('./routes/api/test'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
