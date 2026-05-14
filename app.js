const express = require('express');
require('dotenv').config();
const { syncDatabase } = require('./models');
const postRoutes = require('./routes/posts');

const app = express();
app.use(express.json());

app.use('/posts', postRoutes);

const PORT = process.env.PORT || 3000;
syncDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    })
})
