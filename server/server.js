const express = require('express');
const connectDB = require('./utils/db_loader');
const passport = require('passport');

const app = express();

// Connecting to DB
connectDB();

// Applying global middleware
app.use(express.json());
app.use(passport.initialize());

// apply google strategy
passport.use(require('./services/googleStrategy'));

// Connecting routers
// Auth
app.use('/auth/google', require('./routes/auth/google'));
// apis
app.use('/api', require('./routes/api/general'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/course', require('./routes/api/course'));
app.use('/api/topic', require('./routes/api/topic'));
app.use('/api/comment', require('./routes/api/comment'));
app.use('/api/test', require('./routes/api/test'));

app.use(express.static('build'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
