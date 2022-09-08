/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  ReportContainer,
  StyledContainer,
  ReportImg,
  StyledHeader,
  HeaderContainer,
  ProblemContainer,
  DetailContainer,
  NoContainer,
  ReportCenter,
  BoxReport,
} from './styles';
import { Spin, Button, Row, Col } from 'antd';
import ReportModal from '../../../fixing_report/service/reportModal';
import noImg from '../../../assets/images/noImg.jpg';
import axios from 'axios';
import { format, utcToZonedTime } from 'date-fns-tz';
import { encryptStorage } from '../../../../utils/encryptStorage';

export default function ReportDetail({ reportId }) {
  const session = encryptStorage.getItem('user_session');
  const [reportData, setReportData] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reportValue, setReportValue] = useState(null);
  const thTimeZone = 'Asia/Bangkok';
  const headers = { headers: { Authorization: 'Bearer ' + session.jwt } };
  const status = {
    Pending: '#E86A6B',
    Repairing: '#EEC84D',
    Success: '#79CA6C',
  };

  const fetchData = async () => {
    try {
      if (reportId) {
        await axios
          .get(
            process.env.REACT_APP_API_URL +
              '/fixing-reports?_where[id]=' +
              reportId,
            headers
          )
          .then((res) => {
            console.log('reporT', res.data);
            let date_show = format(
              utcToZonedTime(new Date(res.data[0].submission_date), thTimeZone),
              'dd MMM yyyy',
              { timeZone: 'Asia/Bangkok' }
            );
            let newReport = {
              key: res.data[0]._id,
              submission_date_show: date_show,
              address_number: res.data[0].address.address_number,
              owner: res.data[0].address.owner,
              ...res.data[0],
            };
            // console.log('newReport',newReport)
            setReportValue(newReport);
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
      <Col style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ReportImg
          src={
            reportData.image_pending[0]
              ? process.env.REACT_APP_API_URL + reportData.image_pending[0]?.url
              : noImg
          }
        ></ReportImg>

        <BoxReport>
          <ProblemContainer>{`Problem: ${reportData.problem} (${reportData.address.address_number})`}</ProblemContainer>
          <Row>
            <DetailContainer style={{ flex: 0.1 }}>Detail:</DetailContainer>
            <DetailContainer style={{ flex: 0.88 }}>
              {reportData.description.length > 120
                ? reportData.description.substring(0, 120) + '...'
                : reportData.description}
            </DetailContainer>
          </Row>
          <Row>
            <DetailContainer style={{ flex: 0.1 }}>Status:</DetailContainer>
            <DetailContainer
              style={{ flex: 0.88, color: status[reportData.status] }}
            >
              {reportData.status}
            </DetailContainer>
          </Row>
        </BoxReport>
        <ReportCenter>
          <Button
            style={{
              backgroundColor: '#D8AA81',
              position: 'absolute',
              bottom: '2vh',
              color: '#FFF',
              borderRadius: 20,
              borderColor: 'transparent',
              width: '80%',
            }}
            key="manage_report"
            onClick={() => {
              setVisible(true);
            }}
          >
            Manage Report
          </Button>
        </ReportCenter>
      </Col>
    ) : (
      <NoContainer>No Room Selected</NoContainer>
    );
  };

  const closeModal = () => {
    console.log('closeModal');
    setVisible(false);
  };

  const Loading = () => {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          paddingTop: '30vh',
        }}
      >
        <Spin size="large" />
        <p style={{ color: '#20263A', fontSize: 30 }}>Loading...</p>
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
      {visible ? (
        <ReportModal
          visible={visible}
          reportValue={reportValue}
          fetchData={fetchData}
          closeModal={closeModal}
        />
      ) : null}
    </>
  );
}
