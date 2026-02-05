const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

dotenv.config();
const app = express();

const uploadRoutes = require('./routes/upload.routes')
const userRoutes = require('./routes/user.routes')

app.use(cors());
app.use(express.json());
app.use(uploadRoutes)
app.use(userRoutes)

const PORT = process.env.PORT || 3333;
app.listen(PORT, () =>{
    console.log(`Servidor rodando na porta ${PORT}`);
})