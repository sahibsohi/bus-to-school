const routes = [
  { route: "401", school: "Demo Secondary School", driver: "Driver 01", status: "In progress", progress: "67%" },
  { route: "214", school: "Demo Collegiate", driver: "Driver 02", status: "Scheduled", progress: "0%" },
  { route: "118", school: "Demo Regional", driver: "Driver 03", status: "Delayed", progress: "33%" }
];

export default function Dashboard() {
  return (
    <main className="shell">
      <header className="header">
        <div>
          <p className="eyebrow">BTS OPERATIONS</p>
          <h1>Morning service</h1>
        </div>
        <span className="pill">Prototype</span>
      </header>

      <section className="metrics">
        <Metric label="Active routes" value="3" />
        <Metric label="Students today" value="84" />
        <Metric label="On time" value="92%" />
        <Metric label="Open alerts" value="1" />
      </section>

      <section className="panel">
        <div className="panelHeader">
          <h2>Routes</h2>
          <span>Live operational view</span>
        </div>

        <div className="table">
          <div className="row headerRow">
            <span>Route</span><span>School</span><span>Driver</span><span>Status</span><span>Progress</span>
          </div>
          {routes.map((r) => (
            <div className="row" key={r.route}>
              <strong>#{r.route}</strong>
              <span>{r.school}</span>
              <span>{r.driver}</span>
              <span>{r.status}</span>
              <span>{r.progress}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <div className="panelHeader"><h2>Service alert</h2></div>
          <p className="alert">Route #118 is running approximately 8 minutes behind schedule.</p>
        </div>
        <div className="panel">
          <div className="panelHeader"><h2>Operational events</h2></div>
          <p>07:41 — Route #401 — Stop 4 picked up</p>
          <p>07:42 — Route #118 — Delay reported</p>
          <p>07:43 — Route #401 — Stop 5 picked up</p>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}
