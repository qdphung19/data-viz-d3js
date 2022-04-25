import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyAppBar from './layout/MyAppBar';
import MyContainer from './layout/MyContainer';
import MyAbout from './layout/MyAbout';
import { Grid } from '@mui/material';
// World
import SentimentDeSecurite from '../src/Components/World/SentimentDeSecurite/Page';
// import SentimentDeSecuriteTest from '../src/Components/World/Test/Page';
import Nobel2021 from '../src/Components/World/Nobel2021/Page';
import Fields2018 from '../src/Components/World/Fields2018/Page';
import PassengerCarsSales from '../src/Components/World/PassengerCarsSales/Page';
// France
import Population from '../src/Components/France/Population/Page';
import FootballClub from '../src/Components/France/FootballClub/Page';

function App() {
    return (
        <Grid container direction="column" sx={{ backgroundColor: '#3a3845' }}>
            <Grid item>
                <MyAppBar />
            </Grid>
            <Grid item container>
                <Grid item xs={false} sm={1} md={1} lg={1} xl={1} />

                <Grid item xs={12} sm={10} md={10} lg={10} xl={10}>
                    <Routes>
                        <Route path="/">
                            <Route index element={<MyContainer />} />
                            <Route path="/about" element={<MyAbout />} />
                            <Route path="/geo/SentimentDeSecurite" element={<SentimentDeSecurite />} />
                            <Route path="/geo/Nobel2021" element={<Nobel2021 />} />
                            <Route path="/geo/Fields2018" element={<Fields2018 />} />
                            <Route path="/geo/PassengerCarsSales" element={<PassengerCarsSales />} />
                            <Route path="/geoFrance/Population" element={<Population />} />
                            <Route path="/geoFrance/FootballClub" element={<FootballClub />} />
                        </Route>
                    </Routes>
                </Grid>
                <Grid item xs={false} sm={1} md={1} lg={1} xl={1} />
            </Grid>
        </Grid>
    );
}

export default App;
