import React from 'react';
import * as d3 from 'd3';
import { useD3 } from '../../../hooks/useD3';
import wrap from '../../../functions/wrap';
import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Link,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';

const width = 1200, // width of <svg></svg>
    height = 720, // height of <svg></svg>
    textColor = '#c69b7b';
function Chart({ data, map, title, source, link }) {
    var color = d3.scaleOrdinal().domain(['A', 'B']).range(['#D18975', '#8FD175']);

    const handleCheckbox = (event, isChecked) => {
        // console.log(event);
        // console.log(isChecked);
        // console.log('value - ', event.target.value);

        // For each check box:
        d3.selectAll('.checkbox').each(function (d) {
            let grp = event.target.value;

            // If the box is check, I show the group
            if (isChecked) {
                d3.selectAll('.' + grp)
                    .transition()
                    .duration(1000)
                    .style('opacity', 1);

                // Otherwise I hide it
            } else {
                d3.selectAll('.' + grp)
                    .transition()
                    .duration(1000)
                    .style('opacity', 0);
            }
        });
    };

    const handleRadio = (event) => {
        // For each check box:
        d3.selectAll('.radio').each(function (d) {
            d3.selectAll('#legend').remove();
            // console.log(d3.select(this));
            let title = event.target.value;
            let numberOfTitre = data.features.map((e) => e.properties[`${title}`]);
            let min = Math.min(...numberOfTitre);
            let max = Math.max(...numberOfTitre);
            let size = d3.scaleLinear().domain([min, max]).range([5, 50]);

            // If the box is check, I show the group
            if (title === 'none') {
                d3.selectAll('.club')
                    .transition()
                    .duration(1000)
                    // .style('opacity', 1)
                    .attr('r', 15);
            } else {
                addLegend(min, max, size);
                d3.selectAll('.club')
                    .transition()
                    .duration(1000)
                    // .style('opacity', 1)
                    .attr('r', function (d) {
                        return size(+d.properties[`${title}`]);
                    });
                d3.selectAll('.radio').on('change', () => {
                    d3.selectAll('#legend').style('display', null);
                });
            }
        });
    };

    function addLegend(min, max, size) {
        let valuesToShow = [min, Math.ceil(max / 2), max];
        let xCircle = 150;
        let xLabel = 300;
        let yCircle = 500;

        var legend = d3
            .select('#svg')
            .append('g') // Group for the whole tooltip
            .attr('id', 'legend');
        // .style('display', 'none');

        legend
            .selectAll('.circle-legend')
            .data(valuesToShow)
            .enter()
            .append('circle')
            .attr('class', 'circle-legend')
            .attr('cx', xCircle)
            .attr('cy', function (d) {
                return yCircle - size(d);
            })
            .attr('r', function (d) {
                return size(d);
            })
            .style('fill', 'none')
            .attr('stroke', 'black');

        legend
            .selectAll('g#legend')
            .data(valuesToShow)
            .enter()
            .append('line')
            .attr('x1', function (d) {
                return xCircle + size(d);
            })
            .attr('x2', xLabel)
            .attr('y1', function (d) {
                return yCircle - size(d);
            })
            .attr('y2', function (d) {
                return yCircle - size(d);
            })
            .attr('stroke', 'black')
            .style('stroke-dasharray', '2,2');

        // Add legend: labels
        legend
            .selectAll('g#legend')
            .data(valuesToShow)
            .enter()
            .append('text')
            .attr('x', xLabel)
            .attr('y', function (d) {
                return yCircle - size(d);
            })
            .text(function (d) {
                return d;
            })
            .style('font-size', 14)
            .attr('alignment-baseline', 'middle');

        return legend;
    }

    const ref = useD3(
        (svg) => {
            svg.attr('id', 'svg').attr('class', 'svg').attr('width', width).attr('height', height);

            const projection = d3
                .geoConicConformal() // Lambert-93
                .center([2.454071, 46.279229]) // Center on France
                .scale(3000);
            // .translate([width / 2 - 100, height / 2]); // ???

            projection
                .fitExtent(
                    [
                        [0, 90],
                        [width, height - 90],
                    ],
                    map,
                )
                .precision(100);

            const path = d3
                .geoPath()
                // .pointRadius([2])
                .projection(projection);

            const deps = svg.append('g');

            deps.selectAll('path')
                .data(map.features)
                .enter()
                .append('path')
                .attr('id', (d) => 'code' + d.properties.CODE_DEPT)
                .attr('class', 'country')
                .attr('fill', '#FFF')
                .attr('stroke', '#444343')
                .style('cursor', 'pointer')
                .style('stroke-linecap', 'round')
                .style('stroke-linejoin', 'round')
                .attr('d', path);
            // .attr('opacity', 0.9);

            // Add circles:
            svg.selectAll('myCircles')
                .data(data.features)
                .join('circle')
                .attr('class', (d) => d.properties.league + ' club')
                .attr('cx', (d) => projection(d.geometry.coordinates)[0])
                .attr('cy', (d) => projection(d.geometry.coordinates)[1])
                // .attr('r', (d) => size(+d.properties.capacity))
                .attr('r', 15)
                .style('fill', (d) => color(d.properties.league))
                .attr('stroke', (d) => color(d.properties.league))
                .attr('stroke-width', 3)
                .attr('fill-opacity', 0.4)
                .on('mouseover', function (d) {
                    d3.select(this).attr('opacity', 0.5);
                    tooltip.style('display', null);
                    // legend.style('display', null);
                })
                .on('mouseout', function (event, d) {
                    // countryPath.style('fill', quantile(+e.POP));
                    tooltip.style('display', 'none');
                    // legend.style('display', 'none');
                    d3.select(this).attr('opacity', 1);
                    // legend.select('#cursor').style('display', 'none');
                })
                .on('mousemove', function (event, d) {
                    // console.log(d.properties.league);
                    var mouse = d3.pointer(event);
                    tooltip.select('#tooltip-country').text(d.properties.name);
                    tooltip.select('#tooltip-ligue1').text(d.properties.championnatdefrance);
                    tooltip.select('#tooltip-cdf').text(d.properties.coupdefrance);
                    tooltip.select('#tooltip-places').text(d.properties.capacity.toLocaleString());
                    tooltip
                        .select('#tooltip-stade')
                        .text('(' + d.properties.ground + ')')
                        .call(wrap, 250, 80); // wrap the text in <= 250 pixels;
                    tooltip.attr('transform', 'translate(' + (mouse[0] + 25) + ',' + (mouse[1] - 25) + ')');
                });

            var tooltip = addTooltip();

            function addTooltip() {
                var tooltip = svg
                    .append('g') // Group for the whole tooltip
                    .attr('id', 'tooltip')
                    .style('display', 'none');
                // .style('position', 'absolute')
                // .style('visibility', 'hidden')
                // .style('z-index', '10');

                let w = 250;

                tooltip
                    .append('polyline') // The rectangle containing the text, it is 210px width and 60 height
                    .attr('points', `0,0 ${w},0 ${w},180 0,180 0,0`)
                    .style('fill', '#2B222A')
                    .style('stroke', '#333')
                    .style('opacity', '0.9')
                    .style('stroke-width', '1')
                    .style('padding', '1em');

                tooltip
                    .append('line') // A line inserted between country name and score
                    .attr('x1', 40)
                    .attr('y1', 30)
                    .attr('x2', w - 40)
                    .attr('y2', 30)
                    .style('stroke', '#999')
                    .style('stroke-width', '0.5')
                    .attr('transform', 'translate(0, 5)');

                var text = tooltip
                    .append('text') // Text that will contain all tspan (used for multilines)
                    .style('font-size', '16px')
                    .style('fill', textColor)
                    .attr('transform', 'translate(0, 20)')
                    .attr('font-family', 'Roboto', 'Helvetica Neue', 'sans-serif');

                text.append('tspan') // Country name udpated by its id
                    .attr('x', w / 2) // ie, tooltip width / 2
                    .attr('y', 5)
                    .attr('id', 'tooltip-country')
                    .attr('text-anchor', 'middle')
                    .style('font-weight', '600')
                    .style('font-size', '16px');

                text.append('tspan') // Fixed text
                    .attr('x', w / 2) // ie, tooltip width / 2
                    .attr('y', 40)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#999')
                    .text('Titres de Ligue 1 : ');

                text.append('tspan') // Score udpated by its id
                    .attr('id', 'tooltip-ligue1')
                    .style('fill', textColor)
                    .style('font-weight', 'bold');

                text.append('tspan') // Fixed text
                    .attr('x', w / 2) // ie, tooltip width / 2
                    .attr('y', 70)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#999')
                    .text('Titres Coup de France : ');

                text.append('tspan') // Score udpated by its id
                    .attr('id', 'tooltip-cdf')
                    .style('fill', textColor)
                    .style('font-weight', 'bold');

                text.append('tspan') // Fixed text
                    .attr('x', w / 2) // ie, tooltip width / 2
                    .attr('y', 130)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#999')
                    .text(' ');

                text.append('tspan') // Score udpated by its id
                    .attr('id', 'tooltip-stade')
                    .style('fill', textColor)
                    .style('font-weight', 'bold');

                text.append('tspan') // Fixed text
                    .attr('x', w / 2) // ie, tooltip width / 2
                    .attr('y', 100)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#999')
                    .text('Places de stade : ');

                text.append('tspan') // Score udpated by its id
                    .attr('id', 'tooltip-places')
                    .style('fill', textColor)
                    .style('font-weight', 'bold');

                return tooltip;
            }
        },
        [data.length],
    );

    return (
        <Box sx={{ padding: '20px 40px', bgcolor: '#4b4957' }}>
            <Box mb={'28px'}>
                <Typography variant="h5" gutterBottom style={{ fontWeight: 600 }} sx={{ color: textColor }}>
                    {title}
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ color: textColor }}></Typography>
            </Box>
            <Box
                mb={'28px'}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <FormGroup row>
                        <FormControlLabel
                            onChange={handleCheckbox}
                            value="Ligue1"
                            className="checkbox"
                            control={<Checkbox defaultChecked />}
                            label="Ligue 1"
                            sx={{ color: textColor }}
                        />
                        <FormControlLabel
                            onChange={handleCheckbox}
                            value="Ligue2"
                            className="checkbox"
                            control={<Checkbox defaultChecked />}
                            label="Ligue 2"
                            sx={{ color: textColor }}
                        />
                    </FormGroup>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <FormControl>
                        {/* <FormLabel sx={{ color: textColor }} id="demo-row-radio-buttons-group-label">
                            Titres
                        </FormLabel> */}
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            defaultValue="none"
                        >
                            <FormControlLabel
                                value="none"
                                onChange={handleRadio}
                                className="radio"
                                control={<Radio />}
                                label="Default"
                                sx={{ color: textColor }}
                            />
                            <FormControlLabel
                                value="championnatdefrance"
                                onChange={handleRadio}
                                className="radio"
                                control={<Radio />}
                                label="Championnat de France de football"
                                sx={{ color: textColor }}
                            />
                            <FormControlLabel
                                value="coupdefrance"
                                onChange={handleRadio}
                                className="radio"
                                control={<Radio />}
                                label="Coupe de France"
                                sx={{ color: textColor }}
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>
                <svg
                    ref={ref}
                    className="svg-container"
                    viewBox={`0 0 ${width} ${height}`}
                    style={{
                        width: '100%',
                        height: '100%',
                        marginRight: '0px',
                        marginLeft: '0px',
                        background: '#FDEBF7',
                    }}
                >
                    {/* <g className="plot-area" />
                            <g className="x-axis" />
                            <g className="y-axis" /> */}
                </svg>
            </Box>
            <Box>
                <Typography variant="body2" sx={{ color: textColor }} align="right">
                    <i>
                        Source:{' '}
                        <Link color={textColor} href={link} underline="hover" target="_blank" rel="noopener">
                            {source}
                        </Link>{' '}
                    </i>
                </Typography>
            </Box>
        </Box>
    );
}

export default Chart;
