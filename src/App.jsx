import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from './hooks/useToast';
import Header from './components/Header';
import VersionCard from './components/VersionCard';
import Footer from './components/Footer';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import AppSettingsModal from './components/AppSettingsModal';

function App() {
    const { showToast } = useToast();
    const [theme, setTheme] = useState('light');
    const [versions, setVersions] = useState([]);
    const [activeVersion, setActiveVersion] = useState(null);
    const [phpPath, setPhpPath] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [translations, setTranslations] = useState({});
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isAppSettingsModalOpen, setIsAppSettingsModalOpen] = useState(false);

    const refreshVersions = useCallback(async (currentPath) => {
        try {
            const versionsResult = await window.api.listVersions(currentPath);
            setVersions(versionsResult.data || []);
            return versionsResult.data || [];
        } catch (error) {
            console.error("Failed to refresh versions:", error);
            showToast("Failed to load PHP versions list.", "error");
            return [];
        }
    }, [showToast]);
    
    useEffect(() => {
        async function loadInitialData() {
            setIsLoading(true);
            const { theme: savedTheme, translations: loadedTranslations } = await window.api.getInitialData();
            if (loadedTranslations) setTranslations(loadedTranslations);
            handleThemeChange(savedTheme, false);

            let savedPath = await window.api.getPhpPath();
            if (!savedPath) {
                savedPath = await window.api.getDefaultPath();
                await window.api.setPhpPath(savedPath);
            }
            setPhpPath(savedPath);
            const availableVersions = await refreshVersions(savedPath);
            const systemActiveVersion = (await window.api.getCurrentVersion(savedPath)).data;
            const lastSavedActiveVersion = await window.api.getLastActiveVersion();
            let initialActiveVersion = null;
            if (availableVersions.includes(lastSavedActiveVersion)) {
                initialActiveVersion = lastSavedActiveVersion;
            } else if (availableVersions.includes(systemActiveVersion)) {
                initialActiveVersion = systemActiveVersion;
            }
            setActiveVersion(initialActiveVersion);
            window.api.updateTray(availableVersions, initialActiveVersion);
            setIsLoading(false);
        }
        loadInitialData();
        const cleanup = window.api.onVersionChangedFromTray((newVersion) => {
            setActiveVersion(newVersion);
            window.api.setLastActiveVersion(newVersion);
            const successMsg = translations.statusSwitchSuccess 
                ? translations.statusSwitchSuccess.replace('{version}', newVersion)
                : `Switched to ${newVersion}`;
            showToast(successMsg, 'success');
        });
        return cleanup;
    }, [refreshVersions, translations.statusSwitchSuccess, showToast]);

    const handleThemeChange = (newTheme, shouldSave = true) => {
        setTheme(newTheme);
        document.body.className = `${newTheme}-theme`;
        if (shouldSave) window.api.setTheme(newTheme);
    };

    const handleVersionClick = async (version) => {
        if (version === activeVersion) return;
        const previousVersion = activeVersion;
        setActiveVersion(version);
        showToast(translations.statusSwitchingTo.replace('{version}', version), 'success');
        const result = await window.api.setActiveVersion({ basePath: phpPath, version });
        if (result.success) {
            showToast(translations.statusSwitchSuccess.replace('{version}', version), 'success');
            await window.api.setLastActiveVersion(version);
            window.api.updateTray(versions, version);
        } else {
            showToast(translations.statusSwitchError, 'error');
            setActiveVersion(previousVersion);
        }
    };
    
    const handleUpdatePath = async () => {
        await window.api.setPhpPath(phpPath);
        showToast(translations.statusPathSaved, 'success');
        const availableVersions = await refreshVersions(phpPath);
        const systemActiveVersion = (await window.api.getCurrentVersion(phpPath)).data;
        const lastSavedActiveVersion = await window.api.getLastActiveVersion();
        let newActiveVersion = null;
        if (availableVersions.includes(lastSavedActiveVersion)) {
            newActiveVersion = lastSavedActiveVersion;
        } else if (availableVersions.includes(systemActiveVersion)) {
            newActiveVersion = systemActiveVersion;
        }
        setActiveVersion(newActiveVersion);
        window.api.updateTray(availableVersions, newActiveVersion);
    };
    
    return (
        <div className="app-container">
            <Header 
                phpPath={phpPath} 
                onPathChange={setPhpPath} 
                onUpdate={handleUpdatePath}
                onThemeToggle={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')} 
                onOpenSettings={() => activeVersion && setIsSettingsModalOpen(true)}
                onOpenHelp={() => setIsHelpModalOpen(true)}
                onOpenAppSettings={() => setIsAppSettingsModalOpen(true)}
                translations={translations}
            />
            <main id="main-content">
                {isLoading ? (
                    <div className="state-placeholder"><p>{translations.loadingVersions || 'Loading...'}</p></div>
                ) : versions.length > 0 ? (
                    <div className="version-grid">
                        {versions.map(v => 
                            <VersionCard 
                                key={v} 
                                version={v} 
                                isActive={v === activeVersion} 
                                onVersionClick={handleVersionClick} 
                                translations={translations} 
                            />
                        )}
                    </div>
                ) : (
                    <div className="state-placeholder">
                        <h2>{translations.noVersionsFound}</h2>
                        <p>{translations.noVersionsFoundDesc}</p>
                        <button onClick={() => window.api.openFolder(phpPath)} className="button-primary">{translations.openVersionsFolder}</button>
                    </div>
                )}
            </main>
            <Footer />
            {isSettingsModalOpen && 
                <SettingsModal 
                    activeVersion={activeVersion}
                    phpPath={phpPath}
                    onClose={() => setIsSettingsModalOpen(false)}
                    translations={translations}
                />
            }
            {isHelpModalOpen && <HelpModal onClose={() => setIsHelpModalOpen(false)} translations={translations} />}
            {isAppSettingsModalOpen && <AppSettingsModal onClose={() => setIsAppSettingsModalOpen(false)} translations={translations} />}
        </div>
    );
}

export default App;