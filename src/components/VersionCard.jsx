import React from 'react';

const VersionCard = ({ version, isActive, onVersionClick, translations }) => {
    return (
        <div className={`version-card ${isActive ? 'active' : ''}`} onClick={() => onVersionClick(version)}>
            <div className="card-header">
                <span className="version-name">{version}</span>
                <span className="status-badge">{isActive ? translations.activeVersion : ''}</span>
            </div>
            <div className="card-info">
                <span>{translations.phpVersion}</span>
            </div>
        </div>
    );
};

export default VersionCard;