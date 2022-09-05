import React, { useState, useEffect } from 'react';
import { Empty, Space } from 'antd';
import './styles/building_zone.css';
import Addresses from './Addresses';

export default function BuildingZone({ floorsData, refresh }) {
  const [residences, setResidences] = useState(null);

  const updateFloorsData = async (id, val) => {
    // let floors = floorsData;
    // let objIndex = await floors.findIndex((obj) => obj.id === id);
    // floors[objIndex] = val;
    // console.log(floors);
    // setResidences(floors);
    refresh();
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
