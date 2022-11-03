import React from "react";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

const GithubSearchPage = () => {
    return ( 
        <React.Fragment>
            <Typography variant="h4" component={'h2'}>Github repositories list</Typography>
            <TextField
              id="filterBy"
              label="Filter by"
            />
        </React.Fragment>
     );
}
 
export default GithubSearchPage;