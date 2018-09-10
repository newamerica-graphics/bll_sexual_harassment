import './index.scss';
import { barData, scatterData } from './data';
import { csv } from 'd3-fetch';
import ReactDOM from 'react-dom';

import ScatterPlot from './ScatterPlot';
import BarChart from './Bar';
import StackedBarChart from './StackedBar';

let queue = [];
let data = null;

const settings = {
  'viz__jobs-by-wage-and-gender': (el) => {
      ReactDOM.render(<ScatterPlot
        title={'Occupations, by Median Earnings and Percent Women'}
        height={550}
        width={850}
        data={scatterData}
      />, el)
  },
  'viz__common-occupation-female': (el) => {
    ReactDOM.render(<BarChart
      title="Top 10 Occupations Held by Women"
      height={550}
      width={850}
      x={d => d.number_women}
      data={barData.sort((a,b) => b.number_women - a.number_women).slice(0,10)}
    />, el)
  },
  'viz__common-occupation-male': (el) => {
    ReactDOM.render(<BarChart
      title="Top 10 Occupations Held by Men"
      height={550}
      width={850}
      x={d => d.number_men}
      data={barData.sort((a,b) => b.number_men - a.number_men).slice(0,10)}
    />, el)
  },
  'viz__common-occupation-all': (el) => {
    ReactDOM.render(<StackedBarChart
      title="Most Common Occupations, by Gender"
      height={550}
      width={850}
      data={barData.sort((a,b) => b.number_full_time - a.number_full_time).slice(0,10)}
    />, el)
  }
}


window.renderDataViz = function(el){
  let id = el.getAttribute('id');
  let chart = settings[id];
  if(chart) chart(el);
}
