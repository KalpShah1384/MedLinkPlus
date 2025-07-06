import React from 'react';

const AdminDoctorProfile = ({ doctor, onClose }) => {
    if (!doctor) return null;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px' }}>
            <h1 style={{ color: '#1c7856', fontWeight: 'bold', fontSize: '2rem' }}>Admin Doctor Profile</h1>
            <p style={{ color: '#555', marginTop: '10px' }}>
                This is the admin view for doctor profiles.<br />
                You can add more details and editing functionality here.
            </p>
            <button onClick={onClose} style={{ marginTop: '20px', padding: '8px 16px', background: '#1c7856', color: 'white', border: 'none', borderRadius: '4px' }}>Close</button>
        </div>
    );
};

export default AdminDoctorProfile;
