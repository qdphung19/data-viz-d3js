import React from 'react';
import * as d3 from 'd3';
import { useD3 } from '../../hooks/useD3';
import { Box, Link, Typography } from '@mui/material';
// import styled from '@emotion/styled';

const width = 1200, // width of <svg></svg>
    height = 720, // height of <svg></svg>
    legendCellSize = 25,
    colors = [
        'rgb(142,1,82)',
        'rgb(197,27,125)',
        'rgb(222,119,174)',
        'rgb(241,182,218)',
        'rgb(253,224,239)',
        'rgb(230,245,208)',
        'rgb(184,225,134)',
        'rgb(127,188,65)',
        'rgb(77,146,33)',
        'rgb(39,100,25)',
    ];

function Chart({ data, map, title, source, link }) {
    const ref = useD3(
        (svg) => {
            svg.attr('id', 'svg')
                .attr('class', 'svg')
                .attr('width', width)
                .attr('height', height)
                .attr('background', 'red');

            const projection = d3.geoNaturalEarth1();

            projection.fitSize([width, height], map).precision(100);

            const path = d3.geoPath().pointRadius(2).projection(projection);

            // svg.append('text')
            //     .attr('x', width / 2)
            //     .attr('y', 25)
            //     .attr('text-anchor', 'middle')
            //     .style('fill', '#c1d3b8')
            //     .style('font-weight', '300')
            //     .style('font-size', '16px')
            //     .text('Sentiment de sécurité des habitants de chaque pays en 2018');

            // svg.append('text')
            //     .attr('x', width / 2)
            //     .attr('y', 50)
            //     .attr('text-anchor', 'middle')
            //     .style('fill', '#c1d3b8')
            //     .style('font-weight', '200')
            //     .style('font-size', '12px')
            //     .text('(source : Gallup Report 2018 - Global Law and Order)');

            const cGroup = svg.append('g');

            cGroup
                .selectAll('path')
                .data(map.features)
                .enter()
                .append('path')
                .on('mouseover', (event, d) => {
                    legend
                        .append('text')
                        .attr('class', 'label')
                        .attr('width', 50)
                        .attr('height', 30)
                        .attr('x', 5)
                        .attr('y', 70 + colors.length * legendCellSize)
                        .text(d.properties.name)
                        .style('font-size', '16px')
                        .style('font-weight', '900')
                        .attr('font-family', 'Roboto', 'Helvetica Neue', 'sans-serif');
                })
                .on('mouseout', () => svg.selectAll('.label').remove())
                // .transition()
                .attr('id', (d) => 'code' + d.id)
                .attr('class', 'country')
                .attr('fill', '#999')
                .attr('stroke', '#444343')
                .style('cursor', 'pointer')
                .style('stroke-linecap', 'round')
                .style('stroke-linejoin', 'round')
                .attr('d', path);
            // .attr('opacity', 0.9);

            const min = d3.min(data, (d) => +d.score),
                max = d3.max(data, (d) => +d.score);
            var quantile = d3.scaleQuantile().domain([min, max]).range(colors);

            var legend = addLegend(min, max);
            var tooltip = addTooltip();

            data.forEach(function (e, i) {
                var countryPath = d3.select('#code' + e.code);
                countryPath
                    .attr('scorecolor', quantile(+e.score))
                    .attr('fill', quantile(+e.score))
                    .on('mouseover', function (d) {
                        countryPath.style('fill', '#21209C');
                        tooltip.style('display', null);
                        tooltip.select('#tooltip-country').text(shortCountryName(e.frenchCountry));
                        tooltip.select('#tooltip-score').text(e.score);
                        legend
                            .select('#cursor')
                            .attr(
                                'transform',
                                'translate(' +
                                    (legendCellSize + 5) +
                                    ', ' +
                                    getColorIndex(quantile(+e.score)) * legendCellSize +
                                    ')',
                            )
                            .style('display', null);
                    })
                    .on('mouseout', function (event, d) {
                        countryPath.style('fill', quantile(+e.score));
                        tooltip.style('display', 'none');
                        legend.select('#cursor').style('display', 'none');
                    })
                    .on('mousemove', function (event, d) {
                        var mouse = d3.pointer(event);
                        tooltip.attr('transform', 'translate(' + (mouse[0] - 100) + ',' + (mouse[1] - 100) + ')');
                    });
            });

            function addLegend(min, max) {
                var legend = svg.append('g').attr('transform', 'translate(40, 300)');

                legend
                    .selectAll()
                    .data(d3.range(colors.length))
                    .enter()
                    .append('svg:rect')
                    .attr('height', legendCellSize + 'px')
                    .attr('width', legendCellSize + 'px')
                    .attr('x', 5)
                    .attr('y', (d) => d * legendCellSize)
                    .attr('class', 'legend-cell')
                    .style('fill', (d) => colors[d])
                    .on('mouseover', function (event, d) {
                        legend
                            .select('#cursor')
                            .attr('transform', 'translate(' + (legendCellSize + 5) + ', ' + d * legendCellSize + ')')
                            .style('display', null);
                        d3.selectAll("path[scorecolor='" + colors[d] + "']").style('fill', '#21209C');
                        // .style('opacity', 1);
                    })
                    .on('mouseout', function (event, d) {
                        legend.select('#cursor').style('display', 'none');
                        d3.selectAll("path[scorecolor='" + colors[d] + "']").style('fill', colors[d]);
                        // .style('opacity', 0.9);
                    });

                legend
                    .append('svg:rect')
                    .attr('y', legendCellSize + colors.length * legendCellSize)
                    .attr('height', legendCellSize + 'px')
                    .attr('width', legendCellSize + 'px')
                    .attr('x', 5)
                    .style('fill', '#999');

                legend
                    .append('text')
                    .attr('x', 35)
                    .attr('y', 45 + colors.length * legendCellSize)
                    .style('font-size', '16px')
                    .style('fill', 'black')
                    .text('Aucune information')
                    .attr('font-family', 'Roboto', 'Helvetica Neue', 'sans-serif');

                legend
                    .append('polyline')
                    .attr(
                        'points',
                        legendCellSize +
                            ',0 ' +
                            legendCellSize +
                            ',' +
                            legendCellSize +
                            ' ' +
                            legendCellSize * 0.2 +
                            ',' +
                            legendCellSize / 2,
                    )
                    .attr('id', 'cursor')
                    .style('display', 'none')
                    .style('fill', '#21209C');

                var legendScale = d3
                    .scaleLinear()
                    .domain([min, max])
                    .range([0, colors.length * legendCellSize]);

                legend.append('g').attr('class', 'axis').call(d3.axisLeft(legendScale));

                return legend;
            }

            function addTooltip() {
                var tooltip = svg
                    .append('g') // Group for the whole tooltip
                    .attr('id', 'tooltip')
                    .style('display', 'none');

                tooltip
                    .append('polyline') // The rectangle containing the text, it is 210px width and 60 height
                    .attr('points', '0,0 210,0 210,60 0,60 0,0')
                    .style('fill', '#2B222A')
                    .style('stroke', '#333')
                    .style('opacity', '0.9')
                    .style('stroke-width', '1')
                    .style('padding', '1em');

                tooltip
                    .append('line') // A line inserted between country name and score
                    .attr('x1', 40)
                    .attr('y1', 25)
                    .attr('x2', 160)
                    .attr('y2', 25)
                    .style('stroke', '#999')
                    .style('stroke-width', '0.5')
                    .attr('transform', 'translate(0, 5)');

                var text = tooltip
                    .append('text') // Text that will contain all tspan (used for multilines)
                    .style('font-size', '16px')
                    .style('fill', '#c69b7b')
                    .attr('transform', 'translate(0, 20)')
                    .attr('font-family', 'Roboto', 'Helvetica Neue', 'sans-serif');

                text.append('tspan') // Country name udpated by its id
                    .attr('x', 105) // ie, tooltip width / 2
                    .attr('y', 0)
                    .attr('id', 'tooltip-country')
                    .attr('text-anchor', 'middle')
                    .style('font-weight', '600')
                    .style('font-size', '16px');

                text.append('tspan') // Fixed text
                    .attr('x', 105) // ie, tooltip width / 2
                    .attr('y', 30)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#999')
                    .text('Score : ');

                text.append('tspan') // Score udpated by its id
                    .attr('id', 'tooltip-score')
                    .style('fill', '#c69b7b')
                    .style('font-weight', 'bold');

                return tooltip;
            }

            function shortCountryName(country) {
                return country.replace('Démocratique', 'Dem.').replace('République', 'Rep.');
            }

            function getColorIndex(color) {
                for (var i = 0; i < colors.length; i++) {
                    if (colors[i] === color) {
                        return i;
                    }
                }
                return -1;
            }

            addSvgLegend1();
            function addSvgLegend1() {
                const width = 200,
                    height = 400;

                const svgLegend1 = d3
                    .select('#svgLegend1')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'svg');

                svgLegend1.append('circle').attr('cx', 40).attr('cy', 50).attr('r', 3).style('fill', 'red');
            }

            addSvgLegend2();
            function addSvgLegend2() {
                const width = 200,
                    height = 400;

                const svgLegend2 = d3
                    .select('#svgLegend2')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'svg');

                svgLegend2.append('circle').attr('cx', 40).attr('cy', 50).attr('r', 3).style('fill', 'red');

                var legend = svgLegend2.append('g').attr('transform', 'translate(40, 200)');

                legend
                    .selectAll()
                    .data(d3.range(colors.length))
                    .enter()
                    .append('svg:rect')
                    .attr('y', (d) => d * legendCellSize)
                    .attr('height', legendCellSize + 'px')
                    .attr('width', legendCellSize + 'px')
                    .attr('x', 5)
                    .style('fill', (d) => colors[d]);
            }

            addSvgLegend3();
            function addSvgLegend3() {
                const width = 200,
                    height = 400;

                const svgLegend3 = d3
                    .select('#svgLegend3')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'svg');

                svgLegend3.append('circle').attr('cx', 40).attr('cy', 50).attr('r', 3).style('fill', 'red');

                var legend = svgLegend3.append('g').attr('transform', 'translate(40, 0)');

                legend
                    .selectAll()
                    .data(d3.range(colors.length))
                    .enter()
                    .append('svg:rect')
                    .attr('y', (d) => d * legendCellSize)
                    .attr('height', legendCellSize + 'px')
                    .attr('width', legendCellSize + 'px')
                    .attr('x', 5)
                    .style('fill', (d) => colors[d]);

                var legendScale = d3
                    .scaleLinear()
                    .domain([44, 97])
                    .range([0, colors.length * legendCellSize]);

                legend.append('g').attr('class', 'axis').call(d3.axisLeft(legendScale));
            }
        },
        [data.length],
    );
    return (
        <Box sx={{ padding: '20px 40px', bgcolor: '#4b4957' }}>
            <Box mb={'28px'}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 600 }} sx={{ color: '#c69b7b' }}>
                    {title}
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ color: '#c69b7b' }}>
                    Le sentiment de sécurité personnelle est un élément essentiel du bien-être des individus. Il prend
                    en compte le risque d’être victime d’une agression physique ou d’autres crimes ou délits. La
                    criminalité peut entraîner des pertes de vies humaines et de biens, mais également des souffrances
                    physiques, un stress post-traumatique et des états d’anxiété. Il semble que le sentiment de
                    vulnérabilité que suscite un crime ou délit soit l’un des impacts majeurs que celui-ci exerce sur le
                    bien-être des personnes.
                </Typography>
            </Box>
            <Box
                mb={'28px'}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <svg
                    ref={ref}
                    className="svg-container"
                    viewBox={`0 0 ${width} ${height}`}
                    style={{
                        width: '100%',
                        height: '100%',
                        marginRight: '0px',
                        marginLeft: '0px',
                        background: '#f7f3f3',
                    }}
                >
                    {/* <g className="plot-area" />
                            <g className="x-axis" />
                            <g className="y-axis" /> */}
                </svg>
            </Box>
            <Box>
                <Typography variant="body2" sx={{ color: '#c69b7b' }} align="right">
                    <i>
                        Source:{' '}
                        <Link color="#c69b7b" href={link} underline="hover" target="_blank" rel="noopener">
                            {source}
                        </Link>{' '}
                    </i>
                </Typography>
            </Box>
        </Box>
    );
}

export default Chart;
