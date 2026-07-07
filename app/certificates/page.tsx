"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ParticlesBackground } from "../components/ParticlesBackground";
import { createBrowserClient } from "@supabase/ssr";
import logo from "@/assets/logonobg.png";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CertificateStatus = "available" | "preparing" | "distributed" | "";

interface Event {
  id: number;
  name: string;
  date: string;
  certificate_status: CertificateStatus;
  certificate_link: string;
}

interface StatusDisplay {
  label: string;
  color: string;
  icon: React.ReactNode;
}

const getStatusDisplay = (status: CertificateStatus): StatusDisplay => {
  const statusMap: Record<CertificateStatus, StatusDisplay> = {
    available: {
      label: "Ready to Download",
      color: "text-green-400",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    preparing: {
      label: "Almost Ready",
      color: "text-yellow-400",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
    },
    distributed: {
      label: "Handed Out",
      color: "text-red-400",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <rect x="6" y="11" width="12" height="2" fill="black" />
        </svg>
      ),
    },
    "": {
      label: "Not Available Yet",
      color: "text-gray-400",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="M7 7l10 10M17 7l-10 10" stroke="black" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  };

  return statusMap[status];
};

interface CertificateCardProps {
  event: Event;
  onDownload: (event: Event) => void;
  borderColor: string;
  shadowColor: string;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  event,
  onDownload,
  borderColor,
  shadowColor,
}) => {
  const status = getStatusDisplay(event.certificate_status);
  const canDownload = event.certificate_status === "available";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#1a1a1a] rounded-xl p-6 border ${borderColor} hover:border-opacity-100 transition-all duration-300 hover:shadow-lg hover:${shadowColor}`}
    >
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-xl font-bold text-white">{event.name}</h3>
        <span className="text-sm text-gray-400">{event.date}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className={`${status.color} text-sm flex items-center gap-1`}>
          {status.icon}
          {status.label}
        </span>

        {canDownload && (
          <button
            onClick={() => onDownload(event)}
            className="px-4 py-2 bg-gradient-to-r from-[#fe8d32] to-[#f8be19] rounded-lg text-white text-sm font-semibold hover:opacity-90 hover:scale-105 hover:shadow-lg hover:shadow-[#fe8d32]/30 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Get Certificate
          </button>
        )}
      </div>
    </motion.div>
  );
};

interface EventGroupProps {
  title: string;
  events: Event[];
  icon: React.ReactNode;
  titleColor: string;
  borderColor: string;
  shadowColor: string;
  onDownload: (event: Event) => void;
}

const EventGroup: React.FC<EventGroupProps> = ({
  title,
  events,
  icon,
  titleColor,
  borderColor,
  shadowColor,
  onDownload,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-12"
  >
    <h2 className={`text-2xl font-bold ${titleColor} mb-6 flex items-center gap-2`}>
      {icon}
      {title}
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {events.map((event) => (
        <CertificateCard
          key={event.id}
          event={event}
          onDownload={onDownload}
          borderColor={borderColor}
          shadowColor={shadowColor}
        />
      ))}
    </div>
  </motion.div>
);

const EmptyStateView: React.FC<{
  searchTerm: string;
  onClearSearch: () => void;
}> = ({ searchTerm, onClearSearch }) => {
  if (searchTerm) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <p className="text-gray-400 text-xl mb-4">
          Nothing matched "{searchTerm}" — try a different spelling?
        </p>
        <button
          onClick={onClearSearch}
          className="px-4 py-2 bg-[#fe8d32] rounded-lg text-white hover:opacity-90 transition-opacity"
        >
          Clear Search
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <div className="max-w-md mx-auto">
        <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-white mb-2">Nothing here yet</h3>
        <p className="text-gray-400">Once your events wrap up, your certificates will show up here.</p>
      </div>
    </motion.div>
  );
};

const HowItWorks: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="mt-12 bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]"
  >
    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
      <svg className="w-5 h-5 text-[#fe8d32]" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      How to get your certificate
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 mb-8">
      {[
        "Find your event in the list above",
        'Hit "Get Certificate" — it\'ll open a folder with all the certificates inside',
        "Look for your name and save the file somewhere handy",
      ].map((step, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="bg-[#fe8d32] text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
            {i + 1}
          </span>
          <p className="mt-1">{step}</p>
        </div>
      ))}
    </div>

    <div className="p-4 bg-gray-900/20 border border-gray-600/30 rounded-lg">
      <p className="font-bold text-white text-center text-lg mb-4">What do the statuses mean?</p>
      <ul className="space-y-2 text-sm text-gray-300">
        <li className="flex items-start gap-2">
          <span className="text-green-400 font-semibold flex-shrink-0">Ready:</span>
          <span>Your certificate is available — go ahead and download it.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-yellow-400 font-semibold flex-shrink-0">Almost Ready:</span>
          <span>We're still putting the finishing touches on it.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 font-semibold flex-shrink-0">Handed Out:</span>
          <span>These certificates were given out during the event.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400 font-semibold flex-shrink-0">Not Available:</span>
          <span>Certificates aren't offered for this event.</span>
        </li>
      </ul>
    </div>
  </motion.div>
);

export default function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("id, name, date, certificate_status, certificate_link");

      setEvents((data as Event[]) || []);
      setIsLoading(false);
    };

    loadEvents();
  }, []);

  const pastEvents = events.filter(
    (event) => new Date(event.date) < new Date()
  );

  const filteredEvents = pastEvents.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableEvents = filteredEvents.filter(
    (e) => e.certificate_status === "available"
  );

  const preparingEvents = filteredEvents.filter(
    (e) => e.certificate_status === "preparing"
  );

  const distributedEvents = filteredEvents.filter(
    (e) => e.certificate_status === "distributed"
  );

  const otherEvents = filteredEvents.filter(
    (e) =>
      e.certificate_status !== "available" &&
      e.certificate_status !== "preparing" &&
      e.certificate_status !== "distributed"
  );

  const handleDownload = (event: Event) => {
    if (event.certificate_link) {
      window.open(event.certificate_link, "_blank");
    }
  };

  const hasEvents =
    availableEvents.length > 0 ||
    preparingEvents.length > 0 ||
    distributedEvents.length > 0 ||
    otherEvents.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#fe8d32] text-lg animate-pulse">
          Fetching your certificates…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <ParticlesBackground />

      <div className="container mx-auto px-4 py-16 pt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Image
              src={logo}
              alt="Logo"
              width={64}
              height={64}
              className="rounded-full mr-4"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#fe8d32] to-[#f8be19] text-transparent bg-clip-text">
              Your Certificates
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            All your hard work, in one place. Find an event below and grab your
            certificate.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search events…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#fe8d32] pr-10"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>

        {availableEvents.length > 0 && (
          <EventGroup
            title="Ready to Download"
            events={availableEvents}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            }
            titleColor="text-green-400"
            borderColor="border-green-500/30 hover:border-green-400"
            shadowColor="shadow-green-400/10"
            onDownload={handleDownload}
          />
        )}

        {preparingEvents.length > 0 && (
          <EventGroup
            title="Almost Ready"
            events={preparingEvents}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            }
            titleColor="text-yellow-400"
            borderColor="border-yellow-500/30 hover:border-yellow-400"
            shadowColor="shadow-yellow-400/10"
            onDownload={handleDownload}
          />
        )}

        {distributedEvents.length > 0 && (
          <EventGroup
            title="Handed Out"
            events={distributedEvents}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <rect x="6" y="11" width="12" height="2" fill="black" />
              </svg>
            }
            titleColor="text-red-400"
            borderColor="border-red-500/30 hover:border-red-400"
            shadowColor="shadow-red-400/10"
            onDownload={handleDownload}
          />
        )}

        {otherEvents.length > 0 && (
          <EventGroup
            title="Other Events"
            events={otherEvents}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            }
            titleColor="text-gray-400"
            borderColor="border-[#2a2a2a] hover:border-[#fe8d32]"
            shadowColor="shadow-[#fe8d32]/10"
            onDownload={handleDownload}
          />
        )}

        {!hasEvents ? (
          <EmptyStateView
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm("")}
          />
        ) : (
          <HowItWorks />
        )}
      </div>
    </div>
  );
}