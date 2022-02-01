import React, { useState, useEffect } from "react";
import { Empty, Button, Modal, Tabs, Divider } from "antd";
import ProjectService from "../services/project.service";
import AppendUserModal from "./AppendUserModal";
import { PlusCircleOutlined } from "@ant-design/icons";
import UsersInfo from "./UserInfo";
const { TabPane } = Tabs;

export const RoomInfoModal = ({
  visible,
  onCancel,
  id,
  // owner,
  // inhabitant,
  // tenant,
  refresh,
}) => {
  const [owner, setOwner] = useState([]);
  const [tenant, setTenant] = useState([]);
  const [inhabitant, setInhabitant] = useState([]);
  const [userRule, setUserRule] = useState(null);
  const [appendUserModalVisibility, setAppendUserModalVisibility] =
    useState(false);
  const [createUserModalVisibility, setCreateUserModalVisibility] =
    useState(false);

  useEffect(() => {
    ProjectService.getResidentListByResidenceId(id).then((res) => {
      setOwner(res.data.filter((user) => user.roles === "Owner"));
      setInhabitant(res.data.filter((user) => user.roles === "Inhabitant"));
      setTenant(res.data.filter((user) => user.roles === "Tenant"));
    });
  }, [id, refresh]);

  return (
    <>
      <Modal
        visible={visible}
        title="Information"
        onCancel={() => onCancel()}
        footer={[<Button onClick={() => onCancel()}>Close</Button>]}
        width={800}
        centered
      >
        <div>
          <Tabs defaultActiveKey="owner">
            <TabPane tab="Owner" key="owner">
              {owner.length ? (
                owner.map((owner, index) => (
                  <div key={index}>
                    <UsersInfo user={owner} onEvent={() => refresh()} />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center" }}>
                  <Empty />
                  <Button
                    shape="round"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      setUserRule("Owner");
                      setAppendUserModalVisibility(!appendUserModalVisibility);
                    }}
                  >
                    Add owner user
                  </Button>
                  <Divider>or</Divider>
                  <Button
                    shape="round"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      setUserRule("Owner");
                      setCreateUserModalVisibility(!createUserModalVisibility);
                    }}
                  >
                    Create owner user
                  </Button>
                </div>
              )}
            </TabPane>
            <TabPane tab="Inhabitant" key="inhabitant">
              {inhabitant.length ? (
                inhabitant.map((inhabitant, index) => (
                  <>
                    <div key={index}>
                      <UsersInfo user={inhabitant} onEvent={() => refresh()} />
                    </div>
                    {index < 3 ? (
                      <div style={{ textAlign: "center" }}>
                        <Button
                          style={{ alignSelf: "center" }}
                          shape="round"
                          icon={<PlusCircleOutlined />}
                          onClick={() => {
                            setUserRule("Inhabitant");
                            setAppendUserModalVisibility(
                              !appendUserModalVisibility
                            );
                          }}
                        >
                          Add inhabitant user
                        </Button>
                      </div>
                    ) : null}
                  </>
                ))
              ) : (
                <div style={{ textAlign: "center" }}>
                  <Empty />
                  <Button
                    shape="round"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      setUserRule("Inhabitant");
                      setAppendUserModalVisibility(!appendUserModalVisibility);
                    }}
                  >
                    Add inhabitant user
                  </Button>
                  <Divider>or</Divider>
                  <Button
                    shape="round"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      setUserRule("Inhabitant");
                      setCreateUserModalVisibility(!createUserModalVisibility);
                    }}
                  >
                    Create inhabitant user
                  </Button>
                </div>
              )}
            </TabPane>
            <TabPane tab="Tenant" key="tenant">
              {tenant.length ? (
                tenant.map((tenant, index) => (
                  <>
                    <div key={index}>
                      <UsersInfo user={tenant} onEvent={() => refresh()} />
                    </div>
                    {index < 3 ? (
                      <div style={{ textAlign: "center" }}>
                        <Button
                          style={{ alignSelf: "center" }}
                          shape="round"
                          icon={<PlusCircleOutlined />}
                          onClick={() => {
                            setUserRule("Tenant");
                            setAppendUserModalVisibility(
                              !appendUserModalVisibility
                            );
                          }}
                        >
                          Add tenant user
                        </Button>
                      </div>
                    ) : null}
                  </>
                ))
              ) : (
                <div style={{ textAlign: "center" }}>
                  <Empty />
                  <Button
                    shape="round"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      setUserRule("Tenant");
                      setAppendUserModalVisibility(!appendUserModalVisibility);
                    }}
                  >
                    Add tenant user
                  </Button>
                  <Divider>or</Divider>
                  <Button
                    shape="round"
                    icon={<PlusCircleOutlined />}
                    onClick={() => {
                      setUserRule("Tenant");
                      setCreateUserModalVisibility(!createUserModalVisibility);
                    }}
                  >
                    Create tenant user
                  </Button>
                </div>
              )}
            </TabPane>
            <TabPane tab="Auto Parking QR Code" key="qrCode"></TabPane>
          </Tabs>
        </div>
      </Modal>
      <AppendUserModal
        userRule={userRule}
        visible={appendUserModalVisibility}
        id={id}
        onCancel={() => {
          setAppendUserModalVisibility(!appendUserModalVisibility);
          refresh();
        }}
      />
      <CreateUserModal
        userRule={userRule}
        visible={createUserModalVisibility}
        onCancel={() => {
          setCreateUserModalVisibility(!createUserModalVisibility);
          refresh();
        }}
      />
    </>
  );
};

const CreateUserModal = ({ userRule, visible, onCancel }) => {
  return (
    <Modal
      centered
      title={"Create " + userRule + " user"}
      visible={visible}
      onCancel={() => onCancel()}
    ></Modal>
  );
};
