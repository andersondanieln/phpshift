const { app, BrowserWindow, ipcMain, shell, Tray, Menu } = require('electron');
const path = require('node:path');
const fs = require('fs');
const { exec } = require('child_process');
const Store = require('electron-store');

const store = new Store();
let win = null;
let tray = null;
let appIsQuitting = false;
let currentTranslations = {};

const isDev = process.env.IS_DEV === 'true';

function setActiveVersionLogic({ basePath, version }) {
    return new Promise((resolve) => {
        const newPhpPath = path.join(basePath, version);

        const currentPath = process.env.PATH;
        const allPaths = currentPath.split(path.delimiter);

        const otherPaths = allPaths.filter(p => {
            if (!p || p.trim() === '') return false;
            return !p.startsWith(basePath);
        });

        const newPathArray = [newPhpPath, ...otherPaths];
        
        const newPathString = newPathArray.join(path.delimiter);

        exec(`setx PATH "${newPathString}"`, (error) => {
            if (error) {
             
                resolve({ error: `Falha ao definir o PATH. Tente executar como Administrador. Detalhes: ${error.message}` });
                return;
            }
            resolve({ success: `PHP ${version} está agora ativo!` });
        });
    });
}


function loadTranslations(lang) {
    const localesPath = isDev ? path.join(__dirname, '../locales') : path.join(process.resourcesPath, 'locales');
    try {
        const langPath = path.join(localesPath, `${lang}.json`);
        const fileContent = fs.readFileSync(langPath, 'utf-8');
        currentTranslations = JSON.parse(fileContent);
    } catch (error) {
        console.error(`Could not load language file for ${lang}, falling back to 'en'.`, error);
        const enPath = path.join(localesPath, 'en.json');
        if (fs.existsSync(enPath)) {
            const fileContent = fs.readFileSync(enPath, 'utf-8');
            currentTranslations = JSON.parse(fileContent);
        }
    }
}

function createWindow() {
    win = new BrowserWindow({
        width: 1000, height: 700, minWidth: 600, minHeight: 400,
        webPreferences: { preload: path.join(__dirname, 'preload.js') },
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../public/icon.png'),
    });
    
    if (isDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    win.on('close', (event) => {
        if (!appIsQuitting) {
            event.preventDefault();
            win.hide();
        }
    });
}

function createTray() {
    const iconPath = isDev ? path.join(__dirname, '../public/icon.png') : path.join(process.resourcesPath, 'icon.png');
    tray = new Tray(iconPath);
    tray.setToolTip('PHPShift');
    tray.on('click', () => win.isVisible() ? win.hide() : win.show());
    updateTrayMenu([], null);
}

function updateTrayMenu(versions, activeVersion) {
    if (!tray) return;
    const versionSubMenu = versions.map(version => ({
        label: version, type: 'radio', checked: version === activeVersion,
        click: () => {
            const basePath = store.get('phpBasePath');
            if (basePath) {
                setActiveVersionLogic({ basePath, version }).then(() => {
                    store.set('lastActiveVersion', version);
                });
                if (win) win.webContents.send('version-changed-from-tray', version);
            }
        }
    }));
    const contextMenu = Menu.buildFromTemplate([
        ...versionSubMenu, { type: 'separator' },
        { label: currentTranslations.trayShow || 'Show App', click: () => win.show() },
        { label: currentTranslations.trayQuit || 'Quit', click: () => { appIsQuitting = true; app.quit(); } },
    ]);
    tray.setContextMenu(contextMenu);
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore();
      if (!win.isVisible()) win.show();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    const lang = store.get('language', 'en');
    loadTranslations(lang);
    createWindow();
    createTray();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('before-quit', () => appIsQuitting = true);
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
}


ipcMain.handle('get-initial-data', () => {
    const lang = store.get('language', 'en');
    const theme = store.get('theme', 'light');
    loadTranslations(lang);
    return { language: lang, theme: theme, translations: currentTranslations };
});
ipcMain.handle('get-last-active-version', () => store.get('lastActiveVersion'));
ipcMain.handle('set-last-active-version', (event, version) => store.set('lastActiveVersion', version));
ipcMain.handle('set-language', (event, lang) => store.set('language', lang));
ipcMain.handle('set-theme', (event, theme) => store.set('theme', theme));
ipcMain.handle('open-external-link', (event, url) => shell.openExternal(url));
ipcMain.handle('update-tray', (event, versions, activeVersion) => updateTrayMenu(versions, activeVersion));
ipcMain.handle('get-autostart-status', () => app.getLoginItemSettings().openAtLogin);
ipcMain.handle('set-autostart-status', (event, enabled) => {
    app.setLoginItemSettings({ openAtLogin: enabled, path: app.getPath('exe') });
});
ipcMain.handle('set-active-version', (event, { basePath, version }) => setActiveVersionLogic({ basePath, version }));
ipcMain.handle('get-default-path', () => {
    const defaultPath = path.join(app.getPath('userData'), 'php_versions');
    if (!fs.existsSync(defaultPath)) fs.mkdirSync(defaultPath, { recursive: true });
    return defaultPath;
});
ipcMain.handle('open-folder', (event, folderPath) => shell.openPath(folderPath));
ipcMain.handle('get-php-path', () => store.get('phpBasePath'));
ipcMain.handle('set-php-path', (event, newPath) => store.set('phpBasePath', newPath));
ipcMain.handle('list-versions', (event, phpPath) => {
    if (!phpPath || !fs.existsSync(phpPath)) return { error: 'The specified path does not exist.' };
    try {
        const entries = fs.readdirSync(phpPath, { withFileTypes: true });
        return {
            data: entries.filter(entry => entry.isDirectory() && fs.existsSync(path.join(phpPath, entry.name, 'php.exe'))).map(dir => dir.name)
        };
    } catch (e) {
        return { error: `Error reading directory: ${e.message}` };
    }
});
ipcMain.handle('get-current-version', (event, basePath) => {
    return new Promise((resolve) => {
        exec('where.exe php', (error, stdout) => {
            if (error) return resolve({ data: null, error: 'PHP not found in PATH.' });
            const phpPath = stdout.split('\r\n')[0];
            if (phpPath && basePath && phpPath.startsWith(basePath)) {
                const relativePath = path.relative(basePath, path.dirname(phpPath));
                resolve({ data: relativePath.split(path.sep)[0] });
            } else {
                resolve({ data: 'Externo', error: 'An external PHP version is active.' });
            }
        });
    });
});
function findIniFile(versionPath) {
    const iniPath = path.join(versionPath, 'php.ini');
    if (fs.existsSync(iniPath)) return iniPath;
    const devIni = path.join(versionPath, 'php.ini-development');
    if (fs.existsSync(devIni)) {
        fs.copyFileSync(devIni, iniPath);
        return iniPath;
    }
    const prodIni = path.join(versionPath, 'php.ini-production');
    if (fs.existsSync(prodIni)) {
        fs.copyFileSync(prodIni, iniPath);
        return iniPath;
    }
    return null;
}
ipcMain.handle('get-ini-settings', (event, { basePath, version }) => {
    const versionPath = path.join(basePath, version);
    const iniFilePath = findIniFile(versionPath);
    if (!iniFilePath) return { error: currentTranslations.statusIniLoadError?.replace('{version}', version) || `Could not find php.ini for ${version}.` };
    try {
        const content = fs.readFileSync(iniFilePath, 'utf-8');
        const extensionsToFind = ['curl', 'gd', 'mbstring', 'openssl', 'pdo_mysql', 'pdo_pgsql', 'pdo_sqlite', 'sockets', 'zip', 'intl', 'xsl'];
        const settings = {};
        extensionsToFind.forEach(ext => {
            const regex = new RegExp(`^;?\\s*extension\\s*=\\s*${ext}\\b`, 'im');
            const match = content.match(regex);
            if (match) settings[ext] = !match[0].startsWith(';');
        });
        return { success: true, settings };
    } catch (e) {
        return { error: `Error reading php.ini: ${e.message}` };
    }
});
ipcMain.handle('save-ini-settings', (event, { basePath, version, newSettings }) => {
    const versionPath = path.join(basePath, version);
    const iniFilePath = findIniFile(versionPath);
    if (!iniFilePath) return { error: currentTranslations.statusIniLoadError?.replace('{version}', version) || `Could not find php.ini for ${version}.` };
    try {
        let content = fs.readFileSync(iniFilePath, 'utf-8');
        for (const [ext, isEnabled] of Object.entries(newSettings)) {
            const regex = new RegExp(`^;?\\s*extension\\s*=\\s*${ext}\\b`, 'im');
            const replacement = isEnabled ? `extension=${ext}` : `;extension=${ext}`;
            if (content.match(regex)) content = content.replace(regex, replacement);
        }
        fs.writeFileSync(iniFilePath, content, 'utf-8');
        return { success: currentTranslations.statusIniSaveSuccess?.replace('{version}', version) || `Settings saved for ${version}!` };
    } catch (e) {
        return { error: currentTranslations.statusIniSaveError?.replace('{error}', e.message) || `Error saving: ${e.message}` };
    }
});