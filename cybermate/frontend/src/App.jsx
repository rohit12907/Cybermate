import { useState, useEffect } from "react";

import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import PipelineView from "./components/PipelineView";
import LiveFeed from "./components/LiveFeed";
import AlertHistory from "./components/AlertHistory";

function App() {
  const [theme, setTheme] = useState("cyberpunk");

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const stats = {
    threatsDetected: 24,
    threatsBlocked: 18,
    activeAgents: 4,
    riskLevel: "MEDIUM",
  };

  const liveThreats = [
    {
      id: 1,
      ip: "192.168.1.10",
      type: "Brute Force Attack",
      severity: "Critical",
      status: "Blocked",
    },
    {
      id: 2,
      ip: "172.16.0.22",
      type: "Malware Attempt",
      severity: "High",
      status: "Investigating",
    },
    {
      id: 3,
      ip: "10.10.1.15",
      type: "Suspicious Login",
      severity: "Medium",
      status: "Monitoring",
    },
  ];

  const alertHistory = [
    {
      id: 1,
      timestamp: "10:35 AM",
      threat: "Brute Force Attack",
      severity: "Critical",
      action: "Blocked",
    },
    {
      id: 2,
      timestamp: "10:20 AM",
      threat: "Malware Upload",
      severity: "High",
      action: "Quarantined",
    },
    {
      id: 3,
      timestamp: "09:50 AM",
      threat: "Suspicious Login",
      severity: "Medium",
      action: "Monitored",
    },
  ];

  return (
    <div className="app-container">

      {/* Background Grid */}
      <div className="cyber-background"></div>

      {/* Header */}
      <Header theme={theme} setTheme={setTheme} />

      {/* Dashboard */}
      <main className="dashboard">

        {/* Top Stats */}
        <StatsBar stats={stats} />

        {/* Pipeline */}
        <section className="dashboard-section">
          <h2 className="section-title">
            AGENTIC SECURITY PIPELINE
          </h2>

          <PipelineView />
        </section>

        {/* Live Feed */}
        <section className="dashboard-section">
          <h2 className="section-title">
            LIVE THREAT FEED
          </h2>

          <LiveFeed threats={liveThreats} />
        </section>

        {/* Alert History */}
        <section className="dashboard-section">
          <h2 className="section-title">
            ALERT HISTORY
          </h2>

          <AlertHistory alerts={alertHistory} />
        </section>

      </main>

      {/* Footer */}
      <footer className="footer">
        <span>CYBERMATE SOC v1.0</span>
        <span>Agentic Security Operations Center</span>
      </footer>

    </div>
  );
}

export default App;
