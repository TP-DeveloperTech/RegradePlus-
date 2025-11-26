import React, { useState } from 'react';
import { Upload, RotateCcw, LogOut } from 'lucide-react';

const SubmitWorkPage = ({ onSubmit, onNavigate, currentUser, onLogout }) => {
    const [formData, setFormData] = useState({
        studentName: currentUser?.name || '',
        grade: '',
        studentId: '',
        subjectCode: '',
        subjectName: '',
        type: 'ศูนย์',
        gradeYear: '',
        date: new Date().toISOString().split('T')[0],
        images: []
    });
    const [isDragging, setIsDragging] = useState(false);

    const processFiles = (files) => {
        const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
        Promise.all(fileArray.map(file => new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        }))).then(images => setFormData({ ...formData, images: [...formData.images, ...images] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            studentName: currentUser?.name || '',
            grade: '',
            studentId: '',
            subjectCode: '',
            subjectName: '',
            type: 'ศูนย์',
            gradeYear: '',
            date: new Date().toISOString().split('T')[0],
            images: []
        });
    };

    return (
        <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>ส่งงานแก้</h2>
                <div>
                    <button onClick={() => onNavigate('history')} className="btn btn-secondary btn-animate" style={{ marginRight: '10px' }}>
                        <RotateCcw size={16} /> ประวัติการส่งงาน
                    </button>
                    <button onClick={onLogout} className="btn btn-danger" type="button"><LogOut size={16} /> ออกจากระบบ</button>
                </div>
            </div>
            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div><label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อ-นามสกุล: *</label><input type="text" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                    <div><label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชั้น: *</label><input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                </div>
                <div><label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รหัสนักเรียน: *</label><input type="text" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                <div><label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รหัสวิชา: *</label><input type="text" value={formData.subjectCode} onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                <div><label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อวิชา: *</label><input type="text" value={formData.subjectName} onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                <div><label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ติด: *</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}><option value="ศูนย์">ศูนย์</option><option value="ร.">ร.</option><option value="มส.">มส.</option><option value="มพ.">มพ.</option></select></div>
                <div><label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชั้นที่ติด-ปีการศึกษา: *</label><input type="text" value={formData.gradeYear} onChange={(e) => setFormData({ ...formData, gradeYear: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                <div><label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>วันที่ส่ง: *</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                <div style={{ marginTop: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>รูปงานแก้: *</label>
                    <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }} onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }} style={{ border: `2px dashed ${isDragging ? 'var(--primary-green)' : 'var(--border-color)'}`, borderRadius: '8px', padding: '40px', textAlign: 'center', backgroundColor: isDragging ? 'var(--primary-green-light)' : 'transparent', cursor: 'pointer', marginBottom: '15px' }} onClick={() => document.getElementById('file-upload').click()}>
                        <Upload size={48} style={{ margin: '0 auto 15px', color: 'var(--primary-green)', opacity: 0.6 }} />
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>{isDragging ? 'วางไฟล์ที่นี่' : 'ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์'}</p>
                        <input id="file-upload" type="file" multiple accept="image/*" onChange={(e) => processFiles(e.target.files)} style={{ display: 'none' }} />
                    </div>
                    {formData.images.length > 0 && (
                        <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                            {formData.images.map((img, idx) => (
                                <div key={idx} style={{ position: 'relative' }}>
                                    <img src={img} alt={`preview ${idx}`} style={{ width: '100%', height: '120px', objectFit: 'cover', border: '2px solid var(--border-color)', borderRadius: '4px' }} />
                                    <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) }); }} style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}>×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button type="submit" style={{ marginTop: '25px', padding: '12px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', width: '100%', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Upload size={18} /> ส่งงาน</button>
            </form>
        </div>
    );
};

export default SubmitWorkPage;
