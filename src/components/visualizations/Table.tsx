import React, { useState } from 'react';

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
  const [sortField, setSortField] = useState<keyof T>(columns[0].key);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  // Handle sort
  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter data by search
  const filteredData = search
    ? data.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value !== undefined && value !== null && String(value).toLowerCase().includes(search.toLowerCase());
        })
      )
    : data;

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return sortDirection === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

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
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-slate-200">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={`px-6 py-3 text-xs font-bold text-slate-800 uppercase tracking-wider cursor-pointer text-${col.align || 'left'} ${col.align === 'right' ? 'text-right' : ''}`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className={`flex items-center ${col.align === 'right' ? 'justify-end' : ''}`}>
                    {col.label}
                    {sortField === col.key ? (
                      sortDirection === 'asc' ? ' ▲' : ' ▼'
                    ) : (
                      <span className="ml-1 text-slate-400">⇅</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                {columns.map(col => (
                  <td
                    key={String(col.key)}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-slate-800 number-mono ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    {col.formatter ? col.formatter(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="btn text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Table;
