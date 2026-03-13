------------------------------ DEPENDÊNCIAS ------------------------------
express
cors
dotenv
-D nodemon
install prisma @prisma/client
jsonwebtoken 
bcrypt
---------------------------------------------------------------------------
------------------------------ CMDs Importantes ------------------------------
npm init -y => starta o projeto
npx prisma init => starta o prisma
npx prisma migrate dev --name init => cria o banco e aplica migration
--------------------------------------------------------------------------

------------------------------- ESTRUTURA ---------------------------
src => pasta do código fonte
  controllers => responsáveis por receber a requisiçaõ HTTP e retornar a resposta
  services => Pasta onde fica validações, por exemplo o jsonwebtoken
  routes => define as rotas da API
  middleware => funções que interceptam a requisição antes de chegar no controllers
  



