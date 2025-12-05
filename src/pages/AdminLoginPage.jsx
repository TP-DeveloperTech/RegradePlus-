import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

const AdminLoginPage = ({ onLogin, onRegister, onNavigateToLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '', adminCode: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showAdminCode, setShowAdminCode] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegister) {
            // Always include adminCode for admin registration
            onRegister({ ...formData, adminCode: formData.adminCode });
        } else {
            onLogin(formData.email, formData.password, true);
        }
    };

    return (
        <div className="login-container">
            <div className="form-container" style={{ maxWidth: '450px' }}>
                {/* Back Button */}
                <button
                    onClick={onNavigateToLogin}
                    className="back-button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '8px 0',
                        marginBottom: '20px',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    <ArrowLeft size={18} />
                    กลับหน้าหลัก
                </button>

                {/* Header */}
                <div className="text-center" style={{ marginBottom: '30px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto',
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                    }}>
                        <ShieldCheck size={28} color="white" />
                    </div>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: 'var(--text-primary)' }}>
                        {isRegister ? 'สมัครสมาชิก Admin' : 'เข้าสู่ระบบ Admin'}
                    </h2>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {isRegister ? 'สร้างบัญชี Admin ใหม่' : 'สำหรับครูและผู้ดูแลระบบเท่านั้น'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <label className="form-label">ชื่อ-นามสกุล</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="form-input"
                                placeholder="ชื่อ นามสกุล"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="teacher@taweethapisek.ac.th"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="form-input"
                                style={{ paddingRight: '45px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Admin Code - Always visible for admin registration */}
                    {isRegister && (
                        <div className="form-group" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <label className="form-label">รหัส Admin</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showAdminCode ? "text" : "password"}
                                    value={formData.adminCode}
                                    onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                                    placeholder="กรุณาใส่รหัส Admin"
                                    required
                                    className="form-input"
                                    style={{ paddingRight: '45px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowAdminCode(!showAdminCode)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {showAdminCode ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                                * รหัส Admin จะได้รับจากผู้ดูแลระบบ
                            </p>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '10px' }}>
                        {isRegister ? 'สมัครสมาชิก Admin' : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                <div className="text-center" style={{ marginTop: '24px', padding: '20px 0', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {isRegister ? 'มีบัญชี Admin แล้ว?' : 'ยังไม่มีบัญชี Admin?'}
                    </span>
                    <button
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setFormData({ email: '', password: '', name: '', adminCode: '' });
                            setShowPassword(false);
                            setShowAdminCode(false);
                        }}
                        className="btn-outline"
                        type="button"
                    >
                        {isRegister ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
