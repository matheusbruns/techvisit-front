# Techvisit - Gerenciamento de Agendamentos e Visitas Técnicas

Techvisit é uma solução SaaS desenvolvida para otimizar o gerenciamento de visitas técnicas realizadas na casa dos clientes, oferecendo praticidade tanto para empresas quanto para técnicos ao organizarem seus chamados e compromissos.

## 📎 Link para a aplicação
- [Techvisit](https://techvisit.tech)

---

## 📜 Visão Geral do Projeto

### Objetivo
O **Techvisit** visa simplificar o gerenciamento de visitas técnicas, proporcionando uma experiência intuitiva e eficaz tanto para empresas quanto para técnicos responsáveis pela execução das visitas. Empresas têm acesso a um quadro geral onde podem gerenciar todas as visitas no período desejado, permitindo uma visão ampla e controle sobre os atendimentos. Além disso, é possível cadastrar clientes e técnicos, facilitando a organização e o acesso rápido a informações essenciais. Técnicos podem acessar uma tela personalizada com uma lista de seus próximos serviços, o que aprimora o planejamento diário e o acompanhamento de seus chamados, aumentando a eficiência e organização das operações de atendimento.

---

## 📐 Arquitetura e Tecnologias

- **Frontend:** React (Typescript)
- **Componentes:** Material UI
- **Estilização:** SCSS
- **Monitoramento de Código:** SonarCloud - [Projeto no SonarCloud](https://sonarcloud.io/project/overview?id=matheusbruns_techvisit-front)

O frontend do Techvisit foi estruturado com foco em **componentização**, garantindo maior organização e reutilização de código. Cada funcionalidade está separada em diretórios específicos, facilitando manutenções e escalabilidade.

### Estrutura do Projeto
- **src/**: Contém os arquivos principais do projeto.
  - **pages/**: Páginas principais do sistema, organizadas por funcionalidade.
  - **api/**: Lógica de integração com a API e outras operações externas.
  - **resources/**: Imagens estáticas, dentre outros recursos.
  - **router/**: Rotas da aplicação.
  - **util/**: Funções e utilitários de apoio.
  - **contexts/**: Contextos para gerenciamento de estados globais e configuração de autenticação.

---

## 🚀 Instalação e Execução do Projeto

Siga os passos abaixo para configurar e executar o frontend do Techvisit localmente.

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 16 ou superior
- [Git](https://git-scm.com/)

### Passos para Clonar e Instalar Dependências

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/matheusbruns/techvisit-front.git
   ```
   ```bash
   cd techvisit-front
   ```

2. **Instale as dependências**:

   Certifique-se de estar no diretório raiz do projeto e execute:

   ```bash
   npm install
   ```

### Executando o Projeto

Após instalar as dependências, execute o projeto com o comando:

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000` por padrão.

---

## 🔍 Monitoramento de Código

Este projeto utiliza SonarCloud para monitoramento de qualidade de código e análise estática. Confira o projeto no SonarCloud [aqui](https://sonarcloud.io/summary/overall?id=matheusbruns_techvisit-front).

