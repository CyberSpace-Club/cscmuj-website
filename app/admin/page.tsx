"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  Send,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Mail,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { logAction } from "@/lib/audit";
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const STATUS_OPTIONS = ["", "available", "preparing", "distributed"] as const;
type CertificateStatus = (typeof STATUS_OPTIONS)[number];

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  registration_link: string;
  certificate_status: CertificateStatus;
  certificate_link: string;
  tags: string[];
  organizer: string;
}
interface EditValues {
  certificate_status: CertificateStatus;
  certificate_link: string;
}
interface NewEvent {
  name: string;
  date: string;
  location: string;
  description: string;
  registration_link: string;
  certificate_status: CertificateStatus;
  certificate_link: string;
}
interface Toast {
  msg: string;
  type: "success" | "error";
}
type Subscriber = {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at?: string | null;
};
type SentEmail = {
  id: string;
  subject: string;
  sent_at: string;
  recipient_count: number;
  resend_id?: string;
};

type SendState = "idle" | "loading" | "success" | "error";
type AdminTab = "events" | "newsletter";
type NewsletterTab = "compose" | "subscribers" | "history";
const STATUS_STYLES: Record<CertificateStatus, string> = {
  available:   "bg-green-500/20 text-green-400 border border-green-500/40",
  preparing:   "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
  distributed: "bg-red-500/20 text-red-400 border border-red-500/40",
  "":          "bg-gray-500/20 text-gray-400 border border-gray-500/40",
};
export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading]       = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [activeTab, setActiveTab]   = useState<AdminTab>("events");
  const [toast, setToast]           = useState<Toast | null>(null);
  const [events, setEvents]         = useState<Event[]>([]);
  const [saving, setSaving]         = useState<number | null>(null);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [editValues, setEditValues] = useState<EditValues>({
    certificate_status: "",
    certificate_link: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent]       = useState<NewEvent>({
    name: "",
    date: "",
    location: "",
    description: "",
    registration_link: "",
    certificate_status: "",
    certificate_link: "",
  });

  const [nlTab, setNlTab]               = useState<NewsletterTab>("compose");
  const [subscribers, setSubscribers]   = useState<Subscriber[]>([]);
  const [sentEmails, setSentEmails]     = useState<SentEmail[]>([]);
  const [loadingSubs, setLoadingSubs]   = useState(false);
  const [fromName, setFromName]         = useState("Cyberspace Club");
  const [subject, setSubject]           = useState("");
  const [body, setBody]                 = useState("");
  const [sendState, setSendState]       = useState<SendState>("idle");
  const [sendError, setSendError]       = useState("");
  const [showPreview, setShowPreview]   = useState(false);
  const [search, setSearch]             = useState("");
  const [deletingId, setDeletingId]     = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const activeCount = subscribers.filter(s => !s.unsubscribed_at).length;
  const unsubCount  = subscribers.filter(s =>  s.unsubscribed_at).length;
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/admin/login"); return; }

      const { data } = await supabase
        .from("admins")
        .select("email")
        .eq("email", user.email)
        .single();

      if (!data) {
        await supabase.auth.signOut();
        router.push("/admin/login?error=unauthorized");
        return;
      }

      setAdminEmail(user.email ?? "");
      fetchEvents();
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (activeTab === "newsletter" && subscribers.length === 0) {
      fetchSubscribers();
      fetchSentEmails();
    }
  }, [activeTab]);

  async function fetchEvents() {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("id", { ascending: false });
    setEvents((data as Event[]) || []);
    setLoading(false);
  }

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function startEdit(event: Event) {
    setEditingId(event.id);
    setEditValues({
      certificate_status: event.certificate_status || "",
      certificate_link:   event.certificate_link   || "",
    });
  }

  async function saveEdit(id: number) {
    setSaving(id);
    const { error } = await supabase.from("events").update(editValues).eq("id", id);
    if (error) {
      showToast("Failed to save changes", "error");
    } else {
      showToast("Saved successfully");
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...editValues } : e));
      setEditingId(null);
      const eventName = events.find(e => e.id === id)?.name ?? id;
      await logAction(adminEmail, "updated_event", { id, name: eventName, changes: editValues });
    }
    setSaving(null);
  }

  async function deleteEvent(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      showToast("Failed to delete event", "error");
    } else {
      showToast("Event deleted");
      setEvents(prev => prev.filter(e => e.id !== id));
      await logAction(adminEmail, "deleted_event", { id, name });
    }
  }

  async function addEvent() {
    if (!newEvent.name || !newEvent.date) {
      showToast("Name and date are required", "error");
      return;
    }
    const { data, error } = await supabase
      .from("events")
      .insert([newEvent])
      .select()
      .single();

    if (error) {
      showToast("Failed to add event", "error");
    } else {
      showToast("Event added");
      setEvents(prev => [data as Event, ...prev]);
      await logAction(adminEmail, "created_event", { name: newEvent.name, date: newEvent.date });
      setShowAddForm(false);
      setNewEvent({
        name: "", date: "", location: "", description: "",
        registration_link: "", certificate_status: "", certificate_link: "",
      });
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }
  const fetchSubscribers = useCallback(async () => {
    setLoadingSubs(true);
    const { data } = await supabase
      .from("newsletters_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });
    if (data) setSubscribers(data as Subscriber[]);
    setLoadingSubs(false);
  }, []);

  const fetchSentEmails = useCallback(async () => {
    const { data } = await supabase
      .from("newsletter_sent_emails")
      .select("*")
      .order("sent_at", { ascending: false })
      .limit(50);
    if (data) setSentEmails(data as SentEmail[]);
  }, []);

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setSendError("Subject and body are required.");
      setSendState("error");
      return;
    }

    const activeEmails = subscribers
      .filter(s => !s.unsubscribed_at)
      .map(s => s.email);

    if (activeEmails.length === 0) {
      setSendError("No active subscribers to send to.");
      setSendState("error");
      return;
    }

    setSendState("loading");
    setSendError("");

    try {
      const res  = await fetch("/api/newsletter/send", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ subject, body, fromName, recipients: activeEmails }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Send failed.");

      await supabase.from("newsletter_sent_emails").insert([{
        subject,
        sent_at:         new Date().toISOString(),
        recipient_count: activeEmails.length,
        resend_id:       json.id,
      }]);

      setSendState("success");
      setSubject("");
      setBody("");
      await logAction(adminEmail, "sent_newsletter", { subject, recipient_count: activeEmails.length });
      fetchSentEmails();

    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : "Unexpected error.");
      setSendState("error");
    }
  }

  async function handleDeleteSubscriber(id: string) {
    const sub = subscribers.find(s => s.id === id);
    setDeletingId(id);
    await supabase.from("newsletters_subscribers").delete().eq("id", id);
    setSubscribers(prev => prev.filter(s => s.id !== id));
    await logAction(adminEmail, "deleted_subscriber", { email: sub?.email });
    setDeletingId(null);
    setConfirmDelete(null);
  }

  const filteredSubs = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#fe8d32] text-lg animate-pulse">Loading admin panel...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg text-sm font-medium shadow-lg transition-all ${
            toast.type === "error"
              ? "bg-red-500/20 border border-red-500/50 text-red-400"
              : "bg-green-500/20 border border-green-500/50 text-green-400"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#2a2a2a] bg-[#111] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#fe8d32] to-[#f8be19] bg-clip-text text-transparent">
              Cyber Space Admin
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Events & Newsletter Manager</p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-gray-400 text-sm hover:text-white hover:border-gray-500 transition-all"
          >
            Sign out
          </button>
        </div>

        {/* Main tab bar */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1 pb-3">
          {(["events", "newsletter"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#fe8d32] to-[#f8be19] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab === "events" ? "🗓️ Events" : "📨 Newsletter"}
            </button>
          ))}
          <a
            href="/admin/site-events"
            className="px-5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-all"
          >
            🌐 Site Events
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "events" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Events", value: events.length,                                                           color: "text-white"        },
                { label: "Available",    value: events.filter(e => e.certificate_status === "available").length,         color: "text-green-400"    },
                { label: "Preparing",   value: events.filter(e => e.certificate_status === "preparing").length,          color: "text-yellow-400"   },
                { label: "Distributed", value: events.filter(e => e.certificate_status === "distributed").length,        color: "text-red-400"      },
              ].map(stat => (
                <div key={stat.label} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {!showAddForm && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#fe8d32] to-[#f8be19] rounded-lg text-black text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  + Add Event
                </button>
              </div>
            )}

            {/* Add Event Form */}
            {showAddForm && (
              <div className="bg-[#111] border border-[#fe8d32]/30 rounded-xl p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">Add New Event</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(
                    [
                      { key: "name",              label: "Event Name *",      placeholder: "e.g. Hack n' Earn 3.0"        },
                      { key: "date",              label: "Date *",            placeholder: "e.g. March 15, 2026"           },
                      { key: "location",          label: "Location",          placeholder: "e.g. Manipal University, AB1"  },
                      { key: "registration_link", label: "Registration Link", placeholder: "https://..."                   },
                      { key: "certificate_link",  label: "Certificate Link",  placeholder: "https://drive.google.com/..."  },
                    ] as { key: keyof NewEvent; label: string; placeholder: string }[]
                  ).map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                      <input
                        value={newEvent[key] as string}
                        onChange={e => setNewEvent(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#fe8d32]"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Certificate Status</label>
                    <select
                      value={newEvent.certificate_status}
                      onChange={e => setNewEvent(p => ({ ...p, certificate_status: e.target.value as CertificateStatus }))}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#fe8d32]"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s || "None"}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-xs text-gray-400 mb-1 block">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))}
                    placeholder="Event description..."
                    rows={3}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#fe8d32]"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={addEvent}
                    className="px-5 py-2 bg-gradient-to-r from-[#fe8d32] to-[#f8be19] rounded-lg text-black text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Add Event
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Events Table */}
            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#2a2a2a]">
                <h2 className="font-semibold text-white">All Events ({events.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2a2a2a] text-xs text-gray-500 uppercase tracking-wider">
                      <th className="text-left px-6 py-3">Event</th>
                      <th className="text-left px-6 py-3">Date</th>
                      <th className="text-left px-6 py-3">Certificate Status</th>
                      <th className="text-left px-6 py-3">Certificate Link</th>
                      <th className="text-left px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event.id} className="border-b border-[#1a1a1a] hover:bg-[#151515] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{event.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{event.location}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 whitespace-nowrap">{event.date}</td>
                        <td className="px-6 py-4">
                          {editingId === event.id ? (
                            <select
                              value={editValues.certificate_status}
                              onChange={e => setEditValues(p => ({ ...p, certificate_status: e.target.value as CertificateStatus }))}
                              className="bg-[#1a1a1a] border border-[#fe8d32]/50 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                            >
                              {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s || "None"}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${STATUS_STYLES[event.certificate_status] ?? STATUS_STYLES[""]}`}>
                              {event.certificate_status || "none"}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          {editingId === event.id ? (
                            <input
                              value={editValues.certificate_link}
                              onChange={e => setEditValues(p => ({ ...p, certificate_link: e.target.value }))}
                              placeholder="https://drive.google.com/..."
                              className="w-full bg-[#1a1a1a] border border-[#fe8d32]/50 rounded-lg px-2 py-1 text-sm text-white focus:outline-none"
                            />
                          ) : event.certificate_link ? (
                            <a
                              href={event.certificate_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#fe8d32] hover:underline text-xs truncate block max-w-[200px]"
                            >
                              {event.certificate_link}
                            </a>
                          ) : (
                            <span className="text-gray-600 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {editingId === event.id ? (
                              <>
                                <button
                                  onClick={() => saveEdit(event.id)}
                                  disabled={saving === event.id}
                                  className="px-3 py-1 bg-green-500/20 border border-green-500/40 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                >
                                  {saving === event.id ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 rounded-lg text-xs hover:text-white transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(event)}
                                  className="px-3 py-1 bg-[#fe8d32]/10 border border-[#fe8d32]/30 text-[#fe8d32] rounded-lg text-xs hover:bg-[#fe8d32]/20 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteEvent(event.id, event.name)}
                                  className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-colors"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "newsletter" && (
          <>
            {/* Newsletter stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Subscribers", value: subscribers.length, color: "text-white"      },
                { label: "Active",             value: activeCount,        color: "text-green-400"  },
                { label: "Unsubscribed",       value: unsubCount,         color: "text-red-400"    },
                { label: "Campaigns Sent",     value: sentEmails.length,  color: "text-[#fe8d32]"  },
              ].map(stat => (
                <div key={stat.label} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Newsletter sub-tabs */}
            <div className="flex gap-1 bg-[#111] p-1 rounded-xl border border-[#2a2a2a] w-fit mb-8">
              {(["compose", "subscribers", "history"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setNlTab(t); setSendState("idle"); setSendError(""); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    nlTab === t
                      ? "bg-gradient-to-r from-[#fe8d32] to-[#f8be19] text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* ── Compose ── */}
            {nlTab === "compose" && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">New Campaign</h2>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">From name</label>
                    <input
                      value={fromName}
                      onChange={e => setFromName(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#fe8d32]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Subject line</label>
                    <input
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="Your weekly dose of tech..."
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#fe8d32]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Body (HTML supported)</label>
                    <textarea
                      value={body}
                      onChange={e => setBody(e.target.value)}
                      placeholder={"<h2>Hello!</h2>\n<p>This week we're covering...</p>"}
                      rows={10}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#fe8d32] resize-y"
                    />
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setShowPreview(p => !p)}
                      className="flex items-center gap-2 px-4 py-2 border border-[#2a2a2a] rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {showPreview ? "Hide preview" : "Preview"}
                      {showPreview ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {sendState !== "success" && (
                      <button
                        onClick={handleSend}
                        disabled={sendState === "loading"}
                        className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#fe8d32] to-[#f8be19] rounded-lg text-black text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendState === "loading" ? (
                          <><RefreshCw className="w-4 h-4 animate-spin" /> Sending…</>
                        ) : (
                          <><Send className="w-4 h-4" /> Send to {activeCount} subscribers</>
                        )}
                      </button>
                    )}
                  </div>

                  {sendState === "success" && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      Sent to {activeCount} subscribers!
                    </div>
                  )}

                  {sendState === "error" && sendError && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {sendError}
                    </div>
                  )}
                </div>

                {/* Preview pane */}
                {showPreview && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Preview</h2>
                    <div className="bg-white rounded-xl overflow-hidden">
                      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 text-xs text-gray-500 space-y-1">
                        <p><span className="font-medium text-gray-700">From:</span> {fromName}</p>
                        <p><span className="font-medium text-gray-700">Subject:</span> {subject || "—"}</p>
                      </div>
                      <div
                        className="p-6 text-black text-sm min-h-[300px] prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: body || "<p style='color:#aaa'>Your email body will appear here…</p>",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Subscribers ── */}
            {nlTab === "subscribers" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <h2 className="text-lg font-semibold">Subscribers</h2>
                  <div className="flex gap-2">
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search emails…"
                      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#fe8d32] w-52"
                    />
                    <button
                      onClick={fetchSubscribers}
                      className="p-2 border border-[#2a2a2a] rounded-lg hover:border-[#fe8d32]/50 transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingSubs ? "animate-spin text-[#fe8d32]" : "text-gray-400"}`} />
                    </button>
                  </div>
                </div>

                <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2a2a2a] text-xs text-gray-500 uppercase tracking-wider">
                        <th className="text-left px-6 py-3">Email</th>
                        <th className="text-left px-6 py-3 hidden sm:table-cell">Subscribed</th>
                        <th className="text-left px-6 py-3">Status</th>
                        <th className="px-6 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {loadingSubs ? (
                        <tr>
                          <td colSpan={4} className="text-center py-12 text-gray-500">
                            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2" />
                            Loading…
                          </td>
                        </tr>
                      ) : filteredSubs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-12 text-gray-500">
                            No subscribers found.
                          </td>
                        </tr>
                      ) : (
                        filteredSubs.map(sub => (
                          <tr key={sub.id} className="border-b border-[#1a1a1a] hover:bg-[#151515] transition-colors group">
                            <td className="px-6 py-4 font-mono text-sm truncate max-w-[200px]">
                              {sub.email}
                            </td>
                            <td className="px-6 py-4 text-gray-400 hidden sm:table-cell">
                              <span className="flex items-center gap-1 text-xs">
                                <Clock className="w-3 h-3" />
                                {new Date(sub.subscribed_at).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {sub.unsubscribed_at ? (
                                <span className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                                  Unsubscribed
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/30 text-green-400 text-xs">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {confirmDelete === sub.id ? (
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-xs text-gray-400">Remove?</span>
                                  <button
                                    onClick={() => handleDeleteSubscriber(sub.id)}
                                    disabled={deletingId === sub.id}
                                    className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                  >
                                    {deletingId === sub.id ? "…" : "Yes"}
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 rounded text-xs hover:text-white transition-colors"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDelete(sub.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {filteredSubs.length > 0 && (
                    <div className="px-6 py-2 text-xs text-gray-600 border-t border-[#1a1a1a]">
                      {filteredSubs.length} of {subscribers.length} subscribers
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── History ── */}
            {nlTab === "history" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Sent Campaigns</h2>
                  <button
                    onClick={fetchSentEmails}
                    className="p-2 border border-[#2a2a2a] rounded-lg hover:border-[#fe8d32]/50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {sentEmails.length === 0 ? (
                  <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-12 text-center text-gray-500">
                    <Mail className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    No campaigns sent yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sentEmails.map(email => (
                      <div
                        key={email.id}
                        className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between hover:border-[#fe8d32]/20 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-white">{email.subject}</p>
                          {email.resend_id && (
                            <p className="text-xs text-gray-600 font-mono mt-0.5">
                              ID: {email.resend_id}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {email.recipient_count} sent
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(email.sent_at).toLocaleString()}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Sent
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}