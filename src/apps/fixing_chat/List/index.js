/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { format, utcToZonedTime } from "date-fns-tz";
import {
    List as AntdList,
    Avatar,
    Select,
    Skeleton,
    Divider,
    Row,
    Col,
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
    const adminId = session.user._id;
    const headers = { headers: { Authorization: "Bearer " + session.jwt } };
    const thTimeZone = "Asia/Bangkok";
    const toDay = format(utcToZonedTime(new Date(), thTimeZone), "dd-MM-yyyy", {
        timeZone: "Asia/Bangkok",
    });
    // console.log(toDay)
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
                .get(
                    process.env.REACT_APP_API_URL +
                    "/chats?room_contains=!&_sort=time:desc",
                    headers
                )
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

    useEffect(() => {
        console.log("fetch Socket");
        socket.on("fetchHistory", () => {
            console.log("fetchData");
            fetchData();
        });
    }, [socket]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        Service.getAllFixing().then((report) => {
            console.log("report", report.data[0]._id);
            console.log("report", report.data[0].problem);
            console.log("report", report.data[0].address.address_number);
            report.data.map((data) => {
                setContactList((lists) => [
                    ...lists,
                    {
                        id: data._id,
                        name: data.problem,
                        room: data.address.address_number,
                    },
                ]);
            });
        });
    }, []);

    const History = ({ item }) => {
        console.log("ii", item);
        return (
            <AntdList.Item
                key={item.id}
                onClick={() => {
                    props.handleCallback(item.fixing_info.problem + "," + item.room);
                    props.getAvatar(item.fixing_info.image_pending[0]);
                }}
            >
                <ListComp style={{
                    width: "100%",
                    height: "10vh",
                    // marginBottom: 5
                }}>
                    <Row>
                        <Row style={{
                            width: "0.4vw",
                            height: "10vh",
                            backgroundColor: "red",
                        }}
                        />
                        <Avatar style={{
                            alignSelf: "center",
                            marginLeft: "0.4vw",
                        }}
                            size={60}
                            src={
                                item.fixing_info.image_pending[0]
                                    ? process.env.REACT_APP_API_URL +
                                    item.fixing_info.image_pending[0].url
                                    : noImg
                            }
                        />
                        <Row style={{
                            // backgroundColor: "green",
                            justifyContent: 'space-between',
                            width: "78.2%",
                        }}>
                            <Col
                                style={{

                                    alignSelf: "center",
                                    // width: "60%",
                                }}
                            >
                                <TitleText >
                                    {`${item.fixing_info.problem.length > 20
                                        ? item.fixing_info.problem.substring(0, 20) + "..."
                                        : item.fixing_info.problem
                                        } (${item.room.split("!")[1]})`}
                                </TitleText>
                                <ChatText>
                                    {item.type === "chat"
                                        ? item.text.length > 30
                                            ? item.text.substring(0, 30) + "..."
                                            : item.text
                                        : item.sender_id === adminId
                                            ? "You send a photo"
                                            : item.room_info.fullname + " send a photo"}
                                </ChatText>
                            </Col>
                            <TimeText style={{
                                // width: "10%",
                                // backgroundColor: "coral",
                            }}>
                                {toDay ===
                                    format(
                                        utcToZonedTime(new Date(item.time), thTimeZone),
                                        "dd-MM-yyyy",
                                        {
                                            timeZone: "Asia/Bangkok",
                                        }
                                    )
                                    ? format(
                                        utcToZonedTime(new Date(item.time), thTimeZone),
                                        "HH:mm",
                                        {
                                            timeZone: "Asia/Bangkok",
                                        }
                                    )
                                    : format(
                                        utcToZonedTime(new Date(item.time), thTimeZone),
                                        "dd/MM/yyyy HH:mm",
                                        {
                                            timeZone: "Asia/Bangkok",
                                        }
                                    )}
                            </TimeText></Row>
                    </Row></ListComp>
            </AntdList.Item>
        );
    };

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
                        height: "72vh",
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
                            renderItem={(item) => <History item={item} />}
                        />
                    </InfiniteScroll>
                </div>
            </StyledList>
        </>
    );
}

export default List;

const StyledList = styled(AntdList)`
  //   background-color: green;
  //   padding-top: 10px;
  flex: 0 0 35%;
  padding: 20px;
  .ant-list-item {
    padding: 0 !important;
  }
  .ant-list-split .ant-list-item {
    border-bottom: 0px;
  }
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
const ListComp = styled.div`
background-color: white;
:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
const ListHeading = styled.div`
  font-size: 20px;
  font-style: SukhumvitSet;
  border-bottom: 1px solid #757591;
`;
const TitleText = styled.div`
  margin-left: 10px;
  font-size: 16px;
  font-style: SukhumvitSet;
`;
const ChatText = styled.div`
  margin-left: 10px;
  font-size: 14px;
  font-style: SukhumvitSet;
  color: rgba(0, 0, 0, 0.45);
`;
const TimeText = styled.div`
  text-align: right;
  font-size: 12px;
  font-style: SukhumvitSet;
  color: rgba(0, 0, 0, 1);
`;
