import React, { useContext, useState, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';

function getInitials(name) {
    if (!name) return 'DR';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const DoctorProfile = () => {
    const { doctor, loading, error, setDoctor, backendUrl, dToken } = useContext(DoctorContext);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', color: '' });

    useEffect(() => {
        if (doctor) {
            setForm({
                name: doctor.name || '',
                email: doctor.email || '',
                specialization: doctor.speciality || doctor.specialization || '',
                degree: doctor.degree || '',
                experience: doctor.experience || '',
                about: doctor.about || '',
                address: typeof doctor.address === 'string' ? doctor.address : (doctor.address?.full || ''),
                fees: doctor.fees || '',
                image: doctor.image || '',
                available: doctor.available,
            });
        }
    }, [doctor]);

    const showToast = (message, color = '#4BB543') => {
        setToast({ open: true, message, color });
        setTimeout(() => setToast({ open: false, message: '', color: '' }), 2500);
    };

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = () => setEditMode(true);

    const handleCancel = () => {
        setEditMode(false);
        if (doctor) {
            setForm({
                name: doctor.name || '',
                email: doctor.email || '',
                specialization: doctor.speciality || doctor.specialization || '',
                degree: doctor.degree || '',
                experience: doctor.experience || '',
                about: doctor.about || '',
                address: typeof doctor.address === 'string' ? doctor.address : (doctor.address?.full || ''),
                fees: doctor.fees || '',
                image: doctor.image || '',
                available: doctor.available,
            });
        }
    };

    const handleSave = async e => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.post(
                `${backendUrl}/api/doctor/update-profile`,
                {
                    docId: doctor._id,
                    name: form.name,
                    email: form.email,
                    speciality: form.specialization,
                    degree: form.degree,
                    experience: form.experience,
                    about: form.about,
                    address: form.address,
                    fees: form.fees,
                    image: form.image,
                    available: form.available,
                },
                { headers: { dtoken: dToken } }
            );
            if (res.data && res.data.success) {
                setDoctor(res.data.doctor);
                setEditMode(false);
                showToast('Profile updated successfully!');
            } else {
                showToast(res.data.message || 'Failed to update profile', '#E63946');
            }
        } catch (err) {
            showToast('Error updating profile', '#E63946');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={styles.centerText}>Loading profile...</div>;
    if (error) return <div style={{ ...styles.centerText, color: 'red' }}>Error: {error}</div>;
    if (!doctor) return <div style={styles.centerText}>No doctor data found.</div>;

    return (
        <>
            {toast.open && (
                <div style={{ ...styles.toast, background: toast.color }}>{toast.message}</div>
            )}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={styles.card}>
                        <div style={styles.header}>
                            <div style={styles.avatar}>
                                {form.image ? (
                                    <img src={form.image} alt="profile" style={styles.avatarImage} />
                                ) : (
                                    <span style={styles.avatarInitials}>{getInitials(form.name)}</span>
                                )}
                            </div>
                            <div style={styles.details}>
                                <h2 style={styles.name}>{form.name}</h2>
                                <p style={styles.role}>{form.specialization}</p>
                                <p style={styles.email}>{form.email}</p>
                                <span style={{
                                    ...styles.statusBadge,
                                    background: form.available ? '#d1f7d6' : '#ffe5e5',
                                    color: form.available ? '#2e7d32' : '#d32f2f'
                                }}>
                                    {form.available ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSave} style={styles.form}>
                            {[
                                { label: 'Name', name: 'name' },
                                { label: 'Email', name: 'email', type: 'email' },
                                { label: 'Specialization', name: 'specialization' },
                                { label: 'Degree', name: 'degree' },
                                { label: 'Experience', name: 'experience' },
                                { label: 'Fees', name: 'fees', type: 'number' },
                            ].map(({ label, name, type = 'text' }) => (
                                <div key={name} style={styles.inputGroup}>
                                    <label style={styles.label}>{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                        style={editMode ? styles.input : styles.disabledInput}
                                    />
                                </div>
                            ))}

                            {["about", "address"].map((field) => (
                                <div key={field} style={styles.inputGroup}>
                                    <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <textarea
                                        name={field}
                                        rows={3}
                                        value={form[field]}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                        style={editMode ? styles.textarea : styles.disabledInput}
                                    />
                                </div>
                            ))}

                            {editMode && (
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Profile Image (URL)</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={form.image}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />
                                </div>
                            )}

                            <div style={styles.buttonRow}>
                                {!editMode ? (
                                    <button type="button" onClick={handleEdit} style={styles.primaryButton}>
                                        Edit
                                    </button>
                                ) : (
                                    <>
                                        <button type="button" onClick={handleCancel} style={styles.secondaryButton}>
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={saving} style={styles.primaryButton}>
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorProfile;

// Styles
const styles = {
    pageWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '30px 16px',
    },
    centerText: {
        textAlign: 'center',
        padding: '60px 20px',
        fontSize: 18,
    },
    container: {
        width: '100%',
        maxWidth: 960,
        display: 'flex',
        justifyContent: 'center',
    },
    card: {
        flex: 1,
        borderRadius: 16,
        background: '#fff',
        boxShadow: '0 6px 30px rgba(0,0,0,0.05)',
        padding: 32,
    },
    header: {
        display: 'flex',
        gap: 24,
        marginBottom: 28,
        flexWrap: 'wrap',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: '#f2f2f2',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 36,
        fontWeight: 700,
        color: '#4CAF50',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '50%',
    },
    avatarInitials: {
        fontSize: 32,
    },
    details: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    name: {
        fontSize: 26,
        fontWeight: 700,
        margin: 0,
        color: '#222',
    },
    role: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#999',
    },
    statusBadge: {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 600,
        marginTop: 8,
    },
    form: {
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        display: 'block',
        fontWeight: 600,
        marginBottom: 6,
        color: '#333',
        fontSize: 15,
    },
    input: {
        width: '100%',
        padding: 10,
        borderRadius: 6,
        border: '1px solid #ccc',
        fontSize: 15,
    },
    disabledInput: {
        width: '100%',
        padding: 10,
        borderRadius: 6,
        border: '1px solid #e0e0e0',
        background: '#f9f9f9',
        fontSize: 15,
        color: '#999',
    },
    textarea: {
        width: '100%',
        padding: 10,
        borderRadius: 6,
        border: '1px solid #ccc',
        fontSize: 15,
        resize: 'vertical',
    },
    buttonRow: {
        display: 'flex',
        gap: 12,
        justifyContent: 'flex-end',
        marginTop: 24,
    },
    primaryButton: {
        padding: '10px 24px',
        border: 'none',
        borderRadius: 6,
        background: '#4CAF50',
        color: '#fff',
        fontWeight: 600,
        fontSize: 15,
        cursor: 'pointer',
    },
    secondaryButton: {
        padding: '10px 24px',
        border: '1px solid #ccc',
        borderRadius: 6,
        background: '#f9f9f9',
        color: '#333',
        fontWeight: 600,
        fontSize: 15,
        cursor: 'pointer',
    },
    toast: {
        position: 'fixed',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#fff',
        padding: '10px 24px',
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 16,
        zIndex: 9999,
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    },
};
