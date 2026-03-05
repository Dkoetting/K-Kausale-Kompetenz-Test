import { useState, useEffect, useRef } from "react";

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
        setSeconds(s => {
          if (s <= 1) { clearInterval(intervalRef.current); return 0; }
          return s - 1;
        });
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
    let res;
    if (elapsed < 120) res = "green";
    else if (elapsed <= 300) res = "orange";
    else res = "red";
    const depth = vals.slice(2).reduce((a, v) => a + v.trim().length, 0) / 3;
    if (depth < 40) res = "red";
    else if (depth < 80 && res === "green") res = "orange";
    setResult({ level: res, elapsed });
  };

  const RES = {
    green: { label: "< 2 Minuten", color: C.green, icon: "✓", text: "K² nachgewiesen. Kausalkette ist dokumentierbar. Regulatorisch solide." },
    orange: { label: "2–5 Minuten", color: C.orange, icon: "◑", text: "K² grenzwertig. Erklärbarkeit möglich, aber nicht ad hoc. Dokumentation muss verbessert werden." },
    red: { label: "> 5 Minuten – Eskalation", color: C.red, icon: "✗", text: "K² nicht nachgewiesen. Haftungsrisiko dokumentiert. Sofortmaßnahme erforderlich." },
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
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div style={{ fontSize: 56, color: r.color, marginBottom: 12 }}>{r.icon}</div>
        <div style={{ color: r.color, fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{r.label}</div>
        <div style={{ color: C.grayDark, fontSize: 13, marginBottom: 12 }}>Tatsächliche Zeit: {mm}:{ss} Minuten</div>
        <div style={{ color: C.gray, fontSize: 14, maxWidth: 460, margin: "0 auto 28px", lineHeight: 1.7 }}>{r.text}</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={reset} style={{ padding: "10px 22px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.gray, cursor: "pointer", fontSize: 14 }}>
            Neuer Test
          </button>
          <button onClick={onDone} style={{ padding: "10px 22px", borderRadius: 8, background: C.teal, border: "none", color: C.white, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            Canvas Assessment →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      {!timerActive ? (
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ color: C.grayDark, fontSize: 13, marginBottom: 16 }}>Timer startet wenn Sie auf "Test starten" klicken. Die Uhr läuft während Sie die Fragen beantworten.</div>
          <button onClick={startTimer} style={{ padding: "12px 32px", borderRadius: 10, background: C.teal, border: "none", color: C.white, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>
            ⏱ Test starten
          </button>
        </div>
      ) : (
        <TimerRing seconds={seconds} total={300} />
      )}

      {timerActive && (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {K2_STEPS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? C.teal : C.border, transition: "background 0.3s" }} />
            ))}
          </div>
          <div style={{ color: C.teal, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
            Schritt {step + 1} / {K2_STEPS.length}: {K2_STEPS[step].label}
          </div>
          <div style={{ color: C.white, fontSize: 17, fontWeight: 600, marginBottom: 18, lineHeight: 1.5 }}>{K2_STEPS[step].q}</div>
          <textarea value={cur}
            onChange={e => { const n = [...vals]; n[step] = e.target.value; setVals(n); }}
            rows={4} placeholder="Ihre Antwort..."
            style={{ width: "100%", padding: "13px 15px", background: C.bgCard, border: `1px solid ${valid ? C.teal : C.border}`, borderRadius: 10, color: C.white, fontSize: 14, lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
            <button onClick={() => step > 0 && setStep(s => s - 1)} disabled={step === 0}
              style={{ padding: "10px 20px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: step > 0 ? C.gray : C.grayDark, cursor: step > 0 ? "pointer" : "default", fontSize: 14 }}>
              ← Zurück
            </button>
            {step < K2_STEPS.length - 1
              ? <button onClick={() => valid && setStep(s => s + 1)} disabled={!valid}
                  style={{ padding: "10px 22px", borderRadius: 8, background: valid ? C.teal : C.border, border: "none", color: C.white, cursor: valid ? "pointer" : "default", fontSize: 14, fontWeight: 600 }}>
                  Weiter →
                </button>
              : <button onClick={evaluate} disabled={!allFilled}
                  style={{ padding: "10px 22px", borderRadius: 8, background: allFilled ? C.teal : C.border, border: "none", color: C.white, cursor: allFilled ? "pointer" : "default", fontSize: 14, fontWeight: 600 }}>
                  K² auswerten →
                </button>
            }
          </div>
        </>
      )}
    </div>
  );
}

function FieldCard({ field, answers, onAnswer, open, onToggle }) {
  const filled = answers.filter(Boolean).length;
  const fullCount = answers.filter(v => v === "full").length;
  const missingCount = answers.filter(v => v === "missing").length;
  const total = field.questions.length;
  let dot = C.grayDark;
  if (filled === total) dot = missingCount > 0 ? C.red : fullCount === total ? C.green : C.orange;
  else if (filled > 0) dot = C.orange;
  const OPTS = [
    { k: "full", icon: "✓", color: C.green },
    { k: "partial", icon: "◑", color: C.orange },
    { k: "missing", icon: "✗", color: C.red },
  ];
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${open ? C.teal : C.border}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s" }}>
      <div onClick={onToggle} style={{ padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 13 }}>
        <span style={{ color: C.teal, fontSize: 12, fontWeight: 700, fontFamily: "monospace", minWidth: 22 }}>{field.id}</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{field.title}</div>
          <div style={{ color: C.grayDark, fontSize: 12 }}>{field.sub}</div>
        </div>
        <span style={{ color: C.grayDark, fontSize: 12 }}>{filled}/{total}</span>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot }} />
        <span style={{ color: C.gray, fontSize: 10, display: "inline-block", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "4px 18px 14px" }}>
          {field.questions.map((q, qi) => (
            <div key={qi} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: qi < field.questions.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ flex: 1, color: C.gray, fontSize: 13, lineHeight: 1.5 }}>{q}</span>
              <div style={{ display: "flex", gap: 5 }}>
                {OPTS.map(o => (
                  <button key={o.k} onClick={() => onAnswer(qi, answers[qi] === o.k ? null : o.k)}
                    style={{ width: 30, height: 30, borderRadius: 6, cursor: "pointer", border: `1.5px solid ${answers[qi] === o.k ? o.color : C.border}`, background: answers[qi] === o.k ? o.color + "25" : "transparent", color: answers[qi] === o.k ? o.color : C.grayDark, fontSize: 13, fontWeight: "bold", transition: "all 0.15s" }}>
                    {o.icon}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultModule({ fieldAnswers }) {
  const totalQ = FIELDS.reduce((a, f) => a + f.questions.length, 0);
  const fullQ = FIELDS.reduce((a, f, fi) => a + (fieldAnswers[fi] || []).filter(v => v === "full").length, 0);
  const score = Math.round((fullQ / totalQ) * 100);
  const fieldsComplete = FIELDS.filter((f, fi) => f.questions.every((_, qi) => (fieldAnswers[fi] || [])[qi] === "full")).length;
  const risk = fieldsComplete >= 5 ? "low" : fieldsComplete >= 3 ? "mid" : "high";
  const RISK = {
    low: { label: "Niedrig", color: C.green, text: "Canvas weitgehend vollständig. Governance-Grundlage solide. Kontinuierliche Überprüfung empfohlen." },
    mid: { label: "Mittel", color: C.orange, text: "Kritische Lücken identifiziert. Haftungsrisiko partiell dokumentiert. Priorisierte Schließung notwendig." },
    high: { label: "Hoch", color: C.red, text: "Erhebliche Governance-Lücken. Haftungsrisiko nicht abgesichert. Sofortmaßnahmen erforderlich." },
  };
  const r = RISK[risk];
  const weakFields = FIELDS.filter((f, fi) => f.questions.some((_, qi) => (fieldAnswers[fi] || [])[qi] === "missing"));
  const BOARD_QS = [
    "Ist der Agency Radius technisch erzwungen oder nur dokumentiert?",
    "Weiß Ihr Versicherer, dass Agenten im Einsatz sind?",
    "Ist menschliche Aufsicht gemäß EU AI Act Art. 14 operationalisiert und nachweisbar?",
    "Ist die Delegation gegenüber Aufsichtsrat und Dritten rechtlich belastbar?",
    "Ist der Agent in Ihrem ISMS als Asset geführt und bewertet?",
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Gesamt-Score", val: `${score}%`, color: score >= 75 ? C.green : score >= 50 ? C.orange : C.red },
          { label: "Felder vollständig", val: `${fieldsComplete}/6`, color: fieldsComplete >= 4 ? C.green : C.red },
          { label: "Haftungsrisiko", val: r.label, color: r.color },
        ].map((m, i) => (
          <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 12px", textAlign: "center" }}>
            <div style={{ color: m.color, fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{m.val}</div>
            <div style={{ color: C.grayDark, fontSize: 11 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: r.color + "11", border: `1px solid ${r.color}33`, borderRadius: 12, padding: "13px 17px", marginBottom: 18 }}>
        <div style={{ color: r.color, fontWeight: 700, marginBottom: 4 }}>Risikoeinschätzung: {r.label}</div>
        <div style={{ color: C.gray, fontSize: 14, lineHeight: 1.6 }}>{r.text}</div>
      </div>
      {weakFields.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ color: C.white, fontWeight: 700, marginBottom: 9, fontSize: 14 }}>Prioritäre Handlungsfelder:</div>
          {weakFields.map((f, i) => {
            const fi = FIELDS.indexOf(f);
            const missing = f.questions.filter((_, qi) => (fieldAnswers[fi] || [])[qi] === "missing");
            return (
              <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.red}33`, borderRadius: 10, padding: "10px 14px", marginBottom: 7 }}>
                <div style={{ color: C.red, fontWeight: 600, fontSize: 13, marginBottom: 5 }}>{f.id} {f.title}</div>
                {missing.map((q, j) => <div key={j} style={{ color: C.gray, fontSize: 12, padding: "2px 0 2px 10px", borderLeft: `2px solid ${C.red}44` }}>{q}</div>)}
              </div>
            );
          })}
        </div>
      )}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px", marginBottom: 18 }}>
        <div style={{ color: C.teal, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 9 }}>Board-Fragen Checkliste</div>
        {BOARD_QS.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: 9, padding: "6px 0", borderBottom: i < BOARD_QS.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ color: C.teal, fontSize: 12, flexShrink: 0 }}>→</span>
            <span style={{ color: C.gray, fontSize: 13, lineHeight: 1.5 }}>{q}</span>
          </div>
        ))}
      </div>
      <div style={{ background: C.bgCard, border: `1px solid ${C.red}44`, borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: C.white, fontWeight: 700, marginBottom: 3 }}>30-Minuten Board-Briefing</div>
          <div style={{ color: C.gray, fontSize: 13 }}>Wenn 3 oder mehr Felder nicht vollständig adressiert sind.</div>
        </div>
        <a href="https://dkoetting.github.io/terminbuchung/" target="_blank" rel="noopener noreferrer"
          style={{ color: C.teal, fontSize: 13, fontWeight: 700, marginLeft: 16, whiteSpace: "nowrap", textDecoration: "none" }}>
          → Termin anfragen
        </a>
      </div>
    </div>
  );
}

function WelcomeScreen({ onStart }) {
  const modules = [
    { icon: "⏱", title: "K² Test", sub: "300-Sekunden-Check", desc: "Prüfen Sie, ob Sie die Kausalkette einer autonomen KI-Entscheidung in maximal 5 Minuten ad hoc nachweisen können. Der Timer läuft, sobald Sie starten. Regulatoren werden 2026 genau diese Frage stellen." },
    { icon: "◉", title: "Canvas Assessment", sub: "6 Governance-Dimensionen", desc: "Bewerten Sie jede Dimension des Agentic Authority Canvas: Agency Radius, Delegate Authority, 300-Second Test, Causal Audit Trail, Risk & Liability Mapping, Governance Stack. Je Frage: Vollständig, Teilweise oder Lückenhaft." },
    { icon: "▲", title: "Ergebnis", sub: "Haftungsrisiko-Analyse", desc: "Automatische Auswertung mit Gesamt-Score, Risikoklasse und priorisierten Handlungsfeldern. Inklusive Board-Fragen Checkliste und Empfehlung für nächste Schritte." },
  ];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif", color: C.white, display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: `1200px solid ${C.border}`, padding: "32px 48px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
          <span style={{ fontSize: 18, fontWeight: 800 }}>Agentic Authority</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: C.teal }}>Canvas</span>
        </div>
        <div style={{ color: C.grayDark, fontSize: 10, marginTop: 2, letterSpacing: 1.5, textTransform: "uppercase" }}>
          Governance für Agentic AI · Dr. Dirk Kötting · Dr.DirKInstitut
        </div>
      </div>
      <div style={{ flex: 1, padding: "32px 48px", maxWidth: 1200px, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ color: C.teal, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>
            Governance Assessment Tool
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
            Kein K² ohne Struktur.
          </div>
          <div style={{ color: C.gray, fontSize: 15, maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            K² steht für Kausale Kompetenz: die Fähigkeit, autonome KI-Entscheidungen end-to-end zu durchdringen. Wer das nicht nachweisen kann, haftet persönlich.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 40 }}>
          {modules.map((m, i) => (
            <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 18px" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{m.icon}</div>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{m.title}</div>
              <div style={{ color: C.teal, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{m.sub}</div>
              <div style={{ color: C.gray, fontSize: 13, lineHeight: 1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 40 }}>
          <div style={{ color: C.teal, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>So funktioniert das Assessment</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            {[
              { step: "01", text: "K² Test starten, Timer läuft, 5 Fragen zur Kausalkette beantworten" },
              { step: "02", text: "Canvas Assessment: alle 6 Dimensionen einzeln bewerten" },
              { step: "03", text: "Jede Frage ehrlich einschätzen: Vollständig, Teilweise oder Lückenhaft" },
              { step: "04", text: "Ergebnis: Score, Risikoklasse und konkrete Handlungsfelder" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ color: C.teal, fontSize: 20, fontWeight: 800, fontFamily: "monospace" }}>{s.step}</div>
                <div style={{ color: C.gray, fontSize: 13, lineHeight: 1.5 }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: `${C.red}11`, border: `1px solid ${C.red}33`, borderRadius: 12, padding: "14px 20px", marginBottom: 36, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ color: C.red, fontSize: 18, flexShrink: 0 }}>⚠</span>
          <div style={{ color: C.gray, fontSize: 13, lineHeight: 1.6 }}>
            Dieses Tool ersetzt keine Rechtsberatung. Es dient der strukturierten Selbsteinschätzung im Beratungskontext. Ergebnisse sind intern zu behandeln.
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={onStart}
            style={{ padding: "15px 48px", background: C.teal, border: "none", color: C.white, borderRadius: 12, cursor: "pointer", fontSize: 16, fontWeight: 700, letterSpacing: 0.5 }}>
            Assessment starten →
          </button>
          <div style={{ color: C.grayDark, fontSize: 12, marginTop: 12 }}>ca. 10–15 Minuten · keine Daten werden gespeichert</div>
        </div>
      </div>
    </div>
  );
}

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
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans','Segoe UI',sans-serif", color: C.white }}>
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
            <span style={{ fontSize: 18, fontWeight: 800 }}>Agentic Authority</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: C.teal }}>Canvas</span>
          </div>
          <div style={{ color: C.grayDark, fontSize: 10, marginTop: 2, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Governance für Agentic AI · Dr. Dirk Kötting · K&N EDVKonzepte
          </div>
        </div>
        {tab === "canvas" && (
          <div style={{ textAlign: "right" }}>
            <div style={{ color: C.teal, fontSize: 12, fontWeight: 600 }}>{answeredQ}/{totalQ}</div>
            <div style={{ marginTop: 4, width: 120, background: C.border, borderRadius: 3, height: 3 }}>
              <div style={{ width: `${(answeredQ / totalQ) * 100}%`, height: "100%", background: C.teal, borderRadius: 3, transition: "width 0.4s" }} />
            </div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, padding: "0 24px" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "12px 16px", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? C.teal : "transparent"}`, color: tab === t.id ? C.white : C.grayDark, cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 600 : 400, display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
     <div
  style={{
    padding: "24px 48px",
    maxWidth: "1200px",
    margin: "0 auto",
    boxSizing: "border-box",
  }}
>
  {tab === "k2" && (
    <div>
      <div style={{ marginBottom: 26, maxWidth: 800, margin: "0 auto" }}>
        <div style={{ color: C.teal, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
          300-Sekunden-Check
        </div>
        <div style={{ color: C.white, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
          K² – Kausale Kompetenz Test
        </div>
        <div style={{ color: C.gray, fontSize: 14, lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
          Können Sie die Kausalkette einer autonomen KI-Entscheidung in maximal 5 Minuten ad hoc nachweisen? Regulatoren und Versicherer werden 2026 genau diese Frage stellen.
        </div>
      </div>
      <K2Module onDone={() => setTab("canvas")} />
    </div>
  )}
  {/* canvas / result ... */}
</div>

        )}
        {tab === "canvas" && (
          <div>
            <div style={{ marginBottom: 22 }}>
              <div style={{ color: C.teal, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Self-Assessment</div>
              <div style={{ color: C.white, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Canvas Assessment</div>
              <div style={{ color: C.gray, fontSize: 13 }}>Bewerten Sie jede Dimension: <span style={{ color: C.green }}>✓ Vollständig</span> · <span style={{ color: C.orange }}>◑ Teilweise</span> · <span style={{ color: C.red }}>✗ Lückenhaft</span></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FIELDS.map((f, fi) => (
                <FieldCard key={fi} field={f} answers={fieldAnswers[fi]}
                  onAnswer={(qi, val) => setAnswer(fi, qi, val)}
                  open={openField === fi} onToggle={() => setOpenField(openField === fi ? null : fi)} />
              ))}
            </div>
            {answeredQ >= totalQ * 0.5 && (
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <button onClick={() => setTab("result")} style={{ padding: "13px 36px", background: C.teal, border: "none", color: C.white, borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>
                  Ergebnis auswerten →
                </button>
              </div>
            )}
          </div>
        )}
        {tab === "result" && (
          <div>
            <div style={{ marginBottom: 22 }}>
              <div style={{ color: C.teal, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Auswertung</div>
              <div style={{ color: C.white, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Haftungsrisiko-Analyse</div>
              <div style={{ color: C.gray, fontSize: 13 }}>Basierend auf Ihrem Canvas Assessment</div>
            </div>
            <ResultModule fieldAnswers={fieldAnswers} />
          </div>
        )}
      </div>
    </div>
  );
}
