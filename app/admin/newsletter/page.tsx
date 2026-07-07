"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Send,
  Users,
  Mail,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  recipients?: string[];
};
type SendState = "idle" | "loading" | "success" | "error";
export default function NewsletterAdmin() {
  const router = useRouter();
  useEffect(() => {
    const check = async () => {
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
      }
    };
    check();
  }, [router]);
  const [tab, setTab]                     = useState<"compose" | "subscribers" | "history">("compose");
  const [subscribers, setSubscribers]     = useState<Subscriber[]>([]);
  const [sentEmails, setSentEmails]       = useState<SentEmail[]>([]);
  const [loadingSubs, setLoadingSubs]     = useState(true);
  const [fromName, setFromName]           = useState("Cyberspace Club");
  const [subject, setSubject]             = useState("");
  const [body, setBody]                   = useState("");
  const [sendState, setSendState]         = useState<SendState>("idle");
  const [sendError, setSendError]         = useState("");
  const [showPreview, setShowPreview]     = useState(false);
  const [search, setSearch]               = useState("");
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [expandedId, setExpandedId]       = useState<string | null>(null);
  const activeCount = subscribers.filter(s => !s.unsubscribed_at).length;
  const unsubCount  = subscribers.filter(s =>  s.unsubscribed_at).length;
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

  useEffect(() => {
    fetchSubscribers();
    fetchSentEmails();
  }, [fetchSubscribers, fetchSentEmails]);

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setSendError("Add a subject and body before sending.");
      setSendState("error");
      return;
    }

    const activeEmails = subscribers
      .filter(s => !s.unsubscribed_at)
      .map(s => s.email);

    if (activeEmails.length === 0) {
      setSendError("You don't have any active subscribers yet.");
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
      if (!res.ok) throw new Error(json.error || "Something went wrong. Try again?");

      await supabase.from("newsletter_sent_emails").insert([{
        subject,
        sent_at:         new Date().toISOString(),
        recipient_count: activeEmails.length,
        resend_id:       json.id,
        recipients:      activeEmails,
      }]);

      setSendState("success");
      setSubject("");
      setBody("");
      fetchSentEmails();

    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : "Something went wrong. Try again?");
      setSendState("error");
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await supabase.from("newsletters_subscribers").delete().eq("id", id);
    setSubscribers(prev => prev.filter(s => s.id !== id));
    setDeletingId(null);
    setConfirmDelete(null);
  }

  const filteredSubs = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );
  const tabLabels: Record<"compose" | "subscribers" | "history", string> = {
    compose:     "Write",
    subscribers: "Subscribers",
    history:     "Past sends",
  };
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <header className="border-b border-[#2a2a2a] bg-[#0a0a0a] sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#fe8d32]/20 flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#fe8d32]" />
            </span>
            <span className="font-bold">Newsletter</span>
          </div>
          <a
            href="/admin"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to admin
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total",        value: subscribers.length, color: "text-white"      },
            { label: "Active",       value: activeCount,        color: "text-green-400"  },
            { label: "Unsubscribed", value: unsubCount,         color: "text-red-400"    },
            { label: "Sent",         value: sentEmails.length,  color: "text-[#fe8d32]"  },
          ].map(stat => (
            <div key={stat.label} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#111] p-1 rounded-xl border border-[#2a2a2a] w-fit">
          {(["compose", "subscribers", "history"] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSendState("idle"); setSendError(""); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? "bg-gradient-to-r from-[#fe8d32] to-[#f8be19] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tabLabels[t]}
            </button>
          ))}
        </div>

        {/* ── Write (Compose) ── */}
        {tab === "compose" && (
          <div className="grid lg:grid-cols-2 gap-8">

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">New email</h2>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">From</label>
                <input
                  value={fromName}
                  onChange={e => setFromName(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#fe8d32]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Subject</label>
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Your weekly dose of tech..."
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#fe8d32]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Body <span className="text-gray-600">(HTML works fine)</span>
                </label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder={"<h2>Hey everyone!</h2>\n<p>This week we're covering...</p>"}
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
                      <><Send className="w-4 h-4" /> Send to {activeCount} {activeCount === 1 ? "person" : "people"}</>
                    )}
                  </button>
                )}
              </div>

              {sendState === "success" && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Sent! {activeCount} {activeCount === 1 ? "person" : "people"} got it.
                </div>
              )}

              {sendState === "error" && sendError && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {sendError}
                </div>
              )}
            </div>

            {/* Preview */}
            {showPreview && (
              <div>
                <h2 className="text-lg font-semibold mb-4">How it'll look</h2>
                <div className="bg-white rounded-xl overflow-hidden">
                  <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 text-xs text-gray-500 space-y-1">
                    <p><span className="font-medium text-gray-700">From:</span> {fromName}</p>
                    <p><span className="font-medium text-gray-700">Subject:</span> {subject || "—"}</p>
                  </div>
                  <div
                    className="p-6 text-black text-sm min-h-[300px] prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: body || "<p style='color:#aaa'>Your email will appear here…</p>"
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Subscribers ── */}
        {tab === "subscribers" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <h2 className="text-lg font-semibold">Your subscribers</h2>
              <div className="flex gap-2">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by email…"
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#fe8d32] w-52"
                />
                <button
                  onClick={fetchSubscribers}
                  title="Refresh"
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
                    <th className="text-left px-6 py-3 hidden sm:table-cell">Joined</th>
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
                        {search ? "No one matched that search." : "No subscribers yet."}
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
                              <span className="text-xs text-gray-400">Remove this person?</span>
                              <button
                                onClick={() => handleDelete(sub.id)}
                                disabled={deletingId === sub.id}
                                className="px-2 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50"
                              >
                                {deletingId === sub.id ? "Removing…" : "Remove"}
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 rounded text-xs hover:text-white transition-colors"
                              >
                                Keep
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(sub.id)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
                              title="Remove subscriber"
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
                  Showing {filteredSubs.length} of {subscribers.length}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── History ── */}
        {tab === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Past sends</h2>
              <button
                onClick={fetchSentEmails}
                title="Refresh"
                className="p-2 border border-[#2a2a2a] rounded-lg hover:border-[#fe8d32]/50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {sentEmails.length === 0 ? (
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-12 text-center text-gray-500">
                <Mail className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p>Nothing sent yet.</p>
                <p className="text-xs mt-1 text-gray-600">Your campaigns will show up here after you send them.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sentEmails.map(email => {
                  const isExpanded = expandedId === email.id;
                  const sentTo     = email.recipients ?? [];
                  const allEmails  = subscribers.map(s => s.email);
                  const notSentTo  = allEmails.filter(e => !sentTo.includes(e));

                  return (
                    <div
                      key={email.id}
                      className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#fe8d32]/20 transition-colors"
                    >
                      {/* Campaign row */}
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                        <div>
                          <p className="font-medium text-white">{email.subject}</p>
                          {email.resend_id && (
                            <p className="text-xs text-gray-600 font-mono mt-0.5">{email.resend_id}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {email.recipient_count} {email.recipient_count === 1 ? "person" : "people"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(email.sent_at).toLocaleString()}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Delivered
                          </span>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : email.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#fe8d32]/40 transition-all"
                          >
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {isExpanded ? "Hide" : "Details"}
                          </button>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="border-t border-[#2a2a2a] px-4 py-4 grid sm:grid-cols-2 gap-6">

                          {/* Sent to */}
                          <div>
                            <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Sent to ({sentTo.length})
                            </p>
                            {sentTo.length === 0 ? (
                              <p className="text-xs text-gray-600">No recipient data saved for this campaign.</p>
                            ) : (
                              <ul className="space-y-1">
                                {sentTo.map(e => (
                                  <li key={e} className="text-xs font-mono text-gray-300 bg-[#1a1a1a] px-3 py-1.5 rounded-lg">
                                    {e}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* Not sent to */}
                          <div>
                            <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Not sent to ({notSentTo.length})
                            </p>
                            {notSentTo.length === 0 ? (
                              <p className="text-xs text-gray-600">Everyone got this one.</p>
                            ) : (
                              <ul className="space-y-1">
                                {notSentTo.map(e => (
                                  <li key={e} className="text-xs font-mono text-gray-500 bg-[#1a1a1a] px-3 py-1.5 rounded-lg">
                                    {e}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}