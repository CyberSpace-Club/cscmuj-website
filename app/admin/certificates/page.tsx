"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ParticlesBackground } from "../../components/ParticlesBackground";
import { supabase } from "@/lib/supabase";
type CertStatus = "preparing" | "available" | "distributed";
interface EventCertRow {
  name: string
  certificate_status?: string | null
  certificate_link?: string | null
}
import logo from "@/assets/logonobg.png";
interface StaticEvent {
  id: number
  name: string
  date: string
  description?: string
  location?: string
  registrationLink?: string
  certificateStatus?: string
  certificateLink?: string
  organizer?: string
  tags?: string[]
}

export default function CertificateManager() {
  const [events, setEvents] = useState<StaticEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<StaticEvent | null>(null)
  const [certificateLink, setCertificateLink] = useState("")
  const [certificateStatus, setCertificateStatus] = useState<CertStatus>("preparing")
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [certData, setCertData] = useState<Record<string, EventCertRow>>({})

  const pastEvents = events.filter(
    event => new Date(event.date) < new Date()
  )

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .then(({ data }) => {
        if (data) {
          setEvents(data as StaticEvent[])
          const map: Record<string, EventCertRow> = {}
          ;(data as EventCertRow[]).forEach(row => { map[row.name] = row })
          setCertData(map)
        }
        setLoading(false)
      })
  }, [])

  const handleEdit = (event: StaticEvent) => {
    setSelectedEvent(event)
    const existing = certData[event.name]
    setCertificateLink(existing?.certificate_link ?? event.certificateLink ?? "")
    setCertificateStatus((existing?.certificate_status ?? event.certificateStatus ?? "preparing") as CertStatus)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!selectedEvent) return
    setSaving(true)

    const { error } = await supabase.from("events").upsert(
      {
        name: selectedEvent.name,
        certificate_status: certificateStatus,
        certificate_link: certificateLink,
        date: selectedEvent.date,
        description: selectedEvent.description ?? "",
        location: selectedEvent.location ?? "",
        registration_link: selectedEvent.registrationLink ?? "",
        organizer: selectedEvent.organizer ?? "",
        tags: selectedEvent.tags ?? [],
      },
      { onConflict: "name" }
    )

    setSaving(false)

    if (error) {
      alert("Error saving: " + error.message)
    } else {
      setCertData(prev => ({
        ...prev,
        [selectedEvent.name]: {
          name: selectedEvent.name,
          certificate_status: certificateStatus,
          certificate_link: certificateLink,
        },
      }))
      setShowForm(false)
      setSelectedEvent(null)
    }
  }

  const getStatus = (event: StaticEvent): { text: string; color: string } => {
    const status = certData[event.name]?.certificate_status ?? event.certificateStatus
    switch (status) {
      case "available":    return { text: "Certificates Available", color: "text-green-400" }
      case "preparing":   return { text: "Being Prepared",          color: "text-yellow-400" }
      case "distributed": return { text: "Already Distributed",     color: "text-red-400" }
      default:            return { text: "No Status Set",           color: "text-gray-400" }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#fe8d32] text-lg animate-pulse">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <ParticlesBackground />
      <div className="container mx-auto px-4 py-16 pt-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Image src={logo} alt="Logo" width={64} height={64} className="rounded-full mr-4" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-[#fe8d32] to-[#f8be19] text-transparent bg-clip-text">
              Certificate Management
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Update certificate status and Google Drive links. Changes are saved to Supabase instantly.
          </p>
        </motion.div>

        {/* Modal */}
        {showForm && selectedEvent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Update Certificate</h3>
              <p className="text-gray-400 mb-4">
                Event: <span className="text-white font-semibold">{selectedEvent.name}</span>
              </p>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">Certificate Status</label>
                <select
                  value={certificateStatus}
                  onChange={e => setCertificateStatus(e.target.value as CertStatus)}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#fe8d32]"
                >
                  <option value="preparing">🟡 Being Prepared</option>
                  <option value="available">🟢 Available for Download</option>
                  <option value="distributed">🔴 Already Distributed</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Google Drive Link <span className="text-gray-500">(only for &quot;Available&quot;)</span>
                </label>
                <input
                  type="url"
                  value={certificateLink}
                  onChange={e => setCertificateLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#fe8d32]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-[#fe8d32] to-[#f8be19] rounded-lg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save to Supabase"}
                </button>
                <button
                  onClick={() => { setShowForm(false); setSelectedEvent(null) }}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event, index) => {
            const { text, color } = getStatus(event)
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] hover:border-[#fe8d32] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{event.name}</h3>
                  <span className="text-sm text-gray-400 ml-2 shrink-0">{event.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${color} text-sm`}>{text}</span>
                  <button
                    onClick={() => handleEdit(event)}
                    className="px-4 py-2 bg-linear-to-r from-[#fe8d32] to-[#f8be19] rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Update
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}