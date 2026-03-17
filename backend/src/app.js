const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());



// const authRoutes = require('./routes/auth.routes.js')
// app.use("/auth", authRoutes);

app.use("/users", require("./routes/user.routes"));
app.use("/login", require("./routes/auth.routes"));
app.use("/records", require("./routes/records.routes"));
app.use(express.urlencoded({ extended: true }));

module.exports = app;


