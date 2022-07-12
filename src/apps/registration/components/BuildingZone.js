import React, { useState, useEffect } from 'react';
import { Empty, Space } from 'antd';
import './styles/building_zone.css';
import Addresses from './Addresses';

export default function BuildingZone({ floorsData }) {
  const [residences, setResidences] = useState(null);

  const updateFloorsData = (id, val) => {
    let floors = floorsData;
    let objIndex = floors.findIndex((obj) => obj.id === id);

    floors[objIndex].resident_lists = val;
    setResidences(floors);
  };

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
                <Addresses data={residence} update={updateFloorsData} />
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
