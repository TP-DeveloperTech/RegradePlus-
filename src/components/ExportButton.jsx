import React, { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';

const ExportButton = ({ data, filename = 'submissions', onExport }) => {
    const [showMenu, setShowMenu] = useState(false);

    const handleExport = (format) => {
        onExport(data, filename, format);
        setShowMenu(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="btn btn-outline"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '8px 16px'
                }}
            >
                <Download size={16} />
                ดาวน์โหลดรายงาน
                <ChevronDown size={16} />
            </button>

            {showMenu && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 999
                        }}
                        onClick={() => setShowMenu(false)}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '8px',
                            backgroundColor: 'white',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            minWidth: '200px',
                            zIndex: 1000,
                            overflow: 'hidden'
                        }}
                    >
                        <button
                            onClick={() => handleExport('excel')}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: 'none',
                                backgroundColor: 'white',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                            <Download size={16} style={{ color: '#4CAF50' }} />
                            <div>
                                <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Excel (.xlsx)</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>เหมาะสำหรับการวิเคราะห์</div>
                            </div>
                        </button>
                        <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />
                        <button
                            onClick={() => handleExport('csv')}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: 'none',
                                backgroundColor: 'white',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                            <Download size={16} style={{ color: '#2196F3' }} />
                            <div>
                                <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>CSV (.csv)</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>เหมาะสำหรับการนำเข้าข้อมูล</div>
                            </div>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExportButton;
