import React, { useState, useEffect } from "react";
import { Empty, Space } from "antd";
import ProjectService from "../services/project.service";
import "./styles/building_zone.css";
import Addresses from "./Addresses";

export default function BuildingZone({ zoneData }) {
  const [residences, setResidences] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    ProjectService.getResidencesByZoneId(zoneData.id).then((result) => {
      setResidences(result.data);
    });
  }, [reload, zoneData.id]);

  return (
    <>
      <div className="zone-build">
        {residences ? (
          <Space size={[20, 24]} wrap>
            {residences.map((residence, index) => (
              <div key={index}>
                <Addresses data={residence} reload={() => setReload(!reload)} />
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
