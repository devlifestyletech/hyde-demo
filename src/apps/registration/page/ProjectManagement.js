//import React component
import React, { useEffect, useState } from 'react';

//import services file
import ProjectService from '../services/projectServices';

//import project component
import Header from '../../../components/Header';

//import ant design component
import { Empty, Input, Spin } from 'antd';

//import css file
import './styles/room_mng.css';

//import icons assets
import ProjectData from '../components/ProjectData';

function ProjectManagementPage() {
  //initial react state
  const { Search } = Input;
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // fetch data from useEffect
  useEffect(() => {
    (async () => {
      ProjectService.getProjectList().then((result) => {
        setProjects(result.data);
        setLoading(false);
      });
    })();
  }, []);

  return (
    <>
      <Header title="Room management" />
      <div className="content">
        <div className="subHeader">
          <Search
            style={{ maxWidth: 350 }}
            placeholder="Search by address"
            allowClear
            size="large"
            onSearch={(val) => {
              setSearch(val);
            }}
          />
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <Spin />
            <p>Loading...</p>
          </div>
        ) : (
          <div>
            {projects ? (
              <ProjectData
                search={search}
                projectName={projects[0].project_name}
              />
            ) : (
              <div
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  flex: 1,
                  marginTop: 100,
                }}
              >
                <Empty />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ProjectManagementPage;
