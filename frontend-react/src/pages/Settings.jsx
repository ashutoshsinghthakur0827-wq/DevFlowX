import { useApp } from "../context/AppContext";

function Settings() {
  const { theme, setTheme } = useApp();

  return (
    <div className="page-container">
      <div className="page-heading-row">
        <div>
          <span className="eyebrow">PREFERENCES</span>
          <h2>Settings</h2>
          <p>Customize your DevFlow X workspace.</p>
        </div>
      </div>

      <div className="settings-card">
        <h3>Appearance</h3>
        <p>Choose the visual theme for your workspace.</p>

        <div className="theme-options">
          <button
            className={theme === "dark" ? "theme-option selected" : "theme-option"}
            onClick={() => setTheme("dark")}
          >
            Dark Mode
          </button>

          <button
            className={theme === "light" ? "theme-option selected" : "theme-option"}
            onClick={() => setTheme("light")}
          >
            Light Mode
          </button>
        </div>
      </div>

      <div className="settings-card">
        <h3>Application Information</h3>
        <p>Application: DevFlow X</p>
        <p>Version: 1.0</p>
        <p>Current stage: Frontend development</p>
      </div>
    </div>
  );
}

export default Settings;