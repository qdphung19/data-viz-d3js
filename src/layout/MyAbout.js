import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export default function MyContainer() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Box disableGutters sx={{ backgroundColor: '#4b4957', height: '100vh' }}>
                <Box sx={{ padding: '20px 40px' }}>
                    <Typography variant="body1" sx={{ color: '#c69b7b' }}>
                        C'est mon portfolio:
                    </Typography>
                    <a
                        href="https://qdphung19.github.io/portfolio/"
                        target="_blank"
                        rel="noreferrer"
                        className="link-react"
                    >
                        https://qdphung19.github.io/portfolio/
                    </a>
                </Box>
            </Box>
        </React.Fragment>
    );
}
