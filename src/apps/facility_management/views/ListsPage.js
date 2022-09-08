import {PlusOutlined} from '@ant-design/icons';
import {Button, Input, Select} from 'antd';
import {collection, onSnapshot, query, where} from 'firebase/firestore';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../components/Header';
import addressService from '../../../services/addressServices';

import {db} from '../../../utils/firebaseConfig';
import CreateReservation from '../components/CreateReservation';
import ReservationTable from '../components/ReservationTable';
import './styles/main.css';
// constraint
const {Option} = Select;

export default function ListsPage() {
  const [facilities, setFacilities] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState(
      'aPntKgd7dqVmG6qe2mk9',
  );
  const [search, setSearch] = useState('');
  const [reservationSearch, setReservationSearch] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [addresses, setAddresses] = useState();
  let selectedFacility = facilities.find(
      (facility) => facility.id === selectedFacilities,
  );
  let timeSlot = reservations.map(({startDateTime, endDateTime}) => ({
    start: startDateTime.toDate(),
    end: endDateTime.toDate(),
  }));
  const isFacilitiesMounted = useRef(false);
  const isReservationsMounted = useRef(false);

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
      await onSnapshot(queryFacilities, (QuerySnapshot) => {
        let facility = [];
        QuerySnapshot.forEach((doc) => {
          let data = {id: doc.id, ...doc.data()};
          facility.push(data);
        });
        setFacilities(facility);
      });
      await onSnapshot(queryReservations, (QuerySnapshot) => {
        let reservation = [];
        QuerySnapshot.forEach((doc, idx) => {
          let data = {id: doc.id, idx: idx + 1, ...doc.data()};
          reservation.push(data);
        });
        setReservations(reservation);
        setLoading(false);
      });
    })();
    (async () => {
      const {data} = await addressService.getAllAddresses();
      if (data) {
        setAddresses(data);
      }
    })();
    return () => {
      isFacilitiesMounted.current = false;
      isReservationsMounted.current = false;
    };
  }, [selectedFacilities]);

  const handleSearch = (value) => {
    setSearch(value);
    setReservationSearch(
        reservations.filter((reservation) => {
          return reservation.room_number.toLowerCase()
              .includes(value.toLowerCase());
        }),
    );
  };

  return (
      <>
        <Header title='Reservation Lists' />
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
          <Input.Search
              placeholder='Search by room number'
              style={{width: 400, borderRadius: 20, height: 40, marginLeft: 10}}
              enterButton
              allowClear
              onSearch={handleSearch}
          />
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
          <ReservationTable
              loading={loading}
              data={search !== '' ? reservationSearch : reservations}
              facility={facilities}
          />
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
