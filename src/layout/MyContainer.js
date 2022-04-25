import * as React from 'react';
import { Link } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { List, ListItem } from '@mui/material';
import TerrainIcon from '@mui/icons-material/Terrain';
import WorldDatabase from '../Components/World/WorldDatabase.json';
import FranceDatabase from '../Components/France/FranceDatabase.json';

export default function MyContainer() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Box disableGutters sx={{ backgroundColor: '#4b4957', height: '100vh' }}>
                <Box sx={{ padding: '20px 40px' }}>
                    <List>
                        {WorldDatabase.map((e) => (
                            <ListItem disablePadding key={e.id}>
                                <Box marginRight={2}>
                                    <TerrainIcon color="primary" />
                                </Box>
                                <Link to={`${e.path}`} className="link-react">
                                    {e.title}
                                </Link>
                            </ListItem>
                        ))}
                        {FranceDatabase.map((e) => (
                            <ListItem disablePadding key={e.id}>
                                <Box marginRight={2}>
                                    <TerrainIcon color="primary" />
                                </Box>
                                <Link to={`${e.path}`} className="link-react">
                                    {e.title}
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </React.Fragment>
    );
}
