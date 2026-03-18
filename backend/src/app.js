const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3001', // URL do seu frontend React
    credentials: true
}));


// const authRoutes = require('./routes/auth.routes.js')
// app.use("/auth", authRoutes);

app.use("/users", require("./routes/user.routes"));
app.use("/login", require("./routes/auth.routes"));
app.use("/records", require("./routes/records.routes"));
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));
// ... outras importações

// Libera o acesso à pasta uploads
app.use(express.urlencoded({ extended: true }));


// backend/app.js ou server.js

module.exports = app;


