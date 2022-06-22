import React from 'react';
import Header from '../../../components/header';
import Facilities from '../components/Facilities';

export default function FacilitiesPage() {
  return (
    <>
      <Header title="Facilities" />
      <div className="content-container">
        <Facilities />
      </div>
    </>
  );
}
