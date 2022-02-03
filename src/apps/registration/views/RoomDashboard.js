import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import PieGraph from "../components/PieGraph";
import { Column } from "@ant-design/plots";
import "./styles/dashboard.css";
import { Row, Button, DatePicker, Col } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import moment from "moment";

function RoomDashboardPage() {
  const [totalRoom1, setTotalRoom1] = useState(0);
  const [totalRoom2, setTotalRoom2] = useState(0);
  const [totalRoom3, setTotalRoom3] = useState(0);
  const [data, setData] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const monthFormat = "MMMM ,YYYY";
  const mockData = [
    {
      room_name: "Room 1",
      date: new Date("2021-07-1"),
      day: "Monday",
      in_count: 95,
      out_count: 90,
    },
    {
      room_name: "Room 1",
      date: new Date("2021-07-2"),
      day: "Tuesday",
      in_count: 24,
      out_count: 23,
    },
    {
      room_name: "Room 1",
      date: new Date("2021-07-3"),
      day: "Wednesday",
      in_count: 30,
      out_count: 30,
    },
    {
      room_name: "Room 1",
      date: new Date("2021-07-4"),
      day: "Thursday",
      in_count: 75,
      out_count: 70,
    },
    {
      room_name: "Room 1",
      date: new Date("2021-07-5"),
      day: "Friday",
      in_count: 15,
      out_count: 15,
    },
    {
      room_name: "Room 1",
      date: new Date("2021-07-6"),
      day: "Saturday",
      in_count: 29,
      out_count: 29,
    },
    {
      room_name: "Room 1",
      date: new Date("2021-07-7"),
      day: "Sunday",
      in_count: 30,
      out_count: 30,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-1"),
      day: "Monday",
      in_count: 95,
      out_count: 52,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-2"),
      day: "Tuesday",
      in_count: 23,
      out_count: 23,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-3"),
      day: "Wednesday",
      in_count: 30,
      out_count: 30,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-4"),
      day: "Thursday",
      in_count: 80,
      out_count: 70,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-5"),
      day: "Friday",
      in_count: 15,
      out_count: 15,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-6"),
      day: "Saturday",
      in_count: 29,
      out_count: 29,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-7"),
      day: "Sunday",
      in_count: 30,
      out_count: 30,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-1"),
      day: "Monday",
      in_count: 95,
      out_count: 52,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-2"),
      day: "Tuesday",
      in_count: 1,
      out_count: 1,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-3"),
      day: "Wednesday",
      in_count: 30,
      out_count: 30,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-4"),
      day: "Thursday",
      in_count: 3,
      out_count: 3,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-5"),
      day: "Friday",
      in_count: 15,
      out_count: 15,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-6"),
      day: "Saturday",
      in_count: 29,
      out_count: 29,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-7"),
      day: "Sunday",
      in_count: 30,
      out_count: 30,
    },

    {
      room_name: "Room 1",
      date: new Date("2021-07-8"),
      day: "Monday",
      in_count: 95,
      out_count: 90,
    },
    {
      room_name: "Room 1",
      date: new Date("2021-07-9"),
      day: "Tuesday",
      in_count: 24,
      out_count: 23,
    },
    {
      room_name: "Room 1",
      date: new Date("2021-07-10"),
      day: "Wednesday",
      in_count: 30,
      out_count: 30,
    },
    {
      room_name: "Room 1",
      date: new Date("2021-07-11"),
      day: "Thursday",
      in_count: 75,
      out_count: 70,
    },
    {
      room_name: "Room 1",
      date: new Date("2021-07-12"),
      day: "Friday",
      in_count: 15,
      out_count: 15,
    },
    {
      room_name: "Room 1",
      date: new Date("2021-07-13"),
      day: "Saturday",
      in_count: 29,
      out_count: 29,
    },
    {
      room_name: "Room 1",
      date: new Date("2021-07-14"),
      day: "Sunday",
      in_count: 30,
      out_count: 30,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-8"),
      day: "Monday",
      in_count: 95,
      out_count: 52,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-9"),
      day: "Tuesday",
      in_count: 23,
      out_count: 23,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-10"),
      day: "Wednesday",
      in_count: 30,
      out_count: 30,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-11"),
      day: "Thursday",
      in_count: 80,
      out_count: 70,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-12"),
      day: "Friday",
      in_count: 15,
      out_count: 15,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-13"),
      day: "Saturday",
      in_count: 29,
      out_count: 29,
    },
    {
      room_name: "Room 2",
      date: new Date("2021-07-14"),
      day: "Sunday",
      in_count: 30,
      out_count: 30,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-8"),
      day: "Monday",
      in_count: 95,
      out_count: 52,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-9"),
      day: "Tuesday",
      in_count: 1,
      out_count: 1,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-10"),
      day: "Wednesday",
      in_count: 30,
      out_count: 30,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-11"),
      day: "Thursday",
      in_count: 3,
      out_count: 3,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-12"),
      day: "Friday",
      in_count: 15,
      out_count: 15,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-13"),
      day: "Saturday",
      in_count: 29,
      out_count: 29,
    },
    {
      room_name: "Room 3",
      date: new Date("2021-07-14"),
      day: "Sunday",
      in_count: 30,
      out_count: 30,
    },
  ];
  const room1 = mockData.filter((room) => room.room_name === "Room 1");
  const room2 = mockData.filter((room) => room.room_name === "Room 2");
  const room3 = mockData.filter((room) => room.room_name === "Room 3");

  // config Column data for column chart
  const config = {
    data,
    xField: "day",
    yField: "value",
    seriesField: "room_name",
    isGroup: "true",
    columnStyle: {
      radius: [5, 5, 0, 0],
    },
    color: [
      "rgba(209, 186, 125, 1)",
      "rgba(32, 38, 58, 1)",
      "rgba(216, 170, 129, 1)",
    ],
  };

  // functions
  const countTotalInRooms = (rooms) => {
    let total = 0;

    // count total in room
    rooms.forEach((room) => {
      try {
        if (room.in_count - room.out_count >= 0) {
          total += room.in_count;
        } else {
          total += room.out_count;
        }
      } catch (error) {
        console.log("error", error);
      }
    });

    // set data by room name
    if (rooms[0].room_name === "Room 1") {
      setTotalRoom1(total);
    } else if (rooms[0].room_name === "Room 2") {
      setTotalRoom2(total);
    } else if (rooms[0].room_name === "Room 3") {
      setTotalRoom3(total);
    } else {
      console.log("Something went wrong");
    }
  };

  const pieData = (values) => {
    let data = [];
    for (let i = 1; i < 4; i++) {
      data.push({
        type: "Room" + i,
        value: values[i - 1],
      });
    }
    return data;
  };

  const countTotalInRoomsByDay = (rooms) => {
    let total = [0, 0, 0, 0, 0, 0, 0];
    rooms.forEach((room) => {
      switch (room.day) {
        case "Monday":
          room.in_count - room.out_count >= 0
            ? (total[0] += room.in_count)
            : (total[0] += room.out_count);
          break;
        case "Tuesday":
          room.in_count - room.out_count >= 0
            ? (total[1] += room.in_count)
            : (total[1] += room.out_count);
          break;
        case "Wednesday":
          room.in_count - room.out_count >= 0
            ? (total[2] += room.in_count)
            : (total[2] += room.out_count);
          break;
        case "Thursday":
          room.in_count - room.out_count >= 0
            ? (total[3] += room.in_count)
            : (total[3] += room.out_count);
          break;
        case "Friday":
          room.in_count - room.out_count >= 0
            ? (total[4] += room.in_count)
            : (total[4] += room.out_count);
          break;
        case "Saturday":
          room.in_count - room.out_count >= 0
            ? (total[5] += room.in_count)
            : (total[5] += room.out_count);
          break;
        case "Sunday":
          room.in_count - room.out_count >= 0
            ? (total[6] += room.in_count)
            : (total[6] += room.out_count);
          break;

        default:
          break;
      }
    });
    handleColumnData(rooms[0].room_name, total);
  };

  const handleColumnData = (name, val) => {
    let days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    let colData = columnData;
    if (colData.filter((x) => x.room_name.includes(name)).length === 0) {
      for (let i = 0; i < 7; i++) {
        colData.push({
          room_name: name,
          day: days[i],
          value: val[i],
        });
      }
      setColumnData(colData);
    }
  };

  // components
  const customMonthStartEndFormat = (value) =>
    `All of Month: ${moment(value).startOf("month").format(monthFormat)}`;

  // actions
  useEffect(() => {
    countTotalInRooms(room1);
    countTotalInRooms(room2);
    countTotalInRooms(room3);
    countTotalInRoomsByDay(room1);
    countTotalInRoomsByDay(room2);
    countTotalInRoomsByDay(room3);
    setData(columnData);
  }, [mockData]);

  // page
  return (
    <>
      <Header title="Room management dashboard" />
      <Row style={{ justifyContent: "center" }}>
        <Col span={7} offset={1} className="owner-main">
          <div className="number">{totalRoom1}</div>
          <div className="tag tag-1">Room 1</div>
        </Col>
        <Col span={7} offset={1} className="owner-main">
          <div className="number">{totalRoom2}</div>
          <div className="tag tag-2">Room 2</div>
        </Col>
        <Col span={7} offset={1} className="owner-main">
          <div className="number">{totalRoom3}</div>
          <div className="tag tag-3">Room 3</div>
        </Col>
      </Row>
      <Row style={{ justifyContent: "space-between", alignItems: "end" }}>
        <Col
          span={8}
          className="range"
          style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}
        >
          Select Month :{" "}
          <DatePicker picker="month" format={customMonthStartEndFormat} />
        </Col>
        <Col offset={10} span={6}>
          <Button
            shape="round"
            size="large"
            icon={<VerticalAlignBottomOutlined />}
            style={{
              float: "right",
              backgroundColor: "rgba(216, 170, 129, 1)",
              color: "rgba(255, 255, 255, 1)",
            }}
          >
            Export
          </Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col
          xs={{ span: 24 }}
          xl={{ span: 24 }}
          xxl={{ span: 11, offset: 1 }}
          className="bar"
        >
          <div className="title-graph">Statics of Room</div>
          <div className="graph">
            <Column {...config} />
          </div>
        </Col>
        <Col
          xs={{ span: 24 }}
          xl={{ span: 24 }}
          xxl={{ span: 11, offset: 1 }}
          className="pie"
        >
          <div className="title-graph">Percentage</div>
          <div className="graph">
            <PieGraph
              data={pieData([totalRoom1, totalRoom2, totalRoom3])}
              colors={[
                "rgba(209, 186, 125, 1)",
                "rgba(32, 38, 58, 1)",
                "rgba(216, 170, 129, 1)",
              ]}
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default RoomDashboardPage;
