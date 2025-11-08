import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import IconButton from './IconButton';

const SettingsModal = ({ activeVersion, phpPath, onClose, translations }) => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const result = await window.api.getIniSettings({ basePath: phpPath, version: activeVersion });
      if (result.success) setSettings(result.settings);
      else showToast(result.error, "error");
      setIsLoading(false);
    }
    fetchSettings();
  }, [activeVersion, phpPath, showToast]);

  const handleToggle = (ext) => {
    setSettings(prev => ({ ...prev, [ext]: !prev[ext] }));
  };
  
  const handleSave = async () => {
    const result = await window.api.saveIniSettings({ basePath: phpPath, version: activeVersion, newSettings: settings });
    if (result.success) {
        showToast(result.success, 'success');
        onClose();
    } else {
        showToast(result.error, 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2>{translations.modalTitle.replace('{version}', activeVersion)}</h2>
                <IconButton icon="close" onClick={onClose} />
            </div>
            <div className="modal-body">
                {isLoading ? <p>{translations.modalLoading}</p> : Object.keys(settings).map(ext => (
                    <div key={ext} className="setting-item">
                        <label htmlFor={`toggle-${ext}`}>extension={ext}</label>
                        <label className="toggle-switch">
                            <input type="checkbox" id={`toggle-${ext}`} checked={settings[ext]} onChange={() => handleToggle(ext)} />
                            <span className="slider"></span>
                        </label>
                    </div>
                ))}
            </div>
            <div className="modal-footer">
                <button onClick={onClose}>{translations.modalCancel}</button>
                <button className="button-primary" onClick={handleSave}>{translations.modalSave}</button>
            </div>
        </div>
    </div>
  );
};

export default SettingsModal;