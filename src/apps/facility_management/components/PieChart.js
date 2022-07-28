import React from 'react';
import { pie_data } from '../utils/graphData';
import { Pie } from '@ant-design/charts';

export default function PieChart() {
  const config = {
    appendPadding: 10,
    data: pie_data,
    angleField: 'reservations',
    colorField: 'room',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
}
