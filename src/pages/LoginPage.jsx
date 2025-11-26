import React, { useState } from 'react';

const LoginPage = ({ onLogin, onRegister }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '', adminCode: '' });
    const [showAdminCode, setShowAdminCode] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegister) {
            onRegister(formData);
        } else {
            onLogin(formData.email, formData.password);
        }
    };

    return (
        <div className="login-container">
            <div className="form-container">
                <div className="text-center" style={{ marginBottom: '30px' }}>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', color: 'var(--text-primary)' }}>
                        {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
                    </h2>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {isRegister ? 'สร้างบัญชีใหม่เพื่อเริ่มใช้งาน' : 'ยินดีต้อนรับกลับมา'}
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <label className="form-label">ชื่อ-นามสกุล</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="form-input" />
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="yourname@taweethapisek.ac.th" required className="form-input" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="form-input" />
                    </div>
                    {isRegister && (
                        <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', transition: 'all 0.3s' }}>
                                <input type="checkbox" checked={showAdminCode} onChange={(e) => setShowAdminCode(e.target.checked)} style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }} />
                                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>ฉันเป็น Admin (ต้องมีรหัส Admin)</span>
                            </label>
                            {showAdminCode && (
                                <div style={{ marginTop: '12px', animation: 'fadeIn 0.3s ease-out' }}>
                                    <label className="form-label">รหัส Admin</label>
                                    <input type="password" value={formData.adminCode} onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })} placeholder="กรุณาใส่รหัส Admin" className="form-input" />
                                </div>
                            )}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '10px' }}>
                        {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
                    </button>
                </form>
                <div className="text-center" style={{ marginTop: '24px', padding: '20px 0', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {isRegister ? 'มีบัญชีแล้ว?' : 'ยังไม่มีบัญชี?'}
                    </span>
                    <button onClick={() => { setIsRegister(!isRegister); setFormData({ email: '', password: '', name: '', adminCode: '' }); setShowAdminCode(false); }} className="btn-outline" type="button">
                        {isRegister ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
