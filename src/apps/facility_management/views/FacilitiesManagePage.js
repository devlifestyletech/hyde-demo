import { Space, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../../components/Header'
import EditFacilityModal from '../components/EditFacilityModal'
import FacilityCard from '../components/FacilityCard'
import { getAllFacilitiesData } from '../services/functions'

export default function FacilitiesManagePage () {
  const { facilities } = useSelector(
    (state) => state.FacilitiesManagementReducer)
  const dispatch = useDispatch()

  const [selectedFacility, setSelectedFacility] = useState(null)
  const [editModalVisible, setEditModalVisible] = useState(false)

  const handleEdit = async (v) => {
    await setSelectedFacility(v)
    await setEditModalVisible(true)
  }

  useEffect(() => {
    (async () => {
      await dispatch(getAllFacilitiesData())
    })()
  }, [])

  console.log(selectedFacility, editModalVisible)

  return (
    <>
      <Header title='Facilities' />
      <div className='content-container'>
        <Space wrap>
          {facilities
            ? facilities.map(
              item => <FacilityCard key={item.id} facility={item}
                                    editPress={
                                      (v) => handleEdit(v)
                                    } />,
            )
            : <div>
              <Spin />
              <p>Loading...</p>
            </div>
          }
        </Space>
      </div>
      <EditFacilityModal visible={editModalVisible}
                         value={selectedFacility}
                         onExit={() => setEditModalVisible(false)}
      />
    </>
  )
}
