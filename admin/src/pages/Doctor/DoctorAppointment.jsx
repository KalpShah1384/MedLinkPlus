import React, { useContext, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';

const badgeColors = {
    completed: { background: '#eafaf1', color: '#1c7856' },
    cancelled: { background: '#ffeaea', color: '#d14343' },
    upcoming: { background: '#fff5e6', color: '#b26a00' },
};

const DoctorAppointment = () => {
    const { appointments, loading, error, setAppointments } = useContext(DoctorContext);
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState({ open: false, message: '', color: '' });

    // Analytics
    const filtered = appointments.filter(appt =>
        (appt.userData?.name || appt.patientName || '')
            .toLowerCase()
            .includes(search.toLowerCase())
    );
    const total = filtered.length;
    const completed = filtered.filter(a => a.isCompleted).length;
    const upcoming = filtered.filter(a => !a.isCompleted && !a.cancel).length;
    const cancelled = filtered.filter(a => a.cancel).length;
    const revenue = filtered.filter(a => a.isCompleted).reduce((sum, a) => sum + (Number(a.amount) || 0), 0);

    // Toast
    const showToast = (message, color) => {
        setToast({ open: true, message, color });
        setTimeout(() => setToast({ open: false, message: '', color: '' }), 2500);
    };


// ...
    // Action handlers (with backend integration)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const dToken = localStorage.getItem('dToken');

    const handleMarkCompleted = async (appt) => {
        if (appt.isCompleted) return;
        try {
            const res = await axios.post(
                `${backendUrl}/api/doctor/mark-completed`,
                { appointmentId: appt._id },
                { headers: { dtoken: dToken } }
            );
            if (res.data && res.data.success) {
                setAppointments(prev => prev.map(a => a._id === appt._id ? { ...a, isCompleted: true } : a));
                showToast('Marked as completed!', '#1c7856');
            } else {
                showToast(res.data.message || 'Failed to mark completed', '#d14343');
            }
        } catch (err) {
            showToast('Error marking as completed', '#d14343');
        }
    };
    const handleCancel = appt => {
        if (appt.cancel) return;
        // TODO: Integrate backend cancel endpoint if available for doctor
        setAppointments(prev => prev.map(a => a._id === appt._id ? { ...a, cancel: true } : a));
        showToast('Appointment cancelled.', '#d14343');
    };
    const handleSendReminder = async (appt) => {
        try {
            const res = await axios.post(
                `${backendUrl}/api/doctor/send-reminder`,
                { appointmentId: appt._id },
                { headers: { dtoken: dToken } }
            );
            // Find next upcoming appointment for this patient
            const patientId = appt.userId;
            const upcomingAppts = appointments.filter(a => a.userId === patientId && !a.isCompleted && !a.cancel && (a._id !== appt._id));
            let nextDate = null;
            if (upcomingAppts.length > 0) {
                const next = upcomingAppts.reduce((min, curr) => {
                    const getDate = x => new Date(x.slotDate || x.date || 0);
                    return getDate(curr) < getDate(min) ? curr : min;
                }, upcomingAppts[0]);
                const raw = next.slotDate || next.date || '';
                let dt;
                if (/\d{1,2}_\d{1,2}_\d{4}/.test(raw)) {
                    const [d, m, y] = raw.split('_');
                    dt = new Date(`${y}-${m}-${d}`);
                } else if (!isNaN(Number(raw))) {
                    dt = new Date(Number(raw));
                } else {
                    dt = new Date(raw);
                }
                nextDate = isNaN(dt) ? null : dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
            }
            showToast(nextDate ? `Reminder sent! Next appointment: ${nextDate}` : 'Reminder sent!', '#155c43');
        } catch (err) {
            showToast('Error sending reminder', '#d14343');
        }
    };


    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading appointments...</div>;
    if (error) return <div style={{ padding: 40, color: 'red', textAlign: 'center' }}>Error: {error}</div>;

    // Responsive styles for mobile/desktop
    const responsiveStyles = `
        @media (max-width: 700px) {
            .doctor-appt-card { padding: 12px !important; }
            .doctor-appt-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
            .doctor-appt-header h2 { font-size: 22px !important; }
            .doctor-appt-search { width: 100% !important; font-size: 15px !important; }
            .doctor-appt-table-wrap { overflow-x: auto !important; }
            .doctor-appt-table { min-width: 600px !important; font-size: 14px !important; }
        }
    `;
    return (
        <>
            <style>{responsiveStyles}</style>
            <div style={{ padding: '32px 8px', maxWidth: 950, margin: '0 auto' }}>
                {/* Analytics Bar */}
                <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <div style={{ background: '#eafaf1', borderRadius: 12, padding: '18px 22px', minWidth: 120, flex: 1 }}>
                        <div style={{ color: '#155c43', fontWeight: 700, fontSize: 18 }}>{total}</div>
                        <div style={{ color: '#155c43', fontSize: 14 }}>Total</div>
                    </div>
                    <div style={{ background: '#f0f8ff', borderRadius: 12, padding: '18px 22px', minWidth: 120, flex: 1 }}>
                        <div style={{ color: '#1c7856', fontWeight: 700, fontSize: 18 }}>{completed}</div>
                        <div style={{ color: '#1c7856', fontSize: 14 }}>Completed</div>
                    </div>
                    <div style={{ background: '#fffbe7', borderRadius: 12, padding: '18px 22px', minWidth: 120, flex: 1 }}>
                        <div style={{ color: '#b26a00', fontWeight: 700, fontSize: 18 }}>{upcoming}</div>
                        <div style={{ color: '#b26a00', fontSize: 14 }}>Upcoming</div>
                    </div>
                    <div style={{ background: '#ffeaea', borderRadius: 12, padding: '18px 22px', minWidth: 120, flex: 1 }}>
                        <div style={{ color: '#d14343', fontWeight: 700, fontSize: 18 }}>{cancelled}</div>
                        <div style={{ color: '#d14343', fontSize: 14 }}>Cancelled</div>
                    </div>
                    <div style={{ background: '#fff', borderRadius: 12, padding: '18px 22px', minWidth: 120, flex: 1, border: '1.5px solid #eafaf1' }}>
                        <div style={{ color: '#155c43', fontWeight: 700, fontSize: 18 }}>₹{revenue.toLocaleString('en-IN')}</div>
                        <div style={{ color: '#155c43', fontSize: 14 }}>Revenue</div>
                    </div>
                </div>
                {/* Toast Notification */}
                {toast.open && (
                    <div style={{
                        position: 'fixed',
                        top: 30,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: toast.color || '#155c43',
                        color: '#fff',
                        padding: '14px 36px',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 16,
                        zIndex: 9999,
                        boxShadow: '0 2px 12px #0002',
                        letterSpacing: 0.5
                    }}>
                        {toast.message}
                    </div>
                )}
                <div className="doctor-appt-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 6px 32px #0002', padding: 32, marginBottom: 32 }}>
                    <div className="doctor-appt-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                        <h2 style={{ fontSize: 28, color: '#1c7856', fontWeight: 700, margin: 0 }}>All Appointments</h2>
                        <input
                            className="doctor-appt-search"
                            type="text"
                            placeholder="Search patient..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #bbb', fontSize: 15, width: 220, background: '#f7f7f7' }}
                        />
                    </div>
                    {filtered.length === 0 ? (
                        <div style={{ color: '#999', textAlign: 'center', padding: 32 }}>No appointments found.</div>
                    ) : (
                        <div className="doctor-appt-table-wrap" style={{ overflowX: 'auto' }}>
                            <table className="doctor-appt-table" style={{ width: '100%', borderCollapse: 'collapse', borderRadius: 12, overflow: 'hidden', fontSize: 15, minWidth: 700 }}>
                                <thead>
                                    <tr style={{ background: '#eafaf1', position: 'sticky', top: 0, zIndex: 1 }}>
                                        <th style={{ padding: 14, textAlign: 'left', fontWeight: 700 }}>Patient</th>
                                        <th style={{ padding: 14, textAlign: 'left', fontWeight: 700 }}>Contact</th>
                                        <th style={{ padding: 14, textAlign: 'left', fontWeight: 700 }}>Date</th>
                                        <th style={{ padding: 14, textAlign: 'left', fontWeight: 700 }}>Time</th>
                                        <th style={{ padding: 14, textAlign: 'left', fontWeight: 700 }}>Status</th>
                                        <th style={{ padding: 14, textAlign: 'left', fontWeight: 700 }}>Payment</th>
                                        <th style={{ padding: 14, textAlign: 'left', fontWeight: 700 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((appt, idx) => {
                                        const status = appt.isCompleted ? 'completed' : appt.cancel ? 'cancelled' : 'upcoming';
                                        return (
                                            <tr
                                                key={appt._id || appt.id}
                                                style={{ background: idx % 2 === 0 ? '#f8fcfa' : '#fff', transition: 'background 0.2s', cursor: 'pointer' }}
                                                onMouseOver={e => (e.currentTarget.style.background='#eafaf1')}
                                                onMouseOut={e => (e.currentTarget.style.background=idx%2===0?'#f8fcfa':'#fff')}
                                            >
                                                <td style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(appt.userData?.name || appt.patientName || 'P')}`}
                                                        alt={appt.userData?.name || appt.patientName || 'P'}
                                                        style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', border: '2px solid #eafaf1' }}
                                                    />
                                                    <span>{appt.userData?.name || appt.patientName || 'N/A'}</span>
                                                </td>
                                                {/* Contact */}
                                                <td style={{ padding: 14 }}>
                                                    <span style={{ color: '#444', fontSize: 14 }}>{appt.userData?.email || appt.userData?.phone || 'N/A'}</span>
                                                </td>
                                                {/* Date */}
                                                <td style={{ padding: 14 }}>
                                                    {(() => {
                                                        const raw = appt.slotDate || appt.date || '';
                                                        if (!raw) return 'N/A';
                                                        // Try to parse common formats
                                                        let dt;
                                                        if (/\d{1,2}_\d{1,2}_\d{4}/.test(raw)) {
                                                            // Format: 10_7_2025
                                                            const [d, m, y] = raw.split('_');
                                                            dt = new Date(`${y}-${m}-${d}`);
                                                        } else if (!isNaN(Number(raw))) {
                                                            // Timestamp
                                                            dt = new Date(Number(raw));
                                                        } else {
                                                            dt = new Date(raw);
                                                        }
                                                        if (isNaN(dt)) return raw;
                                                        return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
                                                    })()}
                                                </td>
                                                {/* Time */}
                                                <td style={{ padding: 14 }}>{appt.slotTime || appt.time || 'N/A'}</td>
                                                {/* Status */}
                                                <td style={{ padding: 14 }}>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        padding: '4px 14px',
                                                        borderRadius: 16,
                                                        fontWeight: 600,
                                                        fontSize: 14,
                                                        ...badgeColors[status]
                                                    }}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </span>
                                                </td>
                                                {/* Payment */}
                                                <td style={{ padding: 14 }}>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        padding: '4px 14px',
                                                        borderRadius: 16,
                                                        fontWeight: 600,
                                                        fontSize: 14,
                                                        background: appt.payment ? '#eafaf1' : '#ffeaea',
                                                        color: appt.payment ? '#1c7856' : '#d14343'
                                                    }}>
                                                        {appt.payment ? 'Paid' : 'Pending'}
                                                    </span>
                                                </td>
                                                {/* Actions */}
                                                <td style={{ padding: 14, minWidth: 200 }}>
                                                    <button
                                                        style={{ background: '#eafaf1', color: '#1c7856', border: 'none', borderRadius: 6, padding: '5px 10px', marginRight: 6, fontWeight: 600, cursor: status==='completed'?'not-allowed':'pointer', opacity: status==='completed'?0.6:1 }}
                                                        disabled={status==='completed'}
                                                        onClick={() => handleMarkCompleted(appt)}
                                                    >Mark Completed</button>
                                                    <button
                                                        style={{ background: '#ffeaea', color: '#d14343', border: 'none', borderRadius: 6, padding: '5px 10px', marginRight: 6, fontWeight: 600, cursor: status==='cancelled'?'not-allowed':'pointer', opacity: status==='cancelled'?0.6:1 }}
                                                        disabled={status==='cancelled'}
                                                        onClick={() => handleCancel(appt)}
                                                    >Cancel</button>
                                                    <button
                                                        style={{ background: '#f0f4ff', color: '#155c43', border: 'none', borderRadius: 6, padding: '5px 10px', fontWeight: 600, cursor: 'pointer' }}
                                                        onClick={() => handleSendReminder(appt)}
                                                    >Send Reminder</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default DoctorAppointment;
