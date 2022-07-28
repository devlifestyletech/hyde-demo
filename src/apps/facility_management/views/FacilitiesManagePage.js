import React from 'react';
import Header from '../../../components/Header';
import Facilities from '../components/Facilities';

export default function FacilitiesManagePage() {
  return (
    <>
      <Header title="Facilities" />
      <div className="content-container">
        <Facilities />
      </div>
    </>
  );
}
