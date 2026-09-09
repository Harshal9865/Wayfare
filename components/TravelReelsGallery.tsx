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
  tags?: string[];
}

export default function TravelReelsGallery() {
  const { region } = useRegion();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReelIds, setLikedReelIds] = useState<string[]>([]);
  const [videoError, setVideoError] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const filterTabs = useMemo(() => {
    return region === "india"
      ? ["All", "Varanasi", "Rishikesh", "Ladakh", "Kerala", "Jaipur"]
      : ["All", "Kyoto", "Lisbon", "Oaxaca", "Amalfi"];
  }, [region]);

  // Sync play/pause with HTML5 video element
  useEffect(() => {
    if (modalVideoRef.current) {
      if (isPlaying) {
        modalVideoRef.current.play().catch(() => {});
      } else {
        modalVideoRef.current.pause();
      }
    }
  }, [isPlaying, activeReel]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeReel) {
        setActiveReel(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReel]);

  // Fetch reels from API
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
      .catch((err) => console.error("Error fetching reels:", err))
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [region, selectedFilter]);

  const toggleLike = async (reelId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlyLiked = likedReelIds.includes(reelId);
    setLikedReelIds((prev) =>
      isCurrentlyLiked ? prev.filter((id) => id !== reelId) : [...prev, reelId]
    );

    try {
      await fetch("/api/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reelId,
          action: isCurrentlyLiked ? "unlike" : "like",
        }),
      });
    } catch (_) {}
  };

  const handleOpenModal = (reel: ReelItem) => {
    setActiveReel(reel);
    setIsPlaying(true);
    setIsMuted(true);
    setVideoError(false);
  };

  const handleCloseModal = () => {
    setActiveReel(null);
    setVideoError(false);
  };

  return (
    <section className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-16 content-visibility-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] gap-4">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold">
            {region === "india" ? "🇮🇳 Indian Travel Motion" : "🌐 Global Atmosphere Reels"}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-on-surface dark:text-[#FAF7F2] font-normal tracking-tight mt-1">
            Short Travel Stories
          </h2>
        </div>

        <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] hidden sm:block max-w-xs">
          Immersive short-form glimpses of sacred rituals, mountain trails, and heritage architecture.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-6 scrollbar-none mb-8">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedFilter(tab)}
            className={`px-5 py-2 rounded-full border-2 font-sans text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              selectedFilter === tab
                ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80] font-semibold"
                : "bg-surface-container-lowest dark:bg-[#1A1A1A] text-on-surface-variant dark:text-[rgba(250,247,242,0.7)] border-on-surface/30 dark:border-[rgba(250,247,242,0.25)] hover:bg-surface-container"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reels Video Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-80 rounded-[28px] bg-surface-container dark:bg-[#201F1F] animate-pulse border-2 border-on-surface/20" />
          ))}
        </div>
      ) : reels.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low dark:bg-[#1C1B1B] rounded-[28px] border-2 border-on-surface/20">
          <span className="material-symbols-outlined text-[40px] text-outline mb-2">videocam_off</span>
          <p className="font-sans text-sm text-on-surface dark:text-[#FAF7F2]">No reels found for this selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {reels.map((reel) => {
            const isLiked = likedReelIds.includes(reel.id);
            return (
              <div
                key={reel.id}
                onClick={() => handleOpenModal(reel)}
                className="group relative h-88 sm:h-96 rounded-[28px] overflow-hidden border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-black cursor-pointer shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between p-4"
              >
                {/* Background Thumbnail */}
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.destination}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

                {/* Top Overlay Bar */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 font-sans text-[10px] uppercase font-semibold text-white truncate max-w-[70%]">
                    {reel.destination}
                  </span>
                  <button
                    onClick={(e) => toggleLike(reel.id, e)}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                {/* Center Play Button Overlay */}
                <div className="relative z-10 self-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/60 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">play_arrow</span>
                </div>

                {/* Bottom Overlay Bar */}
                <div className="relative z-10">
                  <p className="font-sans text-xs text-white/95 line-clamp-2 leading-snug mb-2 font-medium">
                    {reel.caption}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-white/70 font-sans">
                    <span>{reel.creator}</span>
                    <Link
                      href={`/itinerary?location=${encodeURIComponent(reel.destination)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary dark:text-[#1E8C80] font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>Plan</span>
                      <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Player Fullscreen Modal */}
      {activeReel && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-sm h-[80vh] max-h-[680px] bg-black rounded-[36px] overflow-hidden border-2 border-white/30 shadow-2xl flex flex-col justify-between p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video or Fallback Atmosphere Frame */}
            {videoError ? (
              <div className="absolute inset-0 w-full h-full bg-black">
                <img
                  src={activeReel.thumbnailUrl}
                  alt={activeReel.destination}
                  className="w-full h-full object-cover opacity-80 scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 flex items-center justify-center p-6 text-center">
                  <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 max-w-xs">
                    <span className="material-symbols-outlined text-[32px] text-[#1E8C80] mb-2">
                      photo_camera
                    </span>
                    <p className="font-sans text-xs text-white font-medium">
                      Atmospheric Still Edition
                    </p>
                    <p className="font-sans text-[10px] text-white/60 mt-1">
                      Direct video stream preview mode
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <video
                ref={modalVideoRef}
                src={activeReel.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onError={() => setVideoError(true)}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                onClick={() => setIsPlaying(!isPlaying)}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 pointer-events-none" />

            {/* Center Pause/Play Indicator (shown when paused) */}
            {!isPlaying && !videoError && (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border-2 border-white/80 flex items-center justify-center text-white z-20 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                aria-label="Resume video"
              >
                <span className="material-symbols-outlined text-[32px]">play_arrow</span>
              </button>
            )}

            {/* Top Modal Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/30 font-sans text-xs text-white font-semibold">
                {activeReel.destination}
              </span>
              <button
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white flex items-center justify-center cursor-pointer hover:bg-black transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Controls & Bottom Info */}
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                {/* Mute/Unmute */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/30 text-white font-sans text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isMuted ? "volume_off" : "volume_up"}
                  </span>
                  <span>{isMuted ? "Unmute" : "Sound On"}</span>
                </button>

                {/* Like Button */}
                <button
                  onClick={() => toggleLike(activeReel.id)}
                  className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/30 text-white font-sans text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-[16px] text-rose-500"
                    style={{ fontVariationSettings: likedReelIds.includes(activeReel.id) ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                  <span>{activeReel.likes + (likedReelIds.includes(activeReel.id) ? 1 : 0)}</span>
                </button>
              </div>

              {/* Caption & Plan CTA */}
              <div>
                <p className="font-sans text-sm text-white font-medium leading-snug mb-3">
                  {activeReel.caption}
                </p>
                <Link
                  href={`/itinerary?location=${encodeURIComponent(activeReel.destination)}`}
                  onClick={handleCloseModal}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] font-sans text-xs uppercase tracking-wider font-semibold border-2 border-white/40 hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Plan Trip to {activeReel.destination.split(",")[0]}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
