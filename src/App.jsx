import { useState, useMemo, useEffect } from "react";

// ─── CONFIG (easy to edit) ────────────────────────────────────────────────────
const CONFIG = {
  city: "Nashville, TN",
  daysAhead: 7,       // change to expand/shrink the search window
  concurrency: 3,     // max simultaneous API calls — raise if your plan allows more
};

const VENUE_LIST = [
  { name: "Ryman Auditorium", area: "Downtown", calendarUrl: "https://ryman.com/events/" },
  { name: "Grand Ole Opry House", area: "Downtown", calendarUrl: "https://www.opry.com/tickets/" },
  { name: "Tootsies Orchid Lounge", area: "Downtown", calendarUrl: "https://tootsies.net/calendar/" },
  { name: "Robert's Western World", area: "Downtown", calendarUrl: "https://robertswesternworld.com" },
  { name: "The Stage on Broadway", area: "Downtown", calendarUrl: "https://thestageonbroadway.com" },
  { name: "Ascend Amphitheater", area: "Downtown", calendarUrl: "https://www.ascendamphitheater.com/events/" },
  { name: "Printer's Alley venues", area: "Downtown", calendarUrl: "https://www.visitmusiccity.com/things-to-do/neighborhoods/printers-alley" },
  { name: "Station Inn", area: "SoBro / The Gulch", calendarUrl: "https://www.stationinn.com/calendar" },
  { name: "City Winery Nashville", area: "SoBro / The Gulch", calendarUrl: "https://citywinery.com/nashville/Online/default.asp" },
  { name: "Listening Room Cafe", area: "SoBro / The Gulch", calendarUrl: "https://www.listeningroomcafe.com/calendar" },
  { name: "Up! Rooftop Lounge", area: "SoBro / The Gulch", calendarUrl: "https://www.uprooftopnashville.com" },
  { name: "The 5 Spot", area: "East Nashville", calendarUrl: "https://www.the5spot.club/calendar" },
  { name: "The Basement East", area: "East Nashville", calendarUrl: "https://www.thebasementnashville.com/calendar" },
  { name: "The East Room", area: "East Nashville", calendarUrl: "https://www.theeastroomnashville.com/events" },
  { name: "The Cobra", area: "East Nashville", calendarUrl: "https://www.thecobraNashville.com/events" },
  { name: "DRKMTTR", area: "East Nashville", calendarUrl: "https://drkmttr.com/events" },
  { name: "Exit/In", area: "Midtown / Music Row", calendarUrl: "https://exitin.com/calendar/" },
  { name: "Mercy Lounge / High Watt / Cannery Ballroom", area: "Midtown / Music Row", calendarUrl: "https://www.mercylounge.com/calendar" },
  { name: "Loser's Bar & Grill / Winner's Bar & Grill", area: "Midtown / Music Row", calendarUrl: "https://www.losers.com" },
  { name: "3rd & Lindsley", area: "Midtown / Music Row", calendarUrl: "https://www.3rdandlindsley.com/calendar" },
  { name: "Bluebird Cafe", area: "Specialty", calendarUrl: "https://www.bluebirdcafe.com/reservations" },
  { name: "Rudy's Jazz Room", area: "Specialty", calendarUrl: "https://www.rudysjazzroom.com/calendar" },
  { name: "The Blue Room at Third Man Records", area: "Specialty", calendarUrl: "https://thirdmanrecords.com/pages/events" },
  { name: "The Basement", area: "Specialty", calendarUrl: "https://www.thebasementnashville.com/calendar" },
  { name: "Harken Hall", area: "Specialty", calendarUrl: "https://www.harkenhall.com/calendar" },
  { name: "Pete's Dueling Piano Bar", area: "Specialty", calendarUrl: "https://www.petesduelingpianobar.com/nashville" },
  { name: "Assembly Food Hall", area: "Specialty", calendarUrl: "https://www.assemblyfoodhall.com/events" },
  { name: "The Local", area: "Specialty", calendarUrl: "https://www.thelocalnashville.com" },
  { name: "Musicians Corner", area: "Specialty", calendarUrl: "https://www.musicianscornernashville.com" },
  { name: "Live on the Green", area: "Specialty", calendarUrl: "https://www.liveonthegreen.com" },
  { name: "The Twelve Thirty Club", area: "Specialty", calendarUrl: "https://www.thetwelvethirtyclub.com/events" },
  { name: "FirstBank Amphitheater", area: "Franklin & Williamson Co.", calendarUrl: "https://www.firstbankamp.com/events" },
  { name: "The Franklin Theatre", area: "Franklin & Williamson Co.", calendarUrl: "https://www.thefranklinTheatre.com/events" },
  { name: "Kimbro's Pickin' Parlor", area: "Franklin & Williamson Co.", calendarUrl: "https://www.kimbrospickinparlor.com/events" },
  { name: "Puckett's Gro. & Restaurant (Franklin)", area: "Franklin & Williamson Co.", calendarUrl: "https://www.puckettsgro.com/events" },
  { name: "Gray's on Main", area: "Franklin & Williamson Co.", calendarUrl: "https://www.graysonmain.com/events" },
  { name: "Americana Taphouse (Franklin)", area: "Franklin & Williamson Co.", calendarUrl: "https://www.americanataphouse.com/events" },
  { name: "The Harpeth Hotel", area: "Franklin & Williamson Co.", calendarUrl: "https://www.theharpethhotel.com/events" },
  { name: "Liberty Hall at The Factory at Franklin", area: "Franklin & Williamson Co.", calendarUrl: "https://www.factoryatfranklin.com/events" },
  { name: "Mockingbird Theatre (The Factory)", area: "Franklin & Williamson Co.", calendarUrl: "https://www.factoryatfranklin.com/events" },
  { name: "Whiskey Room Live (Franklin)", area: "Franklin & Williamson Co.", calendarUrl: "https://www.whiskeyroomlive.com/events" },
  { name: "The Pond (Franklin)", area: "Franklin & Williamson Co.", calendarUrl: "https://www.thepondbar.com" },
  { name: "Tin Roof 2 (Franklin)", area: "Franklin & Williamson Co.", calendarUrl: "https://tinroofbar.com/franklin" },
  { name: "McCreary's Irish Pub (Franklin)", area: "Franklin & Williamson Co.", calendarUrl: "https://www.mccrearysirishpub.com" },
  { name: "Fox & Locke (Leiper's Fork)", area: "Franklin & Williamson Co.", calendarUrl: "https://www.foxandlocke.com" },
  { name: "Leiper's Fork House of Spirits", area: "Franklin & Williamson Co.", calendarUrl: "https://www.leipersforkspirits.com" },
  { name: "Arrington Vineyards", area: "Franklin & Williamson Co.", calendarUrl: "https://www.arringtonvineyards.com/events" },
  { name: "Vanderbilt Dyer Observatory", area: "Greater Nashville", calendarUrl: "https://www.dyer.vanderbilt.edu/events" },
  { name: "Crockett Park (Brentwood)", area: "Greater Nashville", calendarUrl: "https://www.brentwood-tn.gov/parks" },
  { name: "The Southall / Hilltop at Southall", area: "Greater Nashville", calendarUrl: "https://www.southall.com/events" },
  { name: "Williamson County Performing Arts Center", area: "Greater Nashville", calendarUrl: "https://www.wcpac.org/events" },
];

const AREAS = ["All Areas", ...Array.from(new Set(VENUE_LIST.map((v) => v.area)))];

// ─── MOCK DATA (for previewing the layout without a live API call) ─────────────
function getMockEvents() {
  const today = new Date();
  const d = (offset) => {
    const dt = new Date(today);
    dt.setDate(today.getDate() + offset);
    return dt.toISOString().split("T")[0];
  };
  return [
    // Day 0
    { date: d(0), time: "7:00 PM", artist: "The Steeldrivers", venue: "Ryman Auditorium", venueUrl: "https://ryman.com", area: "Downtown", genre: "Bluegrass", cost: "$45", ageRestriction: "All Ages", notes: "Limited seats remaining. Parking available at 5th Ave garage." },
    { date: d(0), time: "8:30 PM", artist: "Molly Tuttle & Golden Highway", venue: "Station Inn", venueUrl: "https://stationinn.com", area: "SoBro / The Gulch", genre: "Americana", cost: "$20", ageRestriction: "All Ages", notes: "Intimate seated show, doors at 7:30 PM." },
    { date: d(0), time: "9:00 PM", artist: "Marcus King Band", venue: "Exit/In", venueUrl: "https://exitin.com", area: "Midtown / Music Row", genre: "Blues / Rock", cost: "$25 advance / $30 door", ageRestriction: "18+", notes: null },
    // Day 1
    { date: d(1), time: "6:30 PM", artist: "Sierra Hull", venue: "Bluebird Cafe", venueUrl: "https://bluebirdcafe.com", area: "Specialty", genre: "Bluegrass / Folk", cost: "$15", ageRestriction: "All Ages", notes: "Strict listening room — no talking during performances. Reservations strongly recommended." },
    { date: d(1), time: "8:00 PM", artist: "Cory Wong", venue: "City Winery Nashville", venueUrl: "https://citywinery.com/nashville", area: "SoBro / The Gulch", genre: "Funk / Jazz", cost: "$35", ageRestriction: "All Ages", notes: "Assigned seating. Dinner service available with ticket purchase." },
    { date: d(1), time: "10:00 PM", artist: "The Black Cadillacs", venue: "The Cobra", venueUrl: "https://thecobraNashville.com", area: "East Nashville", genre: "Indie Rock", cost: "$10", ageRestriction: "21+", notes: null },
    // Day 2
    { date: d(2), time: "7:30 PM", artist: "Béla Fleck & Abigail Washburn", venue: "Listening Room Cafe", venueUrl: "https://listeningroomcafe.com", area: "SoBro / The Gulch", genre: "Acoustic / Americana", cost: "$30", ageRestriction: "All Ages", notes: "Two sets. Doors at 7:00 PM." },
    { date: d(2), time: "9:00 PM", artist: "Dueling Pianos: Nashville Edition", venue: "Pete's Dueling Piano Bar", venueUrl: "https://petesduelingpianobar.com", area: "Specialty", genre: "Variety / Interactive", cost: "Free before 9 PM, $5 after", ageRestriction: "21+", notes: "Crowd request-driven show. High energy, expect a full house." },
    // Day 3
    { date: d(3), time: "8:00 PM", artist: "Trisha Yearwood", venue: "Grand Ole Opry House", venueUrl: "https://opry.com", area: "Downtown", genre: "Country", cost: "$55–$95", ageRestriction: "All Ages", notes: "Special guest TBA. Part of the weekly Opry lineup — arrive early for best seating." },
    { date: d(3), time: "9:30 PM", artist: "Amythyst Kiah", venue: "The Basement East", venueUrl: "https://thebasementnashville.com", area: "East Nashville", genre: "Folk / Blues", cost: "$18", ageRestriction: "All Ages", notes: null },
    // Day 4
    { date: d(4), time: "8:00 PM", artist: "Rudy's Jazz Quartet", venue: "Rudy's Jazz Room", venueUrl: "https://rudysjazzroom.com", area: "Specialty", genre: "Jazz", cost: "$15", ageRestriction: "All Ages", notes: "Stone-walled basement venue, ~50 seats. Walk-ins welcome if capacity allows." },
    { date: d(4), time: "9:00 PM", artist: "Them Vibes", venue: "The 5 Spot", venueUrl: "https://the5spot.club", area: "East Nashville", genre: "Rock / R&B", cost: "$12", ageRestriction: "21+", notes: "The 5 Spot hosts live music 7 nights a week." },
    // Day 5
    { date: d(5), time: "6:00 PM", artist: "The Secret Sisters", venue: "The Franklin Theatre", venueUrl: "https://thefranklinTheatre.com", area: "Franklin & Williamson Co.", genre: "Country / Folk", cost: "$28", ageRestriction: "All Ages", notes: "Historic 1937 theatre, excellent acoustics. Street parking available downtown Franklin." },
    { date: d(5), time: "8:00 PM", artist: "Nathaniel Rateliff & The Night Sweats", venue: "Ascend Amphitheater", venueUrl: "https://ascendamphitheater.com", area: "Downtown", genre: "Soul / Rock", cost: "$40–$85", ageRestriction: "All Ages", notes: "Riverfront outdoor venue. Gates open at 6:30 PM. Food and beverage vendors on site." },
    // Day 6
    { date: d(6), time: "2:00 PM", artist: "Sunday Songwriter Round", venue: "Kimbro's Pickin' Parlor", venueUrl: "https://kimbrospickinparlor.com", area: "Franklin & Williamson Co.", genre: "Americana / Singer-Songwriter", cost: "Free", ageRestriction: "All Ages", notes: "Weekly Sunday afternoon round featuring 3–4 local songwriters." },
    { date: d(6), time: "7:00 PM", artist: "Paul Cauthen", venue: "3rd & Lindsley", venueUrl: "https://3rdandlindsley.com", area: "Midtown / Music Row", genre: "Country / Soul", cost: "$22", ageRestriction: "All Ages", notes: "Full dinner menu available. Part of the Lightning 100 Nashville Sunday Night radio series." },
    // Day 7
    { date: d(7), time: "7:30 PM", artist: "Larkin Poe", venue: "Ryman Auditorium", venueUrl: "https://ryman.com", area: "Downtown", genre: "Blues / Rock", cost: "$38", ageRestriction: "All Ages", notes: "Sisters Rebecca and Megan Lovell. Doors open at 6:30 PM." },
    { date: d(7), time: "9:00 PM", artist: "The Stone Foxes", venue: "The Cobra", venueUrl: "https://thecobraNashville.com", area: "East Nashville", genre: "Rock", cost: "$12", ageRestriction: "21+", notes: null },
    // Day 8
    { date: d(8), time: "8:00 PM", artist: "Yola", venue: "City Winery Nashville", venueUrl: "https://citywinery.com/nashville", area: "SoBro / The Gulch", genre: "Soul / Country", cost: "$32", ageRestriction: "All Ages", notes: "Assigned seating. Dinner service available." },
    { date: d(8), time: "9:30 PM", artist: "Monday Night Jazz Jam", venue: "Rudy's Jazz Room", venueUrl: "https://rudysjazzroom.com", area: "Specialty", genre: "Jazz", cost: "$10", ageRestriction: "All Ages", notes: "Open jam format — local musicians welcome to sit in after the first set." },
    // Day 9
    { date: d(9), time: "7:00 PM", artist: "The Lone Bellow", venue: "Listening Room Cafe", venueUrl: "https://listeningroomcafe.com", area: "SoBro / The Gulch", genre: "Americana / Folk", cost: "$25", ageRestriction: "All Ages", notes: "Intimate listening room format. No talking during sets." },
    { date: d(9), time: "9:00 PM", artist: "Whitehorse", venue: "The Basement East", venueUrl: "https://thebasementnashville.com", area: "East Nashville", genre: "Indie Country", cost: "$20", ageRestriction: "All Ages", notes: null },
    // Day 10
    { date: d(10), time: "8:00 PM", artist: "Valerie June", venue: "Exit/In", venueUrl: "https://exitin.com", area: "Midtown / Music Row", genre: "Folk / Soul", cost: "$22", ageRestriction: "18+", notes: "One of Nashville's most celebrated independent venues. Bar open from doors." },
    { date: d(10), time: "10:00 PM", artist: "Glossy", venue: "DRKMTTR", venueUrl: "https://drkmttr.com", area: "East Nashville", genre: "Experimental / Indie", cost: "$8", ageRestriction: "All Ages", notes: "DIY artist-run venue. Cash at the door." },
    // Day 11
    { date: d(11), time: "7:30 PM", artist: "American Aquarium", venue: "3rd & Lindsley", venueUrl: "https://3rdandlindsley.com", area: "Midtown / Music Row", genre: "Americana / Country Rock", cost: "$20", ageRestriction: "All Ages", notes: "Full dinner menu available. Excellent sound system." },
    { date: d(11), time: "9:00 PM", artist: "Weekly Bluegrass Night", venue: "Station Inn", venueUrl: "https://stationinn.com", area: "SoBro / The Gulch", genre: "Bluegrass", cost: "$15", ageRestriction: "All Ages", notes: "One of the country's premier bluegrass venues. Walk-ins welcome." },
    // Day 12
    { date: d(12), time: "6:30 PM", artist: "Songwriter Showcase", venue: "Bluebird Cafe", venueUrl: "https://bluebirdcafe.com", area: "Specialty", genre: "Singer-Songwriter", cost: "$12", ageRestriction: "All Ages", notes: "Four songwriters in the round. Reservations highly recommended — venue seats under 90." },
    { date: d(12), time: "8:30 PM", artist: "Cedric Burnside", venue: "The East Room", venueUrl: "https://theeastroomnashville.com", area: "East Nashville", genre: "Blues", cost: "$18", ageRestriction: "All Ages", notes: "Cozy neighborhood venue. Limited standing room." },
    // Day 13
    { date: d(13), time: "3:00 PM", artist: "Jazz Afternoon at the Vineyard", venue: "Arrington Vineyards", venueUrl: "https://arringtonvineyards.com", area: "Franklin & Williamson Co.", genre: "Jazz / Classical", cost: "Free with wine purchase", ageRestriction: "All Ages", notes: "Outdoor event on the vineyard grounds. Bring lawn chairs or blankets." },
    { date: d(13), time: "7:00 PM", artist: "The War and Treaty", venue: "FirstBank Amphitheater", venueUrl: "https://firstbankamp.com", area: "Franklin & Williamson Co.", genre: "Soul / Gospel / Country", cost: "$35–$75", ageRestriction: "All Ages", notes: "Outdoor amphitheater in Franklin. Gates open at 5:30 PM." },
  ];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getDateRange(daysAhead) {
  const today = new Date();
  const end = new Date(today);
  end.setDate(today.getDate() + daysAhead - 1);
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return { start: today, end, label: `${fmt(today)} – ${fmt(end)}` };
}

// Returns the YYYY-MM-DD of the Monday of the current week.
// Used as the storage cache key — auto-invalidates each new week.
function getMondayKey() {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today);
  monday.setDate(diff);
  return monday.toISOString().split("T")[0];
}

const STORAGE_KEY = `nashville-music-week-${getMondayKey()}`;

function groupByDay(events) {
  const map = {};
  events.forEach((ev) => {
    if (!map[ev.date]) map[ev.date] = [];
    map[ev.date].push(ev);
  });
  return Object.entries(map).sort(([a], [b]) => new Date(a) - new Date(b));
}

function formatDayHeader(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return {
    name: d.toLocaleDateString("en-US", { weekday: "long" }),
    date: d.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
  };
}

// Converts "8:30 PM" / "10:00 AM" / "TBD" to a sortable number (minutes since midnight)
function parseTimeToMinutes(timeStr) {
  if (!timeStr || timeStr === "TBD") return 9999; // push TBD to end
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 9999;
  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #F4F1EC;
    color: #1C1917;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }

  .app { display: flex; flex-direction: column; min-height: 100vh; }

  /* ── Header ── */
  .header {
    background: #1C2B3A;
    padding: 36px 32px 28px;
    text-align: center;
    border-bottom: 3px solid #2E7D5E;
  }
  .header-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.2em;
    color: #7FBFA4;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 6vw, 60px);
    color: #F4F1EC;
    line-height: 1.1;
    letter-spacing: 0.01em;
  }
  .header-title span { color: #2E7D5E; }
  .header-sub {
    margin-top: 10px;
    font-size: 13px;
    color: #8A9BAA;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.05em;
  }

  /* ── Controls ── */
  .controls {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    padding: 14px 32px;
    background: #ffffff;
    border-bottom: 1px solid #DDD8D0;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }
  .area-select {
    background: #F4F1EC;
    color: #1C1917;
    border: 1px solid #C8C2B8;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    outline: none;
  }
  .area-select:focus { border-color: #2E7D5E; box-shadow: 0 0 0 2px rgba(46,125,94,0.15); }

  .date-range-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #6B6560;
    padding: 7px 11px;
    background: #F4F1EC;
    border: 1px solid #DDD8D0;
    border-radius: 5px;
    white-space: nowrap;
  }

  .btn-group { display: flex; gap: 8px; margin-left: auto; }

  .btn {
    padding: 9px 20px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
    letter-spacing: 0.02em;
  }
  .btn-primary {
    background: #1C2B3A;
    color: #F4F1EC;
  }
  .btn-primary:hover { background: #263d52; }
  .btn-primary:active { transform: scale(0.97); }
  .btn-primary:disabled { background: #C8C2B8; color: #8A8480; cursor: not-allowed; }

  .btn-secondary {
    background: #ffffff;
    color: #2E7D5E;
    border: 1.5px solid #2E7D5E;
  }
  .btn-secondary:hover { background: #f0faf6; }

  /* ── Summary bar ── */
  .summary-bar {
    display: flex; gap: 20px; align-items: center;
    padding: 10px 32px;
    background: #EDE9E2;
    border-bottom: 1px solid #DDD8D0;
    font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #6B6560;
  }
  .summary-bar strong { color: #2E7D5E; }
  .mock-badge {
    margin-left: 8px;
    background: #FFF3CD;
    color: #856404;
    border: 1px solid #FFE69C;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.05em;
  }

  /* ── Main ── */
  .main { flex: 1; padding: 28px 32px 56px; max-width: 1200px; margin: 0 auto; width: 100%; }

  /* ── State screens ── */
  .state-screen {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 14px; padding: 80px 20px; text-align: center;
    color: #8A8480;
  }
  .state-icon { font-size: 44px; }
  .state-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px; color: #4A4540;
  }
  .state-body { font-size: 14px; max-width: 380px; line-height: 1.7; color: #6B6560; }

  /* ── Progress bar ── */
  .progress-bar-track {
    width: 200px; height: 4px;
    background: #DDD8D0; border-radius: 2px; overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%; background: #2E7D5E;
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  .progress-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #8A8480; margin-top: 6px;
  }
  .loading-dots span {
    display: inline-block; width: 8px; height: 8px;
    background: #2E7D5E; border-radius: 50%; margin: 0 3px;
    animation: bounce 1.2s infinite ease-in-out;
  }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }

  /* ── Day sections ── */
  .day-section { margin-bottom: 28px; }
  .day-header {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 14px;
    border-radius: 8px;
    background: #EDEAE3;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
    margin-bottom: 0;
  }
  .day-header:hover { background: #E4E0D8; }
  .day-header.open { border-radius: 8px 8px 0 0; margin-bottom: 0; }
  .day-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px; color: #1C1917;
  }
  .day-date {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; color: #2E7D5E; font-weight: 500;
  }
  .day-count {
    font-size: 12px; color: #8A8480;
    font-family: 'JetBrains Mono', monospace;
  }
  .day-chevron {
    margin-left: auto;
    font-size: 12px; color: #8A8480;
    transition: transform 0.2s ease;
    display: inline-block;
  }
  .day-chevron.open { transform: rotate(180deg); }
  .day-body {
    border: 1px solid #DDD8D0;
    border-top: none;
    border-radius: 0 0 8px 8px;
    padding: 14px;
    background: #FAFAF8;
  }

  /* ── Event grid ── */
  .event-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 14px;
  }

  /* ── Event card ── */
  .event-card {
    background: #ffffff;
    border: 1px solid #DDD8D0;
    border-radius: 10px;
    padding: 18px;
    display: flex; flex-direction: column; gap: 10px;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
    border-left: 3px solid #2E7D5E;
  }
  .event-card:hover {
    border-color: #2E7D5E;
    box-shadow: 0 4px 16px rgba(28,43,58,0.10);
    transform: translateY(-2px);
  }

  .card-time {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #2E7D5E;
    letter-spacing: 0.08em; font-weight: 500;
  }
  .card-artist {
    font-size: 16px; font-weight: 600; color: #1C1917;
    line-height: 1.3;
  }
  .card-venue, a.card-venue {
    font-size: 13px; color: #2E7D5E; font-weight: 500;
    text-decoration: none;
  }
  a.card-venue:hover { text-decoration: underline; }
  .card-area {
    font-size: 11px; color: #8A8480;
    font-family: 'JetBrains Mono', monospace;
  }
  .card-tags {
    display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px;
  }
  .tag {
    font-size: 11px;
    padding: 3px 9px; border-radius: 4px;
    font-family: 'Inter', sans-serif; font-weight: 500;
  }
  .tag-genre { background: #EEF2FF; color: #3730A3; }
  .tag-cost  { background: #F0FDF4; color: #166534; }
  .tag-age   { background: #FFF7ED; color: #9A3412; }
  .card-notes {
    font-size: 12px; color: #6B6560; line-height: 1.6;
    border-top: 1px solid #F0EDE8; padding-top: 8px;
  }

  /* ── Error ── */
  .error-box {
    background: #FEF2F2; border: 1px solid #FECACA;
    border-radius: 8px; padding: 14px 18px;
    color: #991B1B; font-size: 13px; line-height: 1.6;
    margin-bottom: 24px;
  }
`;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function App() {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [isMock, setIsMock] = useState(false);
  const [lastSearched, setLastSearched] = useState(null);
  const [daysAhead, setDaysAhead] = useState(CONFIG.daysAhead);

  // Option 4: cache keyed by "startDate|daysAhead|area" so re-searches only
  // fire when something that actually affects the query changes.
  const [cache, setCache] = useState({});
  const [collapsedDays, setCollapsedDays] = useState({});
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [storageLoading, setStorageLoading] = useState(true);
  const [fromStorage, setFromStorage] = useState(false);

  // On mount: check window.storage for this week's cached results.
  // STORAGE_KEY changes every Monday so stale data is never shown.
  useEffect(() => {
    async function loadFromStorage() {
      try {
        const result = await window.storage.get(STORAGE_KEY, true);
        if (result?.value) {
          const parsed = JSON.parse(result.value);
          if (parsed?.events && Array.isArray(parsed.events)) {
            setEvents(parsed.events);
            setLastSearched(new Date(parsed.savedAt));
            setFromStorage(true);
          }
        }
      } catch {
        // No cached data for this week — normal first-run state
      } finally {
        setStorageLoading(false);
      }
    }
    loadFromStorage();
  }, []);

  function toggleDay(dateStr) {
    setCollapsedDays((prev) => ({ ...prev, [dateStr]: !prev[dateStr] }));
  }

  const { start, end, label } = getDateRange(daysAhead);

  // Cache key includes the area so a per-area search is stored separately
  // from an all-areas search.
  const cacheKey = `${start.toISOString().split("T")[0]}|${daysAhead}|${selectedArea}`;

  const filteredEvents = useMemo(() => {
    if (!events) return null;
    const toDateStr = (d) => d.toISOString().split("T")[0];
    const startStr = toDateStr(start);
    const endStr = toDateStr(end);
    return events.filter((ev) => {
      if (ev.date < startStr || ev.date > endStr) return false;
      if (selectedArea !== "All Areas" && ev.area !== selectedArea) return false;
      return true;
    });
  }, [events, selectedArea, start, end]);

  const grouped = useMemo(() => (filteredEvents ? groupByDay(filteredEvents) : []), [filteredEvents]);

  function loadMockData() {
    setEvents(getMockEvents());
    setIsMock(true);
    setError(null);
    setLastSearched(new Date());
  }

  // Attempts to extract a valid JSON array from a raw string.
  // Returns the parsed array, or null if none found.
  function tryParseJsonArray(text) {
    if (!text) return null;
    let raw = text.trim()
      .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
    if (!raw.startsWith("[")) {
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) return null;
      raw = match[0];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  // Searches a single venue — one API call, 1–2 tool calls max.
  async function searchOneVenue(venue, startStr, endStr) {
    const urlLine = venue.calendarUrl
      ? `Calendar URL: ${venue.calendarUrl}`
      : `No calendar URL — search "[venue name] Nashville live music events" instead.`;

    const prompt = `Find confirmed live music events at this venue in ${CONFIG.city} between ${startStr} and ${endStr}.

VENUE: ${venue.name} (${venue.area})
${urlLine}

INSTRUCTIONS:
1. Fetch the calendar URL directly. If it returns a JavaScript-rendered or empty page, fall back to searching "${venue.name} Nashville live music events" instead.
2. Only include events confirmed on the official venue page or a primary ticketing source (Ticketmaster, Eventbrite, AXS).
3. Include the official venue website URL in the "venueUrl" field.
4. Retrieve the exact start time from the official source. Use "TBD" only if genuinely not posted.
5. Exclude sold-out events entirely.
6. Never fabricate any event, artist, time, or price.
7. If no events are found in this window, return an empty array.

Respond with ONLY a valid JSON array. Start with [ and end with ]. No prose, no markdown. If no events: []

Each item: { "date": "YYYY-MM-DD", "time": "8:00 PM", "artist": "Name", "venue": "${venue.name}", "venueUrl": "https://...", "area": "${venue.area}", "genre": "Genre", "cost": "$15", "ageRestriction": "All Ages or null", "soldOut": false, "notes": "text or null" }`;

    const searchResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: "You are a live music data assistant. Respond with only a raw JSON array starting with '[' and ending with ']'. Never write prose or markdown. If no events found, respond with: []",
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!searchResponse.ok) {
      const err = await searchResponse.json().catch(() => ({}));
      const msg = err?.error?.message || `API error ${searchResponse.status}`;
      console.error(`[${venue.name}] API error:`, msg);
      throw new Error(msg);
    }

    const searchData = await searchResponse.json();
    const textBlocks = searchData.content?.filter((b) => b.type === "text") ?? [];
    const rawText = textBlocks[textBlocks.length - 1]?.text ?? "";

    const direct = tryParseJsonArray(rawText);
    if (direct !== null) return direct;

    // Format pass — only fires if Step 1 returned prose
    if (!rawText.trim()) return [];

    const formatResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: "You are a JSON formatter. Output ONLY a valid JSON array starting with '['. No prose, no markdown. If no event data is present, output: []",
        messages: [{
          role: "user",
          content: `Convert the event information below into a JSON array. Each item must have: date (YYYY-MM-DD), time, artist, venue, venueUrl, area, genre, cost, ageRestriction, soldOut, notes. Do not invent data. Exclude sold-out events. Output ONLY the JSON array.\n\n${rawText}`,
        }],
      }),
    });

    if (!formatResponse.ok) return [];
    const formatData = await formatResponse.json();
    const formatBlocks = formatData.content?.filter((b) => b.type === "text") ?? [];
    const formatText = formatBlocks[formatBlocks.length - 1]?.text ?? "";
    return tryParseJsonArray(formatText) ?? [];
  }

  async function fetchEvents() {
    if (cache[cacheKey]) {
      setEvents(cache[cacheKey].events);
      setLastSearched(cache[cacheKey].timestamp);
      setIsMock(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setEvents(null);
    setIsMock(false);
    setProgress({ done: 0, total: 0 });

    // Flat list of venues to search — scoped to selected area if one is chosen
    const venuesToSearch = selectedArea === "All Areas"
      ? VENUE_LIST
      : VENUE_LIST.filter((v) => v.area === selectedArea);

    const startStr = start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const endStr = end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    setProgress({ done: 0, total: venuesToSearch.length });

    try {
      const failedVenues = [];
      const allEvents = [];

      // Run per-venue searches in batches of CONFIG.concurrency
      for (let i = 0; i < venuesToSearch.length; i += CONFIG.concurrency) {
        const batch = venuesToSearch.slice(i, i + CONFIG.concurrency);
        const batchResults = await Promise.allSettled(
          batch.map((venue) => searchOneVenue(venue, startStr, endStr))
        );

        batchResults.forEach((result, j) => {
          const venue = batch[j];
          if (result.status === "fulfilled") {
            allEvents.push(...result.value);
          } else {
            const reason = result.reason?.message || "unknown error";
            failedVenues.push(`${venue.name} (${reason})`);
            console.warn(`[${venue.name}] failed:`, result.reason);
          }
        });

        setProgress({ done: Math.min(i + CONFIG.concurrency, venuesToSearch.length), total: venuesToSearch.length });
      }

      // Deduplicate by artist+venue+date
      const seen = new Set();
      const deduped = allEvents.filter((ev) => {
        const key = `${(ev.artist || "").toLowerCase()}|${(ev.venue || "").toLowerCase()}|${ev.date}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      const enriched = deduped
        .filter((ev) => {
          if (ev.soldOut === true) return false;
          const notesLower = (ev.notes || "").toLowerCase();
          if (notesLower.includes("sold out") || notesLower.includes("sold-out")) return false;
          return true;
        })
        .map((ev) => {
          if (!ev.area) {
            const match = VENUE_LIST.find((v) =>
              v.name.toLowerCase().includes((ev.venue || "").toLowerCase())
            );
            ev.area = match?.area || "Other";
          }
          return ev;
        });

      if (enriched.length === 0 && failedVenues.length === venuesToSearch.length) {
        throw new Error("All venue searches failed. Please try again.");
      }

      setEvents(enriched);
      setLastSearched(new Date());
      setFromStorage(false);

      if (failedVenues.length > 0) {
        setError(`Note: search failed for ${failedVenues.length} venue(s): ${failedVenues.join(", ")}.`);
      }

      // Write to persistent shared storage so results survive page refreshes
      // and are available to anyone opening the artifact this week.
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify({
          events: enriched,
          savedAt: new Date().toISOString(),
        }), true);
      } catch (storageErr) {
        console.warn("Could not write to storage:", storageErr);
      }

      setCache((prev) => ({
        ...prev,
        [cacheKey]: { events: enriched, timestamp: new Date() },
      }));
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setProgress({ done: 0, total: 0 });
    }
  }

  // Clears this week's storage cache and re-runs the full search.
  async function refreshData() {
    try { await window.storage.delete(STORAGE_KEY, true); } catch {}
    setFromStorage(false);
    setEvents(null);
    setCache({});
    fetchEvents();
  }

  const totalEvents = filteredEvents?.length ?? 0;
  const totalVenues = filteredEvents ? new Set(filteredEvents.map((e) => e.venue)).size : 0;

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        <header className="header">
          <div className="header-eyebrow">Live Music Finder · {CONFIG.city}</div>
          <div className="header-title">
            <span>Nashville</span> This Week
          </div>
          <div className="header-sub">{label} · {VENUE_LIST.length} venues tracked</div>
        </header>

        <div className="controls">
          <select className="area-select" value={daysAhead} onChange={(e) => setDaysAhead(Number(e.target.value))}>
            <option value={1}>Next 1 day</option>
            <option value={2}>Next 2 days</option>
            <option value={3}>Next 3 days</option>
            <option value={4}>Next 4 days</option>
            <option value={5}>Next 5 days</option>
            <option value={6}>Next 6 days</option>
            <option value={7}>Next 7 days</option>
            <option value={8}>Next 8 days</option>
            <option value={9}>Next 9 days</option>
            <option value={10}>Next 10 days</option>
            <option value={11}>Next 11 days</option>
            <option value={12}>Next 12 days</option>
            <option value={13}>Next 13 days</option>
            <option value={14}>Next 14 days</option>
          </select>
          <select className="area-select" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <div className="btn-group">
            <button className="btn btn-secondary" onClick={loadMockData} disabled={loading}>
              Preview Sample Data
            </button>
            {fromStorage
              ? <button className="btn btn-primary" onClick={refreshData} disabled={loading}>
                  Refresh Data
                </button>
              : <button className="btn btn-primary" onClick={fetchEvents} disabled={loading}>
                  {loading ? "Searching…" : "Search Live Events"}
                </button>
            }
          </div>
        </div>

        {events && !loading && (
          <div className="summary-bar">
            <span><strong>{totalEvents}</strong> events</span>
            <span><strong>{totalVenues}</strong> venues</span>
            {isMock && <span className="mock-badge">SAMPLE DATA</span>}
            {fromStorage && <span className="mock-badge" style={{background:"#F0FDF4", color:"#166534", borderColor:"#BBF7D0"}}>CACHED THIS WEEK</span>}
            {!isMock && !fromStorage && cache[cacheKey] && <span className="mock-badge" style={{background:"#E0F2FE", color:"#0369A1", borderColor:"#BAE6FD"}}>SESSION CACHE</span>}
            {lastSearched && (
              <span style={{ marginLeft: "auto" }}>
                {fromStorage ? "Cached" : "Updated"} {lastSearched.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {lastSearched.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}

        <main className="main">
          {error && <div className="error-box">⚠️ {error}</div>}

          {loading && (
            <div className="state-screen">
              <div className="loading-dots"><span /><span /><span /></div>
              <div className="state-title">
                Searching {selectedArea === "All Areas" ? `All ${VENUE_LIST.length} Venues` : selectedArea}
              </div>
              {progress.total > 0 && (
                <>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }} />
                  </div>
                  <div className="progress-label">{progress.done} / {progress.total} venues searched</div>
                </>
              )}
              <div className="state-body">
                Searching {CONFIG.concurrency} venue{CONFIG.concurrency !== 1 ? "s" : ""} at a time — raise <code>concurrency</code> in CONFIG to go faster.
              </div>
            </div>
          )}

          {storageLoading && (
            <div className="state-screen">
              <div className="loading-dots"><span /><span /><span /></div>
              <div className="state-title">Loading</div>
              <div className="state-body">Checking for this week's cached results…</div>
            </div>
          )}

          {!storageLoading && !loading && !events && !error && (
            <div className="state-screen">
              <div className="state-icon">🎸</div>
              <div className="state-title">No Data Yet This Week</div>
              <div className="state-body">
                Press <strong>Search Live Events</strong> to search all {VENUE_LIST.length} Nashville venues. Results will be cached for the rest of the week — anyone opening this app will see them instantly.<br /><br />
                Want to see the layout first? Try <strong>Preview Sample Data</strong>.
              </div>
            </div>
          )}

          {!loading && events && grouped.length === 0 && (
            <div className="state-screen">
              <div className="state-icon">🎵</div>
              <div className="state-title">Light Week</div>
              <div className="state-body">No confirmed events found for the selected area and time window. Try "All Areas" or check back closer to the dates.</div>
            </div>
          )}

          {!loading && grouped.map(([dateStr, dayEvents]) => {
            const { name, date } = formatDayHeader(dateStr);
            const isOpen = !collapsedDays[dateStr];
            return (
              <div key={dateStr} className="day-section">
                <div
                  className={`day-header${isOpen ? " open" : ""}`}
                  onClick={() => toggleDay(dateStr)}
                >
                  <span className="day-name">{name}</span>
                  <span className="day-date">{date}</span>
                  <span className="day-count">{dayEvents.length} show{dayEvents.length !== 1 ? "s" : ""}</span>
                  <span className={`day-chevron${isOpen ? " open" : ""}`}>▼</span>
                </div>
                {isOpen && (
                  <div className="day-body">
                    <div className="event-grid">
                      {dayEvents
                        .sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time))
                        .map((ev, i) => (
                          <div key={i} className="event-card">
                            <div className="card-time">{ev.time}</div>
                            <div className="card-artist">{ev.artist}</div>
                            {ev.venueUrl
                              ? <a className="card-venue" href={ev.venueUrl} target="_blank" rel="noopener noreferrer">{ev.venue} ↗</a>
                              : <div className="card-venue">{ev.venue}</div>}
                            <div className="card-area">{ev.area}</div>
                            <div className="card-tags">
                              {ev.genre && <span className="tag tag-genre">{ev.genre}</span>}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </main>
      </div>
    </>
  );
}
