/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
    List as AntdList,
    Avatar,
    Select,
    message,
    Skeleton,
    Divider,
} from "antd";

import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { encryptStorage } from "../../../utils/encryptStorage";
import Service from "../../../services/auth.service";
const session = encryptStorage.getItem("user_session");

const { Option } = Select;

function List(props) {
    const [contactList, setContactList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    function handleChange(value) {
        console.log(value);
        props.handleCallback(value);
    }

    // const fetchData = async () => {
    //     try {
    //         const headers = { headers: { Authorization: "Bearer " + session.jwt } };

    //         await axios
    //             .get(process.env.REACT_APP_API_URL + "/chats?_where[room]=" + room, headers)
    //             .then((res) => {
    //                 res.data.map((data) => {
    //                     // console.log("data", data.room, data.text, data.time, data.user);
    //                 });
    //                 // setLoading(false);
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    const loadMoreData = useCallback(() => {
        if (loading) {
            return;
        }
        setLoading(true);
        fetch(
            "https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo"
        )
            .then((res) => res.json())
            .then((body) => {
                setData([...data, ...body.results]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    });

    useEffect(() => {
        loadMoreData();
    });
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
                    </Select>
                </ListHeading>
                {/* <div
                    id="scrollableDiv"
                    style={{
                        // backgroundColor:'#fff',
                        height: '72vh',
                        overflow: 'auto',
                        padding: '0 16px',
                    }}
                >
                    <InfiniteScroll
                        dataLength={data.length}
                        next={loadMoreData}
                        hasMore={data.length < 50}
                        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                        scrollableTarget="scrollableDiv"
                    >
                        <AntdList
                            dataSource={data}
                            renderItem={(item) => (
                                <AntdList.Item key={item.id}>
                                    <AntdList.Item.Meta
                                    style={{
                                        // backgroundColor:'#fff',
                                        // borderBottom: '1px solid rgba(140, 140, 140, 0.35)',
                                    }}
                                        avatar={<Avatar src={item.picture.large} />}
                                        title={item.name.last}
                                        description={item.email}
                                    />
                                </AntdList.Item>
                            )}
                        />
                    </InfiniteScroll>
                </div> */}
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
