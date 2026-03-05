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

function TimerRing({ seconds, total }) {
  const pct = seconds / total;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const color = seconds > 180 ? C.green : seconds > 60 ? C.orange : C.red;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto 24px" }}>
      <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke={C.border} strokeWidth="6" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color, fontSize: 26, fontWeight: 800, fontFamily: "monospace", lineHeight: 1 }}>{mm}:{ss}</div>
        <div style={{ color: C.grayDark, fontSize: 10, marginTop: 3, textTransform: "uppercase", letterSpacing: 1 }}>verbleibend</div>
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
    if (!timerActive) {
      setTimerActive(true);
      intervalRef.current = setInterval(() => {
        setSeconds(s => s <= 1 ? (clearInterval(intervalRef.current), 0) : s - 1);
      }, 1000);
    }
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const cur = vals[step];
  const valid = cur.trim().length > 8;
  const allFilled = vals.every(v => v.trim().length > 8);

  const evaluate = () => {
    clearInterval(intervalRef.current);
    const elapsed = 300 - seconds;
    let res = elapsed < 120 ? "green" : elapsed <= 300 ? "orange" : "red";
    const depth = vals.slice(2).reduce((a, v) => a + v.trim().length, 0) / 3;
    if (depth < 40) res = "red";
    else if (depth < 80 && res === "green") res = "orange";
    setResult({ level: res, elapsed });
  };

  const RES = {
    green:  { label: "< 2 Minuten",   color: C.green,  icon: "✓", text: "K² nachgewiesen. Kausalkette ist dokumentierbar. Regulatorisch solide." },
    orange: { label: "2–5 Minuten",   color: C.orange, icon: "◑", text: "K² grenzwertig. Erklärbarkeit möglich, aber nicht ad hoc. Dokumentation muss verbessert werden." },
    red:    { label: "> 5 Minuten – Eskalation", color: C.red, icon: "✗", text: "K² nicht nachgewiesen. Haftungsrisiko dokumentiert. Sofortmaßnahme erforderlich." },
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setResult(null); setStep(0); setVals(Array(5).fill(""));
    setSeconds(300); setTimerActive(false);
  };

  if (result) {
    const r = RES[result.level];
    const elapsed = result.elapsed;
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");
    return (
      <div style={{ textAlign: "center", padding: "32px 0", width: "100%" }}>
        <div style={{ fontSize: 56, color: r.color, marginBottom: 12 }}>{r.icon}</div>
        <div style={{ color: r.color, fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{r.label}</div>
        <div style={{ color: C.grayDark, fontSize: 13, marginBottom: 12 }}>Tatsächliche Zeit: {mm}:{ss} Minuten</div>
        <div style={{ color: C.gray, fontSize: 14, maxWidth: 600, margin: "0 auto 28px", lineHeight: 1.7 }}>{r.text}</div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={reset} style={{ padding: "12px 28px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.gray, cursor: "pointer", fontSize: 15 }}>
            Neuer Test
          </button>
          <button onClick={onDone} style={{ padding: "12px 28px", borderRadius: 8, background: C.teal, border: "none", color: C.white, cursor: "pointer", fontSize: 15, fontWeight: 600 }}>
            Canvas Assessment →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "min(1100px, 92vw)", margin: "0 auto" }}>
      {!timerActive ? (
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ color: C.grayDark, fontSize: 14, marginBottom: 20, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
            Timer startet wenn Sie auf "Test starten" klicken. Die Uhr läuft während Sie die Fragen beantworten.
          </div>
          <button onClick={startTimer} style={{ padding: "14px 48px", borderRadius: 12, background: C.teal, border: "none", color: C.white, cursor: "pointer", fontSize: 16, fontWeight: 700 }}>
            ⏱ Test starten
          </button>
        </div>
      ) : (
        <TimerRing seconds={seconds} total={300} />
      )}

      {timerActive && (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            {K2_STEPS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= step ? C.teal : C.border, transition: "background 0.4s" }} />
            ))}
          </div>

          <div style={{ color: C.teal, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.6, marginBottom: 10 }}>
            Schritt {step + 1} / {K2_STEPS.length}: {K2_STEPS[step].label}
          </div>

          <div style={{ color: C.white, fontSize: 18, fontWeight: 600, marginBottom: 20, lineHeight: 1.5, maxWidth: "100%" }}>
            {K2_STEPS[step].q}
          </div>

          <textarea
            value={cur}
            onChange={e => { const n = [...vals]; n[step] = e.target.value; setVals(n); }}
            rows={6}
            placeholder="Ihre Antwort..."
            style={{
              width: "100%",
              padding: "16px 20px",
              background: C.bgCard,
              border: `1px solid ${valid ? C.teal : C.border}`,
              borderRadius: 12,
              color: C.white,
              fontSize: 16,
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              minHeight: 140
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, flexWrap: "wrap", gap: 12 }}>
            <button
              onClick={() => step > 0 && setStep(s => s - 1)}
              disabled={step === 0}
              style={{
                padding: "12px 28px",
                borderRadius: 10,
                background: "transparent",
                border: `1px solid ${step > 0 ? C.border : C.grayDark}`,
                color: step > 0 ? C.gray : C.grayDark,
                cursor: step > 0 ? "pointer" : "default",
                fontSize: 15
              }}
            >← Zurück</button>

            {step < K2_STEPS.length - 1 ? (
              <button
                onClick={() => valid && setStep(s => s + 1)}
                disabled={!valid}
                style={{
                  padding: "12px 32px",
                  borderRadius: 10,
                  background: valid ? C.teal : C.border,
                  border: "none",
                  color: C.white,
                  cursor: valid ? "pointer" : "default",
                  fontSize: 15,
                  fontWeight: 600
                }}
              >Weiter →</button>
            ) : (
              <button
                onClick={evaluate}
                disabled={!allFilled}
                style={{
                  padding: "12px 32px",
                  borderRadius: 10,
                  background: allFilled ? C.teal : C.border,
                  border: "none",
                  color: C.white,
                  cursor: allFilled ? "pointer" : "default",
                  fontSize: 15,
                  fontWeight: 600
                }}
              >K² auswerten →</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Rest des Codes (FieldCard, ResultModule, WelcomeScreen, App) folgt ...
// ────────────────────────────────────────────────────────────────────────────────

// ... (die Funktionen FieldCard, ResultModule und WelcomeScreen bleiben weitgehend gleich,
//      nur die umschließenden divs bekommen breitere maxWidth-Werte)

function FieldCard({ field, answers, onAnswer, open, onToggle }) {
  // ... (Inhalt unverändert – nur Styling etwas angepasst, falls gewünscht)
  // z. B. padding: "18px 24px" statt kleiner Werte
}

// ... (ResultModule, WelcomeScreen wie in vorheriger Version – nur die Grids / Container breiter)

export default function App() {
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState("k2");
  const [openField, setOpenField] = useState(null);
  const [fieldAnswers, setFieldAnswers] = useState(FIELDS.map(f => Array(f.questions.length).fill(null)));

  const totalQ = FIELDS.reduce((a, f) => a + f.questions.length, 0);
  const answeredQ = fieldAnswers.reduce((a, fa) => a + fa.filter(Boolean).length, 0);

  const setAnswer = (fi, qi, val) =>
    setFieldAnswers(prev => prev.map((fa, i) => i === fi ? fa.map((v, j) => j === qi ? val : v) : fa));

  if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />;

  const TABS = [
    { id: "k2", label: "K² Test", icon: "⏱" },
    { id: "canvas", label: "Canvas Assessment", icon: "◉" },
    { id: "result", label: "Ergebnis", icon: "▲" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      color: C.white,
      width: "100vw",
      margin: 0,
      overflowX: "hidden"
    }}>
      {/* Header + Tabs bleiben ähnlich – padding mit clamp */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "20px clamp(24px, 5vw, 80px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* ... Header-Inhalt ... */}
      </div>

      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, padding: "0 clamp(24px, 5vw, 80px)" }}>
        {/* Tabs ... */}
      </div>

      <main style={{
        padding: "clamp(24px, 4vw, 64px) clamp(16px, 5vw, 96px)",
        width: "100%",
        maxWidth: "none",
        margin: "0 auto",
        boxSizing: "border-box"
      }}>
        {tab === "k2" && (
          <div style={{ width: "100%" }}>
            <div style={{ marginBottom: 48, textAlign: "center", maxWidth: "min(1000px, 90vw)", marginLeft: "auto", marginRight: "auto" }}>
              {/* K² Überschrift ... */}
            </div>
            <K2Module onDone={() => setTab("canvas")} />
          </div>
        )}

        {tab === "canvas" && (
          <div style={{ width: "100%" }}>
            {/* Überschrift Canvas ... */}

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              width: "100%",
              maxWidth: "min(1200px, 94vw)",
              margin: "0 auto"
            }}>
              {FIELDS.map((f, fi) => (
                <FieldCard
                  key={fi}
                  field={f}
                  answers={fieldAnswers[fi]}
                  onAnswer={(qi, val) => setAnswer(fi, qi, val)}
                  open={openField === fi}
                  onToggle={() => setOpenField(openField === fi ? null : fi)}
                />
              ))}
            </div>

            {/* Auswerten-Button ... */}
          </div>
        )}

        {tab === "result" && (
          <div>
            {/* Result-Überschrift ... */}
            <ResultModule fieldAnswers={fieldAnswers} />
          </div>
        )}
      </main>
    </div>
  );
}
