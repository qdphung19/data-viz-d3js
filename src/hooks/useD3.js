import React from 'react';
import * as d3 from 'd3';

export const useD3 = (renderChartFn, dependencies) => {
    const ref = React.useRef();

    React.useEffect(() => {
        renderChartFn(d3.select(ref.current));
        return () => {};
    }, dependencies);
    return ref;
};

/* 
renderChartFn is a callback that contains your D3.js code to be executed
dependencies is a fixed-length array to tell React when to run the renderChartFn. This is useful for preventing unnecessary re-rendering and updating the chart correctly when new data arrives.
*/
