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
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  isLoading,
  rowsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });

  const sortedData = useMemo(() => {
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
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const requestSort = (key: string) => {
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
                  <td key={colIndex}>
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
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              className="btn-pagination"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <img src="icons/back.svg" className="icon-img" width={16} />
            </button>
            <button
              className="btn-pagination"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
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
