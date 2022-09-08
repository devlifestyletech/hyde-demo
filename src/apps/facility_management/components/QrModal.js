import {DownloadOutlined} from '@ant-design/icons';
import {Button, Col, Modal, Row} from 'antd';
import {format} from 'date-fns';
import QRCode from 'qrcode.react';
import React, {useRef} from 'react';
import {exportComponentAsJPEG} from 'react-component-export-image';
import QR_LOGO from '../assets/hyde_2.svg';
import HYDE_LOGO from '../assets/img/hyde3.svg';

export default function QrModal({data, visible, onCancel}) {
  const qrRef = useRef();
  return (
      <React.Fragment key={data?.id}>
        <Modal centered
               title='Reservation'
               visible={visible}
               onCancel={() => onCancel()}
               footer={null}
               width={400}
        >
          <div ref={qrRef}
               style={{
                 paddingBottom: 20,
               }}>
            <div style={{
              backgroundColor: '#20263A',
              textAlign: 'center',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}>
              <img src={HYDE_LOGO} alt='HYDE_LOGO' height={30}
                   style={{margin: 10}} />
            </div>
            <div style={{
              textAlign: 'center',
              backgroundColor: 'white',
              padding: 25,
            }}
            >
              <QRCode value={data?.id}
                      size={200}
                      imageSettings={{
                        src: QR_LOGO,
                        height: 40,
                        width: 40,
                        excavate: false,
                      }}
              />
            </div>
            <div style={{paddingLeft: 30, marginTop: 20}}>
              <Row>
                <Col span={12}>RoomName :</Col>
                <Col span={12}>{data?.facility_name}</Col>
              </Row>
              <Row>
                <Col span={12}>Topic :</Col>
                <Col span={12}>{data?.topic}</Col>
              </Row>
              <Row>
                <Col span={12}>Time :</Col>
                <Col span={12}>
                  {data
                      ? format(data?.startDateTime.toDate(), 'HH:mm')
                      : null} -{' '}
                  {data ? format(data?.endDateTime.toDate(), 'HH:mm') : null}
                </Col>
              </Row>
              <Row>
                <Col span={12}>Name - Surname :</Col>
                <Col span={12}>{data?.name}</Col>
              </Row>
              <Row>
                <Col span={12}>Telephone Number :</Col>
                <Col span={12}>{data?.tel}</Col>
              </Row>
              <Row>
                <Col span={12}>Number of People :</Col>
                <Col span={12}>{data?.user_amount}</Col>
              </Row>
              <Row>
                <Col span={12}>Note :</Col>
                <Col span={12}>{data?.note}</Col>
              </Row>
            </div>
          </div>
          <div style={{textAlign: 'center'}}>
            <Button
                shape='round'
                size='large'
                onClick={() =>
                    exportComponentAsJPEG(qrRef, {
                      fileName: data?.name + '-' + data?.id,
                    })
                }
                style={{width: 200, marginTop: 10}}
                icon={<DownloadOutlined />}
            >
              Save Image
            </Button>
          </div>
        </Modal>
      </React.Fragment>
  );
}
