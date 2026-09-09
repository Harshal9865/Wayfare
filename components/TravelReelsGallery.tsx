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
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReelIds, setLikedReelIds] = useState<string[]>([]);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const filterTabs = useMemo(() => {
    return region === "india"
      ? ["All", "Varanasi", "Rishikesh", "Ladakh", "Kerala", "Jaipur"]
      : ["All", "Kyoto", "Lisbon", "Oaxaca", "Amalfi"];
  }, [region]);

  const activeReel = activeReelIndex !== null && reels[activeReelIndex] ? reels[activeReelIndex] : null;

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

  // Sync play/pause with HTML5 video element
  useEffect(() => {
    if (modalVideoRef.current) {
      if (isPlaying) {
        modalVideoRef.current.play().catch(() => {});
      } else {
        modalVideoRef.current.pause();
      }
    }
  }, [isPlaying, activeReelIndex]);

  // Keyboard navigation inside modal (Arrows, Space, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeReel) return;

      if (e.key === "Escape") {
        setActiveReelIndex(null);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleNextReel();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevReel();
      } else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === "m") {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReelIndex, reels.length, activeReel]);

  const handleNextReel = () => {
    if (activeReelIndex === null || reels.length === 0) return;
    setActiveReelIndex((activeReelIndex + 1) % reels.length);
    setIsPlaying(true);
    setVideoLoading(true);
    setVideoProgress(0);
  };

  const handlePrevReel = () => {
    if (activeReelIndex === null || reels.length === 0) return;
    setActiveReelIndex((activeReelIndex - 1 + reels.length) % reels.length);
    setIsPlaying(true);
    setVideoLoading(true);
    setVideoProgress(0);
  };

  const handleOpenModal = (index: number) => {
    setActiveReelIndex(index);
    setIsPlaying(true);
    setIsMuted(true);
    setVideoLoading(true);
    setVideoProgress(0);
  };

  const handleCloseModal = () => {
    setActiveReelIndex(null);
    setVideoProgress(0);
  };

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

  const handleShare = (destination: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = typeof window !== "undefined" ? `${window.location.origin}/itinerary?location=${encodeURIComponent(destination)}` : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-16 content-visibility-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] gap-4">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold">
            {region === "india" ? "🇮🇳 Indian Motion Dispatches" : "🌐 Global Atmosphere Dispatches"}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-on-surface dark:text-[#FAF7F2] font-normal tracking-tight mt-1">
            Short Travel Reels
          </h2>
        </div>

        <p className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] hidden sm:block max-w-xs">
          High-definition atmospheric motion from verified corridors and natural sanctuaries.
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
                ? "bg-primary-container text-white dark:bg-[#1E8C80] dark:text-[#131313] border-on-surface dark:border-[#1E8C80] font-semibold shadow-sm"
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
            <div key={i} className="h-88 sm:h-96 rounded-[28px] bg-surface-container dark:bg-[#201F1F] animate-pulse border-2 border-on-surface/20" />
          ))}
        </div>
      ) : reels.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-low dark:bg-[#1C1B1B] rounded-[28px] border-2 border-on-surface/20">
          <span className="material-symbols-outlined text-[40px] text-outline mb-2">videocam_off</span>
          <p className="font-sans text-sm text-on-surface dark:text-[#FAF7F2]">No reels found for this selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {reels.map((reel, index) => {
            const isLiked = likedReelIds.includes(reel.id);
            return (
              <div
                key={reel.id}
                onClick={() => handleOpenModal(index)}
                className="group relative h-88 sm:h-96 rounded-[30px] overflow-hidden border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] bg-black cursor-pointer shadow-subtle hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between p-4"
              >
                {/* Background Thumbnail Image */}
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.destination}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 pointer-events-none" />

                {/* Top Overlay Bar */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 font-sans text-[10px] uppercase font-semibold text-white truncate max-w-[70%]">
                    {reel.destination.split(",")[0]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] text-white/80 font-mono">
                    {reel.duration}
                  </span>
                </div>

                {/* Center Play Button Overlay */}
                <div className="relative z-10 self-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/70 flex items-center justify-center text-white group-hover:scale-115 transition-transform duration-300 shadow-lg">
                  <span className="material-symbols-outlined text-[24px] ml-0.5">play_arrow</span>
                </div>

                {/* Bottom Overlay Bar */}
                <div className="relative z-10">
                  <p className="font-sans text-xs text-white/95 line-clamp-2 leading-snug mb-2 font-medium">
                    {reel.caption}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-white/80 font-sans">
                    <span className="truncate max-w-[100px]">{reel.creator}</span>
                    <button
                      onClick={(e) => toggleLike(reel.id, e)}
                      className="flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <span
                        className="material-symbols-outlined text-[16px] text-rose-500"
                        style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                      <span>{reel.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modern Vertical Reel Player Modal */}
      {activeReel && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          {/* Previous Reel Arrow (Desktop) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevReel();
            }}
            className="hidden md:flex w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 items-center justify-center text-white transition-all hover:scale-110 mr-6 cursor-pointer"
            aria-label="Previous Reel"
            title="Previous (Arrow Left)"
          >
            <span className="material-symbols-outlined text-[28px]">chevron_left</span>
          </button>

          {/* Main 9:16 Video Player Container */}
          <div
            className="relative w-full max-w-[420px] h-[85vh] max-h-[740px] bg-black rounded-[36px] overflow-hidden border-2 border-white/25 shadow-2xl flex flex-col justify-between select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
              <div
                className="h-full bg-primary-container dark:bg-[#1E8C80] transition-all duration-100 ease-linear"
                style={{ width: `${videoProgress}%` }}
              />
            </div>

            {/* Poster / Thumbnail Background (Visible while buffering) */}
            {videoLoading && (
              <div className="absolute inset-0 z-0">
                <img
                  src={activeReel.thumbnailUrl}
                  alt=""
                  className="w-full h-full object-cover opacity-60 blur-sm"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-3 border-white/40 border-t-[#1E8C80] animate-spin" />
                </div>
              </div>
            )}

            {/* Real HTML5 Video Stream */}
            <video
              ref={modalVideoRef}
              key={activeReel.videoUrl}
              src={activeReel.videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onWaiting={() => setVideoLoading(true)}
              onPlaying={() => setVideoLoading(false)}
              onTimeUpdate={(e) => {
                const target = e.currentTarget;
                if (target.duration) {
                  setVideoProgress((target.currentTime / target.duration) * 100);
                }
              }}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer z-10"
              onClick={() => setIsPlaying(!isPlaying)}
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 pointer-events-none z-10" />

            {/* Tap for Sound Notice Badge (shown when muted on start) */}
            {isMuted && !videoLoading && (
              <button
                type="button"
                onClick={() => setIsMuted(false)}
                className="absolute top-16 left-1/2 -translate-x-1/2 z-25 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/40 text-white font-sans text-xs flex items-center gap-1.5 shadow-lg animate-bounce cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-300">volume_off</span>
                <span>Tap for Sound</span>
              </button>
            )}

            {/* Center Pause/Play Indicator (when paused) */}
            {!isPlaying && (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border-2 border-white/80 flex items-center justify-center text-white z-25 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                aria-label="Resume video"
              >
                <span className="material-symbols-outlined text-[36px] ml-1">play_arrow</span>
              </button>
            )}

            {/* Top Modal Header Bar */}
            <div className="relative z-20 flex items-center justify-between p-5 pt-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/30 font-sans text-xs text-white font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#1E8C80]">location_on</span>
                  <span>{activeReel.destination}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio Toggle */}
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
                  aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isMuted ? "volume_off" : "volume_up"}
                  </span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
                  aria-label="Close viewer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Right Side Action Rail (Instagram/TikTok style) */}
            <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-4">
              {/* Like Button */}
              <button
                type="button"
                onClick={() => toggleLike(activeReel.id)}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-[20px] text-rose-500"
                    style={{ fontVariationSettings: likedReelIds.includes(activeReel.id) ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </div>
                <span className="text-[10px] font-sans text-white/90 font-medium">
                  {activeReel.likes + (likedReelIds.includes(activeReel.id) ? 1 : 0)}
                </span>
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={() => handleShare(activeReel.destination)}
                className="flex flex-col items-center gap-1 cursor-pointer group"
                title="Copy trip link"
              >
                <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">
                    {copiedLink ? "check" : "share"}
                  </span>
                </div>
                <span className="text-[10px] font-sans text-white/90 font-medium">
                  {copiedLink ? "Copied!" : "Share"}
                </span>
              </button>
            </div>

            {/* Bottom Caption & Plan CTA */}
            <div className="relative z-20 p-5 pt-0 pr-16 flex flex-col gap-3">
              {/* Creator Handle */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary-container text-white border border-white/40 flex items-center justify-center text-xs font-serif font-bold">
                  {activeReel.creator.charAt(1).toUpperCase()}
                </div>
                <span className="font-sans text-xs font-semibold text-white">
                  {activeReel.creator}
                </span>
              </div>

              {/* Caption */}
              <p className="font-sans text-xs sm:text-sm text-white/95 font-normal leading-relaxed">
                {activeReel.caption}
              </p>

              {/* Full-width Plan Trip Button */}
              <Link
                href={`/itinerary?location=${encodeURIComponent(activeReel.destination)}`}
                onClick={handleCloseModal}
                className="w-full mt-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-primary-container dark:bg-[#1E8C80] text-white dark:text-[#131313] font-sans text-xs uppercase tracking-wider font-semibold border-2 border-white/40 hover:bg-primary transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                <span>Plan Trip to {activeReel.destination.split(",")[0]}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Next Reel Arrow (Desktop) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNextReel();
            }}
            className="hidden md:flex w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 items-center justify-center text-white transition-all hover:scale-110 ml-6 cursor-pointer"
            aria-label="Next Reel"
            title="Next (Arrow Right)"
          >
            <span className="material-symbols-outlined text-[28px]">chevron_right</span>
          </button>
        </div>
      )}
    </section>
  );
}
