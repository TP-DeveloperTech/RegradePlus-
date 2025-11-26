import React from 'react';

const ImageViewer = ({ image, onClose }) => {
    if (!image) return null;
    return (
        <div className="image-viewer-overlay" onClick={onClose}>
            <div className="image-viewer-content" onClick={(e) => e.stopPropagation()}>
                <img src={image} alt="Full view" className="image-viewer-img" />
                <button onClick={onClose} className="image-viewer-close" type="button">×</button>
            </div>
        </div>
    );
};

export default ImageViewer;
