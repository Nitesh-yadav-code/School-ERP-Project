import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  styled,
} from "@mui/material";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  UnfoldMore,
} from "@mui/icons-material";

// Helper function to get nested object values
const getNestedValue = (obj, accessor) => {
  if (typeof accessor !== "string") return obj[accessor];
  return accessor.split(".").reduce((current, prop) => {
    return current?.[prop];
  }, obj);
};

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e5e7eb",
  overflow: "hidden",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "15px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    padding: "14px 16px",
    borderBottom: "none",
    whiteSpace: "nowrap",
    "&:first-of-type": {
      borderTopLeftRadius: "12px",
    },
    "&:last-of-type": {
      borderTopRightRadius: "12px",
    },
  },
}));

const StyledTableBody = styled(TableBody)(({ theme }) => ({
  "& .MuiTableRow-root": {
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#f8fafc",
    },
    "&:last-child .MuiTableCell-body": {
      borderBottom: "none",
    },
  },
  "& .MuiTableCell-body": {
    padding: "16px",
    fontSize: "15px",
    color: "#374151",
    borderBottom: "1px solid #f1f5f9",
    fontWeight: 600,
  },
}));

const SortableHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  cursor: "pointer",
  userSelect: "none",
  "&:hover": {
    opacity: 0.85,
  },
}));

const SortIcon = styled(Box)(({ active }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: "4px",
  "& svg": {
    fontSize: "14px",
    opacity: active ? 1 : 0.5,
  },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  borderTop: "1px solid #f1f5f9",
  backgroundColor: "#fafbfc",
  "& .MuiTablePagination-toolbar": {
    padding: "12px 16px",
    minHeight: "52px",
  },
  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: 500,
  },
  "& .MuiTablePagination-select": {
    fontSize: "13px",
    color: "#374151",
    fontWeight: 500,
    borderRadius: "6px",
    padding: "6px 8px",
    backgroundColor: "#ffffff",
  },
  "& .MuiTablePagination-actions": {
    marginLeft: "16px",
    "& .MuiIconButton-root": {
      padding: "8px",
      borderRadius: "8px",
      backgroundColor: "#f3f4f6",
      marginLeft: "8px",
      color: "#4f46e5",
      "&:hover": {
        backgroundColor: "#e5e7eb",
      },
      "&.Mui-disabled": {
        backgroundColor: "#f9fafb",
        color: "#d1d5db",
      },
    },
  },
}));

const EmptyStateBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "48px 24px",
  color: "#9ca3af",
}));

const CommonTable = ({
  columns = [],
  data = [],
  actions,
  pageSizeOptions = [5, 10, 25, 50],
  defaultPageSize = 10,
  stickyHeader = false,
  maxHeight = null,
  emptyMessage = "No data available",
  headerColor = "#4f46e5", // Customizable header color
}) => {
  const [sortConfig, setSortConfig] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);

  /* ---------- Sorting ---------- */
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const { key, direction } = sortConfig;

    return [...data].sort((a, b) => {
      const aVal = getNestedValue(a, key);
      const bVal = getNestedValue(b, key);

      // Handle null/undefined
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return direction === "asc" ? 1 : -1;
      if (bVal == null) return direction === "asc" ? -1 : 1;

      // Handle strings
      if (typeof aVal === "string" && typeof bVal === "string") {
        return direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // Handle numbers
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (accessor) => {
    setSortConfig((prev) => {
      if (prev?.key === accessor && prev.direction === "asc") {
        return { key: accessor, direction: "desc" };
      }
      if (prev?.key === accessor && prev.direction === "desc") {
        return null; // Reset sort
      }
      return { key: accessor, direction: "asc" };
    });
  };

  /* ---------- Pagination ---------- */
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderSortIcon = (accessor) => {
    if (sortConfig?.key !== accessor) {
      return (
        <SortIcon active={false}>
          <UnfoldMore sx={{ fontSize: "16px !important" }} />
        </SortIcon>
      );
    }
    return (
      <SortIcon active={true}>
        {sortConfig.direction === "asc" ? (
          <KeyboardArrowUp />
        ) : (
          <KeyboardArrowDown />
        )}
      </SortIcon>
    );
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: "12px", overflow: "hidden" }}>
      <StyledTableContainer
        sx={{
          maxHeight: maxHeight,
        }}
      >
        <Table stickyHeader={stickyHeader} size="medium">
          <StyledTableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.accessor}
                  sx={{
                    backgroundColor: `${headerColor} !important`,
                    width: col.width || "auto",
                    minWidth: col.minWidth || "auto",
                  }}
                >
                  {col.sortable ? (
                    <SortableHeader onClick={() => handleSort(col.accessor)}>
                      {col.header}
                      {renderSortIcon(col.accessor)}
                    </SortableHeader>
                  ) : (
                    col.header
                  )}
                </TableCell>
              ))}
              {actions && (
                <TableCell
                  sx={{
                    backgroundColor: `${headerColor} !important`,
                    width: "120px",
                    textAlign: "center",
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </StyledTableHead>

          <StyledTableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  sx={{ padding: 0, borderBottom: "none" }}
                >
                  <EmptyStateBox>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 500, color: "#6b7280" }}
                    >
                      {emptyMessage}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#9ca3af", mt: 0.5 }}
                    >
                      Try adjusting your search or filters
                    </Typography>
                  </EmptyStateBox>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={row.id || rowIndex}>
                  {columns.map((col) => (
                    <TableCell key={col.accessor}>
                      {col.render
                        ? col.render(getNestedValue(row, col.accessor), row)
                        : getNestedValue(row, col.accessor) ?? "-"}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell sx={{ textAlign: "center" }}>
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </StyledTableBody>
        </Table>
      </StyledTableContainer>

      {/* Pagination */}
      {data.length > 0 && (
        <StyledTablePagination
          component="div"
          count={sortedData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={pageSizeOptions}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} of ${count}`
          }
        />
      )}
    </Paper>
  );
};

export default CommonTable;