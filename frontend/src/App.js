import { useState } from "react";
import "./App.css";

const API_URL = "https://housing-project-rb5k.onrender.com";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [token, setToken] = useState("");

  const register = async () => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      alert(data.message || "Registrierung abgeschlossen.");
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      alert("Backend nicht erreichbar.");
    }
  };

  const login = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        setToken(data.token);
        alert(data.message || "Erfolgreich eingeloggt!");
      } else {
        alert(data.message || "Login fehlgeschlagen.");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Backend nicht erreichbar.");
    }
  };

  const saveSearch = async () => {
    try {
      if (!token) {
        alert("Bitte zuerst einloggen.");
        return;
      }

      const res = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, city, maxPrice, rooms }),
      });

      const data = await res.json();
      alert(data.message || "Suchprofil gespeichert.");
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      alert("Suchprofil konnte nicht gespeichert werden.");
    }
  };

  return (
    <div className="page">
      <nav className="navbar">
        <div className="logo">WohnRadar</div>

        <div className="nav-links">
          <a href="#vorteile">Vorteile</a>
          <a href="#suche">Suchprofil</a>
          <a href="#start">Starten</a>
        </div>

        <a href="#start" className="nav-button">Kostenlos testen</a>
      </nav>

      <main className="hero">
        <section className="hero-content">
          <div className="badge">Für Miete & Kauf · Schnellere Wohnungssuche</div>

          <h1>Finde passende Wohnungen, bevor sie andere entdecken.</h1>

          <p>
            WohnRadar hilft dir dabei, deine Wunschkriterien zu speichern und
            passende Immobilienangebote schneller im Blick zu behalten.
          </p>

          <div className="hero-actions">
            <a href="#start" className="primary-button">
              Jetzt Suchprofil anlegen
            </a>
            <a href="#vorteile" className="secondary-button">
              Mehr erfahren
            </a>
          </div>

          <div className="stats">
            <div>
              <strong>24/7</strong>
              <span>Suchprofil aktiv</span>
            </div>
            <div>
              <strong>1x</strong>
              <span>Kriterien speichern</span>
            </div>
            <div>
              <strong>Schnell</strong>
              <span>passende Treffer sehen</span>
            </div>
          </div>
        </section>

        <section className="hero-card" id="start">
          <h2>Account erstellen</h2>
          <p className="card-subtitle">
            Registriere dich und speichere dein erstes Suchprofil.
          </p>

          <div className="form-group">
            <input
              type="email"
              placeholder="E-Mail-Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="button-row">
              <button onClick={register}>Registrieren</button>
              <button onClick={login} className="dark-button">
                Einloggen
              </button>
            </div>
          </div>

          <div className="divider"></div>

          <div id="suche" className="form-group">
            <h3>Dein Suchprofil</h3>

            <input
              placeholder="Stadt, z. B. Hannover"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <input
              type="number"
              placeholder="Maximale Miete / Preis"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="Zimmeranzahl"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            />

            <button onClick={saveSearch} className="full-button">
              Suchprofil speichern
            </button>
          </div>
        </section>
      </main>

      <section className="features" id="vorteile">
        <div className="feature">
          <h3>Schneller Überblick</h3>
          <p>
            Alle wichtigen Suchkriterien an einem Ort speichern und später
            gezielt erweitern.
          </p>
        </div>

        <div className="feature">
          <h3>Weniger Stress</h3>
          <p>
            Statt ständig Portale zu prüfen, legst du einmal fest, was du
            suchst.
          </p>
        </div>

        <div className="feature">
          <h3>Bereit für Alerts</h3>
          <p>
            Als nächstes können E-Mail-Benachrichtigungen und echte Inserate
            ergänzt werden.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;