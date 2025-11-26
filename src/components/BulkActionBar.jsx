import React from 'react';
import { Trash2, RotateCcw, CheckCircle, XCircle, Download } from 'lucide-react';

const BulkActionBar = ({ selectedCount, onUpdateStatus, onDelete, onRestore, onExport, onClearSelection, isTrashView }) => {
    if (selectedCount === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            border: '1px solid var(--border-color)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            animation: 'slideUp 0.3s ease-out'
        }}>
            {/* Selection Count */}
            <div style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px'
            }}>
                เลือกแล้ว {selectedCount} รายการ
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border-color)' }} />

            {/* Actions */}
            {!isTrashView ? (
                <>
                    <button
                        onClick={() => onUpdateStatus('ตรวจแล้ว')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                    >
                        <CheckCircle size={16} />
                        ตรวจแล้ว
                    </button>

                    <button
                        onClick={() => onUpdateStatus('รอตรวจ')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#ff9800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#fb8c00'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ff9800'}
                    >
                        <XCircle size={16} />
                        รอตรวจ
                    </button>

                    <button
                        onClick={onDelete}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e53935'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
                    >
                        <Trash2 size={16} />
                        ย้ายไปถังขยะ
                    </button>

                    <button
                        onClick={onExport}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#1e88e5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#2196F3'}
                    >
                        <Download size={16} />
                        Export
                    </button>
                </>
            ) : (
                <>
                    <button
                        onClick={onRestore}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                    >
                        <RotateCcw size={16} />
                        กู้คืน
                    </button>

                    <button
                        onClick={onDelete}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e53935'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
                    >
                        <Trash2 size={16} />
                        ลบถาวร
                    </button>
                </>
            )}

            {/* Divider */}
            <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border-color)' }} />

            {/* Clear Selection */}
            <button
                onClick={onClearSelection}
                style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--text-secondary)';
                }}
            >
                ยกเลิก
            </button>
        </div>
    );
};

export default BulkActionBar;
