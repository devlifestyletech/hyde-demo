import React from 'react';
import Header from '../../../components/header';
import GraphReserves from '../components/GraphReserves';
import './styles/dashboard.css';
import { Button, Row } from 'antd';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import PieChart from '../components/PieChart';
import AreaChart from '../components/AreaChart';

export default function FacilitiesManagementDashboardPage() {
  return (
    <>
      <Header title="Reservation Dashboard" />
      <div className="top-container">
        <Button
          icon={<VerticalAlignBottomOutlined />}
          type="primary"
          size="large"
          shape="round"
          style={{ float: 'right' }}
        >
          Export
        </Button>
      </div>
      <div className="content-container">
        <Row>
          <div className="bar-graph">
            <div className="chart-title">
              <p style={{ fontSize: 18, paddingLeft: 10 }}>Total Reservation</p>
            </div>
            <div className="chart-content">
              <GraphReserves />
            </div>
          </div>
          <div className="pie-graph">
            <div className="chart-title">
              <p style={{ fontSize: 18, paddingLeft: 10 }}>
                Booking Reservation
              </p>
            </div>
            <div className="chart-content">
              <PieChart />
            </div>
          </div>
        </Row>
        <div className="area-graph">
          <div className="chart-title">
            <p style={{ fontSize: 18, paddingLeft: 10 }}>
              Summarize the time when people come to reserve the room.
            </p>
          </div>
          <div className="chart-content">
            <AreaChart />
          </div>
        </div>
      </div>
    </>
  );
}
