"""
Craft-Device launcher.
Starts the FastAPI server and opens the browser automatically.
Works both as a normal script and when frozen by PyInstaller.
"""
import os
import sys
import threading
import time
import webbrowser

PORT = 8000
HOST = "127.0.0.1"


def get_base_path():
    """Return the directory where bundled data lives (PyInstaller or source tree)."""
    if getattr(sys, "frozen", False):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))


def get_app_dir():
    """Return the directory where persistent files (DB, uploads) should live.
    When frozen this is the folder containing the .exe; otherwise the project root."""
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))


def open_browser():
    time.sleep(1.5)
    webbrowser.open(f"http://{HOST}:{PORT}")


def main():
    base = get_base_path()
    app_dir = get_app_dir()

    os.environ["CRAFT_BASE_PATH"] = base
    os.environ["CRAFT_APP_DIR"] = app_dir

    os.chdir(app_dir)

    sys.path.insert(0, os.path.join(base, "backend"))

    threading.Thread(target=open_browser, daemon=True).start()

    import uvicorn
    uvicorn.run("app.main:app", host=HOST, port=PORT, log_level="info")


if __name__ == "__main__":
    main()
