import React from 'react';
import { Group } from '@vx/group';
import { Bar, BarStackHorizontal } from '@vx/shape';
import { ParentSize } from "@vx/responsive";
import { LegendOrdinal } from "@vx/legend";
import { scaleLinear, scaleBand, scaleOrdinal } from '@vx/scale';
import { AxisLeft, AxisTop } from '@vx/axis';
import { max, extent } from 'd3-array';
import { format } from 'd3-format';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { localPoint } from "@vx/event";

const margin = {
  top: 150,
  bottom: 50,
  left: 225,
  right: 25
};

const y = d => d.occupation;
const color = d => d.category;

const xFormat = format(',.0f');
const yFormat = format('$,.0f');
const perFormat = format('.0%');

const getColor = (val) => {
  switch(val){
    case 'Low-Wage, Female Dominated':
      return '#7CA3E4';
    case 'Low-Wage, Male Dominated':
      return '#C28949';
    case 'Middle to High-Wage, Female Dominated':
      return '#22C8A3';
    case 'High Wage, Male Dominated':
      return '#FF6677';
    default:
      return '#333';
  }
}

let tooltipTimeout;

export default withTooltip(props => {
  const { width, height, data, tooltipData, title, x } = props;


  return (
    <ParentSize>
      {({ width }) => {
        const xMax = width - margin.left - margin.right;
        const xMaxDomain = max(data,x);
        const yMaxRange = height - margin.top - margin.bottom;
        const yMaxDomain = max(data, y);
        const keys = ['number_women', 'number_men'];
        if (width < 10) return null;

        const xScale = scaleLinear({
          domain: [0,xMaxDomain],
          rangeRound: [0, xMax],
          clamp: true
        });

        const yScale = scaleBand({
          rangeRound: [yMaxRange, 0],
          domain: data.map(y),
          padding: 0.2
        });

        const zScale = scaleOrdinal({
          domain: keys,
          range: ['#2EBCB3', '#4378A0']
        })

        return (
        <React.Fragment>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={`rgba(51,51,51,0)`}
        />
        <g transform={`translate(25,35)`}>
          <text><tspan fontSize="16px" fontWeight="bold">Figure X&nbsp;&nbsp;|&nbsp;&nbsp;</tspan><tspan>{title}</tspan></text>
        </g>

        <g transform={`translate(${margin.left}, ${margin.top})`}>
        <AxisLeft scale={yScale} stroke={'rgba(0,0,0,0.15)'} hideTicks={true} hideAxisLine={true} tickLabelProps={()=> ({ fontFamily: 'Circular', fontSize: '12px', width: margin.left, textAnchor: 'end', fill: '#333', verticalAnchor: 'middle'  })} labelProps={{ transform: `translate(${xScale(0.25)-15}, 15)`, textAnchor: 'middle', fill: '#333', fontSize: '14px', letterSpacing: '0.0'}}/>
        <AxisTop scale={xScale} stroke={'rgba(0,0,0,0.15)'} hideTicks={true} label="Number of Full Time Workers" numTicks={5} tickLabelProps={()=> ({ fontFamily: 'Circular', fontSize: '11px', fill: '#333', textAnchor: 'middle' })} tickTransform={`translate(0,10px)`} labelProps={{ y: -50, x: 0, textAnchor: 'start', verticalAnchor: 'top', fill: '#333', fontSize: '14px', fontWeight: 'bold' }}/>
        <Group
          onTouchStart={() => event => {
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            props.hideTooltip();
          }}>
          {data.sort((a,b) => x(a) - x(b)).map((d, i) => {
            const barWidth = xScale(x(d));
            return (
              <Bar
                width={barWidth}
                height={yScale.bandwidth()}
                y={yScale(y(d))}
                x={0}
                fill={'#2EBCB3'}
                onMouseEnter={() => event => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout);
                  props.showTooltip({
                    tooltipLeft: barWidth + 50,
                    tooltipTop: yScale(y(d)) + 20,
                    tooltipData: d
                  });
                }}
                onTouchStart={() => event => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout);
                  props.showTooltip({
                    tooltipLeft: barWidth,
                    tooltipTop: yScale(y(d)) + 20,
                    tooltipData: d
                  });
                }}
                onMouseLeave={() => event => {
                  tooltipTimeout = setTimeout(() => {
                    props.hideTooltip();
                  }, 300);
                }}
              />
            );
          })}
        </Group>
      </g>
      </svg>
      {props.tooltipOpen &&
        <Tooltip left={props.tooltipLeft} top={props.tooltipTop} style={{ borderRadius: 0 }}>
          <div>
            <h4 className="margin-top-0 margin-bottom-10" style={{ borderBottom: '1px solid rgba(0,0,0,0.15)', paddingBottom: '5px'}}>{tooltipData.occupation}</h4>
            <h5 className="margin-5">Median Earning</h5>
            <h6 className="margin-top-0 margin-bottom-10">{yFormat(tooltipData.median_earning)}</h6>
            <h5 className="margin-5"># of Workers</h5>
            <h6 className="margin-top-0 margin-bottom-10">{xFormat(x(tooltipData))}</h6>
          </div>
        </Tooltip>}
      </React.Fragment>
    )}}
    </ParentSize>
  );
});
