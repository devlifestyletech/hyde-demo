import React, { useState, useEffect } from "react";
import { Empty, Space } from "antd";
import "./styles/building_zone.css";
import Addresses from "./Addresses";

export default function BuildingZone({ floorsData }) {
  const [residences, setResidences] = useState(null);

  useEffect(() => {
    setResidences(floorsData);
  }, [floorsData]);

  return (
    <>
      <div className="zone-build">
        {residences ? (
          <Space size={[20, 24]} wrap>
            {residences.map((residence, index) => (
              <div key={index}>
                <Addresses data={residence} />
              </div>
            ))}
          </Space>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}
