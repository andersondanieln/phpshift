import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import IconButton from './IconButton';

const Header = ({ phpPath, onPathChange, onUpdate, onThemeToggle, onOpenSettings, onOpenHelp, onOpenAppSettings, translations }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLangChange = async (lang) => {
        await window.api.setLanguage(lang);
        window.location.reload();
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <header>
            <div className="header-content">
                <Logo />
                <div className="controls-group">
                    <div className="path-config">
                        <input type="text" value={phpPath} onChange={(e) => onPathChange(e.target.value)} />
                        <button onClick={onUpdate}>{translations.updateButton || 'Update'}</button>
                        <button onClick={() => window.api.openFolder(phpPath)}>{translations.openFolderButton || 'Open Folder'}</button>
                    </div>
                    <div className="settings-group">
                        <div className="language-selector-container" ref={dropdownRef}>
                            <IconButton icon="language" onClick={() => setDropdownOpen(!dropdownOpen)} title="Change Language" />
                            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                                <a href="#" onClick={() => handleLangChange('en')}>English</a>
                                <a href="#" onClick={() => handleLangChange('pt-BR')}>Português (Brasil)</a>
                                <a href="#" onClick={() => handleLangChange('es')}>Español</a>
                                <a href="#" onClick={() => handleLangChange('zh')}>中文</a>
                            </div>
                        </div>
                        <IconButton icon="theme" onClick={onThemeToggle} title="Toggle Theme" />
                        <IconButton icon="appSettings" onClick={onOpenAppSettings} title={translations.appSettingsTitle} />
                        <IconButton icon="settings" onClick={onOpenSettings} title={translations.settingsButtonTitle}/>
                        <IconButton icon="help" onClick={onOpenHelp} title="Help" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;