# 🎬 CinemaMax - Sistema de Gerenciamento de Cinema

Um sistema completo e moderno para gerenciamento de cinemas, desenvolvido com Angular 19 e Angular Material, oferecendo uma experiência elegante tanto para clientes quanto para administradores.

## 🚀 Funcionalidades Principais

### 👥 Para Clientes

- **Autenticação Segura**: Sistema de login/registro com JWT
- **Catálogo de Filmes**: Navegação intuitiva pelos filmes em cartaz
- **Detalhes de Filmes**: Informações completas com sinopse, classificação e trailer
- **Seleção de Sessões**: Escolha de horários e salas disponíveis
- **Compra de Ingressos**: Fluxo completo de compra com seleção de assentos
- **Alimentos e Combos**: Venda de produtos do cinema
- **Pagamento Integrado**: Sistema seguro de processamento de pagamentos

### 🔧 Para Administradores

- **Dashboard Analítico**: Visão geral das operações do cinema
- **Gerenciamento de Filmes**: CRUD completo com upload de poster e trailers
- **Gestão de Cinemas**: Cadastro e manutenção de unidades
- **Controle de Salas**: Configuração de capacidade e tecnologia
- **Programação de Sessões**: Agendamento flexível de horários
- **Gestão de Alimentos**: Catálogo de produtos da bomboniere
- **Relatórios e Métricas**: Análise de vendas e ocupação

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Angular 19** - Framework principal
- **Angular Material** - Componentes UI elegantes
- **TypeScript** - Linguagem de programação
- **SCSS** - Estilização avançada
- **Angular Signals** - Gerenciamento de estado reativo
- **RxJS** - Programação reativa
- **ngx-toastr** - Notificações toast
- **ngx-mask** - Máscaras de entrada

### Arquitetura

- **Standalone Components** - Componentes independentes
- **Lazy Loading** - Carregamento sob demanda
- **Guards** - Proteção de rotas
- **Interceptors** - Interceptação HTTP automática
- **Services** - Camada de negócio organizada
- **Reactive Forms** - Formulários reativos robustos

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── navbar/         # Barra de navegação
│   │   └── admin-sidebar/  # Sidebar administrativa
│   ├── pages/              # Páginas da aplicação
│   │   ├── home/           # Página inicial
│   │   ├── login/          # Autenticação
│   │   ├── registro/       # Cadastro de usuários
│   │   ├── filme-detalhes/ # Detalhes do filme
│   │   ├── pagamento/      # Processamento de pagamento
│   │   └── admin/          # Páginas administrativas
│   │       ├── dashboard/  # Dashboard principal
│   │       ├── filmes/     # Gestão de filmes
│   │       ├── cinemas/    # Gestão de cinemas
│   │       ├── sessoes/    # Gestão de sessões
│   │       └── alimentos/  # Gestão de alimentos
│   ├── services/           # Serviços de negócio
│   ├── models/             # Interfaces TypeScript
│   ├── guards/             # Proteção de rotas
│   ├── interceptors/       # Interceptadores HTTP
│   └── layouts/            # Layouts da aplicação
├── environments/           # Configurações de ambiente
└── styles.scss            # Estilos globais
```

## 🎨 Design System

### Paleta de Cores

- **Primária**: `#1a1a2e` (Azul escuro elegante)
- **Secundária**: `#16213e` (Azul profundo)
- **Accent**: `#e94560` (Vermelho vibrante)
- **Superfície**: `#f8f9fa` (Cinza claro)
- **Texto**: `#2d3748` (Cinza escuro)

### Componentes UI

- Cards com sombras suaves e bordas arredondadas
- Botões com transições elegantes
- Formulários com validação em tempo real
- Tabelas responsivas com ações contextuais
- Modais centrados com backdrop
- Loading states e spinners
- Notificações toast informativas

## 🚦 Rotas da Aplicação

### Públicas

- `/` → Redirecionamento para home
- `/home` → Página inicial
- `/login` → Autenticação
- `/registro` → Cadastro
- `/filme/:id` → Detalhes do filme

### Protegidas (Usuário Logado)

- `/pagamento` → Processo de compra

### Administrativas (Admin apenas)

- `/admin/dashboard` → Dashboard principal
- `/admin/filmes` → Gestão de filmes
- `/admin/cinemas` → Gestão de cinemas
- `/admin/sessoes` → Gestão de sessões
- `/admin/alimentos` → Gestão de alimentos

## 🔐 Segurança

### Autenticação JWT

- Tokens seguros armazenados em localStorage
- Interceptor automático para requisições
- Refresh token para sessões persistentes
- Logout automático em caso de token expirado

### Proteção de Rotas

- **AuthGuard**: Verifica se usuário está autenticado
- **AdminGuard**: Verifica se usuário tem permissões administrativas
- Redirecionamento automático para login quando necessário

### Validação de Dados

- Formulários reativos com validação client-side
- Máscaras de entrada para formatação
- Sanitização de dados antes do envio
- Feedback visual de erros e sucessos

## 📱 Responsividade

### Breakpoints

- **Mobile**: < 480px
- **Tablet**: 481px - 768px
- **Desktop**: > 768px

### Adaptações

- Layout fluido que se adapta a qualquer tela
- Sidebar colapsável em dispositivos móveis
- Tabelas responsivas com scroll horizontal
- Formulários que se reorganizam em telas menores
- Imagens otimizadas para diferentes densidades

## 🎯 Funcionalidades Avançadas

### Gerenciamento de Estado

- Angular Signals para reatividade moderna
- Estado local em componentes
- Compartilhamento de dados entre componentes
- Cache inteligente de requisições

### Experiência do Usuário

- Loading states em todas as operações
- Feedback visual imediato
- Navegação intuitiva e consistente
- Animações suaves e naturais
- Acessibilidade com ARIA labels

### Performance

- Lazy loading de módulos
- Otimização de bundles
- Compressão de assets
- Tree shaking automático
- Service Workers (PWA ready)

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Angular CLI 19+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/cinema-frontend.git

# Entre no diretório
cd cinema-frontend

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Compile para produção
npm run build
```

### Configuração de Ambiente

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:8080/api",
  authApiUrl: "http://localhost:8081/api",
};
```

## 🧪 Testes

### Configuração de Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run e2e

# Coverage
npm run test:coverage
```

### Estrutura de Testes

- Testes unitários para todos os componentes
- Testes de integração para serviços
- Testes e2e para fluxos principais
- Mocks para APIs externas

## 📦 Build e Deploy

### Build de Produção

```bash
npm run build:prod
```

### Deploy

O projeto é otimizado para deploy em:

- **Vercel** (recomendado)
- **Netlify**
- **Firebase Hosting**
- **AWS S3 + CloudFront**
- **GitHub Pages**

## 🤝 Contribuição

### Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript estrito
- Siga as convenções do Angular
- Mantenha componentes pequenos e focados
- Escreva testes para novas funcionalidades
- Use commits semânticos

## 📈 Roadmap

### Próximas Funcionalidades

- [ ] PWA completo com offline support
- [ ] Sistema de reviews e avaliações
- [ ] Chat de suporte integrado
- [ ] Integração com redes sociais
- [ ] Sistema de fidelidade
- [ ] Relatórios avançados com gráficos
- [ ] Integração com APIs de pagamento reais
- [ ] Push notifications
- [ ] Modo escuro/claro
- [ ] Múltiplos idiomas (i18n)

### Melhorias Técnicas

- [ ] Testes automatizados completos
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento de performance
- [ ] Análise de bundle size
- [ ] SEO otimizado
- [ ] Accessibility audit
- [ ] Security audit
- [ ] Performance budget

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

Desenvolvido com ❤️ por [Seu Nome]

- **GitHub**: [@seu-usuario](https://github.com/seu-usuario)
- **LinkedIn**: [Seu LinkedIn](https://linkedin.com/in/seu-perfil)
- **Email**: seu-email@exemplo.com

## 🙏 Agradecimentos

- Angular Team pela excelente framework
- Material Design pela inspiração visual
- Comunidade open source pelas bibliotecas utilizadas

---

**CinemaMax** - Transformando a experiência cinematográfica através da tecnologia! 🎬✨
