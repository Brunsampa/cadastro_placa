# Atividade 02 web II

## 📌 Sobre
Este projeto é uma API desenvolvida em Node.js e Express, com o objetivo de reconhecer e armazenar informações de placas de veículos utilizando OCR (Reconhecimento Óptico de Caracteres). A API permite o cadastro de placas a partir de imagens enviadas pelos usuários e mantém registros com informações como a cidade, data e hora do registro em um banco de dados MongoDB. Além disso, a API é capaz de gerar relatórios em PDF com os registros das placas de uma cidade específica.

## 📌 Funcionalidades
- **Cadastro de Placas**: Rota `POST /cadastroPlaca` que permite o envio de uma foto de uma placa de veículo, juntamente com o nome da cidade. A API utiliza OCR para reconhecer a placa na imagem e armazena as informações no banco de dados MongoDB.
- **Relatório por Cidade**: Rota `GET /relatorio/cidade/:cidade` que gera um relatório em PDF com todas as placas registradas de uma determinada cidade, contendo informações como número da placa, cidade, data e hora do registro.
- **Consulta de Placas**: Rota `GET /consulta/:placa` que verifica se uma determinada placa está cadastrada no banco de dados.

## 🚀 Tecnologias Utilizadas
- **Node.js e Express**: Plataforma e framework usados para construir a API.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenar as informações das placas.
- **OCR (Tesseract.js)**: Biblioteca para reconhecimento óptico de caracteres a partir das imagens das placas.
- **PDFKit**: Biblioteca utilizada para gerar os arquivos PDF dos relatórios.

## 💻 Clonagem
Como clonar o projeto:

1. Abra o terminal.
2. Digite o seguinte comando:
   ```bash
   git clone https://github.com/Brunsampa/cadastro_placa.git
   ```
3. Acesse o diretório do projeto:
   ```bash
   cd nome-do-projeto
   ```
4. Instale as dependências do projeto:
   ```bash
   npm install
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

Após seguir esses passos, sua aplicação estará rodando localmente.

## 💻 Deploy
Este projeto está hospedado no Vercel.

## ❗ Lições Aprendidas
Durante o desenvolvimento deste projeto, diversas lições importantes foram aprendidas:

- **Integração de OCR com APIs**: Aprendemos como integrar a funcionalidade de OCR (Reconhecimento Óptico de Caracteres) em uma aplicação Node.js, utilizando a biblioteca Tesseract.js para extrair textos de imagens de placas e processá-los de maneira eficiente.
- **Geração de PDFs em Aplicações Web**: Foi interessante explorar a geração de arquivos PDF dinâmicos a partir de dados armazenados no banco de dados, utilizando a biblioteca PDFKit. Isso nos ajudou a entender melhor como manipular documentos dentro de uma aplicação web.
- **Trabalhar com MongoDB**: Ganhamos experiência na modelagem de dados e na interação com um banco de dados NoSQL, utilizando MongoDB. Aprendemos como fazer consultas, inserir e gerenciar registros, além de configurar variáveis de ambiente para facilitar o desenvolvimento.
- **Desenvolvimento de APIs RESTful**: Este projeto reforçou nossos conhecimentos em desenvolvimento de APIs RESTful com Node.js e Express, incluindo boas práticas de estruturação de rotas, middleware, e manipulação de dados.
- **Deploy em Vercel**: A experiência de hospedar o projeto no Vercel foi valiosa, proporcionando uma visão prática sobre o fluxo de deploy contínuo e como gerenciar um ambiente de produção para aplicações Node.js.

## 🤝 Colaboradores
- Bruno
- Matheus

