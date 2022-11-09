
import PropTypes from 'prop-types';
import React from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false }
    }
    static getDerivedStateFromError() {

        return { hasError: true };
    }
    handleReloadClick = () => window.location.reload();

    render() {
        const { children } = this.props;
        const { hasError } = this.state;
        if (hasError) {
            return (
                <React.Fragment>
                    <Grid container >
                        <Grid item xs={12}>
                        <Box>
                            <Typography variant={'h5'} component={'h3'}>There is an unexpected error</Typography>
                            <Button variant={'contained'} type='button' onClick={this.handleReloadClick}>Reload</Button>
                        </Box>
                        </Grid>
                    </Grid>
                    
                </React.Fragment>

            )
        }
        return children;
    }

}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired
}
export default ErrorBoundary
