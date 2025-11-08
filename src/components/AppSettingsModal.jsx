import React, { useState, useEffect } from 'react';
import IconButton from './IconButton';

const AutoStartSetting = ({ translations }) => {
    const [isAutoStartEnabled, setIsAutoStartEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getStatus() {
            const status = await window.api.getAutostartStatus();
            setIsAutoStartEnabled(status);
            setIsLoading(false);
        }
        getStatus();
    }, []);

    const handleToggle = async (e) => {
        const enabled = e.target.checked;
        setIsAutoStartEnabled(enabled);
        await window.api.setAutostartStatus(enabled);
    };

    if (isLoading) {
        return <div className="setting-item">Loading...</div>;
    }

    return (
        <div className="setting-item">
            <div>
                <label htmlFor="autostart-toggle">{translations.appSettingsAutoStart}</label>
                <p style={{ fontSize: '0.8rem', color: 'var(--subtext-color)', marginTop: '4px' }}>
                    {translations.appSettingsAutoStartDescription}
                </p>
            </div>
            <label className="toggle-switch">
                <input 
                    type="checkbox" 
                    id="autostart-toggle" 
                    checked={isAutoStartEnabled} 
                    onChange={handleToggle} 
                />
                <span className="slider"></span>
            </label>
        </div>
    );
};


const AppSettingsModal = ({ onClose, translations }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{translations.appSettingsTitle}</h2>
                    <IconButton icon="close" onClick={onClose} />
                </div>
                <div className="modal-body">
                    <AutoStartSetting translations={translations} />
                </div>
                <div className="modal-footer">
                    <button className="button-primary" onClick={onClose}>{translations.helpGotIt}</button>
                </div>
            </div>
        </div>
    );
};

export default AppSettingsModal;