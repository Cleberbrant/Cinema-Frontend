# 🎬 Cinema Microservices - Trabalho TPPE

| Aluno                    | Matrícula | Disciplina                                        |
| ------------------------ | --------- | ------------------------------------------------- |
| Cleber de Oliveira Brant | 200061216 | Técnicas de Programação em Plataformas Emergentes |

---

## Sobre o Projeto

Este projeto é um sistema completo para gerenciamento de um cinema, desenvolvido com **arquitetura de microserviços**. O backend, o serviço de autenticação e o frontend são desacoplados e se comunicam via REST, com autenticação baseada em JWT. O sistema foi evoluído a partir de um projeto de Orientação a Objetos (OO) e agora segue boas práticas de arquitetura, segurança, versionamento de banco e documentação.

O sistema permite o cadastro e gerenciamento de usuários, filmes, sessões, alimentos, pagamentos e toda a lógica de um cinema moderno, incluindo autenticação de administradores e clientes, operações CRUD completas e controle de acesso por roles.

---

# 🎬 Cinema Frontend

Sistema de gerenciamento de cinema construído com Angular 20 e Angular Material. Este é o frontend da aplicação que permite gerenciar cinemas, filmes, sessões, alimentos e autenticação de usuários.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Execução](#-execução)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Contribuição](#-contribuição)

## ✨ Funcionalidades

### 🔐 Autenticação

- Login e registro de usuários
- Autenticação JWT
- Proteção de rotas com guards
- Interceptor para anexar tokens automaticamente

### 🏢 Administração

- **Cinemas**: CRUD completo com localidades
- **Filmes**: Gerenciamento com posters, gêneros e valores
- **Sessões**: Agendamento com data/hora, cinema e filme
- **Alimentos**: Cardápio com tipos (combo, bebida, doce, salgado)

### 👤 Usuário

- Visualização de filmes em cartaz
- Detalhes dos filmes
- Sistema de pagamento
- Interface responsiva

## 🛠 Tecnologias

- **Angular 20** - Framework principal
- **Angular Material** - UI Components
- **TypeScript** - Linguagem de programação
- **Angular Signals** - Gerenciamento de estado reativo
- **RxJS** - Programação reativa
- **NGX-Toastr** - Notificações
- **NGX-Mask** - Máscaras de input
- **SCSS** - Estilização

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** 9.x ou superior
- **Angular CLI** 20.x
- **Backend do Cinema** rodando (portas 8080 e 8081)

## 🚀 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/Cleberbrant/Cinema-Frontend.git
cd cinema-frontend
```

2. **Instale as dependências**

```bash
npm install
```

3. **Instale o Angular CLI globalmente (se necessário)**

```bash
npm install -g @angular/cli@20
```

## ⚙️ Configuração

### Ambientes

Configure os ambientes em `src/environments/`:

**environment.ts** (Desenvolvimento)

```typescript
export const environment = {
  production: false,
  apiUrl: "/api", // Proxy para cinema-backend:8080
  authUrl: "/auth", // Proxy para auth-cinema:8081
};
```

**environment.prod.ts** (Produção)

```typescript
export const environment = {
  production: true,
  apiUrl: "https://api.cinema.com/api",
  authUrl: "https://auth.cinema.com/auth",
};
```

### Proxy Configuration

O arquivo `proxy.conf.json` configura o redirecionamento para os backends:

```json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  },
  "/auth/*": {
    "target": "http://localhost:8081",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

## 🏃‍♂️ Execução

### Desenvolvimento

```bash
# Executar com proxy (recomendado)
npm run start:proxy

# Ou executar normalmente
npm start
```

A aplicação estará disponível em `http://localhost:4200`

### Produção

```bash
# Build para produção
npm run build

# Os arquivos serão gerados em dist/
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── navbar/         # Barra de navegação
│   │   └── admin-sidebar/  # Menu lateral do admin
│   ├── guards/             # Guards de rota
│   │   ├── auth.guard.ts   # Proteção de rotas autenticadas
│   │   └── admin.guard.ts  # Proteção de rotas admin
│   ├── interceptors/       # Interceptadores HTTP
│   │   └── auth.interceptor.ts
│   ├── layouts/            # Layouts da aplicação
│   │   └── admin/          # Layout administrativo
│   ├── models/             # Interfaces TypeScript
│   │   ├── auth.model.ts
│   │   ├── cinema.model.ts
│   │   ├── filme.model.ts
│   │   ├── sessao.model.ts
│   │   └── alimento.model.ts
│   ├── pages/              # Páginas da aplicação
│   │   ├── admin/          # Área administrativa
│   │   │   ├── dashboard/
│   │   │   ├── cinemas/
│   │   │   ├── filmes/
│   │   │   ├── sessoes/
│   │   │   └── alimentos/
│   │   ├── home/           # Página inicial
│   │   ├── login/          # Login
│   │   ├── registro/       # Registro
│   │   ├── filme-detalhes/ # Detalhes do filme
│   │   └── pagamento/      # Pagamento
│   └── services/           # Serviços
│       ├── auth.service.ts
│       ├── cinema.service.ts
│       ├── filme.service.ts
│       ├── sessao.service.ts
│       └── alimento.service.ts
├── environments/           # Configurações de ambiente
└── styles.scss            # Estilos globais
```

## 🔌 API Endpoints

### Autenticação (Auth Service - :8081)

- `POST /auth/login` - Login do usuário
- `POST /auth/register` - Registro de usuário
- `POST /auth/refresh` - Renovar token
- `GET /auth/me` - Dados do usuário logado

### Cinema Backend (:8080)

- `GET /api/cinemas` - Listar cinemas
- `POST /api/cinemas` - Criar cinema
- `PUT /api/cinemas/:id` - Atualizar cinema
- `DELETE /api/cinemas/:id` - Deletar cinema

- `GET /api/filmes` - Listar filmes
- `POST /api/filmes` - Criar filme
- `PUT /api/filmes/:id` - Atualizar filme
- `DELETE /api/filmes/:id` - Deletar filme

- `GET /api/sessoes` - Listar sessões
- `POST /api/sessoes` - Criar sessão
- `PUT /api/sessoes/:id` - Atualizar sessão
- `DELETE /api/sessoes/:id` - Deletar sessão

- `GET /api/alimentos` - Listar alimentos
- `POST /api/alimentos` - Criar alimento
- `PUT /api/alimentos/:id` - Atualizar alimento
- `DELETE /api/alimentos/:id` - Deletar alimento

## 🎯 Funcionalidades Principais

### Área Administrativa (`/admin`)

Acesso restrito a usuários administradores:

1. **Dashboard**: Visão geral do sistema
2. **Cinemas**: Gerenciar cinemas e suas localidades
3. **Filmes**: CRUD de filmes com upload de posters
4. **Sessões**: Agendamento de sessões de cinema
5. **Alimentos**: Gerenciar cardápio de alimentos

### Área Pública

1. **Home**: Lista de filmes em cartaz
2. **Detalhes do Filme**: Informações completas e sessões
3. **Login/Registro**: Autenticação de usuários
4. **Pagamento**: Processamento de ingressos

### Recursos Técnicos

- **Reactive Forms**: Validação robusta de formulários
- **Angular Signals**: Estado reativo e performático
- **Angular Material**: UI consistente e acessível
- **Guards**: Proteção de rotas baseada em roles
- **Interceptors**: Anexo automático de tokens JWT
- **Error Handling**: Tratamento centralizado de erros
- **Loading States**: Feedback visual para usuário
- **Responsive Design**: Interface adaptável

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm start                    # Servidor de desenvolvimento
npm run start:proxy          # Servidor com proxy (recomendado)

# Build
npm run build               # Build de produção
npm run watch               # Build em modo watch

# Testes
npm test                    # Executar testes unitários

# Angular CLI
npm run ng                  # Executar comandos do Angular CLI
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código

- Use **TypeScript** com tipagem forte
- Siga os padrões do **Angular Style Guide**
- Use **Angular Signals** para estado reativo
- Implemente **tratamento de erros** adequado
- Adicione **testes unitários** para novas funcionalidades

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de CORS:**

```bash
# Certifique-se de usar o proxy
npm run start:proxy
```

**Erro 404 em APIs:**

```bash
# Verifique se os backends estão rodando
# Cinema Backend: http://localhost:8080
# Auth Service: http://localhost:8081
```

**Token expirado:**

```bash
# Faça logout e login novamente
# O sistema renovará automaticamente tokens válidos
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ usando Angular 20**
