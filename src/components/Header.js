import dayjs from 'dayjs'
import 'dayjs/locale/th'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { encryptStorage } from '../utils/encryptStorage'
import { messaging, onMessage } from '../utils/firebaseConfig'
import './styles/header.css'
import { socket } from '../services/webSocketService'
import axios from 'axios'

let width = window.innerWidth

function Header({ title }) {
  const session = encryptStorage.getItem('user_session')
  const headers = { headers: { Authorization: 'Bearer ' + session.jwt } }
  const [noti, setNoti] = useState(false)
  const [NotiFCMList, setNotiFCMList] = useState([])
  const { countAll, countPending, countRepairing, countSuccess } = useSelector(
    (state) => state.ChatFixReportActionRedux
  )
  const { countNotificationChat, focusChat } = useSelector((state) => state.FixReportActionRedux)
  const dispatch = useDispatch()
  useEffect(async () => {
    let countNotiChat = countNotificationChat
    let countFixChat = countAll
    const countData = await getChat()
    countNotiChat = countData.countDataChat
    countFixChat = countData.countFixChatAll
    socket.on('message', (newMessage) => {
      console.log('newMessageHeader:', newMessage)
    })
    socket.on('fetchHistory', async (dataRoom) => {
      const countData = await getChat()
      if (focusChat !== null && countData.dataChat.includes(focusChat.data)) {
        countData.countDataChat = countData.countDataChat - 1
      }
      countNotiChat = countData.countDataChat
      countFixChat = countData.countFixChatAll
      console.log('fetchHistory', dataRoom)
      if (countFixChat > 0) dispatch({ type: 'CHANGE_COUNT_ALL', payload: countFixChat })
      if (countNotiChat > 0)
        dispatch({ type: 'CHANGE_COUNT_NOTICATION_CHAT', payload: countNotiChat })
    })
    socket.on('typing', (data) => {
      // console.log('typingX', data)
    })
    if (countFixChat > 0) dispatch({ type: 'CHANGE_COUNT_ALL', payload: countFixChat })
    if (countNotiChat > 0)
      dispatch({ type: 'CHANGE_COUNT_NOTICATION_CHAT', payload: countNotiChat })
    onMessageListener()
    getAllnotFCMList()
  }, [noti])

  const getChat = async () => {
    const alldata = {
      countDataChat: 0,
      dataChat: [],
      countFixChatPending: 0,
      dataFixChatPending: [],
      countFixChatRepairing: 0,
      dataFixChatRepairing: [],
      countFixChatSuccess: 0,
      dataFixChatSuccess: [],
      countFixChatAll: 0,
    }
    try {
      const resultChat = await axios.get(
        process.env.REACT_APP_API_URL + '/chats?users_read=unread&_sort=time:desc',
        headers
      )

      resultChat?.data?.map((e) => {
        if (e.fixing_info === null && e.sender_id !== session?.user?._id) {
          if (alldata.dataChat.length === 0) {
            alldata.countDataChat = alldata.countDataChat + 1
            alldata.dataChat.push(e.room)
          } else {
            switch (alldata.dataChat.includes(e.room)) {
              case false:
                alldata.dataChat.push(e.room)
                alldata.countDataChat = alldata.countDataChat + 1
                break

              default:
                break
            }
          }
        } else if (e.fixing_info !== null && e.sender_id !== session?.user?._id) {
          switch (e.fixing_info.status) {
            case 'Pending':
              //  alldata.countFixChatPending=countPending
              if (alldata.dataFixChatPending.length === 0) {
                alldata.countFixChatPending = alldata.countFixChatPending + 1
                alldata.dataFixChatPending.push(e.room)
              } else {
                switch (alldata.dataFixChatPending.includes(e.room)) {
                  case false:
                    alldata.dataFixChatPending.push(e.room)
                    alldata.countFixChatPending = alldata.countFixChatPending + 1
                    break

                  default:
                    break
                }
              }
              break
            case 'Repairing':
              if (alldata.dataFixChatRepairing.length === 0) {
                alldata.countFixChatRepairing = alldata.countFixChatRepairing + 1
                alldata.dataFixChatRepairing.push(e.room)
              } else {
                switch (alldata.dataFixChatRepairing.includes(e.room)) {
                  case false:
                    alldata.dataFixChatRepairing.push(e.room)
                    alldata.countFixChatRepairing = alldata.countFixChatRepairing + 1
                    break

                  default:
                    break
                }
              }
              break
            case 'Success':
              if (alldata.dataFixChatSuccess.length === 0) {
                alldata.countFixChatSuccess = alldata.countFixChatSuccess + 1
                alldata.dataFixChatSuccess.push(e.room)
              } else {
                switch (alldata.dataFixChatSuccess.includes(e.room)) {
                  case false:
                    alldata.dataFixChatSuccess.push(e.room)
                    alldata.countFixChatSuccess = alldata.countFixChatSuccess + 1
                    break

                  default:
                    break
                }
              }

              break

            default:
              break
          }
        }
      })
      if (alldata.countFixChatPending > 0) {
        dispatch({ type: 'CHANGE_COUNT_PENDING', payload: alldata.countFixChatPending })
      }
      if (alldata.countFixChatRepairing > 0) {
        dispatch({ type: 'CHANGE_COUNT_REPAIRING', payload: alldata.countFixChatRepairing })
      }
      if (alldata.countFixChatSuccess > 0) {
        dispatch({ type: 'CHANGE_COUNT_SUCCESS', payload: alldata.countFixChatSuccess })
      }
      const { countFixChatPending, countFixChatRepairing, countFixChatSuccess } = alldata
      alldata.countFixChatAll = countFixChatPending + countFixChatRepairing + countFixChatSuccess
    } catch (error) {}

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
      </div>
    </div>
  )
}

export default Header
