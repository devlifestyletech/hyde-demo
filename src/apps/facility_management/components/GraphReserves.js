import React from 'react';
import { bar_data } from '../utils/graphData';
import { Column } from '@ant-design/charts';

export default function GraphReserves() {
  const config = {
    data: bar_data,
    xField: 'month',
    yField: 'reservations',
  };

  return <Column {...config} />;
}
