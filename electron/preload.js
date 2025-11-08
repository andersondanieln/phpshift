const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getInitialData: () => ipcRenderer.invoke('get-initial-data'),
    openExternalLink: (url) => ipcRenderer.invoke('open-external-link', url),
    
    // Gerenciamento de Estado Persistente
    setLanguage: (lang) => ipcRenderer.invoke('set-language', lang),
    setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),
    getLastActiveVersion: () => ipcRenderer.invoke('get-last-active-version'),
    setLastActiveVersion: (version) => ipcRenderer.invoke('set-last-active-version', version),

    // Configurações do App
    getAutostartStatus: () => ipcRenderer.invoke('get-autostart-status'),
    setAutostartStatus: (enabled) => ipcRenderer.invoke('set-autostart-status', enabled),

    // Bandeja
    updateTray: (versions, activeVersion) => ipcRenderer.invoke('update-tray', versions, activeVersion),
    onVersionChangedFromTray: (callback) => {
        const subscription = (_event, value) => callback(value);
        ipcRenderer.on('version-changed-from-tray', subscription);
        return () => ipcRenderer.removeListener('version-changed-from-tray', subscription);
    },

    // Gerenciamento de Versões PHP
    getDefaultPath: () => ipcRenderer.invoke('get-default-path'),
    openFolder: (path) => ipcRenderer.invoke('open-folder', path),
    getPhpPath: () => ipcRenderer.invoke('get-php-path'),
    setPhpPath: (path) => ipcRenderer.invoke('set-php-path', path),
    listVersions: (path) => ipcRenderer.invoke('list-versions', path),
    getCurrentVersion: (basePath) => ipcRenderer.invoke('get-current-version', basePath),
    setActiveVersion: (data) => ipcRenderer.invoke('set-active-version', data),

    // Gerenciamento do PHP.ini
    getIniSettings: (data) => ipcRenderer.invoke('get-ini-settings', data),
    saveIniSettings: (data) => ipcRenderer.invoke('save-ini-settings', data),
});