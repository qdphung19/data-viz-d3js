import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyAppBar from './layout/MyAppBar';
import MyContainer from './layout/MyContainer';
import MyAbout from './layout/MyAbout';
import { Grid } from '@mui/material';
// World
import SentimentDeSecurite from './World/SentimentDeSecurite/Page';
import Nobel2021 from './World/Nobel2021/Page';
import Fields2018 from './World/Fields2018/Page';
import PassengerCarsSales from './World/PassengerCarsSales/Page';
// France
import Population from './France/Population/Page';
import FootballClub from './France/FootballClub/Page';

function App() {
    return (
        <Grid container direction="column" sx={{ backgroundColor: '#3a3845' }}>
            {/* <div className="App"> */}
            <Grid item>
                <MyAppBar />
            </Grid>
            <Grid item container>
                <Grid item xs={false} sm={1} md={1} lg={1} xl={1} />

                <Grid item xs={12} sm={10} md={10} lg={10} xl={10}>
                    <SentimentDeSecurite />
                    <Routes>
                        <Route path="/" element={<MyContainer />} />
                        <Route path="/about" element={<MyAbout />} />
                        <Route path="/geo/SentimentDeSecurite" element={<SentimentDeSecurite />} />
                        <Route path="/geo/Nobel2021" element={<Nobel2021 />} />
                        <Route path="/geo/Fields2018" element={<Fields2018 />} />
                        <Route path="/geo/PassengerCarsSales" element={<PassengerCarsSales />} />
                        <Route path="/geoFrance/Population" element={<Population />} />
                        <Route path="/geoFrance/FootballClub" element={<FootballClub />} />
                    </Routes>
                </Grid>
                <Grid item xs={false} sm={1} md={1} lg={1} xl={1} />

                {/* <Grid item xs={false} sm={2} md={2} lg={2} xl={2} /> */}
            </Grid>
            {/* </div> */}
        </Grid>
    );
}

export default App;
