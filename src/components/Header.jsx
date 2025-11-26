import React from 'react';
import { User } from 'lucide-react';

const Header = ({ currentUser, onNavigateToProfile }) => (
    <header style={{
        backgroundColor: 'white',
        padding: '15px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#4CAF50', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                R+
            </div>
            <div>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: 0 }}>RegradePlus</h1>
                <p style={{ fontSize: '12px', color: '#7f8c8d', margin: '2px 0 0 0' }}>กลุ่มสาระการเรียนรู้ วิทยาศาสตร์ & เทคโนโลยี</p>
            </div>
        </div>

        {currentUser && onNavigateToProfile && (
            <button
                onClick={onNavigateToProfile}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
                <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#4CAF50',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <User size={18} />
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                        {currentUser.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {currentUser.isAdmin ? 'Admin' : 'Student'}
                    </div>
                </div>
            </button>
        )}
    </header>
);

export default Header;
