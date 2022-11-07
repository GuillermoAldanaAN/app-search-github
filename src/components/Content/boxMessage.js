import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const BoxMessage = ({ message }) =>
(
    <Box display='flex' alignItems={'center'} justifyContent='center' height={'400px'}>
        <Typography variant="h6" color="initial">
            {message}
        </Typography >
    </Box >
);

export default BoxMessage;

BoxMessage.propTypes = {
    message: PropTypes.string.isRequired,
}

