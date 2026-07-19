import React, { useState, useMemo } from "react";
import "./datatable.css";

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

interface Column {
  header: string;
  key: string;
  width?: string;
  sortable?: boolean;
  render?: (item: any, index: number) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  isLoading: boolean;
  rowsPerPage?: number;
  // Controlled/server-side pagination: when both are provided, `data` is
  // treated as already being the current page's rows (no local slicing or
  // sorting — sorting only the current page of a server-paginated list
  // would be misleading), and page changes are delegated to the caller.
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  isLoading,
  rowsPerPage = 5,
  page,
  totalPages: controlledTotalPages,
  onPageChange,
}) => {
  const isControlled = page !== undefined && onPageChange !== undefined;

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  const sortedData = useMemo(() => {
    if (isControlled) return data;

    const sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key!);
        const bValue = getNestedValue(b, sortConfig.key!);

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig, isControlled]);

  const activePage = isControlled ? page : currentPage;
  const totalPages = isControlled
    ? Math.max(1, controlledTotalPages ?? 1)
    : Math.ceil(sortedData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    if (isControlled) return sortedData;
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage, isControlled]);

  const goToPage = (next: number) => {
    if (isControlled) {
      onPageChange!(next);
    } else {
      setCurrentPage(next);
    }
  };

  const requestSort = (key: string) => {
    if (isControlled) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  return (
    <div className="custom-card">
      <div className="card-header">
        <span className="card-title">{title}</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="reusable-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && requestSort(col.key)}
                  className={col.sortable ? "th-sortable" : ""}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortConfig.key === col.key && (
                      <img
                        src={`icons/arrow-${sortConfig.direction === "asc" ? "up" : "down"}.svg`}
                        className="icon-img-color"
                        height={12}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={isLoading ? "row-loading" : ""}>
            {paginatedData.map((item, rowIndex) => (
              <tr key={item.id || rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} data-label={col.header}>
                    {col.render ? (
                      col.render(item, rowIndex)
                    ) : (
                      <span className="truncate">
                        {getNestedValue(item, col.key) || "-"}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && data.length > 0 && (
        <div className="pagination-container">
          <span className="pagination-info">
            Página {activePage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              className="btn-pagination"
              onClick={() => goToPage(Math.max(1, activePage - 1))}
              disabled={activePage === 1}
            >
              <img src="icons/back.svg" className="icon-img" width={16} />
            </button>
            <button
              className="btn-pagination"
              onClick={() => goToPage(Math.min(totalPages, activePage + 1))}
              disabled={activePage === totalPages}
            >
              <img src="icons/next.svg" className="icon-img" width={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
