# Serviflex Frontend

Aplicação web para gestão de serviços, agendamentos e administração de estabelecimentos e profissionais da beleza.

## Funcionalidades

- Cadastro e login de clientes, profissionais e administradores
- Edição de perfil para todos os tipos de usuário
- Listagem de estabelecimentos e visualização de profissionais vinculados
- Cadastro, edição e exclusão de estabelecimentos (admin)
- Gerenciamento de profissionais em estabelecimentos (admin)
- Convite e remoção de profissionais em estabelecimentos
- Aceite e recusa de convites por profissionais
- Cadastro, edição e exclusão de procedimentos (profissional)
- Listagem de procedimentos por profissional
- Cadastro, edição e exclusão de horários de atendimento (profissional)
- Visualização de horários disponíveis por profissional
- Agendamento, edição e cancelamento de horários (cliente)
- Visualização de agendamentos por cliente e profissional
- Upload de imagens para profissionais e procedimentos
- Relatórios de faturamento, avaliações e agendamentos (admin e profissional)

## Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/brun-brito/serviflex.git
   ```
2. Acesse o diretório do projeto:
   ```
   cd serviflex
   ```
3. Instale as dependências:
   ```
   npm install
   ```

## Uso

1. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```
2. Acesse a aplicação em `http://localhost:3000`.

## Estrutura do Projeto

- `/src`: Código-fonte da aplicação
- `/public`: Arquivos públicos e estáticos
