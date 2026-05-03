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
  const [userEmail, setUserEmail] = useState("");
  const [isDashboard, setIsDashboard] = useState(false);

  const listings = [
    {
      title: "2-Zimmer-Wohnung nahe Innenstadt",
      city: city || "Hannover",
      price: maxPrice ? `${maxPrice - 80} €` : "820 €",
      rooms: rooms || "2",
      tag: "Sehr passend"
    },
    {
      title: "Moderne Wohnung mit Balkon",
      city: city || "Hannover",
      price: maxPrice ? `${maxPrice - 30} €` : "950 €",
      rooms: rooms || "3",
      tag: "Neu entdeckt"
    },
    {
      title: "Helle Wohnung in ruhiger Lage",
      city: city || "Hannover",
      price: maxPrice ? `${maxPrice} €` : "1.050 €",
      rooms: rooms || "3",
      tag: "Guter Preis"
    }
  ];

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
        setUserEmail(data.user?.email || email);

        if (data.user?.city) setCity(data.user.city);
        if (data.user?.maxPrice) setMaxPrice(data.user.maxPrice);
        if (data.user?.rooms) setRooms(data.user.rooms);

        setIsDashboard(true);
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

  const logout = () => {
    setToken("");
    setIsDashboard(false);
    setUserEmail("");
  };

  if (isDashboard) {
    return (
      <div className="page dashboard-page">
        <nav className="navbar">
          <div className="logo">WohnRadar</div>

          <div className="nav-links">
            <a href="#dashboard">Dashboard</a>
            <a href="#treffer">Treffer</a>
            <a href="#suche">Suchprofil</a>
          </div>

          <button onClick={logout} className="nav-button">Ausloggen</button>
        </nav>

        <main className="dashboard" id="dashboard">
          <section className="dashboard-header">
            <div>
              <div className="badge">Persönliches Dashboard</div>
              <h1>Willkommen zurück.</h1>
              <p>
                Dein Suchprofil ist aktiv. Hier siehst du deine Kriterien,
                Beispiel-Treffer und die nächsten geplanten Funktionen.
              </p>
            </div>

            <div className="profile-card">
              <span>Account</span>
              <strong>{userEmail}</strong>
              <small>Status: aktiv</small>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="dashboard-card">
              <span>Suchort</span>
              <strong>{city || "Noch nicht festgelegt"}</strong>
            </div>

            <div className="dashboard-card">
              <span>Budget</span>
              <strong>{maxPrice ? `${maxPrice} €` : "Noch offen"}</strong>
            </div>

            <div className="dashboard-card">
              <span>Zimmer</span>
              <strong>{rooms || "Noch offen"}</strong>
            </div>

            <div className="dashboard-card highlight-card">
              <span>Potenzielle Treffer</span>
              <strong>3</strong>
            </div>
          </section>

          <section className="dashboard-content">
            <div className="panel" id="treffer">
              <div className="panel-header">
                <div>
                  <h2>Neue Beispiel-Treffer</h2>
                  <p>Später werden hier echte Immobilienangebote angezeigt.</p>
                </div>
                <span className="live-pill">Live vorbereitet</span>
              </div>

              <div className="listing-list">
                {listings.map((item, index) => (
                  <div className="listing-card" key={index}>
                    <div>
                      <span className="listing-tag">{item.tag}</span>
                      <h3>{item.title}</h3>
                      <p>{item.city} · {item.rooms} Zimmer · {item.price}</p>
                    </div>
                    <button>Merken</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel side-panel" id="suche">
              <h2>Suchprofil bearbeiten</h2>
              <p>Ändere deine Kriterien und speichere sie direkt in deiner Neon-Datenbank.</p>

              <div className="form-group">
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
                  Änderungen speichern
                </button>
              </div>
            </div>
          </section>

          <section className="features premium-features">
            <div className="feature">
              <h3>E-Mail Alerts</h3>
              <p>Benachrichtigungen, sobald neue passende Angebote gefunden werden.</p>
            </div>

            <div className="feature">
              <h3>Auto-Bewerbung</h3>
              <p>Später kann der Nutzer Unterlagen hinterlegen und schneller reagieren.</p>
            </div>

            <div className="feature">
              <h3>Fake-Check</h3>
              <p>Verdächtige Inserate können markiert und bewertet werden.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

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
              placeholder="Passwort, mindestens 8 Zeichen"
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
          <h3>Persönliches Dashboard</h3>
          <p>
            Nach dem Login sieht jeder Nutzer sein eigenes Suchprofil und passende Treffer.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;