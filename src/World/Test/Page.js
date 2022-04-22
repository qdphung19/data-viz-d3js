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
        promises.push(
            fetch(
                'https://gist.githubusercontent.com/qdphung19/00899a8fa4ec2e3135e5bb67bb6162c8/raw/ccef5b2f8584d36f5fc92e0e375b57e29ca22119/world.json',
            ),
        );
        promises.push(
            fetch(
                'https://gist.githubusercontent.com/qdphung19/b073c23ff95fc76741ce1841676aa8b3/raw/a43f54805833acfa0fb16d18891024e9c9fcef89/SentimentDeSecurite.json',
            ),
        );

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
