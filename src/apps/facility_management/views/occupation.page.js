import React from 'react';
import Header from '../../../components/header';
import Occupations from '../components/Occupations';

export default function OccupationPage() {
  return (
    <div>
      <Header title="Occupation" />
      <div className="-content-container">
        <Occupations />
      </div>
    </div>
  );
}
