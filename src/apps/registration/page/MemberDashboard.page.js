import React from 'react';
import Header from '../../../components/header';
import BarGraph from '../components/BarGraph';
import PieGraph from '../components/PieGraph';
import Statistic from '../components/Statistic';
import './styles/dashboard.css';
import { Button, Col, DatePicker, Row } from 'antd';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import moment from 'moment';

function MemberDashboardPage() {
  const monthFormat = 'MMMM ,YYYY';

  const customMonthStartEndFormat = (value) =>
    `All of Month: ${moment(value).startOf('month').format(monthFormat)}`;
  return (
    <>
      <Header title="User management dashboard" />
      <Statistic />
      <Row style={{ justifyContent: 'space-between', alignItems: 'end' }}>
        <Col
          span={12}
          className="range"
          style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}
        >
          Select Month :{' '}
          <DatePicker picker="month" format={customMonthStartEndFormat} />
        </Col>
        <Col offset={6} span={6}>
          <Button
            shape="round"
            size="large"
            icon={<VerticalAlignBottomOutlined />}
            style={{
              float: 'right',
              backgroundColor: 'rgba(216, 170, 129, 1)',
              color: 'rgba(255, 255, 255, 1)',
            }}
          >
            Export
          </Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col
          xs={{ span: 24 }}
          xl={{ span: 24 }}
          xxl={{ span: 11, offset: 1 }}
          className="bar"
        >
          <div className="title-graph">Statics of New Co-Owner</div>
          <div className="graph">
            <BarGraph />
          </div>
        </Col>
        <Col
          xs={{ span: 24 }}
          xl={{ span: 24 }}
          xxl={{ span: 11, offset: 1 }}
          className="pie"
        >
          <div className="title-graph">Status</div>
          <div className="graph">
            <PieGraph />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default MemberDashboardPage;
