import {PlusOutlined} from '@ant-design/icons';
import {Button, Select, Spin} from 'antd';
import {collection, onSnapshot, query, where} from 'firebase/firestore';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../components/Header';
import addressService from '../../../services/addressServices';
import {db} from '../../../utils/firebaseConfig';
import CreateReservation from '../components/CreateReservation';

//components import
import SchedularComponent from '../components/Reservationschedular';
import './styles/main.css';

const {Option} = Select;

export default function CalendarPage() {
  const isFacilitiesMounted = useRef(false);
  const isReservationsMounted = useRef(false);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState(
      'aPntKgd7dqVmG6qe2mk9',
  );
  const [addresses, setAddresses] = useState();

  let selectedFacility = facilities.find(
      (facility) => facility.id === selectedFacilities,
  );
  let timeSlot = reservations.map(({startDateTime, endDateTime}) => ({
    start: startDateTime.toDate(),
    end: endDateTime.toDate(),
  }));

  useEffect(() => {
    isFacilitiesMounted.current = true;
    isReservationsMounted.current = true;
    const queryFacilities = query(collection(db, 'facilities'));
    const queryReservations = query(
        collection(db, 'reservations'),
        where('facility_id', '==', selectedFacilities),
    );
    setLoading(true);
    (async () => {
      const {data} = await addressService.getAllAddresses();
      if (data) {
        setAddresses(data);
      }
      await onSnapshot(queryFacilities, (QuerySnapshot) => {
        let facility = [];
        QuerySnapshot.forEach((doc) => {
          let data = {id: doc.id, ...doc.data()};
          facility.push(data);
        });
        if (isFacilitiesMounted) {
          setFacilities(facility);
        }
      });
      await onSnapshot(queryReservations, (QuerySnapshot) => {
        let reservation = [];
        QuerySnapshot.forEach((doc) => {
          let data = {id: doc.id, ...doc.data()};
          reservation.push(data);
        });
        if (isReservationsMounted) {
          setReservations(reservation);
          setLoading(false);
        }
      });
    })();
    return () => {
      isFacilitiesMounted.current = false;
      isReservationsMounted.current = false;
    };
  }, [selectedFacilities]);

  return (
      <>
        <Header title='Reservation Calendar' />
        <div className='top-container'>
          <Select
              style={{width: 400, float: 'left'}}
              size='large'
              defaultValue={selectedFacilities}
              onChange={setSelectedFacilities}
          >
            {!facilities.length
                ? null
                : facilities.map((facility, idx) => (
                    <Option key={idx} value={facility.id}>
                      Room Name : {facility.name}
                    </Option>
                ))}
          </Select>
          <Button
              icon={<PlusOutlined />}
              type='primary'
              size='large'
              shape='round'
              style={{float: 'right'}}
              onClick={() => setCreateModalVisible(true)}
          >
            Create Reservation
          </Button>
        </div>
        <div className='content-container'>
          {loading ? (
              <div style={{textAlign: 'center', margin: 80}}>
                <Spin />
                <p>Please wait...</p>
              </div>
          ) : (
              <SchedularComponent reserves={reservations} />
          )}
          <CreateReservation
              visible={createModalVisible}
              onCancel={() => setCreateModalVisible(false)}
              facility={selectedFacility}
              time_slot={timeSlot}
              addresses={addresses}
          />
        </div>
      </>
  );
}
