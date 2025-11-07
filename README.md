# PHPShift

<p align="center">
  <img src="https://andercoder.com/phpshift/assets/logo.png" alt="PHPShift Logo" width="128">
</p>

<h3 align="center">A modern PHP version switcher for Windows</h3>

<p align="center">
  Official Website: <a href="https://andercoder.com/phpshift" target="_blank">https://andercoder.com/phpshift</a>
</p>

<p align="center">
  <!-- Badges -->
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Windows">
  <img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg?style=for-the-badge" alt="License: CC BY-NC-SA 4.0">
</p>

## 📖 About the Project

**PHPShift** is a desktop application for Windows designed to make switching between different PHP versions incredibly simple. If you're tired of manually editing your system's `PATH` variable every time you need to change projects, this tool automates the entire process. With a clean and intuitive interface, you can change your active PHP version with just a single click.

---

## ✨ Key Features

*   **One-Click Version Switching:** Instantly change the active PHP version in the system's `PATH`.
*   **Automatic Detection:** Point it to your main PHP folder, and PHPShift will list all valid PHP versions found.
*   **Integrated `php.ini` Editor:** Enable and disable common extensions through a visual interface.
*   **System Tray Integration:** Access all features directly from the system tray for maximum productivity.
*   **Modern UI with Themes:** A pleasant and reactive user experience with both light and dark modes.
*   **Multi-language Support:** Available in Portuguese, English, Spanish, and Chinese.
*   **Professional Installer:** Simple and clean installation for Windows (x64/x32).

---

## 📸 Visual Tour

### Clean and Intuitive Interface
Manage all your PHP versions in one place. The interface is simple, direct, and supports both light and dark themes to match your preference.

<p align="center">
  <img src="https://andercoder.com/phpshift/assets/light-version.png" alt="Main Screen - Light Theme" width="75%">
  <br>
  <i>Main screen showing available PHP versions.</i>
</p>

### Quick php.ini Editing
No more manual file editing. Enable or disable common PHP extensions like `pgsql`, `gd`, or `xdebug` with a single click through a user-friendly modal.

<p align="center">
  <img src="https://andercoder.com/phpshift/assets/settings.png" alt="PHP.ini Edit Modal" width="75%">
  <br>
  <i>Modal for quick editing of the php.ini file.</i>
</p>

### Full Control from the System Tray
PHPShift can be minimized to the system tray (next to the clock), allowing you to switch PHP versions without even opening the main window. It's the perfect way to stay productive.

<p align="center">
  <img src="https://andercoder.com/phpshift/assets/tray.png" alt="System Tray Menu" width="50%">
  <br>
  <i>Convenient context menu in the system tray.</i>
</p>

---

## 🚀 Installation (For Users)

1.  Go to the [**Releases**](https://github.com/andersondanieln/phpshift/releases) page of this repository.
2.  Download the `.exe` installer file for the latest version (e.g., `PHPShift Setup X.Y.Z.exe`).
3.  Run the installer and follow the instructions.

---

## 🛠️ For Developers (Development Environment)

If you want to contribute or just run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/andersondanieln/phpshift.git
    ```

2.  **Navigate to the project folder:**
    ```bash
    cd phpshift
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

4.  **Start the development environment:**
    ```bash
    npm run dev
    ```
    This command will start the Vite development server for the frontend and then the main Electron process. The application will open with developer tools enabled.

---

## 📦 Building the Installer

To compile the application and generate the `.exe` installation files, follow these steps:

1.  **Open the terminal as an Administrator:** On Windows, it's crucial to run this command in a terminal with elevated privileges to avoid permission errors during the build process.

2.  **Run the build command:**
    ```bash
    npm run build
    ```

3.  After completion, the installers will be available in the `release/` folder.

---

## 💻 Tech Stack

*   **[Electron](https://www.electronjs.org/):** Framework for creating desktop applications with JavaScript, HTML, and CSS.
*   **[React](https://react.dev/):** Library for building the user interface in a component-based and reactive way.
*   **[Vite](https://vitejs.dev/):** Extremely fast frontend build tool that offers a superior development experience.
*   **[Node.js](https://nodejs.org/):** Used for the backend logic in the Electron main process, such as file and environment variable manipulation.
*   **[Electron-Store](https://github.com/sindreshus/electron-store):** To persist user settings (path, theme, language, etc.).
*   **[Electron-Builder](https://www.electron.build/):** Tool for packaging and creating installers for different platforms.
*   **[NSIS](https://nsis.sourceforge.io/Main_Page):** System for creating Windows installers, used by Electron-Builder for custom options.

---

## 📄 License

This project uses a dual-license model.

*   **For personal, non-commercial use:** It is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.
*   **For commercial use:** A separate commercial license must be obtained by contacting the author. Using this software in a commercial product or service without a proper license is a violation of copyright.

Please see the [LICENSE.md](LICENSE.md) file for full details.

---

## 👨‍💻 Author

Made with ❤️ by **Anderson Nascimento**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andersondn/)
&nbsp;
[![Website](https://img.shields.io/badge/Site-andercoder.com-blue?style=for-the-badge)](https://andercoder.com)
