import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const DebugAppointments = () => {
  const { appointments } = useContext(AdminContext);
  const { calculateAge } = useContext(AppContext);

  return (
    <div style={{ padding: 16 }}>
      <h2>Debug Appointments Data</h2>
      <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 8, maxHeight: 400, overflow: 'auto' }}>
        {JSON.stringify(appointments, null, 2)}
      </pre>
      <h3>Calculated Ages:</h3>
      <ul>
        {appointments.map((item, idx) => (
          <li key={idx}>
            Name: {item.userData?.name || 'Unknown'} | DOB: {item.userData?.dob || 'N/A'} | Age: {item.userData?.dob ? calculateAge(item.userData.dob) : 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DebugAppointments;
