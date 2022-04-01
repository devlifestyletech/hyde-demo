import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { List as AntdList, Avatar, Select } from "antd";
import Service from "../../../services/auth.service";
import ChatRoom from "../../chat/screens/ChatRoom";

const { Option } = Select;

function List(props) {
    const [room, setRoom] = useState();

    function handleChange(value) {
        console.log(value);
        setRoom(value);
        props.handleCallback(value);
        // return  <ChatRoom room={room} />
    }

    useEffect(() => {
        Service.getAllResident().then((user) => {
            console.log("userss", user);
        });
    }, []);

    return (
        <>
            <StyledList>
                <ListHeading>
                    <Select
                        showSearch
                        style={{ width: "100%", marginBottom: 10 }}
                        placeholder="Search by name or room number"
                        optionFilterProp="children"
                        onChange={handleChange}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children
                                .toLowerCase()
                                .localeCompare(optionB.children.toLowerCase())
                        }
                    >
                        <Option value="1199/1">Not Identified</Option>
                        <Option value="1199/2">Closed</Option>
                        <Option value="1199/3">Communicated</Option>
                        <Option value="1199/4">Identified</Option>
                        <Option value="1199/5">Resolved</Option>
                        <Option value="1199/6">Cancelled</Option>
                    </Select>
                </ListHeading>
                <AntdList
                    itemLayout="horizontal"
                    dataSource={props.users}
                    renderItem={(user) => (
                        <AntdList.Item>
                            <AntdList.Item.Meta
                                avatar={
                                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                }
                                title={<a href="https://ant.design">{user.username}</a>}
                            />
                        </AntdList.Item>
                    )}
                />
            </StyledList>
        </>
    );
}

export default List;

const StyledList = styled(AntdList)`
  margin-right: 10px;
  flex: 0 0 35%;
  padding: 20px;
  .ant-list-item-meta-content {
    flex-grow: 0;
  }
  h4 {
    font-size: 25px;
  }
  a {
    color: #097ef0;
  }
`;

const ListHeading = styled.div`
  color: #757591;
  font-size: 20px;
  font-style: oblique;
  border-bottom: 1px solid #757591;
`;
