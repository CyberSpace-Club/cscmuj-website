"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ParticlesBackground } from "../components/ParticlesBackground";
import { createBrowserClient } from "@supabase/ssr";
import logo from "@/assets/logonobg.png";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  const isPastEvent = new Date(event.date) < new Date();
  const winners = event.winners ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-2 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`bg-[#1a1a1a] rounded-xl w-full ${isPastEvent && winners.length > 0 ? 'sm:max-w-6xl' : 'sm:max-w-4xl'} overflow-hidden my-2 sm:my-4 flex flex-col sm:flex-row sm:gap-8 gap-4 px-0 sm:px-12 py-0 sm:py-2 shadow-2xl relative max-h-screen overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo in top right */}
        <div className="hidden sm:block absolute top-4 right-4 z-30">
          <Image src={logo} alt="Logo" width={60} height={60} className="rounded-full shadow-lg" />
        </div>

        {/* Vertical Divider */}
        {isPastEvent && winners.length > 0 && (
          <div className="hidden sm:block absolute left-[54%] top-8 bottom-8 w-[2.5px] bg-[#fe8d32] opacity-60 rounded-full z-20" />
        )}

        {/* Left: Event Info */}
        <div className={`${isPastEvent && winners.length > 0 ? 'sm:w-1/2' : 'w-full'} w-full min-w-[320px] flex-shrink-0 px-4 sm:px-0 flex flex-col justify-center`}>
          {event.image_url && (
            <div className="relative h-[350px] xs:h-[400px] sm:h-[450px]">
              <Image
                src={event.image_url}
                alt={event.name}
                fill
                priority
                className="object-contain p-2"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a] via-transparent to-transparent" />
            </div>
          )}
          <div className="p-3 sm:p-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{event.name}</h2>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-gray-400 mb-3 text-sm">
              <p>{event.date}</p>
              <p className="hidden sm:block">•</p>
              <p>{event.location}</p>
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">{event.description}</p>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {event.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-black/50 text-gray-300 px-2 py-1 rounded-sm backdrop-blur-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
              {!isPastEvent ? (
                event?.name?.toLowerCase() === 'cyber awareness camp' ? (
                  <span className="px-6 py-2 bg-gray-700 rounded-lg text-gray-200 text-center">
                    Event for School Students
                  </span>
                ) : (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-linear-to-r from-[#fe8d32] to-[#f8be19] rounded-lg text-white font-semibold hover:opacity-90 transition-opacity text-center"
                  >
                    Register Now
                  </a>
                )
              ) : (
                event?.name?.toLowerCase() === 'cyber awareness camp' ? (
                  <span className="px-6 py-2 bg-gray-700 rounded-lg text-gray-200 text-center">
                    Event for School Students Only
                  </span>
                ) : (
                  <span className="px-6 py-2 bg-gray-700 rounded-lg text-gray-300 text-center cursor-not-allowed">
                    Registration Closed
                  </span>
                )
              )}
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Right: Winners */}
        {isPastEvent && winners.length > 0 && (
          <div className="sm:w-1/2 w-full min-w-[320px] flex-shrink-0 flex flex-col justify-center items-center px-4 sm:px-0 sm:ml-4">
            <h3 className="text-2xl font-extrabold text-[#fe8d32] mb-3 tracking-wide" style={{ textShadow: '0 1px 4px #fe8d32, 0 1px 1px #000' }}>Winners</h3>
            <div className="w-12 h-1 rounded-full bg-[#fe8d32] opacity-70 mb-6 mx-auto"></div>
            <div className="flex flex-col gap-4 w-full max-w-sm">
              {winners.map((winner) => {
                const icon = winner.position === 1 ? '🥇' : winner.position === 2 ? '🥈' : '🥉';
                return (
                  <div
                    key={winner.position}
                    className="flex items-center gap-3 bg-[#232323] rounded-lg shadow px-4 py-3 border border-[#2d2d2d] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#fe8d32] cursor-pointer"
                  >
                    <span className="text-2xl font-bold" style={{ minWidth: 32, textAlign: 'center' }}>{icon}</span>
                    <div className="flex flex-col">
                      <span className="text-base sm:text-lg font-semibold text-white">{winner.winner_name}</span>
                      <span className="text-xs text-gray-400">{winner.position === 1 ? '1st Place' : winner.position === 2 ? '2nd Place' : '3rd Place'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const EventCard = ({ event, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-[500px] w-full overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10" />
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.name}
            fill
            priority
            className="group-hover:scale-105 transition-transform duration-300 object-contain bg-black/40"
          />
        ) : (
          <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
            <span className="text-gray-600 text-sm">No image</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-linear-to-t from-black/90 via-black/50 to-transparent">
          <h3 className="text-2xl font-bold text-white">{event.name}</h3>
          {event.tags && (
            <div className="flex flex-wrap gap-2 mt-2">
              {event.tags.map((tag, i) => (
                <span key={i} className="text-sm bg-black/50 text-gray-300 px-2 py-1 rounded-sm backdrop-blur-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const PreviousEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      // Fetch events (only visible ones)
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .neq("is_visible", false)
        .order("id", { ascending: false });

      if (!eventsData) { setLoading(false); return; }

      // Fetch winners
      const { data: winnersData } = await supabase
        .from("event_winners")
        .select("*");

      // Attach winners to each event
      const eventsWithWinners = eventsData.map(e => ({
        ...e,
        winners: (winnersData ?? [])
          .filter(w => w.event_name === e.name)
          .sort((a, b) => a.position - b.position),
      }));

      setEvents(eventsWithWinners);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const currentDate = new Date();
const upcomingEvents = events
  .filter(e => new Date(e.date) >= currentDate)
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // soonest first

const pastEvents = events
  .filter(e => new Date(e.date) < currentDate)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // most recent first
  const filteredPastEvents = pastEvents.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayEvents = showPastEvents ? filteredPastEvents : upcomingEvents;

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <ParticlesBackground />
      <div className="container mx-auto px-4 py-16 pt-24 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-center mb-8 bg-linear-to-r from-[#fe8d32] to-[#f8be19] text-transparent bg-clip-text"
        >
          Our Events
        </motion.h1>

        <div className="flex justify-center mb-12">
          <div className="bg-[#1a1a1a] rounded-full p-1 flex">
            <button
              onClick={() => setShowPastEvents(false)}
              className={`px-6 py-2 rounded-full transition-all ${!showPastEvents ? 'bg-linear-to-r from-[#fe8d32] to-[#ce9700] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setShowPastEvents(true)}
              className={`px-6 py-2 rounded-full transition-all ${showPastEvents ? 'bg-linear-to-r from-[#fe8d32] to-[#ce9700] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Past Events
            </button>
          </div>
        </div>

        {showPastEvents && (
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search past events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#fe8d32] transition-colors"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading events…</div>
        ) : displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onClick={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">Coming Soon</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PreviousEvents;