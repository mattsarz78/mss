# MattSarzSports App - React Version

A React + TypeScript + Vite version of the MattSarzSports application. This is a clone of the Vue version (`mss-app`) but built with React and React Router instead of Vue and Vue Router.

## Features

- ⚡ Vite for fast development and building
- ⚛️ React 18 with TypeScript
- 🔄 Apollo Client for GraphQL
- 🛣️ React Router for navigation
- 📱 PWA support with service workers
- 🎨 Path aliases for cleaner imports

## Project Setup

### Install dependencies

```bash
pnpm install
```

### Development Server

```bash
pnpm dev
```

### Build for Production

```bash
pnpm build
```

### Type Check

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
pnpm lintFix
```

## Environment Variables

Create a `.env` file in the root directory:

```env
API_URL=http://localhost:8020/graphql
```

## Project Structure

```
src/
├── components/          # React components organized by feature
│   ├── conference/     # Conference games components
│   ├── noTVGames/      # No TV games components
│   ├── season/         # Season-related components
│   ├── shared/         # Shared/common components
│   ├── weekly/         # Weekly schedule components
│   └── weeklyText/     # Weekly text components
├── composables/        # Custom React hooks (similar to Vue composables)
├── router/            # React Router configuration
├── views/             # Page components
├── utils/             # Utility functions
├── staticData/        # Static data and constants
├── types/             # TypeScript type definitions
├── assets/            # Static assets
├── App.tsx            # Root App component
├── devtools.ts        # Development tools initialization
└── main.tsx           # Application entry point
```

## Key Differences from Vue Version

1. **Routing**: Uses React Router v6 instead of Vue Router
2. **State Management**: Uses React Context + Apollo Client instead of Vuex
3. **Component Definition**: Functional components with hooks instead of Vue SFCs
4. **Composables**: Custom React hooks instead of Vue composables
5. **GraphQL**: Apollo Client hooks instead of @vue/apollo-composable

## Development Tips

- Import utilities using path aliases (e.g., `#/utils`, `#/components/shared`)
- Create custom hooks in the `composables` folder for reusable logic
- Use React Router's hooks like `useNavigate`, `useParams`, `useLocation` for routing

## Notes

This is a work-in-progress conversion from Vue. Component implementations and styling still need to be completed by converting the Vue components to React components.
