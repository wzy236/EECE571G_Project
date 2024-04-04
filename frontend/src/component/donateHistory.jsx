import React, {useState} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { ethers} from 'ethers';

const columns = [
    {
        id: 'time',
        label: 'Donation Date',
        minWidth: 170,
        align: 'center',
        format: (value) => value.slice(0,19)+ 'Z', //YYYY-MM-DDTHH:mm:ss, 'Z' represents time zone: UTC 
      },
  {
    id: 'fundTitle',
    label: 'Fundraising Title',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toString(),
  },
  {
    id: 'transAmount',
    label: 'Donation Amount (in ETH)',
    minWidth: 170,
    align: 'center',
    format: (value) => parseFloat(ethers.utils.formatEther(value)),
  },
];


export default function DonationHistory( props ) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const rows=props.data

  //sort rows ordered by donation time, descending order, latest first
  const sortedRows = [...rows].sort((a, b) => new Date(b.time) - new Date(a.time));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 1080 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15, 20 ,25]}
        component="div"
        count={sortedRows.length}
        rowsPerPage={rowsPerPage} //set the default value for number of rows in page
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}