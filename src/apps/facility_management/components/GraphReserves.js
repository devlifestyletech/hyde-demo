import { Column } from '@ant-design/charts';
import React from 'react';
import { bar_data } from '../utils/graphData';

export default function GraphReserves() {
  const config = {
    data  : bar_data,
    xField: 'month',
    yField: 'reservations',
  };
  
  return <Column {...config} />;
}
