import React from 'react';
import { useParams } from 'react-router-dom';

function MandateRegResponse() {
  const { mendateRegId } = useParams();
 

  return (
    <div>
      <h2>Mandate Registration Response</h2>
      <p>Mandate Registration ID: {mendateRegId}</p>
    </div>
  );
}

export default MandateRegResponse;
