//import React component
import React, { useState, useEffect } from "react";

//import services file
import ProjectService from "../services/project.service";

//import project component
import Header from "../../../components/Header";

//import ant design component
import { Input, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";

//import css file
import "./styles/room-mng.css";

//import icons assets
import ProjectData from "../components/ProjectData";

function ProjectManagementPage() {
  //initial react state
  const [projects, setProjects] = useState(null);

  // fetch data from useEffect
  useEffect(() => {
    ProjectService.getProjectList().then((result) => {
      setProjects(result.data);
    });
  }, []);

  return (
    <>
      <Header title="Room management" />
      <div className="content">
        <div className="subHeader">
          <Input
            placeholder="Search by name/address"
            prefix={<SearchOutlined />}
            size="large"
          />
        </div>
        <div>
          {projects ? (
            <ProjectData projectName={projects[0].project_name} />
          ) : (
            <div
              style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                flex: 1,
                marginTop: 100,
              }}
            >
              <Empty />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectManagementPage;
