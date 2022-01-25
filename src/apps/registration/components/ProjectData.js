import React, { useEffect, useState } from "react";
import "./styles/project.css";
import { Empty } from "antd";
import ProjectService from "../services/project.service";
import BuildingZone from "./BuildingZone";
import "./styles/building_zone.css";

export default function ProjectData({ projectId, projectName }) {
  const [zones, setZones] = useState(null);

  useEffect(() => {
    ProjectService.getZoneById(projectId).then((zone) => {
      console.log(zone.data);
      setZones(zone.data);
    });
  }, [projectId]);

  return (
    <>
      <div className="zone">
        <div className="zone-name">{projectName}</div>
        {zones ? (
          zones.map((zone, index) => (
            <div
              style={{
                backgroundColor: index % 2 === 0 ? "#ECEBEB" : "#E4E4E4",
              }}
            >
              <p className="floor">FLOOR {index + 8}</p>
              <BuildingZone zoneData={zone} key={index} />
            </div>
          ))
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}
