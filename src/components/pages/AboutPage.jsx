// src/components/pages/AboutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import CTASection from '../CTASection';
import API_CONFIG, { MEDIA_IDS, GALLERY_SECTION_IDS } from '../../config/api';
import pcFallback from "../../assets/team/pc.jpg";

const IDS = MEDIA_IDS.aboutPage;

function safeParse(raw, fallback) {
  try {
    let str = raw?.trim() || "";
    if (str.startsWith("'") && str.endsWith("'")) str = str.slice(1, -1);
    let parsed = JSON.parse(str);
    while (typeof parsed === "string") parsed = JSON.parse(parsed);
    return parsed;
  } catch (_) { return fallback; }
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`bg-white/[0.06] animate-pulse rounded ${className}`} />;
}

const AboutPage = () => {
  const navigate = useNavigate();

  const [loading,   setLoading]   = useState(true);
  const [picUrl,    setPicUrl]    = useState(pcFallback);

  // Hero section
  const [name,      setName]      = useState("PRAJWAL CHAVAN");
  const [role,      setRole]      = useState("PHOTOGRAPHER");
  const [aboutMe,   setAboutMe]   = useState("I'm a freelance photographer based in Pune who specializes in capturing moments across all types of photography. I love turning ideas into beautiful images, and I'm here to help you do the same.");
  const [wordsBy,   setWordsBy]   = useState("PajjuChavan");

  // Equipment section
  const [eqHeader,  setEqHeader]  = useState("MY EQUIPMENTS");
  const [eqDesc,    setEqDesc]    = useState("Here you can find the list of my equipment. The choice of camera depends on the photoshoot type, location, timing, and a lot more.");
  const [gears,     setGears]     = useState([]);

  // Team section — merged from gallery section_id=14 + media id=26
  const [team,      setTeam]      = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch media list and team gallery images in parallel
        const [data, galleryItems] = await Promise.all([
          fetch(API_CONFIG.endpoints.media.list).then(r => r.json()),
          fetch(API_CONFIG.endpoints.gallery.list(GALLERY_SECTION_IDS.team)).then(r => r.json()),
        ]);

        // Pic
        const picRecord = data.find(i => i.id === IDS.pic);
        if (picRecord?.url) setPicUrl(picRecord.url);

        // About myself
        const myselfRecord = data.find(i => i.id === IDS.myself);
        if (myselfRecord?.text) {
          const obj = safeParse(myselfRecord.text, null);
          const parsed = Array.isArray(obj) ? obj[0] : obj;
          if (parsed) {
            if (parsed.name)    setName(parsed.name);
            if (parsed.role)    setRole(parsed.role);
            if (parsed.aboutMe) setAboutMe(parsed.aboutMe);
            if (parsed.wordsBy) setWordsBy(parsed.wordsBy);
          }
        }

        // Equipment
        const eqRecord = data.find(i => i.id === IDS.equipment);
        if (eqRecord?.text) {
          const obj = safeParse(eqRecord.text, null);
          const parsed = Array.isArray(obj) ? obj[0] : obj;
          if (parsed) {
            if (parsed.header) setEqHeader(parsed.header.toUpperCase());
            if (parsed.desc)   setEqDesc(parsed.desc);
            if (Array.isArray(parsed.gears)) setGears(parsed.gears);
          }
        }

        // Team — merge gallery photos with name/role from media id=26
        const teamRecord = data.find(i => i.id === IDS.myTeam);
        const teamText   = safeParse(teamRecord?.text, []);
        // Build a lookup: galleryId (string) → { name, role }
        const textMap = {};
        if (Array.isArray(teamText)) {
          teamText.forEach(m => { textMap[String(m.id)] = { name: m.name || "", role: m.role || "" }; });
        }
        // Sort by sort_order then id, merge photo URL + info
        const merged = [...galleryItems]
          .sort((a, b) => (a.sort_order ?? a.id) - (b.sort_order ?? b.id))
          .map(item => ({
            id:   item.id,
            url:  item.url || null,
            name: textMap[String(item.id)]?.name || item.title || "",
            role: textMap[String(item.id)]?.role || "",
          }));
        setTeam(merged);

      } catch (err) {
        console.error("Error fetching about page data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Split name — last word gets accent colour, rest white
  function renderName(raw) {
    const parts = raw.trim().split(" ");
    if (parts.length < 2) return <>{raw}</>;
    const first = parts.slice(0, -1).join(" ");
    const last  = parts[parts.length - 1];
    return <><span className="text-[#D2C1AF]">{first}</span> {last}</>;
  }

  // Group gears into pairs for the two-column layout
  const gearPairs = [];
  for (let i = 0; i < gears.length; i += 2) gearPairs.push(gears.slice(i, i + 2));

  return (
    <div className="bg-[#0a0a0a] min-h-screen">

      {/* ── Hero Section ── */}
      <section className="pt-32 pb-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {loading ? (
                <Skeleton className="w-full h-[600px]" />
              ) : (
                <img src={picUrl} alt={name}
                  className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  onError={e => { e.target.src = pcFallback; }}
                />
              )}
            </div>

            {/* Content */}
            <div className="text-white space-y-6">
              {loading ? (
                <>
                  <Skeleton className="h-16 w-3/4" />
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-6 w-1/4" />
                </>
              ) : (
                <>
                  <h1 className="text-6xl font-bold tracking-wide text-white">
                    {renderName(name)}
                  </h1>
                  <h5 className="text-lg tracking-[0.3em] text-white/60 uppercase">{role}</h5>
                  <p className="text-white/70 leading-relaxed text-lg">{aboutMe}</p>
                  <p className="text-white/50 italic font-serif text-xl">- {wordsBy}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Equipment Section ── */}
      <section className="pt-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            {loading ? (
              <>
                <Skeleton className="h-10 w-64 mx-auto mb-4" />
                <Skeleton className="h-16 w-2/3 mx-auto" />
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-white tracking-wide mb-4">{eqHeader}</h2>
                <p className="text-white/70 max-w-3xl mx-auto">{eqDesc}</p>
              </>
            )}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-64 rounded-lg" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {gearPairs.map((pair, pairIdx) => (
                <div key={pairIdx} className="bg-[#0f0f0f] border border-white/5 rounded-lg p-8 shadow-xl shadow-white/30">
                  {pair.map((gear, gi) => (
                    <div key={gi} className={gi > 0 ? "mt-10" : ""}>
                      <h3 className="text-xl font-bold text-white tracking-wider mb-8 uppercase">
                        {gear.eqName}
                      </h3>
                      <ul className="space-y-4">
                        {gear.items.map((item, idx) => (
                          <li key={idx} className="text-white/70 flex items-center gap-3">
                            <span className="text-white/50">⊙</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white tracking-wide">OUR AMAZING TEAM</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loading ? (
              // Skeleton cards while loading
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="w-full h-96" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))
            ) : team.length > 0 ? (
              team.map((member) => (
                <div key={member.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden mb-6">
                    {member.url ? (
                      <img
                        src={member.url}
                        alt={member.name}
                        className="w-full h-96 object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                      />
                    ) : (
                      // Placeholder when no photo uploaded yet
                      <div className="w-full h-96 bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                        <span className="text-white/20 text-4xl">👤</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2 tracking-wide">{member.name}</h4>
                  <p className="text-white/50 tracking-wider text-sm">{member.role}</p>
                </div>
              ))
            ) : null}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default AboutPage;