import React, { useState, useEffect, useRef } from "react";

// --- DATA & LOGIC ---
const initialClients = [
  { id: 1, name: "Valentina Rios", phone: "5491122334455", history: [true, true, false] },
  { id: 2, name: "Mateo González", phone: "5491133445566", history: [true, true, true] },
  { id: 3, name: "Lucía Fernández", phone: "5491144556677", history: [false, false] },
  { id: 4, name: "Tomás Herrera", phone: "5491155667788", history: [true, false] },
  { id: 5, name: "Camila Suárez", phone: "5491166778899", history: [true, true] }
]; [cite: 4, 18, 19]

const initialAppointments = [
  { id: 1, clientId: 1, date: "2026-04-02", time: "10:00", service: "Corte de cabello", attended: null },
  { id: 2, clientId: 2, date: "2026-04-02", time: "11:30", service: "Coloración", attended: null },
  { id: 3, clientId: 3, date: "2026-04-03", time: "09:00", service: "Manicura", attended: null },
  { id: 4, clientId: 4, date: "2026-04-03", time: "14:00", service: "Consulta médica", attended: null },
  { id: 5, clientId: 5, date: "2026-04-04", time: "16:00", service: "Tratamiento", attended: null }
]; [cite: 23, 31, 39, 47, 54]

function getAttendanceRate(history) {
  if (!history.length) return 0;
  return Math.round((history.filter(Boolean).length / history.length) * 100);
} [cite: 62, 63, 64]

function getCategory(rate) {
  if (rate >= 80) return "confiable";
  if (rate >= 50) return "intermitente";
  return "ausente";
} [cite: 66, 68, 70, 71]

const CATEGORY_META = {
  confiable: {
    label: "Confiable",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    icon: "✓",
    daysAhead: 1,
    msgTemplate: (name, date, time, service) => `Hola ${name}! Te recordamos tu turno de *${service}* el *${date}* a las ${time}. ¡Te esperamos!`
  }, [cite: 74, 75, 76, 79, 80]
  intermitente: {
    label: "Intermitente",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    icon: "!",
    daysAhead: 2,
    msgTemplate: (name, date, time, service) => `Hola ${name}, ¿cómo estás? Te escribimos para confirmar tu turno de *${service}* el *${date}* a las ${time}. ¿Nos confirmás si asistís?`
  }, [cite: 84, 85, 88, 89]
  ausente: {
    label: "Alta ausencia",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    icon: "⚠",
    daysAhead: 3,
    msgTemplate: (name, date, time, service) => `Hola ${name}. Queremos recordarte tu turno de *${service}* el *${date}* a las ${time}. Por favor, confirmanos con un SÍ o NO para mantener el espacio.`
  } [cite: 92, 94, 98, 99]
};

function buildMessage(client, appointment) {
  const rate = getAttendanceRate(client.history);
  const cat = getCategory(rate);
  const meta = CATEGORY_META[cat];
  const dateStr = new Date(appointment.date + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long"
  }); [cite: 104, 105, 106, 107, 108]
  return meta.msgTemplate(client.name.split(" ")[0], dateStr, appointment.time, appointment.service);
} [cite: 111]

// --- ICONS ---
const Icon = ({ name, size = 18 }) => {
  const icons = {
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    whatsapp: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    brain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"></path></svg>
  }; [cite: 115, 116, 118]
  return icons[name] || null;
}; [cite: 119]

// --- COMPONENTS ---
function Badge({ category }) {
  const meta = CATEGORY_META[category];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20,
      background: meta.bg, color: meta.color,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
    }}>
      <span style={{ fontSize: 9 }}>{meta.icon}</span>
      {meta.label.toUpperCase()}
    </span>
  );
} [cite: 125, 126, 129, 131, 134, 135]

function MiniBar({ value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120, marginTop: 6 }}>
      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32 }}>{value}%</span>
    </div>
  );
} [cite: 137, 139, 140, 141, 142, 143, 146]

function ModalOverlay({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20, backdropFilter: "blur(4px)",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#141418", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16, padding: 28, width: "100%", maxWidth: 480,
      }}>
        {children}
      </div>
    </div>
  );
} [cite: 149, 151, 152, 153, 154, 156, 157, 158, 160]

function WhatsAppPreview({ message, phone, onClose }) {
  const [sent, setSent] = useState(false);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`; [cite: 164, 165, 166]
  return (
    <ModalOverlay onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ color: "#25D366" }}><Icon name="whatsapp" size={22} /></span>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Vista previa del mensaje</h3>
      </div>
      <div style={{ background: "#0b1f0e", borderRadius: 12, padding: 16, border: "1px solid rgba(37,211,102,0.2)", marginBottom: 20 }}>
        <div style={{ background: "#005c4b", borderRadius: "12px 12px 2px 12px", padding: "10px 14px", color: "#e2fce7", fontSize: 14 }}>
          {message}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", cursor: "pointer" }}>Cerrar</button>
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ flex: 2, textDecoration: "none" }} onClick={() => setSent(true)}>
          <button style={{ width: "100%", padding: "10px", borderRadius: 8, background: "#25D366", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Icon name="whatsapp" size={16} /> {sent ? "Mensaje enviado" : "Abrir en WhatsApp"}
          </button>
        </a>
      </div>
    </ModalOverlay>
  );
} [cite: 167, 168, 170, 171, 175, 184, 185, 186, 190, 191, 192, 194, 195, 197, 199]

// --- MAIN APP ---
export default function TurnoSmart() {
  const [view, setView] = useState("dashboard");
  const [clients, setClients] = useState(initialClients);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [preview, setPreview] = useState(null);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [addApptOpen, setAddApptOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [aiLoading, setAiLoading] = useState(null); [cite: 205, 206, 207, 208, 209, 210, 211, 212, 213]

  const [newClient, setNewClient] = useState({ name: "", phone: "" });
  const [newAppt, setNewAppt] = useState({ clientId: "", date: "", time: "", service: "" }); [cite: 217, 219]

  const notify = (msg, ok = true) => {
    setNotification({ msg, ok });
    setTimeout(() => setNotification(null), 3000);
  }; [cite: 220, 222, 223]

  const addClient = () => {
    if (!newClient.name || !newClient.phone) return notify("Completá todos los campos", false);
    setClients(prev => [...prev, { id: Date.now(), name: newClient.name, phone: newClient.phone, history: [] }]);
    setNewClient({ name: "", phone: "" });
    setAddClientOpen(false);
    notify("Cliente agregado");
  }; [cite: 225, 226, 227, 228, 229]

  const addAppt = () => {
    if (!newAppt.clientId || !newAppt.date || !newAppt.time || !newAppt.service) return notify("Completá los campos", false);
    setAppointments(prev => [...prev, { id: Date.now(), ...newAppt, clientId: Number(newAppt.clientId), attended: null }]);
    setNewAppt({ clientId: "", date: "", time: "", service: "" });
    setAddApptOpen(false);
    notify("Turno agregado");
  }; [cite: 230, 231, 233, 234, 235]

  const markAttended = (apptId, attended) => {
    const appt = appointments.find(a => a.id === apptId);
    setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, attended } : a));
    setClients(prev => prev.map(c => c.id === appt.clientId ? { ...c, history: [...c.history, attended] } : c));
    notify(attended ? "Asistencia registrada" : "Ausencia registrada");
  }; [cite: 238, 240, 241, 242, 243]

  const sendReminder = (appt) => {
    const client = clients.find(c => c.id === appt.clientId);
    if (!client) return;
    const msg = buildMessage(client, appt);
    setPreview({ message: msg, phone: client.phone });
  }; [cite: 280, 282, 283, 285]

  // Stats
  const totalAppts = appointments.length;
  const attendedCount = appointments.filter(a => a.attended === true).length;
  const missedCount = appointments.filter(a => a.attended === false).length;
  const pendingCount = appointments.filter(a => a.attended === null).length; [cite: 287, 293, 294, 295]

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "chart" },
    { id: "turnos", label: "Turnos", icon: "calendar" },
    { id: "clientes", label: "Clientes", icon: "users" }
  ]; [cite: 300, 301, 303, 304, 305]

  const inputStyle = { width: "100%", padding: "10px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", marginBottom: 10 };
  const labelStyle = { fontSize: 12, color: "#888", marginBottom: 5, display: "block" }; [cite: 307, 309, 310, 311, 312]

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c10", color: "#f0f0f4", fontFamily: "sans-serif" }}>
      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 2000, background: notification.ok ? "#22c55e" : "#ef4444", padding: "10px 20px", borderRadius: 8 }}>
          {notification.msg}
        </div>
      )} [cite: 320, 321, 322, 323, 324, 328]

      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>TS</div>
          <span style={{ fontWeight: 800, fontSize: 17 }}>TurnoSmart</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#888", fontSize: 12 }}>
          <Icon name="brain" size={14} /> IA Activa
        </div>
      </header> [cite: 331, 332, 333, 335, 336, 337, 341, 345, 346]

      <nav style={{ display: "flex", gap: 10, padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setView(n.id)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: view === n.id ? "rgba(99,102,241,0.2)" : "transparent", color: view === n.id ? "#818cf8" : "#666", fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name={n.icon} size={16} /> {n.label}
          </button>
        ))}
      </nav> [cite: 350, 351, 353, 354, 355, 356, 359]

      <main style={{ padding: "24px 20px", maxWidth: 900, margin: "0 auto" }}>
        {view === "dashboard" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Resumen general</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 15, marginBottom: 30 }}>
              {[
                { label: "Total turnos", val: totalAppts, color: "#6366f1", icon: <Icon name="calendar" /> },
                { label: "Asistieron", val: attendedCount, color: "#22c55e", icon: <Icon name="check" /> },
                { label: "Ausentes", val: missedCount, color: "#ef4444", icon: <Icon name="x" /> }
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", padding: "20px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ color: s.color, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )} [cite: 366, 368, 371, 374, 377, 378, 379, 381]

        {view === "turnos" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2>Gestión de Turnos</h2>
              <button onClick={() => setAddApptOpen(true)} style={{ background: "#6366f1", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>+ Nuevo Turno</button>
            </div>
            {appointments.map(appt => {
              const client = clients.find(c => c.id === appt.clientId);
              const rate = getAttendanceRate(client?.history || []);
              const cat = getCategory(rate);
              return (
                <div key={appt.id} style={{ background: "rgba(255,255,255,0.04)", padding: "16px", borderRadius: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{client?.name} <Badge category={cat} /></div>
                    <div style={{ fontSize: 13, color: "#888" }}>{appt.service} - {appt.date} {appt.time}</div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => sendReminder(appt)} style={{ background: "rgba(37,211,102,0.1)", color: "#25D366", border: "none", padding: "8px", borderRadius: 8, cursor: "pointer" }}><Icon name="send" size={14} /></button>
                    {appt.attended === null && (
                      <>
                        <button onClick={() => markAttended(appt.id, true)} style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "none", padding: "8px", borderRadius: 8, cursor: "pointer" }}><Icon name="check" size={14} /></button>
                        <button onClick={() => markAttended(appt.id, false)} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", padding: "8px", borderRadius: 8, cursor: "pointer" }}><Icon name="x" size={14} /></button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )} [cite: 438, 439, 440, 441, 442, 443]
      </main>

      {addApptOpen && (
        <ModalOverlay onClose={() => setAddApptOpen(false)}>
          <h3>Nuevo Turno</h3>
          <label style={labelStyle}>Cliente</label>
          <select style={inputStyle} onChange={e => setNewAppt({...newAppt, clientId: e.target.value})}>
            <option value="">Seleccionar...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label style={labelStyle}>Servicio</label>
          <input style={inputStyle} placeholder="Ej: Corte" onChange={e => setNewAppt({...newAppt, service: e.target.value})} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input type="date" style={inputStyle} onChange={e => setNewAppt({...newAppt, date: e.target.value})} />
            <input type="time" style={inputStyle} onChange={e => setNewAppt({...newAppt, time: e.target.value})} />
          </div>
          <button onClick={addAppt} style={{ width: "100%", background: "#6366f1", color: "#fff", padding: "12px", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer" }}>Guardar Turno</button>
        </ModalOverlay>
      )} [cite: 452, 453, 454]

      {preview && <WhatsAppPreview message={preview.message} phone={preview.phone} onClose={() => setPreview(null)} />} [cite: 455]
    </div>
  );
}
