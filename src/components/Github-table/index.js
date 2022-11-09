import React from "react";
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
const tableHeaders = ['Repository', 'Stars', 'Forks', 'Open issues', 'Updated at'];

export const GithubTable = ({repositoriesList}) => (
    <TableContainer  sx={{ maxHeight: 440 }}>
    <Table stickyHeader >
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
)


GithubTable.propTypes = {
    repositoriesList: PropTypes.arrayOf(PropTypes.object.isRequired),
}