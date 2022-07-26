import React, { useEffect, useState } from 'react';
import './styles/project.css';
import { Spin, Empty, Pagination } from 'antd';
import ProjectService from '../services/projectServices';
import BuildingZone from './BuildingZone';
import './styles/building_zone.css';

export default function ProjectData({ projectName, search = '' }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [floors, setFloors] = useState(null);
  const [minIndex, setMinIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [current, setCurrent] = useState(1);
  const pageSize = 3;
  let isCancelled = false;

  // functions
  const groupBy = (arr, key) => {
    return arr.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const handleChange = (page) => {
    setCurrent(page);
    setMinIndex((page - 1) * pageSize);
    setMaxIndex(page * pageSize);
  };

  const filterData = async (val) => {
    if (!isCancelled) {
      let floorsGroup = await groupBy(val, 'floor');
      setFloors(floorsGroup);
      setTotalLength(Object.keys(floorsGroup).length);
      setMinIndex(0);
      setMaxIndex(pageSize);
      setLoading(false);
    }
  };

  const isLoading = (bool) => {
    setLoading(bool);
  };

  //actions
  useEffect(() => {
    setLoading(true);
    (async () => {
      ProjectService.getResidences().then((res) => {
        setData(res.data);
        filterData(res.data);
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    if (search) {
      ProjectService.getResidences(search).then((res) => {
        if (!isCancelled) {
          let floorsGroup = groupBy(
            res.data.filter((item) => item.address_number.includes(search)),
            'floor'
          );
          setFloors(floorsGroup);
          setTotalLength(Object.keys(floorsGroup).length);
          setMinIndex(0);
          setMaxIndex(pageSize);
          setLoading(false);
        }
      });
    } else {
      filterData(data);
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isCancelled = true;
    };
  }, [search]);

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <Spin />
          <p>Loading...</p>
        </div>
      ) : (
        <div className="zone">
          <div className="zone-name">{projectName}</div>
          {floors ? (
            Object.keys(floors).map(
              (floor, index) =>
                index >= minIndex &&
                index < maxIndex && (
                  <div
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#ECEBEB' : '#E4E4E4',
                    }}
                  >
                    <p className="floor">FLOOR {floor.substring(1, 4)}</p>
                    <BuildingZone
                      isLoading={isLoading}
                      floorsData={floors[floor]}
                    />
                  </div>
                )
            )
          ) : (
            <Empty />
          )}
          <Pagination
            pageSize={pageSize}
            current={current}
            total={totalLength}
            onChange={handleChange}
            className="paginationProject"
            style={{ textAlign: 'end', marginTop: 10 }}
          />
        </div>
      )}
    </>
  );
}
