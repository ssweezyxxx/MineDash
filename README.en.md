# MineDash

**MineDash** is a modern web control panel for Minecraft bots powered by `Mineflayer`. It is a comprehensive rework (fork) of the **BlockMineJS** panel, featuring a complete UI redesign in **Google Pixel — Material Design 3 (Material You)** style, improved security defaults, and expanded automation tools.

Repository: **[https://github.com/ssweezyxxx/MineDash](https://github.com/ssweezyxxx/MineDash)**

---

## Key Features & Rework Highlights

* **Google Pixel Material Design 3 (Material You) UI**:
  * **Google Sans / Outfit / Plus Jakarta Sans / Roboto** typography for the interface, paired with **JetBrains Mono / Roboto Mono** for the bot console and code editors.
  * Tonal surfaces, `28px` dialogs, `rounded-3xl` cards, pill navigation indicators (`Navigation Drawer` & `Navigation Rail`), and Google Pixel `Quick Settings` dashboard tiles.
  * Built-in Material You color presets (`Pixel Blue`, `Pixel Mint`, `Pixel Lavender`, `Pixel Peach`, `Pixel Daylight`, `Midnight`, `Emerald`, `Sunset`, `Rose`, `Nord`, `Dracula`, `Paper`, `Sky`) and a live custom theme editor.
* **Multi-Bot Process Isolation & Real-Time Monitoring**:
  * Run multiple bots simultaneously in isolated Node.js child processes with live CPU/RAM usage tracking and automatic crash recovery.
* **3D World Viewer & Interactive GUI**:
  * Real-time 3D view (`prismarine-viewer`), interactive inventory/container management, scoreboard, and ANSI/Gradient console.
* **Visual Event Graph Editor & Easy Command Builder**:
  * Build complex bot behaviors with a node-based visual programming editor or create quick command macros without writing code.
* **Built-In Plugin Store & Web IDE**:
  * Download plugins directly from the catalog repository, install from GitHub or ZIP archives, or develop plugins inside the built-in Monaco Editor IDE.

---

## Quick Start

1. Install **Node.js 22 LTS** or newer.
2. On Windows, run **`start.bat`**.
3. On Linux / macOS:
   ```bash
   git clone https://github.com/ssweezyxxx/MineDash.git
   cd MineDash
   npm install
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser and create the administrator account.

---

## License

Released under the **MIT License** (see `LICENSE` and `NOTICE`). Rework based on BlockMineJS.
