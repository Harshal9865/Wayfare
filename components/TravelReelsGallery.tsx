"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRegion } from "@/lib/region";

interface ReelItem {
  id: string;
  creator: string;
  destination: string;
  regionType: "india" | "abroad";
  query: string;
  caption: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  likes: number;
}

export default function TravelReelsGallery() {
  const { region } = useRegion();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReelIds, setLikedReelIds] = useState<string[]>([]);
  const [savedReelIds, setSavedReelIds] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const filterTabs = useMemo(() => {
    return region === "india"
      ? ["All", "Varanasi", "Rishikesh", "Ladakh", "Kerala", "Jaipur"]
      : ["All", "Kyoto", "Lisbon", "Oaxaca", "Amalfi", "Varanasi"];
  }, [region]);

  // Fetch reels dynamically from /api/reels
  useEffect(() => {
    let isSubscribed = true;
    setIsLoading(true);

    fetch(`/api/reels?region=${region}&filter=${encodeURIComponent(selectedFilter)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isSubscribed && data.success && Array.isArray(data.reels)) {
          setReels(data.reels);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch reels from API:", err);
      })
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [region, selectedFilter]);

  const activeReel = activeReelIndex !== null ? reels[activeReelIndex] : null;

  const toggleLike = async (reelId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLiked = likedReelIds.includes(reelId);
    const action = isLiked ? "unlike" : "like";

    if (isLiked) {
      setLikedReelIds(likedReelIds.filter((id) => id !== reelId));
    } else {
      setLikedReelIds([...likedReelIds, reelId]);
    }

    try {
      const res = await fetch("/api/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId, action }),
      });
      const data = await res.json();
      if (data.success && typeof data.likes === "number") {
        setReels((prev) =>
          prev.map((r) => (r.id === reelId ? { ...r, likes: data.likes } : r))
        );
      }
    } catch (err) {
      console.error("Failed to sync reel like to backend:", err);
    }
  };

  const toggleSave = (reelId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedReelIds.includes(reelId)) {
      setSavedReelIds(savedReelIds.filter((id) => id !== reelId));
    } else {
      setSavedReelIds([...savedReelIds, reelId]);
    }
  };

  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  useEffect(() => {
    if (activeReel && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeReelIndex, activeReel]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const nextReel = () => {
    if (activeReelIndex !== null && activeReelIndex < reels.length - 1) {
      setActiveReelIndex(activeReelIndex + 1);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const prevReel = () => {
    if (activeReelIndex !== null && activeReelIndex > 0) {
      setActiveReelIndex(activeReelIndex - 1);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  return (
    <section className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-16 content-visibility-auto">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-8 right-8 z-50 px-5 py-3 rounded-full bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-primary text-primary dark:text-[#1E8C80] font-sans text-xs uppercase tracking-wider font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Reel dispatch link copied to clipboard</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] gap-4">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-sm"></span>
            Atmospheric Motion Archive • Real-time API
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-on-surface dark:text-[#FAF7F2] font-normal tracking-tight mt-1">
            Traveler Reels &amp; Atmosphere
          </h2>
          <p className="font-sans text-xs md:text-sm text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] mt-1">
            Unfiltered vertical motion dispatches streamed live from verified voyager journals.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-4 py-1.5 rounded-full border-2 font-sans text-xs uppercase tracking-wider transition-all cursor-pointer ${
                selectedFilter === tab
                  ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80] font-semibold shadow-md scale-105"
                  : "bg-surface-container-low dark:bg-[#1C1B1B] text-on-surface dark:text-[#FAF7F2] border-on-surface/20 hover:bg-surface-container"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton or Reels Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="aspect-[9/16] rounded-[32px] bg-surface-container-high dark:bg-[#201F1F] animate-pulse border-2 border-on-surface/10"
            />
          ))}
        </div>
      ) : reels.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] font-sans text-sm border-2 border-dashed border-on-surface/20 rounded-[32px]">
          No video dispatches found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {reels.map((reel, idx) => {
            const isLiked = likedReelIds.includes(reel.id);

            return (
              <div
                key={reel.id}
                onClick={() => {
                  setActiveReelIndex(idx);
                  setIsPlaying(true);
                }}
                className="group relative aspect-[9/16] rounded-[32px] overflow-hidden border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-surface-container dark:bg-[#201F1F] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.caption}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-4.5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-[10px] uppercase font-sans font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-rose-400">play_circle</span>
                      {reel.duration}
                    </span>

                    <button
                      onClick={(e) => toggleLike(reel.id, e)}
                      className="flex items-center gap-1.5 text-[11px] font-sans px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 transition-transform active:scale-125 cursor-pointer hover:bg-black/90"
                    >
                      <span
                        className={`material-symbols-outlined text-[14px] ${
                          isLiked ? "text-rose-500 fill-current" : "text-white"
                        }`}
                      >
                        favorite
                      </span>
                      <span className="font-medium">{reel.likes.toLocaleString()}</span>
                    </button>
                  </div>

                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-teal-300 font-semibold block mb-1">
                      {reel.destination}
                    </span>
                    <p className="font-sans text-xs text-white/95 line-clamp-2 leading-snug font-normal">
                      {reel.caption}
                    </p>
                    <span className="font-sans text-[10px] text-white/60 mt-1.5 block font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {reel.creator}
                    </span>
                  </div>
                </div>

                {/* Play Icon Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <div className="w-14 h-14 rounded-full bg-surface-container-lowest/95 dark:bg-[#131313]/95 border-2 border-on-surface dark:border-[#FAF7F2] flex items-center justify-center text-on-surface dark:text-[#FAF7F2] shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <span className="material-symbols-outlined text-[32px] pl-1">play_arrow</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reel Interactive Lightbox Modal (TikTok / Instagram Reels Style) */}
      {activeReel && activeReelIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setActiveReelIndex(null)}
        >
          {/* Main Reel Frame */}
          <div
            className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] rounded-[36px] overflow-hidden border-2 border-white/30 bg-black flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Playback Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/20 z-30">
              <div
                className="h-full bg-primary-container dark:bg-[#1E8C80] transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Loop Video Player */}
            <video
              ref={videoRef}
              src={activeReel.videoUrl}
              poster={activeReel.thumbnailUrl}
              loop
              playsInline
              muted={isMuted}
              autoPlay
              onTimeUpdate={handleTimeUpdate}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 pointer-events-none"></div>

            {/* Top Bar Controls */}
            <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between text-white">
              <span className="font-sans text-xs uppercase tracking-wider font-semibold bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {activeReel.destination}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-9 h-9 rounded-full bg-black/70 border border-white/30 flex items-center justify-center text-white cursor-pointer hover:bg-black transition-transform active:scale-90"
                  title={isMuted ? "Unmute Sound" : "Mute Sound"}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isMuted ? "volume_off" : "volume_up"}
                  </span>
                </button>

                <button
                  onClick={() => setActiveReelIndex(null)}
                  className="w-9 h-9 rounded-full bg-black/70 border border-white/30 flex items-center justify-center text-white cursor-pointer hover:bg-black transition-transform active:scale-90"
                  title="Close Reel"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Center Play/Pause Trigger & Next/Prev Controls */}
            <div className="relative z-20 flex-1 flex items-center justify-between px-3">
              {activeReelIndex > 0 ? (
                <button
                  onClick={prevReel}
                  className="w-10 h-10 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center cursor-pointer hover:bg-black/80 transition-transform active:scale-90"
                  title="Previous Reel"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
              ) : (
                <div className="w-10" />
              )}

              <div
                className="flex-1 h-full flex items-center justify-center cursor-pointer"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {!isPlaying && (
                  <div className="w-16 h-16 rounded-full bg-black/80 border-2 border-white flex items-center justify-center text-white shadow-2xl animate-in zoom-in-75">
                    <span className="material-symbols-outlined text-[40px] pl-1">play_arrow</span>
                  </div>
                )}
              </div>

              {activeReelIndex < reels.length - 1 ? (
                <button
                  onClick={nextReel}
                  className="w-10 h-10 rounded-full bg-black/50 border border-white/20 text-white flex items-center justify-center cursor-pointer hover:bg-black/80 transition-transform active:scale-90"
                  title="Next Reel"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              ) : (
                <div className="w-10" />
              )}
            </div>

            {/* Right Side Actions Bar (TikTok style) */}
            <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-4 text-white">
              {/* Like Button */}
              <button
                onClick={(e) => toggleLike(activeReel.id, e)}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    likedReelIds.includes(activeReel.id)
                      ? "bg-rose-500 border-rose-400 text-white scale-110 shadow-lg"
                      : "bg-black/60 backdrop-blur-md border-white/30 text-white hover:bg-black"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      likedReelIds.includes(activeReel.id) ? "fill-current" : ""
                    }`}
                  >
                    favorite
                  </span>
                </div>
                <span className="text-[10px] font-sans font-medium text-white/90 shadow-sm">
                  {activeReel.likes.toLocaleString()}
                </span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={(e) => toggleSave(activeReel.id, e)}
                className="flex flex-col items-center gap-1 cursor-pointer"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    savedReelIds.includes(activeReel.id)
                      ? "bg-amber-500 border-amber-400 text-white scale-110 shadow-lg"
                      : "bg-black/60 backdrop-blur-md border-white/30 text-white hover:bg-black"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      savedReelIds.includes(activeReel.id) ? "fill-current" : ""
                    }`}
                  >
                    bookmark
                  </span>
                </div>
                <span className="text-[10px] font-sans font-medium text-white/90 shadow-sm">
                  Save
                </span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-black transition-all">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </div>
                <span className="text-[10px] font-sans font-medium text-white/90 shadow-sm">
                  Share
                </span>
              </button>
            </div>

            {/* Bottom Caption & Plan Action */}
            <div className="relative z-20 p-5 sm:p-6 text-white space-y-3.5 pr-18">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center text-[10px] font-sans font-bold uppercase">
                  {activeReel.creator.slice(1, 3)}
                </span>
                <span className="font-sans text-xs font-semibold text-white/95">
                  {activeReel.creator}
                </span>
              </div>

              <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                {activeReel.caption}
              </p>

              <Link
                href={`/itinerary?location=${encodeURIComponent(activeReel.query)}`}
                onClick={() => setActiveReelIndex(null)}
                className="w-full py-3 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] border-2 border-white font-sans text-xs uppercase tracking-widest font-semibold hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-xl active:scale-98 cursor-pointer"
              >
                <span>Plan This Voyage</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
