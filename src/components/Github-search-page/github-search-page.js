import React, { useEffect, useState, useCallback, useRef } from "react";
import { Container, Grid, Button, TextField, Typography, Box } from '@mui/material';
import Content from "../Content";
import { getAllRepositories } from "../../services/repositoriesServices";
import { GithubTable } from "../Github-table";

import Snackbar from '@mui/material/Snackbar';
import TablePagination from '@mui/material/TablePagination';

const ROW_PER_PAGE_DEFAULT = 30;
const CURRENT_PAGE = 0;
const TOTAL_COUNT = 0;
const GithubSearchPage = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchApplied, setIsSearchApplied] = useState(false);
    const [repositoriesList, setRepositoriesList] = useState([]);
    const [currentPage, setCurrentPage] = useState(CURRENT_PAGE);
    const [rowsPerPage, setRowsPerPage] = useState(ROW_PER_PAGE_DEFAULT);
    const [totalCounts, setTotalCounts] = useState(TOTAL_COUNT);
    const [isOpen, setIsOpen] = useState(false);
    const didMount = useRef(false)
    const searchByInput = useRef(null)

    const handleSearch = useCallback(
        async () => {
            try {
                setIsSearching(true);
                const response = await getAllRepositories(
                    {
                        q: searchByInput.current.value,
                        rowsPerPage,
                        currentPage
                    });
                if(!response.ok){
                    throw response
                }
                const dataResponse = await response.json();
                setRepositoriesList(dataResponse.items);
                setTotalCounts(dataResponse.total_count);
                setIsSearchApplied(true);
                
            } catch (error) {
                setIsOpen(true);

            }finally{
                setIsSearching(false);
            }

        }, [rowsPerPage, currentPage])


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
    };
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true
            return
        }

        handleSearch()
    }, [handleSearch])


    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" component={'h2'}>Github repositories list</Typography>

            </Box>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item md={6} xs={12}>
                    <TextField
                        fullWidth
                        variant="standard"
                        id="filterBy"
                        label="Filter by"
                        inputRef={searchByInput}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <Button variant="contained" color='primary' fullWidth disabled={isSearching} onClick={handleSearch}>
                        Search
                    </Button>
                </Grid>
            </Grid>
            <Box my={2}>
                <Content
                    isSearchApplied={isSearchApplied}
                    repositoriesList={repositoriesList}>
                    <GithubTable repositoriesList={repositoriesList} />
                    <TablePagination
                        rowsPerPageOptions={[30, 50, 100]}
                        component="div"
                        count={totalCounts}
                        rowsPerPage={rowsPerPage}
                        page={currentPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Content>
            </Box>
            <Snackbar
                open={isOpen}
                autoHideDuration={6000}
                onClose={() => setIsOpen(false)}
                message="Validation failed"
            />
        </Container>
    );
}

export default GithubSearchPage;