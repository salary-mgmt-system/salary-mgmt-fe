import styled from 'styled-components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import theme from '../theme/theme';

export const PageHeader = styled(Box)`
  margin-bottom: 32px;
`;

export const PageTitle = styled(Typography)`
  && {
    margin-bottom: 8px;
    color: ${theme.palette.text.primary};
    font-weight: 800;
  }
`;

export const FilterCard = styled(Card)`
  && {
    margin-bottom: 24px;
    padding: 16px;
  }
`;

export const FilterToolbar = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

export const SearchField = styled(TextField)`
  && {
    flex-grow: 1;
    min-width: 250px;
  }
`;

export const DropdownField = styled(TextField)`
  && {
    min-width: 160px;
  }
`;

export const StyledTableContainer = styled(TableContainer)<{ component?: React.ElementType }>`
  && {
    box-shadow: none;
    border: 1px solid ${theme.palette.divider};
    border-radius: 8px;
  }
`;

export const StyledTable = styled(Table)`
  && {
    min-width: 800px;
  }
`;

export const StyledSortLabel = styled(TableSortLabel)`
  && {
    font-weight: 600;
  }
`;

export const ClickableRow = styled(TableRow)`
  && {
    cursor: pointer;
    &:last-child td, &:last-child th {
      border: 0;
    }
  }
`;

export const CodeCell = styled(TableCell)`
  && {
    font-weight: 500;
  }
`;

export const EmptyStateCell = styled(TableCell)`
  && {
    padding-top: 48px;
    padding-bottom: 48px;
  }
`;
