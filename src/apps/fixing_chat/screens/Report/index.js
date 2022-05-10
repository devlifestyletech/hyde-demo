/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { ReportContainer, StyledContainer, StyledHeader } from "./styles";
import { Spin } from "antd";

import axios from "axios";
import { encryptStorage } from "../../../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

function ReportDetail(props) {
  const [room, setRoom] = useState("");
  const [receiver, setReceiver] = useState();
  const [loading, setLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const sender_name = session.user.fullname;
  const headers = { headers: { Authorization: "Bearer " + session.jwt } };

  const fetchData = async () => {
    try {
      if (room) {
        await axios
          .get(
            process.env.REACT_APP_API_URL + "/chats?_where[room]=" + room,
            headers
          )
          .then((res) => {
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const Loading = () => {
    return (
      <div
        style={{
          // width: "80vw",
          height: "100vh",
          textAlign: "center",
          paddingTop: 300,
        }}
      >
        <Spin size="large" />
        <p style={{ color: "#20263A", fontSize: 30 }}>Loading...</p>
      </div>
    );
  };

  return (
    <>
      <ReportContainer>
      <StyledHeader></StyledHeader>
        <StyledContainer></StyledContainer>
      </ReportContainer>
    </>
  );
}
export default ReportDetail;
