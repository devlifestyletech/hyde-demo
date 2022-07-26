import React from 'react';
import { area_data } from '../utils/graphData';
import { Area } from '@ant-design/charts';

export default function AreaChart() {
  const config = {
    data: area_data,
    xField: 'time',
    yField: 'reservation',
  };

  return <Area {...config} />;
}
