import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

const NotificationBell = ({ notifications, onMarkAsRead, onMarkAllAsRead, onClearAll }) => {
    const [showPanel, setShowPanel] = useState(false);
    const panelRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setShowPanel(false);
            }
        };

        if (showPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPanel]);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'status_changed':
                return '✓';
            case 'note_added':
                return '💬';
            case 'deadline_warning':
                return '⏰';
            default:
                return '📌';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'status_changed':
                return '#4CAF50';
            case 'note_added':
                return '#2196F3';
            case 'deadline_warning':
                return '#ff9800';
            default:
                return '#757575';
        }
    };

    return (
        <div style={{ position: 'relative' }} ref={panelRef}>
            <button
                onClick={() => setShowPanel(!showPanel)}
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
                <Bell size={20} style={{ color: 'var(--text-primary)' }} />
                {unreadCount > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                )}
            </button>

            {showPanel && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '360px',
                    maxHeight: '500px',
                    backgroundColor: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    zIndex: 1000,
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                การแจ้งเตือน
                            </h3>
                            {unreadCount > 0 && (
                                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    {unreadCount} รายการใหม่
                                </p>
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <button
                                onClick={() => {
                                    onMarkAllAsRead();
                                    setShowPanel(false);
                                }}
                                style={{
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <Check size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                อ่านทั้งหมด
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{
                                padding: '40px 20px',
                                textAlign: 'center',
                                color: 'var(--text-secondary)'
                            }}>
                                <Bell size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                                <p style={{ margin: 0 }}>ไม่มีการแจ้งเตือน</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => onMarkAsRead(notif.id)}
                                    style={{
                                        padding: '16px',
                                        borderBottom: '1px solid var(--border-color)',
                                        cursor: 'pointer',
                                        backgroundColor: notif.read ? 'white' : '#f0f9ff',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = notif.read ? 'white' : '#f0f9ff'}
                                >
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            backgroundColor: getNotificationColor(notif.type) + '20',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px',
                                            flexShrink: 0
                                        }}>
                                            {getNotificationIcon(notif.type)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{
                                                margin: '0 0 4px 0',
                                                fontSize: '14px',
                                                color: 'var(--text-primary)',
                                                fontWeight: notif.read ? 'normal' : '500',
                                                lineHeight: '1.4'
                                            }}>
                                                {notif.message}
                                            </p>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '12px',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: th })}
                                            </p>
                                        </div>
                                        {!notif.read && (
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                backgroundColor: '#2196F3',
                                                flexShrink: 0,
                                                marginTop: '14px'
                                            }} />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div style={{
                            padding: '12px 16px',
                            borderTop: '1px solid var(--border-color)',
                            textAlign: 'center'
                        }}>
                            <button
                                onClick={() => {
                                    onClearAll();
                                    setShowPanel(false);
                                }}
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '13px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: '#f44336',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                ล้างการแจ้งเตือนทั้งหมด
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
