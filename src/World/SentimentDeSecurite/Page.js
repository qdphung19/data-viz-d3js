import React, { useEffect, useState } from 'react';
import Test from './Test';
import * as d3 from 'd3';
// database
import database from '../WorldDatabase.json';

const dataSelected = database[0];

function Page() {
    const [map, setMap] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        var promises = [];
        promises.push(d3.json(process.env.PUBLIC_URL + dataSelected.pathGeojson));
        promises.push(d3.json(process.env.PUBLIC_URL + dataSelected.pathData));

        Promise.all(promises).then((d) => {
            setMap(d[0]);
            setData(d[1]);
            setLoading(false);
        });
        return () => undefined;
    }, []);

    // console.log(map);
    // console.log(data);
    return (
        <div className="App">
            {loading && <div>loading</div>}
            {!loading && (
                <Test
                    data={data}
                    map={map}
                    title={dataSelected.title}
                    source={dataSelected.source}
                    link={dataSelected.link}
                />
            )}
        </div>
    );
}

export default Page;
