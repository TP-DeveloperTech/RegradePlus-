import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const PopupNotification = ({ popup, onClose }) => {
    if (!popup.show) return null;
    return (
        <div className="popup-container">
            <div className={`popup-content ${popup.type === 'error' ? 'error' : ''}`}>
                {popup.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                <div style={{ flex: 1, fontSize: '15px', fontWeight: '500' }}>{popup.message}</div>
                <button onClick={onClose} className="popup-close-btn" type="button"><X size={20} /></button>
            </div>
        </div>
    );
};

export default PopupNotification;
