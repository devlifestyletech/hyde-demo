import { Spin } from 'antd';
import React from 'react';
import './styles/loading.css';

export default function Loading() {
  return (
      <div className='load'>
        <Spin />
        <p>Loading...</p>
      </div>
  );
}
