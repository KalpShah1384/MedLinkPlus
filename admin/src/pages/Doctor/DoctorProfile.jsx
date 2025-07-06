import React, { useContext, useState } from 'react';
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
    const [toast, setToast] = useState({ open: false, message: '', color: '' });
    const showToast = (message, color) => {
        setToast({ open: true, message, color });
        setTimeout(() => setToast({ open: false, message: '', color: '' }), 2500);
    };
    const { doctor, loading, error, setDoctor, backendUrl, dToken } = useContext(DoctorContext);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
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

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading profile...</div>;
    if (error) return <div style={{ padding: 40, color: 'red', textAlign: 'center' }}>Error: {error}</div>;
    if (!doctor) return <div style={{ padding: 40, textAlign: 'center' }}>No doctor data found.</div>;

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleEdit = () => setEditMode(true);
    const handleCancel = () => {
        setEditMode(false);
        setForm({
            name: doctor.name || '',
            email: doctor.email || '',
            specialization: doctor.speciality || doctor.specialization || '',
        });
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
                showToast('Profile updated successfully!', '#1c7856');
            } else {
                showToast(res.data.message || 'Failed to update profile', '#d14343');
            }
        } catch (err) {
            showToast('Error updating profile', '#d14343');
        } finally {
            setSaving(false);
        }
    };



    // Responsive styles for mobile/desktop
    const responsiveStyles = `
        @media (max-width: 700px) {
            .doctor-profile-card { padding: 18px !important; }
            .doctor-profile-flex { flex-direction: column !important; gap: 18px !important; align-items: flex-start !important; }
            .doctor-profile-avatar { margin: 0 auto 16px auto !important; }
            .doctor-profile-fields { min-width: 0 !important; width: 100% !important; }
            .doctor-profile-form-flex { flex-direction: column !important; gap: 0 !important; }
        }
    `;
    return (
        <>
            <style>{responsiveStyles}</style>
            {toast.open && (
                <div style={{
                    position: 'fixed',
                    top: 32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: toast.color,
                    color: '#fff',
                    padding: '12px 32px',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 16,
                    zIndex: 9999,
                    boxShadow: '0 2px 12px #0003',
                    transition: 'opacity 0.2s',
                }}>
                    {toast.message}
                </div>
            )}
            <div style={{ padding: '32px 8px', maxWidth: 800, margin: '0 auto' }}>
                <div className="doctor-profile-card" style={{ background: 'linear-gradient(120deg, #eafaf1 60%, #f0f4ff 100%)', borderRadius: 20, boxShadow: '0 6px 32px #0002', padding: 36, marginBottom: 32 }}>
                    <div className="doctor-profile-flex" style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 24, flexWrap: 'wrap' }}>
                        <div className="doctor-profile-avatar" style={{
                            width: 110,
                            height: 110,
                            borderRadius: '50%',
                            background: '#fff',
                            boxShadow: '0 2px 12px #1c785622',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 44,
                            fontWeight: 700,
                            color: '#1c7856',
                            border: '4px solid #eafaf1',
                            overflow: 'hidden',
                        }}>
                            {form.image ? (
                                <img src={form.image} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            ) : (
                                getInitials(form.name)
                            )}
                        </div>
                        <div className="doctor-profile-fields" style={{ flex: 1, minWidth: 220 }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#1c7856', marginBottom: 4 }}>{form.name}</div>
                            <div style={{ fontSize: 17, color: '#555', marginBottom: 2 }}>{form.specialization}</div>
                            <div style={{ fontSize: 15, color: '#888', marginBottom: 4 }}>{form.email}</div>
                            <span style={{
                                display: 'inline-block',
                                padding: '4px 16px',
                                borderRadius: 16,
                                fontWeight: 600,
                                fontSize: 15,
                                background: form.available ? '#eafaf1' : '#ffeaea',
                                color: form.available ? '#1c7856' : '#d14343',
                                marginTop: 4,
                            }}>
                                {form.available ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                    </div>
                    <form onSubmit={handleSave} style={{ marginTop: 12 }}>
                        <div className="doctor-profile-form-flex" style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 260 }}>
                                <div style={{ marginBottom: 14 }}>
                                    <label style={{ fontWeight: 500, color: '#155c43', fontSize: 15 }}>Name</label><br />
                                    <input type="text" name="name" value={form.name} onChange={handleChange} disabled={!editMode} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1.2px solid #cce5db', marginTop: 4, background: editMode ? '#fff' : '#f6f6f6', fontSize: 15 }} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 500, color: '#155c43', fontSize: 15 }}>Email</label><br />
                                    <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!editMode} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1.2px solid #cce5db', marginTop: 4, background: editMode ? '#fff' : '#f6f6f6', fontSize: 15 }} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 600, color: '#155c43', fontSize: 15 }}>Specialization</label><br />
                                    <input type="text" name="specialization" value={form.specialization} onChange={handleChange} disabled={!editMode} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #cce5db', marginTop: 4, background: editMode ? '#fff' : '#f6f6f6', fontSize: 16 }} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 600, color: '#155c43', fontSize: 15 }}>Degree</label><br />
                                    <input type="text" name="degree" value={form.degree} onChange={handleChange} disabled={!editMode} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #cce5db', marginTop: 4, background: editMode ? '#fff' : '#f6f6f6', fontSize: 16 }} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 600, color: '#155c43', fontSize: 15 }}>Experience</label><br />
                                    <input type="text" name="experience" value={form.experience} onChange={handleChange} disabled={!editMode} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #cce5db', marginTop: 4, background: editMode ? '#fff' : '#f6f6f6', fontSize: 16 }} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 600, color: '#155c43', fontSize: 15 }}>Fees</label><br />
                                    <input type="number" name="fees" value={form.fees} onChange={handleChange} disabled={!editMode} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #cce5db', marginTop: 4, background: editMode ? '#fff' : '#f6f6f6', fontSize: 16 }} />
                                </div>
                            </div>
                            <div style={{ flex: 1, minWidth: 260 }}>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 600, color: '#155c43', fontSize: 15 }}>About</label><br />
                                    <textarea name="about" value={form.about} onChange={handleChange} disabled={!editMode} rows={editMode ? 6 : 4} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #cce5db', marginTop: 4, background: editMode ? '#fff' : '#f6f6f6', fontSize: 16, resize: 'vertical', minHeight: 60 }} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 600, color: '#155c43', fontSize: 15 }}>Address</label><br />
                                    <textarea name="address" value={form.address} onChange={handleChange} disabled={!editMode} rows={editMode ? 4 : 2} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #cce5db', marginTop: 4, background: editMode ? '#fff' : '#f6f6f6', fontSize: 16, resize: 'vertical', minHeight: 40 }} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 600, color: '#155c43', fontSize: 15 }}>Profile Image</label><br />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input type="text" name="image" value={form.image} onChange={handleChange} disabled={!editMode} placeholder="Image URL" style={{ flex: 1, padding: 10, borderRadius: 6, border: '1.2px solid #cce5db', marginTop: 4, background: editMode ? '#fff' : '#f6f6f6', fontSize: 15 }} />
                                        {editMode && (
                                            <>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id="doctor-image-upload"
                                                    onChange={async e => {
                                                        if (!e.target.files || !e.target.files[0]) return;
                                                        const file = e.target.files[0];
                                                        const formData = new FormData();
                                                        formData.append('file', file);
                                                        formData.append('upload_preset', 'YOUR_CLOUDINARY_PRESET'); // TODO: replace
                                                        try {
                                                            setSaving(true);
                                                            const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_CLOUD_NAME/image/upload', {
                                                                method: 'POST',
                                                                body: formData,
                                                            });
                                                            const data = await res.json();
                                                            if (data.secure_url) {
                                                                setForm(f => ({ ...f, image: data.secure_url }));
                                                                showToast('Image uploaded!', '#1c7856');
                                                            } else {
                                                                showToast('Failed to upload image', '#d14343');
                                                            }
                                                        } catch (err) {
                                                            showToast('Error uploading image', '#d14343');
                                                        } finally {
                                                            setSaving(false);
                                                        }
                                                    }}
                                                />
                                                <label htmlFor="doctor-image-upload" style={{ cursor: 'pointer', background: '#eaeaea', color: '#1c7856', padding: '6px 14px', borderRadius: 6, fontWeight: 600, fontSize: 13, border: '1px solid #cce5db', marginTop: 4 }}>
                                                    Upload
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 28 }}>
                            {!editMode ? (
                                <button type="button" onClick={handleEdit} style={{ background: '#1c7856', color: '#fff', padding: '12px 32px', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #1c785622' }}>Edit</button>
                            ) : (
                                <>
                                    <button type="button" onClick={handleCancel} style={{ background: '#eaeaea', color: '#1c7856', padding: '12px 32px', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" disabled={saving} style={{ background: '#1c7856', color: '#fff', padding: '12px 32px', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, boxShadow: '0 2px 8px #1c785622' }}>{saving ? 'Saving...' : 'Save'}</button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default DoctorProfile;
