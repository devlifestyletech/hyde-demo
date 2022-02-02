import React, { useEffect, useState } from "react";
import "./styles/project.css";
import { Empty } from "antd";
import ProjectService from "../services/project.service";
import BuildingZone from "./BuildingZone";
import "./styles/building_zone.css";

export default function ProjectData({ projectName }) {
  const [floors, setFloors] = useState(null);

  const groupBy = (arr, key) => {
    return arr.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  useEffect(() => {
    ProjectService.getResidences().then((res) => {
      let floorsGroup = groupBy(res.data, "floor");
      setFloors(floorsGroup);
    });
  }, []);

  return (
    <>
      <div className="zone">
        <div className="zone-name">{projectName}</div>
        {floors ? (
          Object.keys(floors).map((floor, index) => (
            <div
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? "#ECEBEB" : "#E4E4E4",
              }}
            >
              <p className="floor">FLOOR {floor.substring(1, 4)}</p>
              <BuildingZone floorsData={floors[floor]} />
            </div>
          ))
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}
