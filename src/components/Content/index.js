import React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const tableHeaders = ['Repository', 'Stars', 'Forks', 'Open issues', 'Updated at'];
const Content = ({ isSearchApplied }) => {
    return (
        isSearchApplied ?
            (<React.Fragment>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {tableHeaders.map((name, index) => (
                                    <TableCell key={index}>
                                        {name}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Avatar alt='test' src="/logo192.png" />
                                    <Link href="http://localhost:3000/test" underline="none">
                                        Test
                                    </Link>
                                </TableCell>
                                <TableCell>10</TableCell>
                                <TableCell>5</TableCell>
                                <TableCell>2</TableCell>
                                <TableCell>2022-01-01</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={1}
                    rowsPerPage={10}
                    page={0}
                    onPageChange={() => { }}
                    onRowsPerPageChange={() => { }}
                />
            </React.Fragment>
            ) :
            (
                <Box display='flex' alignItems={'center'} justifyContent='center' height={'400px'}>
                    <Typography variant="h6" color="initial">
                        Please provide a search option and click in the search button
                    </Typography>
                </Box>
            )
    );
}

export default Content;

Content.protTypes = {
    isSearchApplied: PropTypes.bool.isRequired,
}