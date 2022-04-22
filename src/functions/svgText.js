function svgText(svg, x, y, color, text, fontWeight, fontSize) {
    svg.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .style('fill', color)
        .style('font-weight', fontWeight)
        .style('font-size', fontSize)
        .text(text);
}

export default svgText;
