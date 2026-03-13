require('dotenv').config();
const app = require('./src/app.js');

const PORT = process.env.PORT
;

app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});