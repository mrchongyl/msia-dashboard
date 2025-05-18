import React, { useState } from 'react';
import DataTable, { TableColumn as RDCColumn } from 'react-data-table-component';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  align?: 'left' | 'right';
  formatter?: (value: any, row: T) => string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowsPerPage?: number;
  title?: string;
}

function Table<T extends { [key: string]: any }>({ columns, data, rowsPerPage = 10, title }: TableProps<T>) {
  const [search, setSearch] = useState('');

  // Filter data by search
  const filteredData = search
    ? data.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value !== undefined && value !== null && String(value).toLowerCase().includes(search.toLowerCase());
        })
      )
    : data;

  const rdcColumns: RDCColumn<T>[] = columns.map(col => ({
    name: col.label,
    selector: row => row[col.key],
    sortable: true,
    right: col.align === 'right',
    cell: col.formatter
      ? row => col.formatter!(row[col.key], row)
      : row => row[col.key],
    style: col.align === 'right' ? { justifyContent: 'flex-end', textAlign: 'right' } : {},
    wrap: false,
  }));

  return (
    <div>
      <div className="flex flex-row-reverse items-center justify-between px-4 pt-4 pb-2 mb-2 bg-slate-50 rounded-t-lg border-b border-slate-200">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ml-2"
          style={{ minWidth: 220, marginBottom: 0 }}
        />
        {title && <h3 className="text-lg font-semibold text-slate-800 mr-auto">{title}</h3>}
      </div>
      <DataTable
        columns={rdcColumns}
        data={filteredData}
        pagination
        paginationPerPage={rowsPerPage}
        highlightOnHover
        striped
        responsive
        persistTableHead
        noHeader
        customStyles={{
          table: { style: { minWidth: '100%' } },
          headRow: { style: { backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' } },
          headCells: { style: { fontWeight: 700, color: '#1e293b', fontSize: 13, textTransform: 'uppercase', background: 'white' } },
          rows: { style: { backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', fontSize: 14 } },
          cells: { style: { padding: '1rem 1.5rem', fontFamily: 'inherit' } },
          pagination: { style: { background: 'white', borderTop: '1px solid #e2e8f0', padding: '1rem 1.5rem' } },
        }}
      />
    </div>
  );
}

export default Table;
