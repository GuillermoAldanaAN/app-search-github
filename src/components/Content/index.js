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
import BoxMessage from './boxMessage';

const tableHeaders = ['Repository', 'Stars', 'Forks', 'Open issues', 'Updated at'];
const Content = ({ isSearchApplied, repositoriesList }) => {
    if (isSearchApplied && !!repositoriesList.length) {
        return (
            <React.Fragment>
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
                            {repositoriesList.map((item, index) =>
                                <TableRow key={index}>
                                    <TableCell>
                                        <Avatar alt={item.name} src={item.owner.avatar_url} />
                                        <Link href={item.html_ur} underline="none">
                                            {item.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{item.stargazers_count}</TableCell>
                                    <TableCell>{item.forks_count}</TableCell>
                                    <TableCell>{item.open_issues_count}</TableCell>
                                    <TableCell>{item.updated_at}</TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[30, 50, 100]}
                    component="div"
                    count={1}
                    rowsPerPage={30}
                    page={0}
                    onPageChange={() => { }}
                    onRowsPerPageChange={() => { }}
                />
            </React.Fragment>
        )
    }
    if (isSearchApplied && !repositoriesList.length) {
        return (
             <BoxMessage message='You search has no results' />
        )
    }
    return (
        <BoxMessage message='Please provide a search option and click in the search button' />

    );
}

export default Content;

Content.propTypes = {
    isSearchApplied: PropTypes.bool.isRequired,
    repositoriesList: PropTypes.arrayOf(PropTypes.object.isRequired)
}