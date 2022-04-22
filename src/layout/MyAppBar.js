import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import Drawer from './Drawer';

function HomeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}

const pages = [
    {
        name: 'HOME',
        path: '/',
    },
    {
        name: 'About',
        path: '/about',
    },
];

const MyAppBar = () => {
    const theme = useTheme();
    // console.log(theme);
    const isMatch = useMediaQuery(theme.breakpoints.down('md'));
    // console.log(isMatch);
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar elevation={0} position="static" sx={{ bgcolor: '#3a3845', borderBottom: '1px solid #282730' }}>
            <Grid container>
                <Grid item xs={false} sm={1} md={1} lg={1} xl={1} />
                <Grid item xs={12} sm={10} md={10} lg={10} xl={10}>
                    <Toolbar disableGutters>
                        {isMatch ? (
                            <>
                                <Drawer />
                            </>
                        ) : (
                            <>
                                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                    {pages.map((page) => (
                                        <Link to={page.path} className="link-react" key={page.name}>
                                            <Button
                                                onClick={handleCloseNavMenu}
                                                sx={{ my: 2, color: '#c69b7b', display: 'block' }}
                                                // href={page.path}
                                            >
                                                {page.name}
                                            </Button>
                                        </Link>
                                    ))}
                                </Box>
                            </>
                        )}
                        <Box sx={{ flexGrow: 1, justifyContent: 'flex-end', display: { xs: 'flex', md: 'flex' } }}>
                            <a href="https://qdphung19.github.io/portfolio/" target="_blank" rel="noreferrer">
                                <Tooltip title="Quoc Duong PHUNG">
                                    <IconButton>
                                        <Avatar alt="Quoc Duong PHUNG" src={process.env.PUBLIC_URL + '/logo512.png'} />
                                    </IconButton>
                                </Tooltip>
                            </a>
                        </Box>
                    </Toolbar>
                </Grid>
                <Grid item xs={false} sm={1} md={1} lg={1} xl={1} />
            </Grid>
        </AppBar>
    );
};
export default MyAppBar;
