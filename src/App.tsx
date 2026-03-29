const initialClients = [
 { id: 1, name: "Valentina Ríos", phone: "5491122334455", history: [true, true, true, true, false] },
 { id: 2, name: "Mateo González", phone: "5491133445566", history: [true, false, false, true, false] },
 { id: 3, name: "Lucía Fernández", phone: "5491144556677", history: [false, false, false, true, false] },
 { id: 4, name: "Tomás Herrera", phone: "5491155667788", history: [true, true, false, true, true] },
 { id: 5, name: "Camila Suárez", phone: "5491166778899", history: [true, false, true, false, true] },
];
const initialAppointments = [
 { id: 1, clientId: 1, date: "2026-04-02", time: "10:00", service: "Corte de cabello", attended: null },
 { id: 2, clientId: 2, date: "2026-04-02", time: "11:30", service: "Coloración", attended: null },
 { id: 3, clientId: 3, date: "2026-04-03", time: "09:00", service: "Manicura", attended: null },
 { id: 4, clientId: 4, date: "2026-04-03", time: "14:00", service: "Consulta médica", attended: null },
 { id: 5, clientId: 5, date: "2026-04-04", time: "16:00", service: "Tratamiento facial", attended: null },
];
function getAttendanceRate(history) {
 if (!history.length) return 0;
 return Math.round((history.filter(Boolean).length / history.length) * 100);
}
function getCategory(rate) {
 if (rate >= 80) return "confiable";
 if (rate >= 50) return "intermitente";
 return "ausente";
}
const CATEGORY_META = {
 confiable: {
 label: "Confiable",
 color: "#22c55e",
 bg: "rgba(34,197,94,0.12)",
 icon: "✦",
 daysAhead: 1,
 msgTemplate: (name, date, time, service) =>
 `Hola ${name} Te recordamos tu turno de *${service}* el *${date}* a las *${time}*. ¡Te esperamos! `,
 },
 intermitente: {
 label: "Intermitente",
 color: "#f59e0b",
 bg: "rgba(245,158,11,0.12)",
 icon: "◈",
 daysAhead: 2,
 msgTemplate: (name, date, time, service) =>
 `Hola ${name} Te recordamos tu turno de *${service}* el *${date}* a las *${time}*. Por favor confirmanos si vas a asistir respondiendo este mensaje. ¡Gracias! `,
 },
 ausente: {
 label: "Alta ausencia",
 color: "#ef4444",
 bg: "rgba(239,68,68,0.12)",
 icon: "⬡",
 daysAhead: 3,
 msgTemplate: (name, date, time, service) =>
 `Hola ${name} Queremos recordarte tu turno de *${service}* el *${date}* a las *${time}*. Es importante que nos avises si no podés asistir para liberar el horario. Respondé *SÍ* para confirmar o *NO* para cancelar. ¡Muchas gracias! `,
 },
};
function buildMessage(client, appointment) {
 const rate = getAttendanceRate(client.history);
 const cat = getCategory(rate);
 const meta = CATEGORY_META[cat];
 const dateStr = new Date(appointment.date + "T12:00:00").toLocaleDateString("es-AR", {
 weekday: "long", day: "numeric", month: "long",
 });
 return meta.msgTemplate(client.name.split(" ")[0], dateStr, appointment.time, appointment.service);
}
// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
 const icons = {
 calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
 users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
 message: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
 plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
 check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
 x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
 send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
 chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
 trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
 whatsapp: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.62a.75.75 0 0 0 .918.928l5.9-1.481A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.944 0-3.769-.525-5.328-1.436l-.38-.222-3.942.99.997-3.853-.246-.4A10 10 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>,
 brain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.16z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.16z"/></svg>,
 };
 return icons[name] || null;
};
// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Badge({ category }) {
 const meta = CATEGORY_META[category];
 return (
 <span style={{
 display: "inline-flex", alignItems: "center", gap: 5,
 padding: "3px 10px", borderRadius: 20,
 background: meta.bg, color: meta.color,
 fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
 fontFamily: "inherit",
 }}>
 <span style={{ fontSize: 9 }}>{meta.icon}</span>
 {meta.label.toUpperCase()}
 </span>
 );
}
function MiniBar({ value, color }) {
 return (
 <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
 <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
 <div style={{
 width: `${value}%`, height: "100%",
 background: color, borderRadius: 3,
 transition: "width 0.6s ease",
 }} />
 </div>
 <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32, textAlign: "right" }}>{value}%</span>
 </div>
 );
}
function ModalOverlay({ children, onClose }) {
 return (
 <div onClick={onClose} style={{
 position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
 display: "flex", alignItems: "center", justifyContent: "center",
 zIndex: 1000, padding: 20, backdropFilter: "blur(4px)",
 }}>
 <div onClick={e => e.stopPropagation()} style={{
 background: "#141418", border: "1px solid rgba(255,255,255,0.1)",
 borderRadius: 16, padding: 28, width: "100%", maxWidth: 480,
 boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
 }}>
 {children}
 </div>
 </div>
 );
}
function WhatsAppPreview({ message, phone, onClose }) {
 const [sent, setSent] = useState(false);
 const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
 return (
 <ModalOverlay onClose={onClose}>
 <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
 <span style={{ color: "#25D366" }}><Icon name="whatsapp" size={22} /></span>
 <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Vista previa del mensaje</h3>
 </div>
 <div style={{
 background: "#0b1f0e", borderRadius: 12, padding: 16,
 border: "1px solid rgba(37,211,102,0.2)", marginBottom: 20,
 fontFamily: "'Segoe UI', sans-serif", fontSize: 14, lineHeight: 1.6,
 color: "#e2fce7",
 }}>
 <div style={{
 background: "#005c4b", borderRadius: "12px 12px 2px 12px",
 padding: "10px 14px", display: "inline-block", maxWidth: "90%",
 whiteSpace: "pre-wrap",
 }}>
 {message.replace(/\*(.*?)\*/g, (_, t) => t)}
 </div>
 <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textAlign: "right", marginTop: 6 }}>
 {new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} ✓✓
 </div>
 </div>
 <div style={{ display: "flex", gap: 10 }}>
 <button onClick={onClose} style={{
 flex: 1, padding: "10px 0", borderRadius: 8,
 background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
 color: "#aaa", cursor: "pointer", fontSize: 14,
 }}>Cerrar</button>
 <a href={url} target="_blank" rel="noopener noreferrer" style={{ flex: 2, textDecoration: "none" }}
 onClick={() => setSent(true)}>
 <button style={{
 width: "100%", padding: "10px 0", borderRadius: 8,
 background: sent ? "rgba(37,211,102,0.2)" : "#25D366",
 border: "none", color: sent ? "#25D366" : "#fff",
 cursor: "pointer", fontSize: 14, fontWeight: 700,
 display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
 }}>
 <Icon name="whatsapp" size={16} />
 {sent ? "Mensaje enviado ✓" : "Abrir en WhatsApp"}
 </button>
 </a>
 </div>
 </ModalOverlay>
 );
}
// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function TurnoSmart() {
 const [view, setView] = useState("dashboard");
 const [clients, setClients] = useState(initialClients);
 const [appointments, setAppointments] = useState(initialAppointments);
 const [preview, setPreview] = useState(null);
 const [addClientOpen, setAddClientOpen] = useState(false);
 const [addApptOpen, setAddApptOpen] = useState(false);
 const [notification, setNotification] = useState(null);
 const [aiLoading, setAiLoading] = useState(null);
 const [aiMessages, setAiMessages] = useState({});
 // New client form
 const [newClient, setNewClient] = useState({ name: "", phone: "" });
 // New appointment form
 const [newAppt, setNewAppt] = useState({ clientId: "", date: "", time: "", service: "" });
 const notify = (msg, ok = true) => {
 setNotification({ msg, ok });
 setTimeout(() => setNotification(null), 3000);
 };
 const addClient = () => {
 if (!newClient.name || !newClient.phone) return notify("Completá todos los campos", false);
 setClients(prev => [...prev, { id: Date.now(), name: newClient.name, phone: newClient.phone, history: [] }]);
 setNewClient({ name: "", phone: "" });
 setAddClientOpen(false);
 notify("Cliente agregado ✓");
 };
 const addAppt = () => {
 if (!newAppt.clientId || !newAppt.date || !newAppt.time || !newAppt.service)
 return notify("Completá todos los campos", false);
 setAppointments(prev => [...prev, { id: Date.now(), ...newAppt, clientId: +newAppt.clientId, attended: null }]);
 setNewAppt({ clientId: "", date: "", time: "", service: "" });
 setAddApptOpen(false);
 notify("Turno agregado ✓");
 };
 const markAttended = (apptId, attended) => {
 setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, attended } : a));
 const appt = appointments.find(a => a.id === apptId);
 setClients(prev => prev.map(c =>
 c.id === appt?.clientId ? { ...c, history: [...c.history, attended] } : c
 ));
 notify(attended ? "Asistencia registrada ✓" : "Ausencia registrada");
 };
 const generateAIMessage = async (appt) => {
 const client = clients.find(c => c.id === appt.clientId);
 if (!client) return;
 setAiLoading(appt.id);
 const rate = getAttendanceRate(client.history);
 const cat = getCategory(rate);
 const dateStr = new Date(appt.date + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
 try {
 const res = await fetch("https://api.anthropic.com/v1/messages", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 model: "claude-sonnet-4-20250514",
 max_tokens: 1000,
 messages: [{
 role: "user",
 content: `Sos un asistente de un negocio de estética/salud. Generá un mensaje de WhatsApp de recordatorio de turno para el cliente ${client.name} (${appt.service}, ${dateStr} a las ${appt.time}).
El cliente tiene un historial de asistencia del ${rate}% y está clasificado como "${cat}".
- Si es "confiable" (≥80%): mensaje amigable y corto.
- Si es "intermitente" (50-79%): pide confirmación.
- Si es "ausente" (<50%): más insistente, pide SÍ/NO.
Usá emojis apropiados. Máximo 3 oraciones. Solo devolvé el mensaje, sin explicaciones.`,
 }],
 }),
 });
 const data = await res.json();
 const msg = data.content?.[0]?.text || buildMessage(client, appt);
 setAiMessages(prev => ({ ...prev, [appt.id]: msg }));
 setPreview({ message: msg, phone: client.phone });
 } catch {
 setPreview({ message: buildMessage(client, appt), phone: client.phone });
 }
 setAiLoading(null);
 };
 const sendReminder = (appt) => {
 const client = clients.find(c => c.id === appt.clientId);
 if (!client) return;
 const msg = aiMessages[appt.id] || buildMessage(client, appt);
 setPreview({ message: msg, phone: client.phone });
 };
 // Stats
 const totalAppts = appointments.length;
 const attended = appointments.filter(a => a.attended === true).length;
 const missed = appointments.filter(a => a.attended === false).length;
 const pending = appointments.filter(a => a.attended === null).length;
 const catCounts = clients.reduce((acc, c) => {
 const cat = getCategory(getAttendanceRate(c.history));
 acc[cat] = (acc[cat] || 0) + 1;
 return acc;
 }, {});
 const navItems = [
 { id: "dashboard", label: "Dashboard", icon: "chart" },
 { id: "turnos", label: "Turnos", icon: "calendar" },
 { id: "clientes", label: "Clientes", icon: "users" },
 ];
 const inputStyle = {
 width: "100%", padding: "10px 12px", borderRadius: 8,
 background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
 color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
 fontFamily: "inherit",
 };
 const labelStyle = { fontSize: 12, color: "#888", marginBottom: 5, display: "block", fontWeight: 600, letterSpacing: "0.04em" };
 return (
 <div style={{
 minHeight: "100vh", background: "#0c0c10", color: "#f0f0f4",
 fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
 display: "flex", flexDirection: "column",
 }}>
 {/* Notification */}
 {notification && (
 <div style={{
 position: "fixed", top: 20, right: 20, zIndex: 2000,
 background: notification.ok ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
 border: `1px solid ${notification.ok ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
 color: notification.ok ? "#4ade80" : "#f87171",
 padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 600,
 boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
 animation: "slideIn 0.25s ease",
 }}>
 {notification.msg}
 </div>
 )}
 {/* Header */}
 <header style={{
 borderBottom: "1px solid rgba(255,255,255,0.07)",
 padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
 background: "rgba(255,255,255,0.02)",
 }}>
 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 <div style={{
 width: 36, height: 36, borderRadius: 10,
 background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
 display: "flex", alignItems: "center", justifyContent: "center",
 fontSize: 18,
 }}> </div>
 <div>
 <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>TurnoSmart</div>
 <div style={{ fontSize: 11, color: "#666", letterSpacing: "0.05em" }}>RECORDATORIOS INTELIGENTES</div>
 </div>
 </div>
 <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
 <span style={{ color: "#6366f1", fontSize: 13 }}><Icon name="brain" size={14} /></span>
 <span style={{ fontSize: 12, color: "#888" }}>IA activa</span>
 </div>
 </header>
 {/* Nav */}
 <nav style={{
 display: "flex", gap: 4, padding: "12px 20px",
 borderBottom: "1px solid rgba(255,255,255,0.06)",
 }}>
 {navItems.map(n => (
 <button key={n.id} onClick={() => setView(n.id)} style={{
 padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
 background: view === n.id ? "rgba(99,102,241,0.2)" : "transparent",
 color: view === n.id ? "#818cf8" : "#666",
 fontWeight: view === n.id ? 700 : 500, fontSize: 14,
 display: "flex", alignItems: "center", gap: 7, transition: "all 0.2s",
 }}>
 <Icon name={n.icon} size={16} />{n.label}
 </button>
 ))}
 </nav>
 {/* Content */}
 <main style={{ flex: 1, padding: "24px 20px", maxWidth: 900, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
 {/* DASHBOARD */}
 {view === "dashboard" && (
 <div>
 <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
 Resumen general
 </h2>
 {/* Stats row */}
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
 {[
 { label: "Total turnos", val: totalAppts, color: "#6366f1", icon: " " },
 { label: "Asistieron", val: attended, color: "#22c55e", icon: " " },
 { label: "Ausentes", val: missed, color: "#ef4444", icon: " " },
 { label: "Pendientes", val: pending, color: "#f59e0b", icon: " " },
 ].map(s => (
 <div key={s.label} style={{
 background: "rgba(255,255,255,0.04)", borderRadius: 14,
 border: "1px solid rgba(255,255,255,0.07)", padding: "18px 20px",
 }}>
 <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
 <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
 <div style={{ fontSize: 12, color: "#666", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
 </div>
 ))}
 </div>
 {/* Categories */}
 <div style={{
 background: "rgba(255,255,255,0.04)", borderRadius: 14,
 border: "1px solid rgba(255,255,255,0.07)", padding: "20px 24px", marginBottom: 24,
 }}>
 <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: "#aaa" }}>
 Clasificación de clientes por IA
 </h3>
 {Object.entries(CATEGORY_META).map(([key, meta]) => (
 <div key={key} style={{
 display: "flex", alignItems: "center", gap: 14, marginBottom: 14,
 padding: "12px 16px", borderRadius: 10, background: meta.bg,
 }}>
 <span style={{ color: meta.color, fontSize: 18 }}>{meta.icon}</span>
 <div style={{ flex: 1 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: meta.color, marginBottom: 4 }}>
 {meta.label} · {catCounts[key] || 0} cliente{catCounts[key] !== 1 ? "s" : ""}
 </div>
 <div style={{ fontSize: 12, color: "#777" }}>
 Recordatorio {meta.daysAhead} día{meta.daysAhead > 1 ? "s" : ""} antes
 </div>
 </div>
 </div>
 ))}
 </div>
 {/* Next appointments */}
 <div style={{
 background: "rgba(255,255,255,0.04)", borderRadius: 14,
 border: "1px solid rgba(255,255,255,0.07)", padding: "20px 24px",
 }}>
 <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#aaa" }}>
 Próximos turnos con recordatorio pendiente
 </h3>
 {appointments.filter(a => a.attended === null).slice(0, 3).map(appt => {
 const client = clients.find(c => c.id === appt.clientId);
 if (!client) return null;
 const cat = getCategory(getAttendanceRate(client.history));
 const meta = CATEGORY_META[cat];
 return (
 <div key={appt.id} style={{
 display: "flex", alignItems: "center", gap: 14,
 padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
 }}>
 <div style={{
 width: 40, height: 40, borderRadius: 10,
 background: meta.bg, display: "flex", alignItems: "center",
 justifyContent: "center", color: meta.color, fontSize: 16, flexShrink: 0,
 }}>{meta.icon}</div>
 <div style={{ flex: 1 }}>
 <div style={{ fontWeight: 700, fontSize: 14 }}>{client.name}</div>
 <div style={{ fontSize: 12, color: "#666" }}>{appt.service} · {appt.date} {appt.time}</div>
 </div>
 <button onClick={() => sendReminder(appt)} style={{
 padding: "7px 14px", borderRadius: 8,
 background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)",
 color: "#25D366", cursor: "pointer", fontSize: 12, fontWeight: 700,
 display: "flex", alignItems: "center", gap: 6,
 }}>
 <Icon name="send" size={13} /> Enviar
 </button>
 </div>
 );
 })}
 </div>
 </div>
 )}
 {/* TURNOS */}
 {view === "turnos" && (
 <div>
 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
 <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Turnos</h2>
 <button onClick={() => setAddApptOpen(true)} style={{
 padding: "9px 16px", borderRadius: 9,
 background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
 border: "none", color: "#fff", cursor: "pointer",
 fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 7,
 }}>
 <Icon name="plus" size={16} /> Nuevo turno
 </button>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
 {appointments.map(appt => {
 const client = clients.find(c => c.id === appt.clientId);
 if (!client) return null;
 const rate = getAttendanceRate(client.history);
 const cat = getCategory(rate);
 const meta = CATEGORY_META[cat];
 const isLoading = aiLoading === appt.id;
 return (
 <div key={appt.id} style={{
 background: "rgba(255,255,255,0.04)", borderRadius: 14,
 border: "1px solid rgba(255,255,255,0.07)", padding: "16px 20px",
 }}>
 <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
 <div style={{
 width: 44, height: 44, borderRadius: 12,
 background: meta.bg, display: "flex", alignItems: "center",
 justifyContent: "center", color: meta.color, fontSize: 20, flexShrink: 0,
 }}>{meta.icon}</div>
 <div style={{ flex: 1, minWidth: 200 }}>
 <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
 <span style={{ fontWeight: 800, fontSize: 15 }}>{client.name}</span>
 <Badge category={cat} />
 {appt.attended === true && <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>ASISTIÓ ✓</span>}
 {appt.attended === false && <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 700 }}>AUSENTE ✗</span>}
 </div>
 <div style={{ fontSize: 13, color: "#888" }}>
 {appt.service} · {appt.date} a las {appt.time}
 </div>
 <MiniBar value={rate} color={meta.color} />
 </div>
 <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
 {appt.attended === null && (
 <>
 <button onClick={() => generateAIMessage(appt)} disabled={isLoading} style={{
 padding: "7px 13px", borderRadius: 8,
 background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
 color: "#818cf8", cursor: "pointer", fontSize: 12, fontWeight: 700,
 display: "flex", alignItems: "center", gap: 6,
 }}>
 <Icon name="brain" size={13} />
 {isLoading ? "Generando..." : "IA"}
 </button>
 <button onClick={() => sendReminder(appt)} style={{
 padding: "7px 13px", borderRadius: 8,
 background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)",
 color: "#25D366", cursor: "pointer", fontSize: 12, fontWeight: 700,
 display: "flex", alignItems: "center", gap: 6,
 }}>
 <Icon name="whatsapp" size={13} /> Enviar
 </button>
 <button onClick={() => markAttended(appt.id, true)} style={{
 width: 34, height: 34, borderRadius: 8, border: "none",
 background: "rgba(34,197,94,0.15)", color: "#22c55e", cursor: "pointer",
 display: "flex", alignItems: "center", justifyContent: "center",
 }}><Icon name="check" size={16} /></button>
 <button onClick={() => markAttended(appt.id, false)} style={{
 width: 34, height: 34, borderRadius: 8, border: "none",
 background: "rgba(239,68,68,0.15)", color: "#ef4444", cursor: "pointer",
 display: "flex", alignItems: "center", justifyContent: "center",
 }}><Icon name="x" size={16} /></button>
 </>
 )}
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}
 {/* CLIENTES */}
 {view === "clientes" && (
 <div>
 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
 <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Clientes</h2>
 <button onClick={() => setAddClientOpen(true)} style={{
 padding: "9px 16px", borderRadius: 9,
 background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
 border: "none", color: "#fff", cursor: "pointer",
 fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 7,
 }}>
 <Icon name="plus" size={16} /> Nuevo cliente
 </button>
 </div>
 <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
 {clients.map(client => {
 const rate = getAttendanceRate(client.history);
 const cat = getCategory(rate);
 const meta = CATEGORY_META[cat];
 const clientAppts = appointments.filter(a => a.clientId === client.id);
 return (
 <div key={client.id} style={{
 background: "rgba(255,255,255,0.04)", borderRadius: 14,
 border: "1px solid rgba(255,255,255,0.07)", padding: "16px 20px",
 display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
 }}>
 <div style={{
 width: 42, height: 42, borderRadius: 50,
 background: `linear-gradient(135deg, ${meta.color}33, ${meta.color}11)`,
 display: "flex", alignItems: "center", justifyContent: "center",
 fontWeight: 800, fontSize: 16, color: meta.color, flexShrink: 0,
 }}>
 {client.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
 </div>
 <div style={{ flex: 1, minWidth: 160 }}>
 <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
 <span style={{ fontWeight: 700, fontSize: 15 }}>{client.name}</span>
 <Badge category={cat} />
 </div>
 <div style={{ fontSize: 12, color: "#666" }}>
 {client.phone} · {clientAppts.length} turno{clientAppts.length !== 1 ? "s" : ""}
 </div>
 </div>
 <div style={{ minWidth: 140 }}>
 <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>
 Historial: {client.history.map((h, i) => (
 <span key={i} style={{ color: h ? "#22c55e" : "#ef4444" }}>{h ? "●" : "●"}</span>
 ))}
 </div>
 <MiniBar value={rate} color={meta.color} />
 </div>
 <div style={{ fontSize: 12, color: "#666", textAlign: "right", minWidth: 100 }}>
 <div style={{ color: meta.color, fontWeight: 700, fontSize: 11 }}>
 Recordatorio {meta.daysAhead}d antes
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}
 </main>
 {/* Modals */}
 {addClientOpen && (
 <ModalOverlay onClose={() => setAddClientOpen(false)}>
 <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 800 }}>Agregar cliente</h3>
 <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
 <div>
 <label style={labelStyle}>NOMBRE COMPLETO</label>
 <input style={inputStyle} placeholder="Ej: María González" value={newClient.name}
 onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))} />
 </div>
 <div>
 <label style={labelStyle}>TELÉFONO (con código de país)</label>
 <input style={inputStyle} placeholder="Ej: 5491122334455" value={newClient.phone}
 onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))} />
 </div>
 <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
 <button onClick={() => setAddClientOpen(false)} style={{
 flex: 1, padding: "11px 0", borderRadius: 9,
 background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
 color: "#aaa", cursor: "pointer", fontSize: 14,
 }}>Cancelar</button>
 <button onClick={addClient} style={{
 flex: 2, padding: "11px 0", borderRadius: 9,
 background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
 border: "none", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700,
 }}>Guardar cliente</button>
 </div>
 </div>
 </ModalOverlay>
 )}
 {addApptOpen && (
 <ModalOverlay onClose={() => setAddApptOpen(false)}>
 <h3 style={{ margin: "0 0 20px", fontSize: 17, fontWeight: 800 }}>Nuevo turno</h3>
 <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
 <div>
 <label style={labelStyle}>CLIENTE</label>
 <select style={{ ...inputStyle, appearance: "none" }} value={newAppt.clientId}
 onChange={e => setNewAppt(p => ({ ...p, clientId: e.target.value }))}>
 <option value="">Seleccionar...</option>
 {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
 </select>
 </div>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
 <div>
 <label style={labelStyle}>FECHA</label>
 <input type="date" style={inputStyle} value={newAppt.date}
 onChange={e => setNewAppt(p => ({ ...p, date: e.target.value }))} />
 </div>
 <div>
 <label style={labelStyle}>HORA</label>
 <input type="time" style={inputStyle} value={newAppt.time}
 onChange={e => setNewAppt(p => ({ ...p, time: e.target.value }))} />
 </div>
 </div>
 <div>
 <label style={labelStyle}>SERVICIO</label>
 <input style={inputStyle} placeholder="Ej: Corte de cabello" value={newAppt.service}
 onChange={e => setNewAppt(p => ({ ...p, service: e.target.value }))} />
 </div>
 <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
 <button onClick={() => setAddApptOpen(false)} style={{
 flex: 1, padding: "11px 0", borderRadius: 9,
 background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
 color: "#aaa", cursor: "pointer", fontSize: 14,
 }}>Cancelar</button>
 <button onClick={addAppt} style={{
 flex: 2, padding: "11px 0", borderRadius: 9,
 background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
 border: "none", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700,
 }}>Guardar turno</button>
 </div>
 </div>
 </ModalOverlay>
 )}
 {preview && (
 <WhatsAppPreview
 message={preview.message}
 phone={preview.phone}
 onClose={() => setPreview(null)}
 />
 )}
 <style>{`
 @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
 input[type="date"]::-webkit-calendar-picker-indicator,
 input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
 * { box-sizing: border-box; }
 `}</style>
 </div>
