import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

import { fetchEmployees } from '../api/api';
import {
  PageHeader,
  PageTitle,
  FilterCard,
  FilterToolbar,
  SearchField,
  DropdownField,
  StyledTableContainer,
  StyledTable,
  StyledSortLabel,
  ClickableRow,
  CodeCell,
  EmptyStateCell,
} from './Employees.styles';

const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'India', 'Canada'];
const DEPARTMENTS = ['Engineering', 'Product', 'Marketing', 'Sales', 'HR', 'Finance'];

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

const Employees: FC = () => {
  const navigate = useNavigate();

  // Filter and pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [country, setCountry] = useState('');
  const [sortBy, setSortBy] = useState('employeeCode');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  // Debounce search input by 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['employees', { page, pageSize, search, department, country, sortBy, sortOrder }],
    queryFn: () => fetchEmployees({ page, pageSize, search, department, country, sortBy, sortOrder }),
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  const handleRowClick = (id: string) => {
    navigate(`/employees/${id}`);
  };

  const columns = [
    { id: 'employeeCode', label: 'Code' },
    { id: 'firstName', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'department', label: 'Department' },
    { id: 'designation', label: 'Designation' },
    { id: 'country', label: 'Country' },
    { id: 'baseSalary', label: 'Base Salary' },
    { id: 'bonus', label: 'Bonus' },
  ];

  return (
    <Box>
      <PageHeader>
        <PageTitle variant="h3">
          Employee Directory
        </PageTitle>
        <Typography variant="body1" color="text.secondary">
          Manage, search, and audit employee records and compensation structures.
        </Typography>
      </PageHeader>

      {/* Filters Toolbar */}
      <FilterCard>
        <FilterToolbar>
          <SearchField
            size="small"
            placeholder="Search name, code, email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <DropdownField
            select
            size="small"
            label="Department"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">All Departments</MenuItem>
            {DEPARTMENTS.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </DropdownField>

          <DropdownField
            select
            size="small"
            label="Country"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">All Countries</MenuItem>
            {COUNTRIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </DropdownField>
        </FilterToolbar>
      </FilterCard>

      {/* Employees Table */}
      {isError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading employees: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      ) : (
        <StyledTableContainer component={Paper}>
          <StyledTable>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    <StyledSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? (sortOrder.toLowerCase() as 'asc' | 'desc') : 'asc'}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </StyledSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data && data.data.length > 0 ? (
                data.data.map((employee) => {
                  const currentSalary = employee.salaries?.[0];
                  return (
                    <ClickableRow
                      key={employee.id}
                      hover
                      onClick={() => handleRowClick(employee.id)}
                    >
                      <CodeCell>{employee.employeeCode}</CodeCell>
                      <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.designation}</TableCell>
                      <TableCell>{employee.country}</TableCell>
                      <TableCell>
                        {currentSalary
                          ? formatCurrency(currentSalary.baseSalary, employee.currency)
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {currentSalary
                          ? formatCurrency(currentSalary.bonus, employee.currency)
                          : 'N/A'}
                      </TableCell>
                    </ClickableRow>
                  );
                })
              ) : (
                <TableRow>
                  <EmptyStateCell colSpan={columns.length} align="center">
                    <Typography color="text.secondary">No employees found.</Typography>
                  </EmptyStateCell>
                </TableRow>
              )}
            </TableBody>
          </StyledTable>

          {data && (
            <TablePagination
              component="div"
              count={data.total}
              page={page - 1}
              onPageChange={(_, newPage) => setPage(newPage + 1)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(1);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          )}
        </StyledTableContainer>
      )}
    </Box>
  );
};

export default Employees;
