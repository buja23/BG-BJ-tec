# BG-BJ-tec

cd backend
npm install
npm install mongoose

cd frontend
npm install
npm install axios
npm install antd
npm run dev



npm install helmet compression express-rate-limit morgan

✓MVC

✓assets
➢Arquivos estáticos: imagens, fontes, CSS, entre outros
✓config
Arquivos de configurações globais, como banco de dados e autenticação
✓middlewares
➢Funções de middleware e suas configurações
✓routes
➢Definição de rotas da aplicação API (endpoints)
✓utils
➢Funções auxiliares utilizadas em diferentes áreas do sistema
✓.env
✓Variáveis de ambiente, arquivo não versionado


Estrutura de Arquivos Final

src/
├── App.js
├── index.js
├── pages/
│   ├── Home.jsx              # Layout principal com menu
│   ├── CaixaPage.jsx         # Controle de caixa
│   ├── MesasPage.jsx         # Gerenciamento de mesas
│   ├── DeliverysPage.jsx     # Pedidos de delivery
│   ├── ClientesPage.jsx      # Cadastro de clientes
│   ├── RankingPage.jsx       # Ranking de atendimentos
│   ├── EstoquePage.jsx       # Controle de estoque
│   ├── NegocioPage.jsx       # Configurações do negócio
│   ├── FinanceiroPage.jsx    # Relatórios financeiros
│   ├── DrePage.jsx           # Demonstração de resultados
│   └── Auth/
│       └── LoginPage.jsx     # Página de login
├── components/
│   ├── Layout/
│   │   ├── Header.jsx        # Cabeçalho do sistema
│   │   └── Sidebar.jsx       # Menu lateral
│   └── Shared/
│       ├── CustomCard.jsx    # Componente de card reutilizável
│       └── ...               # Outros componentes compartilhados
├── services/
│   ├── authService.js        # Autenticação
│   ├── caixaService.js       # Operações de caixa
│   ├── mesaService.js        # Operações com mesas
│   ├── produtoService.js     # Operações com produtos
│   └── ...                   # Outros serviços
├── utils/
│   ├── formatters.js         # Funções de formatação
│   └── constants.js          # Constantes do sistema
└── styles/
    ├── global.css            # Estilos globais
    └── theme.js              # Configuração de tema (se usar styled-components)