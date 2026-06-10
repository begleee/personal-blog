const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { syncDatabase } = require('./models');
const postRoutes = require('./routes/posts');
const authorRoutes = require('./routes/authors');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const refreshRoutes = require('./routes/refresh');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/refresh', refreshRoutes);

app.use('/posts', postRoutes);
app.use('/authors', authorRoutes);

const PORT = process.env.PORT || 3000;
syncDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    })
})
