import React from 'react';
import { Group } from '@vx/group';
import { GlyphDot, GlyphCircle } from '@vx/glyph';
import { GradientPinkRed } from '@vx/gradient';
import { scaleLinear, scaleOrdinal  } from '@vx/scale';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { max, extent } from 'd3-array';
import { format } from 'd3-format';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { AnnotationCalloutCurve } from 'react-annotation';
import { ParentSize } from "@vx/responsive";

const margin = {
  top: 125,
  bottom: 50,
  left: 25,
  right: 25
};

const x = d => d.percent_women;
const y = d => d.median_earning;
const r = d => d.number_full_time;
const z = d => d.category;

const xFormat = format('.0%');
const yFormat = format('$,.0f');
const nFormat = format(',.0f');

let tooltipTimeout;

export default withTooltip(props => {
  const { height, data, tooltipData, title } = props;

  const Note = () => {

    return (
      <AnnotationCalloutCurve
        x={150}
        y={170}
        dy={117}
        dx={162}
        color={"#9610ff"}
        editMode={true}
        note={{"title":"Annotations :)",
          "label":"Longer text to show text wrapping",
          "lineType":"horizontal"}}
      />
    );

  }

  return (
    <ParentSize>
      {({ width }) => {
        const xMax = width - margin.left - margin.right;
        const yMaxRange = height - margin.top - margin.bottom;
        const yMaxDomain = max(data, y);
        if (width < 10) return null;

        const xScale = scaleLinear({
          domain: [0,1],
          range: [0, xMax],
          clamp: true
        });

        const yScale = scaleLinear({
          domain: [0, yMaxDomain],
          range: [yMaxRange, 0],
          clamp: true
        });

        const rScale = scaleLinear({
          domain: extent(data, r),
          range: [2, 40],
          clamp: true
        });

        const zScale = scaleOrdinal({
          domain: ['Low-Wage, Female Dominated','Low-Wage, Male Dominated', 'Middle to High-Wage, Female Dominated', 'High Wage, Male Dominated'],
          range: ['#7CA3E4', '#C28949', '#22C8A3', '#FF6677']
        });

        return (
    <div>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={`rgba(51,51,51,0)`}
        />
        <g transform={`translate(${margin.left},35)`}>
          <text><tspan fontSize="16px" fontWeight="bold">Figure X&nbsp;&nbsp;|&nbsp;&nbsp;</tspan><tspan>{title}</tspan></text>
        </g>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
        <text transform={`translate(${xScale(0.25)}, ${yScale(70000)})`} textAnchor='middle' fontWeight='bold' fontSize='14px' fill='rgba(255, 102, 119, 0.9)'>High Wage, Male Dominated</text>
        <text transform={`translate(${xScale(0.75)}, ${yScale(70000)})`} textAnchor='middle' fontWeight='bold' fontSize='14px' fill='rgba(34, 200, 163, 0.9)'>Medium to High Wage, Female Dominated</text>
        <text transform={`translate(${xScale(0.25)}, ${yScale(20000)})`} textAnchor='middle' fontWeight='bold' fontSize='14px' fill='rgba(194, 137, 73, 0.9)'>Low Wage, Male Dominated</text>
        <text transform={`translate(${xScale(0.75)}, ${yScale(20000)})`} textAnchor='middle' fontWeight='bold' fontSize='14px' fill='rgba(124, 163, 228, 0.9)'>Low Wage, Female Dominated</text>
        <AxisLeft scale={yScale} left={xScale(0.5)} tickFormat={yFormat} stroke={'rgba(0,0,0,0.15)'} hideTicks={true} label="Median Earning" numTicks={5} tickLabelProps={()=> ({ fontFamily: 'Circular', fontSize: '11px', textAnchor: 'end', fill: '#333'  })} tickValues={[0, 20000, 60000, 80000, 100000]} labelProps={{ x: 0, y: -25, transform: 'none', textAnchor: 'middle', fill: '#333', fontSize: '14px', fontWeight: 'bold'}}/>
        <AxisBottom scale={xScale} top={yScale(40000)} tickFormat={xFormat} stroke={'rgba(0,0,0,0.15)'} hideTicks={true} label="Percent Women" numTicks={5} tickLabelProps={()=> ({ fontFamily: 'Circular', fontSize: '11px', dy: '1.5em', fill: '#333', textAnchor: 'middle' })} tickTransform={`translate(0,10px)`} labelProps={{ transform: `translate(${xScale(0.5)}, -15)`, textAnchor: 'end', fill: '#333', fontSize: '14px', fontWeight: 'bold' }}/>
        <Group
          onTouchStart={() => event => {
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            props.hideTooltip();
          }}
        >
          {data.map((point, i) => {
            return (
              <GlyphCircle
                className="dot"
                key={`point-${i}`}
                stroke={'rgba(0,0,0,0.3)'}
                fill={zScale(z(point))}
                left={xScale(x(point))}
                top={yScale(y(point))}
                style={{ cursor: 'pointer' }}
                size={Math.PI*rScale(r(point))*rScale(r(point))}
                onMouseEnter={() => event => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout);
                  props.showTooltip({
                    tooltipLeft: xScale(x(point)) + 50,
                    tooltipTop: yScale(y(point)) + 20,
                    tooltipData: point
                  });
                }}
                onTouchStart={() => event => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout);
                  props.showTooltip({
                    tooltipLeft: xScale(x(point)),
                    tooltipTop: yScale(y(point)) - 30,
                    tooltipData: point
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
            <h5 className="margin-5">% Women</h5>
            <h6 className="margin-top-0 margin-bottom-10">{xFormat(tooltipData.percent_women)}</h6>
            <h5 className="margin-5">Median Earning</h5>
            <h6 className="margin-top-0 margin-bottom-10">{yFormat(tooltipData.median_earning)}</h6>
            <h5 className="margin-5"># of Workers</h5>
            <h6 className="margin-top-0 margin-bottom-10">{nFormat(tooltipData.number_full_time)}</h6>
          </div>
        </Tooltip>}
    </div>
  )}}
  </ParentSize>
  );
});
