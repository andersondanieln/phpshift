import React from 'react';
import IconButton from './IconButton';

const HelpModal = ({ onClose, translations }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{translations.helpTitle}</h2>
                    <IconButton icon="close" onClick={onClose} />
                </div>
                <div className="modal-body help-body">
                    <ul>
                        <li>{translations.helpStep1}</li>
                        <li>{translations.helpStep2}</li>
                        <li>{translations.helpStep3}</li>
                        <li>{translations.helpStep4}</li>
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="button-primary" onClick={onClose}>{translations.helpGotIt}</button>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;