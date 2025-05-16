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
}

function Table<T extends { [key: string]: any }>({ columns, data, rowsPerPage = 10 }: TableProps<T>) {
  const [sortField, setSortField] = useState<keyof T>(columns[0].key);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Handle sort
  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort data
  const sortedData = [...data].sort((a, b) => {
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
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-slate-200">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={`px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer text-${col.align || 'left'}`}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center">
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
                    className={`px-6 py-4 whitespace-nowrap text-sm text-slate-800 text-${col.align || 'left'} number-mono`}
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
