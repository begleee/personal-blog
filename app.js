const express = require('express');
const app = express();
require('dotenv').config();
const { syncDatabase } = require('./models');

const PORT = process.env.PORT || 3000;
syncDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    })
})
