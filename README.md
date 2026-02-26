# React + TypeScript Project

**_NOTE:_** this file structure is just example of production ready code, you can change it as you want

A modern React application built with TypeScript, Vite, Tailwind CSS, and TanStack Query (React Query).

## 🚀 Tech Stack

- ⚛️ **React 18** + TypeScript
- ⚡ **Vite** - Next Generation Frontend Tooling
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔄 **TanStack Query** (React Query) - Powerful data synchronization
- 🐻 **Zustand** - Lightweight state management
- 📦 **pnpm** - Fast, disk space efficient package manager

## 📁 Project Structure

```
src/
├── assets/              # Static assets (images, icons, fonts)
│   ├── images/          # Image files
│   └── icons/           # Icon files
├── components/          # Reusable UI components
│   ├── Button/
│   │   └── Button.tsx
│   └── index.ts         # Component exports
├── constants/           # Application constants and configuration
│   └── index.ts         # Route paths, API URLs, etc.
├── contexts/            # React Context providers for global state
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.ts  # Local storage hook
│   ├── useUsers.ts         # React Query hooks for users
│   └── index.ts
├── lib/                 # Library configurations
│   ├── queryClient.ts      # React Query client setup
│   └── index.ts
├── pages/               # Page-level components
│   ├── Home/
│   │   ├── Home.tsx
│   │   └── Home.css
│   └── index.ts
├── services/            # API calls and external services
│   ├── api.ts              # Base API client
│   ├── userService.ts      # User API endpoints
│   └── index.ts
├── styles/              # Global styles and theme
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── date.utils.ts
│   └── index.ts
├── App.tsx              # Main App component
├── main.tsx             # Application entry point
└── index.css            # Global CSS with Tailwind directives
```

## 🏗️ Architecture Patterns

### Component Organization

Each component has its own folder with related files:

```
components/
└── Button/
    ├── Button.tsx
    ├── Button.test.tsx  (optional)
    └── Button.module.css (optional)
```

### Hooks Pattern

Custom hooks follow React Query patterns:

- **Query keys** - Hierarchical organization for cache management
- **Hooks** - Reusable data fetching and mutation logic
- **Services** - API call implementations

### Services Layer

Services handle API communication:

```typescript
// services/userService.ts
export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data;
  },
};
```

## 🔄 React Query Setup

### Configuration

The QueryClient is configured in [src/lib/queryClient.ts](src/lib/queryClient.ts):

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Usage Pattern

**1. Define service functions:**

```typescript
export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data;
  },
};
```

**2. Create query hooks:**

```typescript
export function useGetUsers() {
  return useQuery({
    queryKey: ['query-key'],
    queryFn: userService.getUsers,
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: userService.createUser,
  });
}
```

**3. Use in components:**

```typescript
export const MyComponent = () => {
  const { data: users, isLoading, isError } = useGetUsers();
  const createUser = useCreateUser();

  // Component logic...
};
```

## 🎨 Tailwind CSS

Tailwind is configured and ready to use. Example usage:

```tsx
<div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Hello Tailwind!
  </h1>
</div>
```

### Button Component Example

The Button component demonstrates Tailwind utility classes:

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
```

## 🛠️ Development

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
pnpm run dev
```

### Build for production

```bash
pnpm run build
```

### Type checking

```bash
pnpm exec tsc --noEmit
```

## 📂 Folder Conventions

### Components (`/components`)

- Reusable UI components
- Each component in its own folder
- Use named exports with barrel exports

### Pages (`/pages`)

- Page-level components for routes
- Compose smaller components
- Handle page-specific logic

### Hooks (`/hooks`)

- Custom React hooks
- Prefix with `use`
- Include React Query hooks

### Services (`/services`)

- API integration
- Centralized API configuration
- Organized by domain

### Types (`/types`)

- Shared TypeScript types and interfaces
- Organized by domain

### Utils (`/utils`)

- Pure utility functions
- No React dependencies

### Constants (`/constants`)

- Application-wide constants
- Configuration values
- Route paths and API endpoints

## 📦 Key Dependencies

- `react` & `react-dom` - UI library
- `@tanstack/react-query` - Data fetching and caching
- `@tanstack/react-query-devtools` - DevTools for debugging queries
- `zustand` - State management
- `tailwindcss` - Utility-first CSS
- `typescript` - Type safety
- `vite` - Build tool

## 🎯 Best Practices

1. **Component Organization** - Keep related files together
2. **Index Exports** - Use barrel exports for clean imports
3. **Type Safety** - Define types for all props and API responses
4. **Naming** - PascalCase for components, camelCase for functions/variables
5. **Tailwind Classes** - Use utility classes, avoid inline styles
6. **React Query**:
   - Define query keys hierarchically
   - Invalidate queries after mutations
   - Use `enabled` option for dependent queries

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vite.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
