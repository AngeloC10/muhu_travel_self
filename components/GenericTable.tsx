import React, { useState, useMemo } from 'react';
import { Icons } from './Icons';

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

export interface SearchOption<T> {
  label: string;
  value: keyof T;
}

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  title: string;
  onAdd?: () => void;
  searchOptions?: SearchOption<T>[];
  expandableContent?: (item: T) => React.ReactNode;
}

export function GenericTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  title,
  onAdd,
  searchOptions,
  expandableContent
}: GenericTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<keyof T | ''>(searchOptions?.[0]?.value || '');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  };

  // Filter logic
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchField) return data;

    return data.filter((item) => {
      const value = item[searchField];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchField]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-white to-gray-50">
        <h2 className="text-xl font-bold text-gray-800 flex items-center font-serif">
          {title}
          <span className="ml-3 text-xs font-sans bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
            {filteredData.length} / {data.length}
          </span>
        </h2>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Search Controls */}
          {searchOptions && searchOptions.length > 0 && (
            <div className="flex rounded-lg shadow-sm">
              <div className="relative flex-grow focus-within:z-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-l-md py-2 border outline-none"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="-ml-px relative inline-flex items-center px-3 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 rounded-r-md"
                value={searchField as string}
                onChange={(e) => setSearchField(e.target.value as keyof T)}
              >
                {searchOptions.map((opt) => (
                  <option key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {onAdd && (
            <button
              onClick={onAdd}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors shadow-md shadow-indigo-500/20 whitespace-nowrap justify-center"
            >
              <Icons.Add size={16} className="mr-2" /> Nuevo
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
              {expandableContent && <th className="px-6 py-4 w-10"></th>}
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4">{col.header}</th>
              ))}
              {(onEdit || onDelete) && <th className="px-6 py-4 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1 + (expandableContent ? 1 : 0)} className="px-6 py-10 text-center text-gray-400">
                  {data.length === 0 ? 'No hay registros disponibles.' : 'No se encontraron resultados para la búsqueda.'}
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className={`hover:bg-indigo-50/30 transition-colors group ${expandedIds.has(item.id) ? 'bg-indigo-50/50' : ''}`}>
                    {expandableContent && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          {expandedIds.has(item.id) ? <Icons.Prev className="-rotate-90" size={16} /> : <Icons.Next size={16} />}
                        </button>
                      </td>
                    )}
                    {columns.map((col, i) => (
                      <td key={i} className="px-6 py-4 text-sm text-gray-700">
                        {col.accessor(item)}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 text-right space-x-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                          <button onClick={() => onEdit(item)} className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-md transition-colors">
                            <Icons.Edit size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(item)} className="text-red-500 hover:bg-red-100 p-2 rounded-md transition-colors">
                            <Icons.Delete size={16} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                  {expandableContent && expandedIds.has(item.id) && (
                    <tr className="bg-gray-50/50 animate-fade-in">
                      <td colSpan={columns.length + 2 + (onEdit || onDelete ? 1 : 0)} className="px-6 py-4 border-b border-gray-100">
                        <div className="pl-8">
                          {expandableContent(item)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}