Linguagem / Runtime: Node.js
Framework: Express
Banco de Dados: PostgreSQL
Upload de Arquivos: Multer
Autenticação: JWT

Estrutura:
Backend => Contém tudo que roda no servidor: API, Regras de negócio, banco de dados, upload de arquivos, segurança
/src => Código fonte da aplicação,  toda a lógica da API fica localizada aqui.
/src/controllers => Controladores de entrada da  API. Recebe a requisição HTTP(req) e devolve a resposta (res)
Responsabilidades: Ler dados da requisição, validar dados básico, chamar o service correto, retornar resposta HTTP.
/src/routes/ => Definição de rotas da API. Mapeia URL + método HTTP paara um controller.
Responsabilidades: Organização.
/src/middlewares/ => Executam ANTES do controller.
Exemplos: Autenticação (JWT), Verificar se é ADM, Validação de arquivos, Controle de permissões
/src/services/ => Coração do sistema.
O que faz? => Lógica principal, Decisões, Regras do sistema, Comunicação com o Banco
/src/config => Configurações globais.
Aqui ficam arquivos de configuração como: Prisma, Multer,  JWT, Banco de Dados, CORS
/src/server.js => Ponto de entrada da aplicação
O que faz? => Inicializa o express, aplica middlewares globais, registra rotas, sobe o servidor

uploads/ => Armazenamento de arquivos enviados
Aqui ficam as imagens e registros enviados pelo usuário

prisma/ => Camada de banco de dados (ORM)
prisma/schema.prisma => Modelo de banco de dados

.env => Variáveis de ambiente
Contém:
URL do banco, senhas, Chaves JWT, Porta do Servidor

Dependencias:
pg => PostgreSQL
express
cors
dotenv
jsonwebtoken
multer
prisma @prisma/client
nodemon --save-dev