import { Col, Dropdown, Menu, Row } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import paymentIcon from '../apps/assets/icons/payment.png'
import closeButton from '../apps/assets/icons/x.png'
import { encryptStorage } from '../utils/encryptStorage'
import { messaging, onMessage } from '../utils/firebaseConfig'
import notiIcon from './assets/bell.svg'
import notiEmpty from './assets/bell2.svg'
import './styles/header.css'
import { socket } from '../services/webSocketService'
import axios from 'axios'

let width = window.innerWidth

function Header({ title }) {
  let navigate = useNavigate()
  const session = encryptStorage.getItem('user_session')
  const headers = { headers: { Authorization: 'Bearer ' + session.jwt } }
  const [noti, setNoti] = useState(false)
  const [NotiFCMList, setNotiFCMList] = useState([])
  const { countNoticationChat, focuschat } = useSelector((state) => state.FixReportActionRedux)
  const dispatch = useDispatch()
  useEffect(async () => {
    let countNoticatonChat = countNoticationChat
    const countData = await getChat()
    countNoticatonChat = countData.countData
    socket.on('message', (newMessage) => {
      console.log('newMessageHeader:', newMessage)
    })
    socket.on('fetchHistory', async (dataRoom) => {
      const countData = await getChat()
      if (focuschat !== null && countData.data.includes(focuschat.data)) {
        countData.countData = countData.countData - 1
      }
      countNoticatonChat = countData.countData
      console.log('fetchHistory', dataRoom)
      if (countNoticatonChat > 0)
        dispatch({ type: 'CHANGE_COUNT_NOTICATION_CHAT', payload: countNoticatonChat })
    })
    socket.on('typing', (data) => {
      // console.log('typingX', data)
    })
    if (countNoticatonChat > 0)
      dispatch({ type: 'CHANGE_COUNT_NOTICATION_CHAT', payload: countNoticatonChat })
    onMessageListener()
    getAllnotFCMList()
  }, [noti])

  const getChat = async () => {
    let data = []
    let countData = 0
    try {
      const resultChat = await axios.get(
        process.env.REACT_APP_API_URL + '/chats?users_read=unread&_sort=time:desc',
        headers
      )

      resultChat?.data?.map((e) => {
        if (e.fixing_info === null) {
          if (data.length === 0) {
            countData = countData + 1
            data.push(e.room)
          } else {
            switch (data.includes(e.room)) {
              case false:
                data.push(e.room)
                countData = countData + 1
                break

              default:
                break
            }
          }
        }
      })
    } catch (error) {}
    const alldata = { countData, data }
    return alldata
  }
  const onMessageListener = () => {
    const myPromise = new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        resolve(payload)
      })
    })
    myPromise
      .then(async (value) => {
        await setNoti(!noti)
        const FCMtoken = await encryptStorage.getItem('fcm_token_data')
        if (FCMtoken !== null && FCMtoken !== undefined) {
          value.data.receriveTime = dayjs(new Date())
          value.data.readStatus = false
          FCMtoken.push(value.data)
          await encryptStorage.setItem('fcm_token_data', JSON.stringify(FCMtoken))
          await getAllnotFCMList()
        } else {
          value.data.receriveTime = dayjs(new Date())
          value.data.readStatus = false
          await encryptStorage.setItem('fcm_token_data', JSON.stringify([value.data]))
          await getAllnotFCMList()
        }
        return { status: true, ...value.data }
      })
      .catch((err) => {
        console.error(err)
        return { status: false, message: 'fcm forground error.' }
      })
  }

  const getAllnotFCMList = async () => {
    const FCMtoken = await encryptStorage.getItem('fcm_token_data')
    if (FCMtoken !== null && FCMtoken !== undefined) {
      let countFCMTotal = 0,
        countFixreportTotal = 0
      FCMtoken.map((e) => {
        if (e.readStatus === false) {
          switch (e.title) {
            case 'Payments':
              countFCMTotal = countFCMTotal + 1
              break
            case 'ServiceCenter':
              countFixreportTotal = countFixreportTotal + 1
              break
            default:
              break
          }
        }
      })
      dispatch({ type: 'CHANGE_FCM_COUNT', payload: countFCMTotal })
      dispatch({ type: 'CHANGE_FCM_COUNT_FIX_REPORT', payload: countFixreportTotal })

      FCMtoken.sort((a, b) => b.receriveTime.localeCompare(a.receriveTime))
      await setNotiFCMList(FCMtoken)
    }
  }

  const coverDateTostring = (date) => {
    const dataDate = dayjs(new Date()).diff(dayjs(date), 'Millisecond')
    let resultDate = null
    switch (true) {
      // more than a hour
      case dataDate > 3600000:
        let Hour = dayjs(new Date()).diff(dayjs(date), 'hours')
        resultDate = `${Hour} hour ago`
        break
      // more than a minutes
      case dataDate > 60000:
        let min = dayjs(new Date()).diff(dayjs(date), 'minute')
        resultDate = `${min} minutes ago`
        break
      // more than seconds
      case dataDate > 1000:
        let s = dayjs(new Date()).diff(dayjs(date), 's')
        resultDate = `${s} seconds ago`
        break
      default:
        resultDate = `a millisecond ago`
        break
    }
    return resultDate
  }
  return (
    <div className="heading">
      <div className="title" style={{ maxheight: 500, overflow: 'auto' }}>
        {title}
        <Dropdown
          style={{ maxheight: '500px', overflowY: ' scroll' }}
          overlay={
            <Menu
              onClick={async ({ item, key }) => {
                const FCMtoken = await encryptStorage.getItem('fcm_token_data')
                FCMtoken.sort((a, b) => b.receriveTime.localeCompare(a.receriveTime))
                let datas = FCMtoken[key]
                datas.readStatus = true
                FCMtoken[key] = datas
                await encryptStorage.setItem('fcm_token_data', JSON.stringify(FCMtoken))
                switch (item.props.title) {
                  case 'Payments':
                    let path = `/dashboard/payment/billing`

                    navigate(path, { replace: true })
                    await getAllnotFCMList()
                    break

                  default:
                    break
                }
              }}
            >
              {NotiFCMList.length > 0
                ? NotiFCMList.map((e, i) => {
                    return (
                      <Menu.Item
                        key={i}
                        title={e.title}
                        onClick={({ domEvent }) => {
                          domEvent.stopPropagation()
                        }}
                      >
                        <Row>
                          <Col span={22}>
                            <p style={{ color: '#D8AA81' }}>{`${coverDateTostring(
                              e.receriveTime
                            )}`}</p>
                          </Col>
                          <Col span={2}>
                            <img
                              id={i}
                              onClick={async (e) => {
                                const FCMtoken = await encryptStorage.getItem('fcm_token_data')
                                if (FCMtoken !== null && FCMtoken !== undefined) {
                                  FCMtoken.sort((a, b) =>
                                    b.receriveTime.localeCompare(a.receriveTime)
                                  )
                                  let data = FCMtoken.filter((ex, i) => {
                                    if (i !== parseInt(e.target.id)) {
                                      return e
                                    }
                                  })
                                  if (FCMtoken.length > 0) {
                                    await encryptStorage.removeItem('fcm_token_data')
                                    await encryptStorage.setItem(
                                      'fcm_token_data',
                                      JSON.stringify(data)
                                    )
                                    await getAllnotFCMList()
                                  }
                                }
                              }}
                              src={closeButton}
                              alt="closeButton"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col span={4}>
                            {(() => {
                              switch (e.title) {
                                case 'Payments':
                                  return (
                                    <img
                                      style={{
                                        backgroundColor: '#D1986D',
                                        borderRadius: '50%',
                                      }}
                                      width={50}
                                      height={50}
                                      src={paymentIcon}
                                      alt="payments"
                                    />
                                  )
                                  break
                                default:
                                  break
                              }
                            })()}
                            {/* <img src={notiEmpty} alt="notification" /> */}
                          </Col>
                          <Col span={18}>
                            <text
                              style={{
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {e.title}
                              {'\n'}
                            </text>
                            <text>{e.body}</text>
                          </Col>
                          <Col span={2}>
                            <Row>
                              {e.readStatus ? null : (
                                <div
                                  style={{
                                    // Icon content view
                                    backgroundColor: '#D8AA81',
                                    width: width * 0.01,
                                    height: width * 0.01,
                                    alignItems: 'center',
                                    borderRadius: 100,
                                    justifyContent: 'center',
                                    marginTop: 20,
                                  }}
                                />
                              )}
                            </Row>
                          </Col>
                        </Row>
                      </Menu.Item>
                    )
                  })
                : null}
            </Menu>
          }
          disabled={NotiFCMList.length > 0 ? false : true}
          trigger={['click']}
          onClick={() => setNoti(false)}
          placement="bottomRight"
          arrow
        >
          <img className="bell" src={noti === true ? notiIcon : notiEmpty} alt="notification" />
        </Dropdown>
      </div>
    </div>
  )
}

export default Header
