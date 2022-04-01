/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { List as AntdList, Avatar, Select } from "antd";
import Service from "../../../services/auth.service";

const { Option } = Select;

function List(props) {
    const [contactList, setContactList] = useState([]);

    function handleChange(value) {
        console.log(value);
        props.handleCallback(value);
    }

    useEffect(() => {
        Service.getAllResident().then((user) => {
            console.log("users", user);
            user.data.map((data) => {
                setContactList((lists) => [
                    ...lists,
                    {
                        id: data._id,
                        name: data.fullname,
                        room: data.address.address_number,
                    },
                ]);
            });
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
                        {contactList.map((data, index) => (
                            <Option
                                value={`${data.name},${data.id}:${data.room}`}
                                key={index}
                            >
                                {`${data.name} (${data.room})`}
                            </Option>
                        ))}
                        {/* {contactList.map((data, index) => {
                            console.log("dataList", index, data.id, data.name, data.room);
                            <Option value={`${data.id},${data.room}`} key={index}>
                                {index}
                            </Option>;
                        })} */}
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
  font-size: 20px;
  font-style: SukhumvitSet;
  border-bottom: 1px solid #757591;
`;
