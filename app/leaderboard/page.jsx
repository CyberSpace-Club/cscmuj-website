"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ParticlesBackground } from "../components/ParticlesBackground";
import logo from "@/assets/logonobg.png";

// Improved CSV parser to handle commas in values
function parseCSV(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines[0].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ""));
    const row = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || "";
    });
    return row;
  });
  return { headers, rows };
}

const LeaderboardPage = () => {
  const [data, setData] = useState({ headers: [], rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/leaderboard.csv")
      .then(res => {
        if (!res.ok) throw new Error("Leaderboards Coming Soon...");
        return res.text();
      })
      .then(csv => {
        setData(parseCSV(csv));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative flex flex-col items-center justify-center pt-24 pb-12 px-2">
      <ParticlesBackground />
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="flex flex-col items-center mb-8">
          <Image src={logo} alt="Club Logo" width={120} height={120} className="rounded-full shadow-lg mb-2" />
          <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-[#fe8d32] to-[#f8be19] text-transparent bg-clip-text drop-shadow-lg mb-2 tracking-tight">CyberQuest CTF Round 2</h1>
          <div className="text-lg text-gray-300 max-w-2xl text-center mb-2 mt-4 space-y-2">
            <p>Congratulations to the teams advancing to the next stage!</p>
            <p className="bg-[#fe8d32]/10 border border-[#fe8d32]/30 p-3 rounded-lg text-sm text-[#ffae53]">
              <strong>Note:</strong> The teams below are listed in no particular order. Placement on this list does not reflect final rankings, scores, or performance.
            </p>
          </div>
        </div>
        <div className="w-full max-w-4xl bg-[#181818] border border-[#fe8d32] rounded-2xl shadow-xl p-12 flex flex-col items-center">
          {loading ? (
            <p className="text-[#ffae53] text-lg text-center">Loading leaderboard...</p>
          ) : error ? (
            <p className="text-[#ffae53] text-lg text-center">{error}</p>
          ) : data.rows.length === 0 ? (
            <p className="text-[#ffae53] text-lg text-center">Leaderboards Coming Soon...</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full text-white">
                <thead>
                  <tr className="bg-[#232323]">
                    {data.headers.map(header => (
                      <th key={header} className="py-3 px-6 text-center first:rounded-tl-xl last:rounded-tr-xl capitalize">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#222] transition border-b border-[#333] last:border-none">
                      {data.headers.map(header => (
                        <td key={header} className="py-4 px-6 text-center whitespace-nowrap">{row[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-sm text-gray-400 mt-8 text-center">For any queries regarding the results, please contact the event coordinators.</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;