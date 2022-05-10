/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  ReportContainer,
  StyledContainer,
  StyledHeader,
  HeaderContainer,
  NoContainer,
} from "./styles";
import { Spin, Image } from "antd";
import noImg from "../../../assets/images/noImg.jpg";
import axios from "axios";
import { encryptStorage } from "../../../../utils/encryptStorage";
const session = encryptStorage.getItem("user_session");

function ReportDetail({ reportId }) {
  const [reportData, setReportData] = useState();
  const [loading, setLoading] = useState(false);
  const headers = { headers: { Authorization: "Bearer " + session.jwt } };

  const fetchData = async () => {
    try {
      if (reportId) {
        await axios
          .get(
            process.env.REACT_APP_API_URL +
              "/fixing-reports?_where[id]=" +
              reportId,
            headers
          )
          .then((res) => {
            console.log("reportData", res.data);
            setReportData(res.data[0]);
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

  const ShowReport = () => {
    return reportData ? (
      <Image
        style={{
          width: "100%",
          height: "20vwh",
          alignSelf: "center",
        }}
        src={
          reportData.image_pending[0]
            ? process.env.REACT_APP_API_URL + reportData.image_pending[0].url
            : noImg
        }
      />
    ) : (
      <NoContainer>No Room Selected</NoContainer>
    );
  };

  const Loading = () => {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          textAlign: "center",
          paddingTop: "30vh",
        }}
      >
        <Spin size="large" />
        <p style={{ color: "#20263A", fontSize: 30 }}>Loading...</p>
      </div>
    );
  };

  useEffect(() => {
    fetchData();
    setLoading(true);
    setTimeout(() => {
      if (!reportId) setLoading(false);
    }, 2000);
  }, [reportId]);

  return (
    <>
      <ReportContainer>
        <StyledHeader>
          <HeaderContainer>Details</HeaderContainer>
        </StyledHeader>
        <StyledContainer>
          {loading ? <Loading /> : <ShowReport />}
        </StyledContainer>
      </ReportContainer>
    </>
  );
}
export default ReportDetail;
