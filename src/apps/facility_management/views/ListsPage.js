import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { Input, Select } from 'antd';
import ReservationTable from '../components/ReservationTable';

import { db } from '../../../utils/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

// constraint
const { Option } = Select;

export default function ListsPage() {
  const [facilities, setFacilities] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState(
    'aPntKgd7dqVmG6qe2mk9'
  );
  const [search, setSearch] = useState('');
  const [reservationSearch, setReservationSearch] = useState([]);

  useEffect(() => {
    const queryFacilities = query(collection(db, 'facilities'));
    const queryReservations = query(
      collection(db, 'reservations'),
      where('facility_id', '==', selectedFacilities)
    );

    setLoading(true);
    (async () => {
      await onSnapshot(queryFacilities, (QuerySnapshot) => {
        let facility = [];
        QuerySnapshot.forEach((doc) => {
          let data = { id: doc.id, ...doc.data() };
          facility.push(data);
        });
        setFacilities(facility);
      });
      await onSnapshot(queryReservations, (QuerySnapshot) => {
        let reservation = [];
        QuerySnapshot.forEach((doc) => {
          let data = { id: doc.id, ...doc.data() };
          reservation.push(data);
        });
        setReservations(reservation);
        setLoading(false);
      });
    })();
  }, [selectedFacilities]);

  const handleSearch = (value) => {
    setSearch(value);
    setReservationSearch(
      reservations.filter((reservation) => {
        return reservation.room_number
          .toLowerCase()
          .includes(value.toLowerCase());
      })
    );
  };

  return (
    <>
      <Header title="Booking Lists" />
      <div className="top-container">
        <Select
          style={{ width: 400, float: 'left' }}
          size="large"
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
          placeholder="Search by room number"
          style={{ width: 400, borderRadius: 20, height: 40, marginLeft: 10 }}
          enterButton
          allowClear
          onSearch={handleSearch}
        />
      </div>
      <div className="content-container">
        <ReservationTable
          loading={loading}
          data={search !== '' ? reservationSearch : reservations}
          facility={facilities}
        />
      </div>
    </>
  );
}
