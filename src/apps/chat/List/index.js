/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
    List as AntdList,
    Avatar,
    Select,
    Skeleton,
    Divider,
    Button,
} from "antd";
import noImg from "../../assets/images/noImg.jpg";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { encryptStorage } from "../../../utils/encryptStorage";
import Service from "../../../services/auth.service";
import { socket } from "../../../services/web-sockets";

const session = encryptStorage.getItem("user_session");

const { Option } = Select;

function List(props) {
    const [contactList, setContactList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const headers = { headers: { Authorization: "Bearer " + session.jwt } };
    // console.log(headers);
    function handleChange(value) {
        console.log(value);
        props.handleCallback(value);
    }
    const fetchData = async () => {
        try {
            if (loading) {
                return;
            }
            setLoading(true);
            await axios
                .get(process.env.REACT_APP_API_URL + "/chats?_sort=time:desc", headers)
                .then((res) => {
                    console.log("res", res.data);
                    var flags = [],
                        output = [],
                        l = res.data.length,
                        i;
                    for (i = 0; i < l; i++) {
                        if (flags[res.data[i].room]) continue;
                        flags[res.data[i].room] = true;
                        output.push(res.data[i]);
                    }
                    console.log("output", output);
                    setData(output);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } catch (err) {
            console.error(err);
        }
    };
    // const getUserData = async () => {
    //     try {
    //         for (let i = 0; i < data.length; i++) {
    //             await axios
    //                 .get(
    //                     process.env.REACT_APP_API_URL +
    //                     "/users?_where[id]=" +
    //                     data[i].room.split(":")[0],
    //                     headers
    //                 )
    //                 .then((res) => {
    //                     console.log("user", res.data[0]._id);

    //                     // setRoomInfo([...roomInfo, {key: res.data.id}]);
    //                     // setData([...data, ...body.results]);
    //                     // setRoomInfo(...roomInfo,{key: res.data[0]._id})
    //                     // setRoomInfo((prevState) => {  });
    //                     this.setRoomInfo(prevState => ({
    //                         roomInfo: {                   // object that we want to update
    //                             ...prevState.roomInfo,    // keep all other key-value pairs
    //                             name: res.data[0].fullname       // update the value of specific key
    //                         }
    //                     }))
    //                     console.log("roomInfo", roomInfo);
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                     setLoading(false);
    //                 });
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    useEffect(() => {
        // loadMoreData();
        fetchData();
    }, [socket]);
    useEffect(() => {
        Service.getAllResident().then((user) => {
            // console.log("users", user);
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
                <div
                    id="scrollableDiv"
                    style={{
                        // backgroundColor:'#fff',
                        height: "72vh",
                        overflow: "auto",
                        padding: "0 16px",
                    }}
                >
                    <InfiniteScroll
                        dataLength={data.length}
                        next={fetchData}
                        hasMore={data.length < 1}
                        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                        endMessage={<Divider plain>It is all, nothing more</Divider>}
                        scrollableTarget="scrollableDiv"
                    >
                        <AntdList
                            dataSource={data}
                            renderItem={(item) => (
                                // <button  onClick={handleChange(item.room)}>
                                <AntdList.Item
                                    key={item.id}
                                    onClick={() => {
                                        props.handleCallback(item.room_info.fullname+","+item.room);
                                    }}
                                >
                                    <AntdList.Item.Meta
                                        style={{
                                            // backgroundColor:'#fff',
                                            borderBottom: "1px solid rgba(140, 140, 140, 0.35)",
                                            // maxHeight:'10vh'
                                        }}
                                        avatar={
                                            <Avatar
                                                src={
                                                    item.room_info.avatar
                                                        ? process.env.REACT_APP_API_URL +
                                                        item.room_info.avatar.url
                                                        : noImg
                                                }
                                            />
                                        }
                                        title={item.room_info.fullname}
                                        description={
                                            item.text.length > 30
                                                ? item.text.substring(0, 30) + "..."
                                                : item.text
                                        }
                                    />
                                </AntdList.Item>
                                // </button>
                            )}
                        />
                    </InfiniteScroll>
                </div>
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
const textOverx = styled.div`
  font-size: 20px;
  font-style: SukhumvitSet;
  overflow: hidden;
  text-overflow: ellipsis;
`;
