import { describe, expect, it, vi } from 'vitest';

import type { Column } from '@/types';
import { render, screen } from '@/utils/test-utils';

import { MainTable } from './MainTable';

const columns: Column[] = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
];

type Row = { id: string; name: string; status: string };

const items: Row[] = [
  { id: '1', name: 'Alpha', status: 'ok' },
  { id: '2', name: 'Beta', status: 'pending' },
];

describe('UI Component: MainTable', () => {
  it('should render the table and column headers', () => {
    render(
      <MainTable<Row>
        columns={columns}
        items={[]}
        renderRow={() => null}
        loading={false}
      />,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Name' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Status' }),
    ).toBeInTheDocument();
  });

  it('should display "Loading..." when loading is true', () => {
    render(
      <MainTable<Row>
        columns={columns}
        items={[]}
        renderRow={() => null}
        loading
      />,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should set colspan on the loading cell from columns length by default', () => {
    const { container } = render(
      <MainTable<Row>
        columns={columns}
        items={[]}
        renderRow={() => null}
        loading
      />,
    );

    const loadingCell = container.querySelector('td[colspan="2"]');
    expect(loadingCell).toBeInTheDocument();
  });

  it('should show the default empty message when there are no items', () => {
    render(
      <MainTable<Row>
        columns={columns}
        items={[]}
        renderRow={() => null}
        loading={false}
      />,
    );

    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('should render error state with alert role and fallback copy', () => {
    render(
      <MainTable<Row>
        columns={columns}
        items={items}
        renderRow={() => null}
        loading={false}
        error={new Error('Network')}
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  });

  it('should prefer loading over error and empty data', () => {
    render(
      <MainTable<Row>
        columns={columns}
        items={[]}
        renderRow={() => null}
        loading
        error={new Error('fail')}
      />,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should call renderRow for each item', () => {
    const renderRow = vi.fn((item: Row) => (
      <>
        <td>{item.name}</td>
        <td>{item.status}</td>
      </>
    ));

    render(
      <MainTable<Row>
        columns={columns}
        items={items}
        loading={false}
        renderRow={renderRow}
      />,
    );

    expect(renderRow).toHaveBeenCalledTimes(2);
    expect(renderRow).toHaveBeenCalledWith(items[0]);
    expect(renderRow).toHaveBeenCalledWith(items[1]);
  });
});
