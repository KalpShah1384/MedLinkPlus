import React, { useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardCharts from '../../components/DashboardCharts';

const DoctorDashboard = () => {
    const { doctor, appointments, loading, error, dToken, backendUrl, setDoctor } = useContext(DoctorContext);
    const navigate = useNavigate();
    const [availLoading, setAvailLoading] = React.useState(false);
    const [toast, setToast] = React.useState({ open: false, message: '', color: '' });

    const showToast = (message, color) => {
        setToast({ open: true, message, color });
        setTimeout(() => setToast({ open: false, message: '', color: '' }), 2500);
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading dashboard...</div>;
    if (error) return <div style={{ padding: 40, color: 'red', textAlign: 'center' }}>Error: {error}</div>;
    if (!doctor) return <div style={{ padding: 40, textAlign: 'center' }}>No doctor data found.</div>;

    // Stats
    const totalAppointments = appointments.length;
    const completed = appointments.filter(a => a.status === 'completed' || a.isCompleted).length;
    const upcoming = appointments.filter(a => a.status === 'upcoming' && !a.isCompleted && !a.cancel).length;

    // Revenue: sum of fees for all completed appointments
    const revenue = appointments
        .filter(a => a.status === 'completed' || a.isCompleted)
        .reduce((sum, a) => sum + (Number(a.fees) || Number(doctor.fees) || 0), 0);

    // --- Insights Data for Charts ---
    // Group appointments by month for the last 6 months
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            name: d.toLocaleString('default', { month: 'short' }),
            year: d.getFullYear(),
            key: `${d.getFullYear()}-${d.getMonth()}`
        });
    }
    const barData = months.map(({ name, year, key }) => {
        const count = appointments.filter(a => {
            const date = new Date(a.date || a.time || a.dateTime || a.createdAt || 0);
            return date.getFullYear() === year && date.getMonth() === parseInt(key.split('-')[1]);
        }).length;
        return { name, Appointments: count };
    });

    // Pie chart: Completed vs Upcoming
    const pieStats = [
        { name: 'Completed', value: completed },
        { name: 'Upcoming', value: upcoming }
    ];

    // Button Handlers
    const handleViewAppointments = () => {
        navigate('/doctor-appointment');
    };
    const handleUpdateProfile = () => {
        navigate('/doctor-profile');
    };
    const handleToggleAvailability = async () => {
        if (!doctor._id) return;
        setAvailLoading(true);
        try {
            const res = await axios.post(
                `${backendUrl}/api/doctor/change-availability`,
                { docId: doctor._id },
                { headers: { dtoken: dToken } }
            );
            if (res.data && res.data.success) {
                // Prefer backend's returned doctor if present
                if (res.data.doctor && typeof res.data.doctor.available !== 'undefined') {
                    setDoctor(res.data.doctor);
                } else {
                    setDoctor({ ...doctor, available: !doctor.available });
                }
                showToast('Availability updated successfully!', '#1c7856');
            } else {
                showToast(res.data.message || 'Failed to update availability', '#d14343');
            }
        } catch (err) {
            alert('Error updating availability');
        } finally {
            setAvailLoading(false);
        }
    };

    return (
        <>
            {toast.open && (
                <div style={{
                    position: 'fixed',
                    top: 28,
                    right: 28,
                    background: toast.color,
                    color: '#fff',
                    padding: '14px 32px',
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 16,
                    zIndex: 9999,
                    boxShadow: '0 2px 12px #0003',
                    transition: 'opacity 0.2s',
                }}>
                    {toast.message}
                </div>
            )}
            <div style={{ padding: '32px', maxWidth: 900, margin: '0 auto' }}>
                {/* Welcome Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
                <img src={doctor.image || 'https://placehold.co/80x80'} alt={doctor.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #1c7856' }} />
                <div>
                    <h2 style={{ fontSize: 28, color: '#1c7856', margin: 0 }}>Welcome, {doctor.name}</h2>
                    <p style={{ color: '#555', margin: 0 }}>{doctor.speciality || doctor.specialization}</p>
                    <span style={{ fontSize: 13, color: doctor.available ? '#1c7856' : '#d14343' }}>
                        {doctor.available ? 'Available' : 'Not Available'}
                    </span>
                </div>
            </div>

            {/* Stats Section */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                <div style={{ flex: 1, background: '#eafaf1', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#1c7856' }}>Total Appointments</div>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>{totalAppointments}</div>
                </div>
                <div style={{ flex: 1, background: '#f0f4ff', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#155c43' }}>Completed</div>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>{completed}</div>
                </div>
                <div style={{ flex: 1, background: '#fff5e6', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#b26a00' }}>Upcoming</div>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>{upcoming}</div>
                </div>
                {/* Revenue Widget */}
                <div style={{ flex: 1, background: '#1c7856', borderRadius: 12, padding: 20, textAlign: 'center', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 22 }}>₹</span> Revenue
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, marginTop: 4 }}>
                        {revenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                    </div>
                </div>
            </div>

            {/* Statistics & Insights Charts */}
            <div style={{ marginBottom: 40 }}>
                <h3 style={{ fontSize: 22, color: '#1c7856', marginBottom: 16 }}>Statistics & Insights</h3>
                {appointments.length === 0 ? (
                    <div style={{ color: '#999', padding: 24, textAlign: 'center', background: '#f8f8f8', borderRadius: 12 }}>
                        No appointment data available to display charts.
                    </div>
                ) : (
                    <DashboardCharts barData={barData} pieStats={pieStats} />
                )}
            </div>

            {/* Today's Appointments */}
            <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 22, color: '#1c7856', marginBottom: 16 }}>Today's Appointments</h3>
                {appointments.filter(a => a.status === 'upcoming').length === 0 ? (
                    <p style={{ color: '#999' }}>No appointments for today.</p>
                ) : (
                    <>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                            <thead>
                                <tr style={{ background: '#eafaf1' }}>
                                    <th style={{ padding: 10, textAlign: 'left' }}>Patient</th>
                                    <th style={{ padding: 10, textAlign: 'left' }}>Time</th>
                                    <th style={{ padding: 10, textAlign: 'left' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    // Get all upcoming appointments, sort by soonest date/time, and take top 3
                                    const upcomingSorted = appointments
                                        .filter(a => a.status === 'upcoming')
                                        .sort((a, b) => {
                                            // Try to parse date/time from several fields
                                            const getDate = appt => new Date(appt.date || appt.time || appt.dateTime || appt.createdAt || 0);
                                            return getDate(a) - getDate(b);
                                        })
                                        .slice(0, 3);
                                    return upcomingSorted.map(appt => (
                                        <tr key={appt._id || appt.id}>
                                            <td style={{ padding: 10 }}>{appt.patientName || appt.patient || 'N/A'}</td>
                                            <td style={{ padding: 10 }}>{appt.time || appt.dateTime || 'N/A'}</td>
                                            <td style={{ padding: 10 }}>{appt.status ? appt.status.charAt(0).toUpperCase() + appt.status.slice(1) : 'N/A'}</td>
                                        </tr>
                                    ));
                                })()}

                            </tbody>
                        </table>
                        {appointments.filter(a => a.status === 'upcoming').length > 3 && (
                            <div style={{ marginTop: 12, textAlign: 'right' }}>
                                <button onClick={handleViewAppointments} style={{ background: 'none', color: '#1c7856', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}>
                                    View All Appointments
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 20 }}>
                <button
                    style={{ background: '#1c7856', color: '#fff', padding: '12px 24px', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
                    onClick={handleViewAppointments}
                >
                    View All Appointments
                </button>
                <button
                    style={{ background: '#f0f4ff', color: '#1c7856', padding: '12px 24px', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
                    onClick={handleUpdateProfile}
                >
                    Update Profile
                </button>
                <button
                    style={{ background: doctor.available ? '#fff5e6' : '#eafaf1', color: doctor.available ? '#b26a00' : '#1c7856', padding: '12px 24px', border: 'none', borderRadius: 6, fontWeight: 600, cursor: availLoading ? 'not-allowed' : 'pointer', opacity: availLoading ? 0.7 : 1 }}
                    onClick={handleToggleAvailability}
                    disabled={availLoading}
                >
                    {availLoading ? 'Updating...' : doctor.available ? 'Mark Unavailable' : 'Mark Available'}
                </button>
            </div>
        </div>
        </>
    );
}

export default DoctorDashboard;
