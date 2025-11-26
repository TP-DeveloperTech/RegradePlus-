import React from 'react';

export const ConfirmLogoutDialog = ({ show, onConfirm, onCancel }) => {
    if (!show) return null;
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>ยืนยันการออกจากระบบ</h3>
                <p style={{ margin: '15px 0', color: 'var(--text-secondary)' }}>คุณแน่ใจหรือไม่ที่จะออกจากระบบ?</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button onClick={onConfirm} className="btn btn-danger" style={{ flex: 1 }}>ออกจากระบบ</button>
                    <button onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>ยกเลิก</button>
                </div>
            </div>
        </div>
    );
};
