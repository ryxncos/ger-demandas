require('dotenv').config({path: '../../.env'});
const express = require('express');
const cors = require('cors');
const app = express();

const uploadRoutes = require('./routes/upload.routes')
const userRoutes = require('./routes/user.routes')

app.use(cors());
app.use(express.json());
app.use(uploadRoutes)
app.use(userRoutes)

const PORT = process.env.LOCAL_SERVER;
app.listen(PORT, () =>{
    console.log(`Servidor rodando na porta ${PORT}`);
})