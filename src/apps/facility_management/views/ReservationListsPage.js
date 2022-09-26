import { Button, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../components/Header';
import CreateReservationModal from '../components/CreateReservationModal';
import Loading from '../components/Loading';
import ReservationTable from '../components/ReservationsTable';
import { getAllFacilitiesData, getAllReserves } from '../services';
import './styles/main.css';

export default function ReservationListsPage() {
  const [createReserveModalVisible, setCreateReserveModalVisible] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  
  const { reserves, facilities } = useSelector((state) => state.FacilitiesManagementReducer);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (facilities) {
      setSelectedFacility(facilities[0].id);
    }
  }, [facilities]);
  
  useEffect(() => {
    dispatch(getAllReserves());
    dispatch(getAllFacilitiesData());
  }, []);
  
  console.log(selectedFacility);
  
  return (
      <>
        <Header title='Reservation Lists' />
        <div className='content-container'>
          <Tabs onTabClick={(facilityId) => setSelectedFacility(facilityId)}
                tabBarExtraContent={
                  <Button type={'primary'} size={'large'} shape={'round'}
                          onClick={() => setCreateReserveModalVisible((prevState) => !prevState)}
                  >
                    Create Reservation
                  </Button>
                }
          >
            {facilities ? (
                facilities.map((facility) => (
                    <Tabs.TabPane tab={facility.name} key={facility.id}>
                      <ReservationTable facilityId={facility.id} />
                    </Tabs.TabPane>
                ))
            ) : (
                 <Loading />
             )}
          </Tabs>
        </div>
        <CreateReservationModal visible={createReserveModalVisible}
                                id={selectedFacility}
                                onExit={
                                  () => setCreateReserveModalVisible(
                                      prevState => !prevState)
                                }
        />
      </>
  );
}
