import { LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Modal, Row, Switch } from 'antd'
import { doc, updateDoc } from 'firebase/firestore'
import React from 'react'
import { db } from '../../../utils/firebaseConfig'
import editIcon from '../assets/edit.svg'
import peopleIcon from '../assets/people.svg'
import './styles/index.css'

const FacilityCard = ({ facility, editPress }) => {

  const changeLockedState = (id, lockState) => {
    const documentRef = doc(db, 'facilities', id)
    Modal.confirm({
      title: lockState
        ? 'Are you sure you want to unlock this facility ?'
        : 'Are you sure you want to lock this facility ?',
      okButtonProps: { shape: 'round', size: 'large', type: 'primary' },
      cancelButtonProps: { shape: 'round', size: 'large' },
      icon: null,
      autoFocusButton: null,
      centered: true,
      onOk () {
        return new Promise((resolve, reject) => {
          updateDoc(documentRef, { locked: !lockState }).then(() => {
            resolve('Success')
          }).catch((error) => {
            console.error(error)
            reject('Error')
          })
        })
      },
    })
  }

  return (
    <div key={facility.id} className={'facility-card'}>
      <Card cover={
        <img src={facility.cover}
             alt={facility.name}
             className='facility-cover'
        />
      }
      >
        <Row>
          <Col span={22}>
            <div className='facility-title'>{facility.name}</div>
          </Col>
          <Col span={2}>
            <Button type='link'
                    className='facility-edit'
                    onClick={() => editPress(facility)}
            >
              <img src={editIcon} alt='edit' />
            </Button>
          </Col>
        </Row>
        <div className='facility-detail'>{facility.detail}</div>
        <div className='facility-limit'>
          <Row>
            <img src={peopleIcon} alt='people' />
            <div
              style={{ marginLeft: 5 }}>{` ${facility.max_users} Reserves/Slot`}</div>
          </Row>
        </div>
        <Divider size={'large'} />
        <div>
          <div>
            <div style={{ marginRight: 10, float: 'left' }}>
              <Switch checked={facility.locked}
                      checkedChildren={<LockOutlined />}
                      unCheckedChildren={<UnlockOutlined />}
                      onClick={() =>
                        changeLockedState(facility.id, facility.locked)
                      }
              />
            </div>
            <div style={{ fontSize: 18, float: 'left' }}>
              {facility.locked ? 'Lock' : 'Unlock'}
            </div>
          </div>
          <div style={{ float: 'right', textAlign: 'right' }}>
            {facility.locked ? (
              <div style={{ fontSize: 18, color: 'rgba(245, 27, 27, 1)' }}>
                Not Available
              </div>
            ) : (
              <div style={{ fontSize: 18, color: 'rgba(118, 175, 46, 1)' }}>
                Available
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default FacilityCard
