import React, { useState } from "react";
import { Card, Space, Row, Col, Button } from "antd";
import { occupations } from "../utils/occupation.data";

import editIcon from "../assets/edit.svg";
import lowIcon from "../assets/low.svg";
import mediumIcon from "../assets/medium.svg";
import highIcon from "../assets/high.svg";
import EditOccupation from "./EditOccupation";

export default function Occupations() {
  const [editOccupationModalVisibility, setEditOccupationModalVisibility] =
    useState(false);
  const [handleId, setHandleId] = useState();
  return (
    <>
      <Space style={{ justifyContent: "center" }} wrap>
        {occupations ? (
          occupations.map((occupation) => (
            <div className="facilities-card">
              <Card
                cover={
                  <img
                    src={occupation.image}
                    alt="place"
                    style={{
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    }}
                  />
                }
                style={{ width: 435 }}
              >
                <Row>
                  <Col span={22}>
                    <div style={{ fontSize: 18, fontWeight: "bold" }}>
                      {occupation.room_name}
                    </div>
                  </Col>
                  <Col span={2}>
                    <Button
                      type="link"
                      onClick={() => {
                        setEditOccupationModalVisibility(true);
                        setHandleId();
                      }}
                    >
                      <img src={editIcon} alt="edit" />
                    </Button>
                  </Col>
                </Row>
                <div>
                  {occupation.status_now === 0 ? (
                    <Row>
                      <div>
                        <img
                          src={lowIcon}
                          alt="low"
                          style={{ marginRight: 10 }}
                        />
                        Low
                      </div>
                    </Row>
                  ) : occupation.status_now === 1 ? (
                    <Row>
                      <div>
                        <img
                          src={mediumIcon}
                          alt="low"
                          style={{ marginRight: 10 }}
                        />
                        Medium
                      </div>
                    </Row>
                  ) : (
                    <Row>
                      <div>
                        <img
                          src={highIcon}
                          alt="low"
                          style={{ marginRight: 10 }}
                        />
                        High
                      </div>
                    </Row>
                  )}
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div></div>
        )}
      </Space>
      <EditOccupation
        visible={editOccupationModalVisibility}
        id={handleId}
        onCancel={() => {
          setEditOccupationModalVisibility(false);
        }}
      />
    </>
  );
}
