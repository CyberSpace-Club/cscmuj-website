"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, Trash2, RefreshCw, CheckCircle, AlertTriangle,
  ChevronDown, ChevronUp, Trophy, X, Upload, Edit2, Save, Eye, EyeOff,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { logAction } from "@/lib/audit";
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
type Winner = {
  id?: string;
  position: 1 | 2 | 3;
  winner_name: string;
};
type SiteEvent = {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  image_url: string | null;
  tags: string[];
  registration_link: string;
  certificate_status: string;
  certificate_link: string;
  organizer: string;
  is_visible: boolean;
  winners?: Winner[];
};

type Toast = { message: string; type: "success" | "error" };
const emptyEvent = () => ({
  name: "",
  date: "",
  location: "",
  description: "",
  image_url: null as string | null,
  tags: [] as string[],
  registration_link: "",
  certificate_status: "",
  certificate_link: "",
  organizer: "Cyber Space Club",
  is_visible: true,
  winners: [
    { position: 1 as const, winner_name: "" },
    { position: 2 as const, winner_name: "" },
    { position: 3 as const, winner_name: "" },
  ],
});

export default function SiteEventsAdmin() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/admin/login"); return; }
      const { data } = await supabase.from("admins").select("email").eq("email", user.email).single();
      if (!data) { await supabase.auth.signOut(); router.push("/admin/login?error=unauthorized"); }
    };
    check();
  }, [router]);

  const [events, setEvents]               = useState<SiteEvent[]>([]);
  const [adminEmail, setAdminEmail]       = useState("");
  const [loading, setLoading]             = useState(true);
  const [expandedId, setExpandedId]       = useState<number | null>(null);
  const [editingId, setEditingId]         = useState<number | null>(null);
  const [editValues, setEditValues]       = useState<Partial<SiteEvent>>({});
  const [showAdd, setShowAdd]             = useState(false);
  const [newEvent, setNewEvent]           = useState(emptyEvent());
  const [tagInput, setTagInput]           = useState("");
  const [newTagInput, setNewTagInput]     = useState("");
  const [uploading, setUploading]         = useState(false);
  const [saving, setSaving]               = useState(false);
  const [deleting, setDeleting]           = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [toast, setToast]                 = useState<Toast | null>(null);
  const [togglingId, setTogglingId]       = useState<number | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setAdminEmail(user.email ?? "");

    const { data: eventsData } = await supabase
      .from("events")
      .select("*")
      .order("id", { ascending: false });

    if (!eventsData) { setLoading(false); return; }

    const { data: winnersData } = await supabase.from("event_winners").select("*");

    const eventsWithWinners: SiteEvent[] = eventsData.map(e => ({
      ...e,
      winners: (winnersData ?? [])
        .filter((w: any) => w.event_name === e.name)
        .sort((a: Winner, b: Winner) => a.position - b.position),
    }));

    setEvents(eventsWithWinners);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  async function toggleVisibility(id: number, current: boolean) {
    setTogglingId(id);
    const { error } = await supabase.from("events").update({ is_visible: !current }).eq("id", id);
    if (error) { showToast("Failed to update visibility", "error"); }
    else {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, is_visible: !current } : e));
      showToast(!current ? "Event is now visible" : "Event hidden from site");
    }
    setTogglingId(null);
  }

  async function uploadImage(file: File, forNew = false): Promise<string | null> {
    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("event-images").upload(path, file);
    if (error) { showToast("Image upload failed", "error"); setUploading(false); return null; }
    const { data } = supabase.storage.from("event-images").getPublicUrl(path);
    setUploading(false);
    if (forNew) {
      setNewEvent(prev => ({ ...prev, image_url: data.publicUrl }));
    } else {
      setEditValues(prev => ({ ...prev, image_url: data.publicUrl }));
    }
    return data.publicUrl;
  }

  async function saveEdit(id: number) {
    setSaving(true);
    const { error } = await supabase.from("events").update({
      name:               editValues.name,
      date:               editValues.date,
      location:           editValues.location,
      description:        editValues.description,
      image_url:          editValues.image_url,
      tags:               editValues.tags,
      registration_link:  editValues.registration_link,
      certificate_status: editValues.certificate_status,
      certificate_link:   editValues.certificate_link,
      organizer:          editValues.organizer,
    }).eq("id", id);

    if (error) { showToast("Failed to save", "error"); setSaving(false); return; }

    await supabase.from("event_winners").delete().eq("event_name", editValues.name ?? "");
    const winners = (editValues.winners ?? []).filter(w => w.winner_name.trim());
    if (winners.length > 0) {
      await supabase.from("event_winners").insert(
        winners.map(w => ({ event_name: editValues.name, position: w.position, winner_name: w.winner_name }))
      );
    }

    await logAction(adminEmail, "updated_site_event", { id, name: editValues.name });
    showToast("Saved!");
    setEditingId(null);
    fetchEvents();
    setSaving(false);
  }

  async function handleAdd() {
    if (!newEvent.name.trim() || !newEvent.date.trim() || !newEvent.location.trim()) {
      showToast("Name, date, and location are required", "error");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.from("events").insert([{
      name:               newEvent.name,
      date:               newEvent.date,
      location:           newEvent.location,
      description:        newEvent.description,
      image_url:          newEvent.image_url,
      tags:               newEvent.tags,
      registration_link:  newEvent.registration_link,
      certificate_status: newEvent.certificate_status,
      certificate_link:   newEvent.certificate_link,
      organizer:          newEvent.organizer,
      is_visible:         true,
    }]).select().single();

    if (error || !data) { showToast("Failed to add event", "error"); setSaving(false); return; }

    const winners = (newEvent.winners ?? []).filter(w => w.winner_name.trim());
    if (winners.length > 0) {
      await supabase.from("event_winners").insert(
        winners.map(w => ({ event_name: newEvent.name, position: w.position, winner_name: w.winner_name }))
      );
    }

    await logAction(adminEmail, "created_site_event", { name: newEvent.name, date: newEvent.date });
    showToast("Event added!");
    setNewEvent(emptyEvent());
    setShowAdd(false);
    fetchEvents();
    setSaving(false);
  }

  async function handleDelete(id: number, name: string) {
    setDeleting(id);
    await supabase.from("event_winners").delete().eq("event_name", name);
    await supabase.from("events").delete().eq("id", id);
    await logAction(adminEmail, "deleted_site_event", { id, name });
    setEvents(prev => prev.filter(e => e.id !== id));
    setDeleting(null);
    setConfirmDelete(null);
    showToast("Event deleted");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm shadow-lg border ${
          toast.type === "success"
            ? "bg-green-500/10 border-green-500/30 text-green-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <header className="border-b border-[#2a2a2a] bg-[#111] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#fe8d32]/20 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-[#fe8d32]" />
            </span>
            <span className="font-bold">Site Events</span>
          </div>
          <a href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to admin
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Events on the public site</h1>
            <p className="text-xs text-gray-500 mt-0.5">These show on the /event page. New images go to Supabase Storage.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchEvents} className="p-2 border border-[#2a2a2a] rounded-lg hover:border-[#fe8d32]/50 transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#fe8d32]" : "text-gray-400"}`} />
            </button>
            <button
              onClick={() => setShowAdd(p => !p)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#fe8d32] to-[#f8be19] rounded-lg text-black text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Add event
            </button>
          </div>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="bg-[#111] border border-[#fe8d32]/30 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#fe8d32]">New event</h2>
              <button onClick={() => setShowAdd(false)}><X className="w-4 h-4 text-gray-400 hover:text-white" /></button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Event name *">
                <input value={newEvent.name} onChange={e => setNewEvent(p => ({ ...p, name: e.target.value }))} className="inp" placeholder="e.g. HackFest 2026" />
              </Field>
              <Field label="Date *">
                <input value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} className="inp" placeholder="e.g. March 15, 2026" />
              </Field>
              <Field label="Location *">
                <input value={newEvent.location} onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))} className="inp" placeholder="e.g. Manipal University, AB1" />
              </Field>
              <Field label="Registration link">
                <input value={newEvent.registration_link} onChange={e => setNewEvent(p => ({ ...p, registration_link: e.target.value }))} className="inp" placeholder="https://forms.gle/..." />
              </Field>
              <Field label="Certificate status">
                <select value={newEvent.certificate_status} onChange={e => setNewEvent(p => ({ ...p, certificate_status: e.target.value }))} className="inp">
                  <option value="">None</option>
                  <option value="preparing">Preparing</option>
                  <option value="available">Available</option>
                  <option value="distributed">Distributed</option>
                </select>
              </Field>
              <Field label="Certificate link">
                <input value={newEvent.certificate_link} onChange={e => setNewEvent(p => ({ ...p, certificate_link: e.target.value }))} className="inp" placeholder="https://drive.google.com/..." />
              </Field>
            </div>

            <Field label="Description">
              <textarea value={newEvent.description} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))} className="inp resize-y" rows={3} placeholder="What's this event about?" />
            </Field>

            <Field label="Tags (press Enter to add)">
              <div className="flex flex-wrap gap-2 mb-2">
                {newEvent.tags.map((t, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-[#fe8d32]/10 border border-[#fe8d32]/30 rounded-full text-xs text-[#fe8d32]">
                    {t} <button onClick={() => setNewEvent(p => ({ ...p, tags: p.tags.filter((_, j) => j !== i) }))}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <input value={newTagInput} onChange={e => setNewTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && newTagInput.trim()) { setNewEvent(p => ({ ...p, tags: [...p.tags, newTagInput.trim()] })); setNewTagInput(""); e.preventDefault(); } }}
                className="inp" placeholder="Type tag + Enter" />
            </Field>

            <Field label="Event image">
              {newEvent.image_url && (
                <div className="relative w-32 h-32 mb-2 rounded-lg overflow-hidden border border-[#2a2a2a]">
                  <Image src={newEvent.image_url} alt="preview" fill className="object-cover" />
                </div>
              )}
              <button onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border border-[#2a2a2a] rounded-lg text-sm text-gray-400 hover:text-white hover:border-[#fe8d32]/40 transition-all">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading…" : newEvent.image_url ? "Change image" : "Upload image"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, true); }} />
            </Field>

            <Field label="Winners (optional)">
              <div className="space-y-2">
                {(newEvent.winners ?? []).map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</span>
                    <input value={w.winner_name}
                      onChange={e => { const u = [...(newEvent.winners ?? [])]; u[i] = { ...u[i], winner_name: e.target.value }; setNewEvent(p => ({ ...p, winners: u })); }}
                      className="inp flex-1" placeholder={`${i === 0 ? "1st" : i === 1 ? "2nd" : "3rd"} place`} />
                  </div>
                ))}
              </div>
            </Field>

            <button onClick={handleAdd} disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#fe8d32] to-[#f8be19] rounded-lg text-black text-sm font-semibold hover:opacity-90 disabled:opacity-50">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? "Adding…" : "Add event"}
            </button>
          </div>
        )}

        {/* Events list */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading…
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No events yet.</div>
        ) : (
          <div className="space-y-3">
            {events.map(event => {
              const isExpanded = expandedId === event.id;
              const isEditing  = editingId  === event.id;
              const isVisible  = event.is_visible !== false;

              return (
                <div key={event.id} className={`bg-[#111] border rounded-xl overflow-hidden transition-colors ${isVisible ? "border-[#2a2a2a] hover:border-[#fe8d32]/20" : "border-[#2a2a2a] opacity-60"}`}>

                  <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      {event.image_url && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#2a2a2a] shrink-0">
                          <Image src={event.image_url} alt={event.name} fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{event.name}</p>
                          {!isVisible && (
                            <span className="text-xs px-1.5 py-0.5 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded">Hidden</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{event.date} · {event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">

                      {/* Visibility toggle */}
                      <button
                        onClick={() => toggleVisibility(event.id, isVisible)}
                        disabled={togglingId === event.id}
                        title={isVisible ? "Hide from site" : "Show on site"}
                        className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs transition-all disabled:opacity-50 ${
                          isVisible
                            ? "border-green-500/30 text-green-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                            : "border-gray-500/30 text-gray-400 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30"
                        }`}
                      >
                        {togglingId === event.id
                          ? <RefreshCw className="w-3 h-3 animate-spin" />
                          : isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />
                        }
                        {isVisible ? "Visible" : "Hidden"}
                      </button>

                      <button
                        onClick={() => { setEditingId(event.id); setEditValues({ ...event }); setExpandedId(event.id); }}
                        className="flex items-center gap-1 px-3 py-1.5 border border-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:text-white hover:border-[#fe8d32]/40 transition-all"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : event.id)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-[#2a2a2a] rounded-lg text-xs text-gray-400 hover:text-white transition-all"
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {isExpanded ? "Hide" : "Details"}
                      </button>
                      {confirmDelete === event.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(event.id, event.name)} disabled={deleting === event.id}
                            className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-500/30 disabled:opacity-50">
                            {deleting === event.id ? "Deleting…" : "Delete"}
                          </button>
                          <button onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 rounded text-xs hover:text-white">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(event.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[#2a2a2a] px-4 py-5 space-y-4">
                      {isEditing ? (
                        <>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <Field label="Name"><input value={editValues.name ?? ""} onChange={e => setEditValues(p => ({ ...p, name: e.target.value }))} className="inp" /></Field>
                            <Field label="Date"><input value={editValues.date ?? ""} onChange={e => setEditValues(p => ({ ...p, date: e.target.value }))} className="inp" /></Field>
                            <Field label="Location"><input value={editValues.location ?? ""} onChange={e => setEditValues(p => ({ ...p, location: e.target.value }))} className="inp" /></Field>
                            <Field label="Registration link"><input value={editValues.registration_link ?? ""} onChange={e => setEditValues(p => ({ ...p, registration_link: e.target.value }))} className="inp" /></Field>
                            <Field label="Certificate status">
                              <select value={editValues.certificate_status ?? ""} onChange={e => setEditValues(p => ({ ...p, certificate_status: e.target.value }))} className="inp">
                                <option value="">None</option>
                                <option value="preparing">Preparing</option>
                                <option value="available">Available</option>
                                <option value="distributed">Distributed</option>
                              </select>
                            </Field>
                            <Field label="Certificate link"><input value={editValues.certificate_link ?? ""} onChange={e => setEditValues(p => ({ ...p, certificate_link: e.target.value }))} className="inp" /></Field>
                          </div>
                          <Field label="Description">
                            <textarea value={editValues.description ?? ""} onChange={e => setEditValues(p => ({ ...p, description: e.target.value }))} className="inp resize-y" rows={3} />
                          </Field>
                          <Field label="Tags">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {(editValues.tags ?? []).map((t, i) => (
                                <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-[#fe8d32]/10 border border-[#fe8d32]/30 rounded-full text-xs text-[#fe8d32]">
                                  {t} <button onClick={() => setEditValues(p => ({ ...p, tags: (p.tags ?? []).filter((_, j) => j !== i) }))}><X className="w-3 h-3" /></button>
                                </span>
                              ))}
                            </div>
                            <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { setEditValues(p => ({ ...p, tags: [...(p.tags ?? []), tagInput.trim()] })); setTagInput(""); e.preventDefault(); } }}
                              className="inp" placeholder="Type tag + Enter" />
                          </Field>
                          <Field label="Image">
                            {editValues.image_url && (
                              <div className="relative w-32 h-32 mb-2 rounded-lg overflow-hidden border border-[#2a2a2a]">
                                <Image src={editValues.image_url} alt="preview" fill className="object-cover" />
                              </div>
                            )}
                            <button onClick={() => editFileInputRef.current?.click()}
                              className="flex items-center gap-2 px-4 py-2 border border-[#2a2a2a] rounded-lg text-sm text-gray-400 hover:text-white hover:border-[#fe8d32]/40 transition-all">
                              <Upload className="w-4 h-4" />{uploading ? "Uploading…" : "Upload new image"}
                            </button>
                            <input ref={editFileInputRef} type="file" accept="image/*" className="hidden"
                              onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, false); }} />
                          </Field>
                          <Field label="Winners">
                            <div className="space-y-2">
                              {[1, 2, 3].map(pos => {
                                const w = (editValues.winners ?? []).find(x => x.position === pos) ?? { position: pos as 1|2|3, winner_name: "" };
                                return (
                                  <div key={pos} className="flex items-center gap-3">
                                    <span className="text-lg">{pos === 1 ? "🥇" : pos === 2 ? "🥈" : "🥉"}</span>
                                    <input value={w.winner_name}
                                      onChange={e => {
                                        const rest = (editValues.winners ?? []).filter(x => x.position !== pos);
                                        setEditValues(p => ({ ...p, winners: [...rest, { position: pos as 1|2|3, winner_name: e.target.value }].sort((a,b) => a.position - b.position) }));
                                      }}
                                      className="inp flex-1" placeholder={`${pos === 1 ? "1st" : pos === 2 ? "2nd" : "3rd"} place`} />
                                  </div>
                                );
                              })}
                            </div>
                          </Field>
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(event.id)} disabled={saving}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#fe8d32] to-[#f8be19] rounded-lg text-black text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              {saving ? "Saving…" : "Save changes"}
                            </button>
                            <button onClick={() => setEditingId(null)}
                              className="px-4 py-2 border border-[#2a2a2a] rounded-lg text-sm text-gray-400 hover:text-white transition-colors">
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-6 text-sm">
                          <div className="space-y-3">
                            <p className="text-gray-400">{event.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {(event.tags ?? []).map((t, i) => (
                                <span key={i} className="px-2 py-0.5 bg-[#fe8d32]/10 border border-[#fe8d32]/30 rounded-full text-xs text-[#fe8d32]">{t}</span>
                              ))}
                            </div>
                            {event.registration_link && (
                              <a href={event.registration_link} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-[#fe8d32] hover:underline break-all">{event.registration_link}</a>
                            )}
                            {event.certificate_status && (
                              <p className="text-xs text-gray-500">Certificate: <span className="text-white">{event.certificate_status}</span></p>
                            )}
                          </div>
                          {event.winners && event.winners.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-[#fe8d32] uppercase tracking-wider mb-2">Winners</p>
                              <div className="space-y-2">
                                {event.winners.map(w => (
                                  <div key={w.position} className="flex items-center gap-2">
                                    <span>{w.position === 1 ? "🥇" : w.position === 2 ? "🥈" : "🥉"}</span>
                                    <span className="text-white">{w.winner_name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style jsx global>{`
        .inp {
          width: 100%;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          color: white;
          outline: none;
          transition: border-color 0.15s;
        }
        .inp:focus { border-color: #fe8d32; }
        .inp::placeholder { color: #555; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-400">{label}</label>
      {children}
    </div>
  );
}