import React from 'react';
import * as d3 from 'd3';
import { useD3 } from '../../../hooks/useD3';
import { geoMercator } from 'd3';
import { geoPath } from 'd3';
import { Box, Link, Typography } from '@mui/material';
// import styled from '@emotion/styled';

const width = 1200, // width of <svg></svg>
    height = 720, // height of <svg></svg>
    colors = [
        'rgb(255,245,235)',
        'rgb(254,230,206)',
        'rgb(253,208,162)',
        'rgb(253,174,107)',
        'rgb(253,141,60)',
        'rgb(241,105,19)',
        'rgb(217,72,1)',
        'rgb(166,54,3)',
        'rgb(127,39,4)',
    ];

function Chart({ data, map, title, source, link }) {
    data = data.map((e) => {
        return { ...e, country: [e.country].toString().replace(' ', '') };
    });

    const ref = useD3(
        (svg) => {
            svg.attr('id', 'svg').attr('class', 'svg').attr('width', width).attr('height', height);
            // .attr('background', 'red');

            const projection = geoMercator();
            projection.fitSize([width, height], map).precision(100);

            const path = geoPath().projection(projection);

            const cGroup = svg.append('g');

            cGroup
                .selectAll('path')
                .data(map.features)
                .enter()
                .append('path')
                .on('mouseover', (event, feature) => {
                    svg.append('text')
                        .attr('class', 'label')
                        .attr('width', 50)
                        .attr('height', 30)
                        .attr('x', 10)
                        .attr('y', 400)
                        .text(feature.properties.name)
                        .style('font-size', '16px')
                        .style('font-weight', '900')
                        .attr('font-family', 'Roboto', 'Helvetica Neue', 'sans-serif');
                })
                .on('mouseout', () => d3.selectAll('.label').remove())
                .attr('id', (d) => 'code' + [d.properties.name].map((e) => e.replace(' ', '')))
                .attr('class', 'country')
                // .transition() // !!! no transition here, when not no color
                // .attr('stroke', 'black')
                .attr('fill', '#ccc')
                .attr('stroke', '#444343')
                .style('cursor', 'pointer')
                .style('stroke-linecap', 'round')
                .style('stroke-linejoin', 'round')
                .attr('d', (feature) => path(feature));

            var quantile = d3
                .scaleQuantile()
                .domain([
                    Math.sqrt(d3.min(data, (e) => +e.information)),
                    Math.sqrt(d3.max(data, (e) => +e.information)),
                ])
                .range(colors);

            var legendScale = d3
                .scaleSqrt()
                .domain([d3.min(data, (e) => +e.information), d3.max(data, (e) => +e.information)])
                .range([0, 9 * 25]);

            // Legend scale bar
            svg.append('g').attr('transform', 'translate(50, 450)').call(d3.axisRight(legendScale).ticks(10));

            // Legend color bar
            var legend = svg.append('g').attr('transform', 'translate(-180, 450)').attr('id', 'legend');

            legend
                .selectAll('.colorbar')
                .data(d3.range(9))
                .enter()
                .append('svg:rect')
                .attr('y', (d) => d * 25 + 'px')
                .attr('height', '25px')
                .attr('width', '25px')
                .attr('x', '200px')
                .attr('class', (d) => 'q' + d + '-9')
                .attr('fill', (d) => colors[d]);

            // div tooltip
            // var div = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);
            var tooltip = addTooltip();

            data.forEach(function (e, i) {
                d3.select('#code' + e.country)
                    // .attr('fill', quantile(+e.information))  // scaleLinear
                    .attr('fill', quantile(Math.sqrt(+e.information))) // scaleSqrt
                    .on('mouseover', function (event, d) {
                        // console.log(d);
                        d3.select(this).attr('opacity', 0.8).attr('stroke-width', 3);
                        tooltip.style('display', null);
                        tooltip.select('#tooltip-country').text(d.properties.name);
                        tooltip.select('#tooltip-score').text(e.information);
                    })
                    .on('mouseout', function (event, d) {
                        d3.select(this).attr('opacity', 1).attr('stroke-width', 1);
                        tooltip.style('display', 'none');
                    })
                    .on('mousemove', function (event, d) {
                        var mouse = d3.pointer(event);
                        tooltip.attr('transform', 'translate(' + (mouse[0] - 100) + ',' + (mouse[1] - 100) + ')');
                    });
            });

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
                    .text('Nombre de prix : ');

                text.append('tspan') // Score udpated by its id
                    .attr('id', 'tooltip-score')
                    .style('fill', '#c69b7b')
                    .style('font-weight', 'bold');

                return tooltip;
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
                    Le prix Nobel (en suédois : Nobelpriset) est une récompense de portée internationale. Remis pour la
                    première fois en 1901, les prix sont décernés chaque année à des personnes « ayant apporté le plus
                    grand bénéfice à l'humanité », par leurs inventions, découvertes et améliorations dans différents
                    domaines de la connaissance, par l'œuvre littéraire la plus impressionnante, ou par leur travail en
                    faveur de la paix, suivant ainsi les derniers vœux d'Alfred Nobel, inventeur de la dynamite.
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
