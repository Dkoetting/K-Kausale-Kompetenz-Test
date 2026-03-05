import React, { useState, useEffect, useRef } from "react";

const C = {
  bg: "#0A1628", bgCard: "#0F1E35", teal: "#00B4D8",
  red: "#E63946", green: "#2ECC71", orange: "#F39C12",
  white: "#FFFFFF", gray: "#B0BEC5", grayDark: "#546E7A", border: "#1E3A5F",
};

const FIELDS = [
  { id: "01", title: "Agency Radius", sub: "Keine Autonomie ohne definierte Grenze", questions: [
    "Monetäre Grenzen sind schriftlich definiert und technisch erzwungen",
    "Rechtliche Grenzen sind dokumentiert und geprüft",
    "Operative Grenzen sind in Code-Logik übersetzt, nicht nur dokumentiert",
    "Max. Transaktionswert ohne Eskalation ist festgelegt",
  ]},
  { id: "02", title: "Delegate Authority", sub: "Haftung folgt Autorität", questions: [
    "Formale Delegationsgrundlage existiert (Vorstandsbeschluss oder IT-Policy)",
    "Prokura-Äquivalenz ist rechtlich geprüft",
    "Eskalationspfad bei Überschreitung ist definiert und getestet",
    "Delegation ist gegenüber Aufsichtsrat und Dritten rechtlich belastbar",
  ]},
  { id: "03", title: "300-Second Test", sub: "Was nicht erklärbar ist, ist nicht kontrollierbar", questions: [
    "Jede autonome Entscheidung ist in max. 5 Minuten kausal erklärbar",
    "Verantwortlicher für den Test ist namentlich benannt",
    "Letzter Test wurde dokumentiert und archiviert",
    "Nächster Test ist terminiert",
  ]},
  { id: "04", title: "Causal Audit Trail", sub: "Was nicht rekonstruierbar ist, ist nicht auditierbar", questions: [
    "Input-Daten jeder Entscheidung sind vollständig protokolliert",
    "Entscheidungslogik ist vollständig rekonstruierbar",
    "Tool Calls und API-Aufrufe sind lückenlos geloggt",
    "Log-Aufbewahrung entspricht regulatorischen Anforderungen",
  ]},
  { id: "05", title: "Risk & Liability Mapping", sub: "Wer trägt die Haftung?", questions: [
    "Operator-Rolle gemäß EU AI Act ist formal zugewiesen",
    "Risk Appetite ist vom Aufsichtsrat formell beschlossen und dokumentiert",
    "D&O-Versicherung wurde auf autonome Systeme geprüft",
    "Max. tolerierter Schaden pro Entscheidung ist quantifiziert",
  ]},
  { id: "06", title: "Governance Stack", sub: "Kein Agent außerhalb des Governance-Stacks", questions: [
    "ISO 42001 AIMS Status ist bekannt und dokumentiert",
    "Agent ist im ISMS (ISO 27001) als Asset geführt und bewertet",
    "EU AI Act Einstufung (Hochrisiko?) ist durchgeführt",
    "DSGVO-Folgeabschätzung ist abgeschlossen",
  ]},
];

const K2_STEPS = [
  { label: "Use Case", q: "Welcher KI-Agent / welcher Use Case wird getestet?" },
  { label: "Entscheidung", q: "Beschreiben Sie die letzte autonome Entscheidung des Agenten (1–2 Sätze):" },
  { label: "Input-Klarheit", q: "Welche Datenbasis lag der Entscheidung zugrunde?" },
  { label: "Logik-Transparenz", q: "Warum wurde diese Option gewählt und nicht eine Alternative?" },
  { label: "Impact-Kontrolle", q: "Welche Kausalkette wurde durch die Entscheidung ausgelöst?" },
];

const PrintStyles = () => (
  <style>{`
    @media print {
      body { background: white !important; color: black !important; margin: 0; padding: 0; }
      .no-print { display: none !important; }
      .print-only { display: block !important; color: black !important; }
      .card { border: 1px solid #eee !important; page-break-inside: avoid; background: white !important; margin-bottom: 20px !important; }
      h1, h2, h3 { color: black !important; }
      @page { size: A4; margin: 1.5cm; }
      .app-container { padding: 0 !important; width: 100% !important; max-width: none !important; }
    }
    .print-only { display: none; }
  `}</style>
);

function TimerRing({ seconds, total }) {
  const pct = seconds / total;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const color = seconds > 180 ? C.green : seconds > 60 ? C.orange : C.red;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="no-print" style={{ position: "relative", width: 130, height: 130, margin: "0 auto 24px" }}>
      <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke={C.border} strokeWidth="6" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color, fontSize: 26, fontWeight: 800, fontFamily: "monospace" }}>{mm}:{ss}</div>
      </div>
    </div>
  );
}

function K2Module({ onDone }) {
  const [step, setStep] = useState(0);
  const [vals, setVals] = useState(Array(5).fill(""));
  const [result, setResult] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(300);
  const intervalRef = useRef(null);

  const startTimer = () => {
    setTimerActive(true);
    intervalRef.current = setInterval(() => {
      setSeconds(s => (s <= 1 ? 0 : s - 1));
    }, 1000);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  if (result) return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2 style={{ color: C.teal }}>K² Test abgeschlossen</h2>
      <p style={{ color: C.white, marginBottom: "30px" }}>Dauer: {300 - result.elapsed} Sekunden</p>
      <button className="no-print" onClick={onDone} style={{ padding: "15px 40px", background: C.teal, border: "none", color: C.white, borderRadius: 10, cursor: "pointer", fontWeight: 700 }}>
        Weiter zum Canvas Assessment →
      </button>
    </div>
  );

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {!timerActive ? (
        <button onClick={startTimer} style={{ padding: "20px 60px", background: C.teal, color: C.white, borderRadius: 12, border: "none", fontSize: 20, fontWeight: 800, cursor: "pointer" }}>
          ⏱ K² TEST STARTEN
        </button>
      ) : (
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
          <TimerRing seconds={seconds} total={300} />
          <h3>{K2_STEPS[step].q}</h3>
          <textarea value={vals[step]} onChange={e => { const n = [...vals]; n[step] = e.target.value; setVals(n); }}
            style={{ width: "100%", minHeight: "150px", background: C.bgCard, border: `1px solid ${C.border}`, color: C.white, padding: "15px", borderRadius: 10 }} />
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0} style={{ color: C.gray, background: "none", border: "none", cursor: "pointer" }}>Zurück</button>
            <button onClick={() => step < 4 ? setStep(s => s + 1) : setResult({ elapsed: seconds })} style={{ padding: "10px 30px", background: C.teal, border: "none", color: C.white, borderRadius: 8, cursor: "pointer" }}>
              {step < 4 ? "Nächste Frage" : "Abschließen"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldCard({ field, answers, onAnswer, open, onToggle }) {
  const OPTS = [{ k: "full", icon: "✓", label: "Vollständig" }, { k: "partial", icon: "◑", label: "Teilweise" }, { k: "missing", icon: "✗", label: "Lücke" }];
  return (
    <div className="card" style={{ background: C.bgCard, border: `1px solid ${open ? C.teal : C.border}`, borderRadius: 12, marginBottom: 12, width: "100%" }}>
      <div onClick={onToggle} style={{ padding: "20px", cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 800, color: C.white }}>{field.id} · {field.title}</span>
        <span className="no-print" style={{ color: C.grayDark }}>{open ? "▲" : "▼"}</span>
      </div>
      {(open || typeof window === 'undefined') && (
        <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${C.border}` }}>
          {field.questions.map((q, qi) => (
            <div key={qi} style={{ display: "flex", alignItems: "center", gap: "20px", padding: "12px 0", borderBottom: `1px solid ${C.border}33` }}>
              <span style={{ flex: 1, color: C.gray }}>{q}</span>
              <div className="no-print" style={{ display: "flex", gap: "8px" }}>
                {OPTS.map(o => (
                  <button key={o.k} onClick={(e) => { e.stopPropagation(); onAnswer(qi, o.k); }}
                    style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${answers[qi] === o.k ? C.teal : C.border}`, background: answers[qi] === o.k ? C.teal : "transparent", color: C.white, cursor: "pointer" }}>
                    {o.icon} {o.label}
                  </button>
                ))}
              </div>
              <div className="print-only" style={{ color: "black", fontWeight: "bold" }}>
                Status: {answers[qi] || "Nicht bewertet"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState("k2");
  const [fieldAnswers, setFieldAnswers] = useState(FIELDS.map(f => Array(f.questions.length).fill(null)));

  if (!started) return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h1 style={{ fontSize: "56px" }}>Agentic Authority <span style={{ color: C.teal }}>Canvas</span></h1>
        <button onClick={() => setStarted(true)} style={{ padding: "20px 80px", background: C.teal, border: "none", color: C.white, borderRadius: 15, fontSize: "22px", fontWeight: 800, cursor: "pointer" }}>
          START
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-container" style={{ minHeight: "100vh", background: C.bg, color: C.white, width: "100%" }}>
      <PrintStyles />
      <div className="no-print" style={{ borderBottom: `1px solid ${C.border}`, padding: "20px 40px", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 900 }}>AGENTIC AUTHORITY CANVAS</div>
        <div style={{ display: "flex", gap: "30px" }}>
          {["k2", "canvas", "result"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", color: tab === t ? C.teal : C.gray, cursor: "pointer", fontWeight: 700 }}>{t.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "40px", width: "100%", boxSizing: "border-box" }}>
        {tab === "k2" && <K2Module onDone={() => setTab("canvas")} />}
        
        {tab === "canvas" && (
          <div style={{ width: "100%" }}>
            {FIELDS.map((f, fi) => (
              <FieldCard key={fi} field={f} answers={fieldAnswers[fi]} 
                onAnswer={(qi, val) => { const n = [...fieldAnswers]; n[fi][qi] = val; setFieldAnswers(n); }} 
                open={true} />
            ))}
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <button className="no-print" onClick={() => setTab("result")} style={{ padding: "15px 50px", background: C.teal, borderRadius: 10, border: "none", color: C.white, fontWeight: 700, cursor: "pointer" }}>
                Ergebnis generieren →
              </button>
            </div>
          </div>
        )}

        {tab === "result" && (
          <div style={{ width: "100%" }}>
            <h1 style={{ color: C.teal }}>Assessment Ergebnis</h1>
            <div className="card" style={{ background: C.bgCard, padding: "30px", borderRadius: 15, border: `1px solid ${C.border}` }}>
              <h3>Governance Status: Bereit für den Board-Review</h3>
              <p style={{ color: C.gray }}>Das Agentic Authority Canvas wurde vollständig durchlaufen. Die folgenden Daten sind als PDF-Export für die Dokumentation nach EU AI Act und ISO 42001 vorgesehen.</p>
            </div>
            <div className="no-print" style={{ marginTop: "40px", display: "flex", gap: "20px", justifyContent: "center" }}>
              <button onClick={() => window.print()} style={{ padding: "20px 60px", background: C.white, color: C.bg, borderRadius: 12, fontWeight: 800, border: "none", cursor: "pointer" }}>
                📄 PDF SPEICHERN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
