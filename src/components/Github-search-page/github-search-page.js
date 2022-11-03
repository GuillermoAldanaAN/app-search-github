import React, { useState } from "react";
import { Container, Grid, Button, TextField, Typography, Box } from '@mui/material'
const GithubSearchPage = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchApplied, setIsSearchApplied] = useState(false);
    const handleClick = async () => {
        setIsSearching(true);
        await Promise.resolve();
        setIsSearchApplied(true);
        setIsSearching(false);
    }
    const renderContent = () => {
        return isSearchApplied ?
            (
            <table>
                <thead>
                    <tr>
                        <th>Repository</th>
                        <th>stars</th>
                        <th>forks</th>
                        <th>open issues</th>
                        <th>updated at</th>
                    </tr>
                </thead>
            </table>
            ) :
            (
            <Box display='flex' alignItems={'center'} justifyContent='center' height={'400px'}>
                <Typography variant="h6" color="initial">
                    Please provide a search option and click in the search button
                </Typography>
            </Box>
            )

    }
    return (
        <Container>
            <Typography variant="h4" component={'h2'}>Github repositories list</Typography>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item md={6} xs={12}>
                    <TextField
                        fullWidth
                        variant="standard"
                        id="filterBy"
                        label="Filter by"
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <Button variant="contained" color='primary' fullWidth disabled={isSearching} onClick={handleClick}>
                        Search
                    </Button>
                </Grid>
            </Grid>
            {renderContent()}
        </Container>
    );
}

export default GithubSearchPage;