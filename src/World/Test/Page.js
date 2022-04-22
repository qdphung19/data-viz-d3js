import React, { useEffect, useState } from 'react';
import Test from './Test.js';
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
        promises.push(fetch(dataSelected.pathGeojson));
        promises.push(fetch(dataSelected.pathData));

        Promise.all(promises)
            .then(async ([mapjson, datajson]) => {
                const a = await mapjson.json();
                const b = await datajson.json();
                setMap(a);
                setData(b);
                setLoading(false);
                // return [a, b];
            })
            // .then((responseText) => {
            //     console.log(responseText);
            // })
            .catch((err) => {
                console.log(err);
            });
        // Promise.all(promises).then((d) => {
        //     console.log(d);
        //     setMap(d[0]);
        //     setData(d[1]);
        //     setLoading(false);
        // });

        return () => undefined;
    }, []);

    console.log(map);
    console.log(data);
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
            {/* <Test data={data} map={map} title="Test" source="Test" link="Test" /> */}
        </div>
    );
}

export default Page;
