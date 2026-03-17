import { Button, NewArrivals } from '@/components';
import { useProducts } from '@/hooks/useProducts';

import reactLogo from '../../assets/react.svg';
import { useCreateUser, useGetUsers } from '../../hooks';
import type { User } from '../../types';

import './Home.css';

import viteLogo from '/vite.svg';

const NEW_ARRIVALS_LIMIT = 10;

export const Home = () => {
  const { data: users } = useGetUsers();
  const createUser = useCreateUser();

  const {
    data: products,
    isLoading,
    isError,
  } = useProducts(1, NEW_ARRIVALS_LIMIT);

  const handleCreateUser = () => {
    createUser.mutate({
      name: 'John Doe',
      email: `john.doe.${Date.now()}@example.com`,
    });
  };

  return (
    <div className="home">
      <NewArrivals
        products={products?.items ?? []}
        isLoading={isLoading}
        isError={isError}
      />

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p className="subtitle">
        Data fetching with @tanstack/react-query, but no real API connected (for
        code demonstration purposes)
      </p>

      <div className="actions">
        <Button onClick={handleCreateUser} disabled={createUser.isPending}>
          {createUser.isPending ? 'Creating...' : 'Create User'}
        </Button>
      </div>

      {createUser.isError && (
        <div className="error">
          Error creating user: {createUser.error.message}
        </div>
      )}

      <div className="users-list">
        <h2>Users ({users?.length || 0})</h2>
        {users && users.length > 0 ? (
          <ul>
            {users.map((user: User) => (
              <li key={user.id} className="user-item">
                <div className="user-info">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};
