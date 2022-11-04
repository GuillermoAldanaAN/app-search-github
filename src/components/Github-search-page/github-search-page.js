import React, { useState } from "react";
import { Container, Grid, Button, TextField, Typography, Box } from '@mui/material';
import Content from "../Content";

const GithubSearchPage = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchApplied, setIsSearchApplied] = useState(false);
    const handleClick = async () => {
        setIsSearching(true);
        await Promise.resolve();
        setIsSearchApplied(true);
        setIsSearching(false);
    }

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
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <Button variant="contained" color='primary' fullWidth disabled={isSearching} onClick={handleClick}>
                        Search
                    </Button>
                </Grid>
            </Grid>
            <Box my={2}>
                <Content isSearchApplied={isSearchApplied} />
            </Box>

        </Container>
    );
}

export default GithubSearchPage;