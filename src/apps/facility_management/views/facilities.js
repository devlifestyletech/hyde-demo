import React from 'react';
import Header from '../../../components/header';
import Facilities from '../components/Facilities';

export default function FacilitiesManage() {
  return (
    <>
      <Header title="Facilities" />
      <div className="content-container">
        <Facilities />
      </div>
    </>
  );
}
