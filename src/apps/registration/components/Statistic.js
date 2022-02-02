import React from "react";
import { Row, Col } from "antd";
import "./styles/Statistic.css";
export default function Statistic() {
  return (
    <Row style={{ justifyContent: "center" }}>
      <Col span={7} offset={1} className="owner-main">
        <div className="number">1,500</div>
        <div className="tag tag-1">Co-Owner Total</div>
      </Col>
      <Col span={7} offset={1} className="owner-main">
        <div className="number">30</div>
        <div className="tag tag-2">New Co-Owner</div>
      </Col>
      <Col span={7} offset={1} className="owner-main">
        <div className="number">1,470</div>
        <div className="tag tag-3">Co-Owner</div>
      </Col>
    </Row>
  );
}
