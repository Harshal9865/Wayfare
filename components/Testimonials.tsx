"use client";

const TESTIMONIALS = [
  {
    name: "Aarav K.",
    location: "Mumbai",
    destination: "Leh Ladakh",
    rating: 5,
    text: "WAYFARE planned our entire Ladakh road trip in under a minute. The day-by-day breakdown with altitude acclimatisation tips was something I couldn't find anywhere else.",
    avatar: "AK",
    color: "bg-teal-600",
  },
  {
    name: "Priya S.",
    location: "Bangalore",
    destination: "Varanasi Ghats",
    rating: 5,
    text: "The ghat-by-ghat morning itinerary was perfect. Woke up at 5am exactly as the plan suggested — the sunrise Aarti was absolutely breathtaking.",
    avatar: "PS",
    color: "bg-rose-600",
  },
  {
    name: "Rahul M.",
    location: "Delhi",
    destination: "Kerala Backwaters",
    rating: 5,
    text: "Booked the houseboat exactly as recommended and it was magical. WAYFARE even highlighted which backwater canals have less tourist traffic — a genuine hidden gem finder.",
    avatar: "RM",
    color: "bg-amber-600",
  },
  {
    name: "Sneha T.",
    location: "Pune",
    destination: "Rajasthan Circuit",
    rating: 5,
    text: "7-day Rajasthan itinerary covering Jaipur, Jodhpur and Udaipur — all optimised by drive time and fort visit order. Saved us hours of research and made the trip seamless.",
    avatar: "ST",
    color: "bg-indigo-600",
  },
  {
    name: "Vikram P.",
    location: "Chennai",
    destination: "Coorg",
    rating: 5,
    text: "Perfect for long weekend getaways. Detailed coffee estate routes, homestay picks, misty trail suggestions — everything spot on. Planning our next trip with WAYFARE already.",
    avatar: "VP",
    color: "bg-emerald-600",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-16 content-visibility-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] gap-4">
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-secondary dark:text-[#1E8C80] font-semibold">
            Traveler Dispatches
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-on-surface dark:text-[#FAF7F2] tracking-tight mt-1 font-normal">
            Journeys taken, stories told.
          </h2>
        </div>
        <span className="font-sans text-xs text-on-surface-variant dark:text-[rgba(250,247,242,0.6)] hidden sm:inline">
          Real trips, real travelers
        </span>
      </div>

      {/* Scrollable card row */}
      <div className="flex gap-5 overflow-x-auto pb-4 scroll-smooth -mx-margin-mobile md:-mx-margin-tablet lg:-mx-margin-desktop px-margin-mobile md:px-margin-tablet lg:px-margin-desktop scrollbar-none snap-x snap-mandatory">
        {TESTIMONIALS.map((t) => (
          <article
            key={t.name}
            className="flex-none w-[300px] md:w-[320px] bg-surface-container-lowest dark:bg-[#1A1A1A] border-2 border-on-surface dark:border-[rgba(250,247,242,0.3)] rounded-[28px] p-6 flex flex-col gap-4 snap-start hover:-translate-y-1 transition-transform duration-300"
          >
            {/* Stars */}
            <div className="flex items-center gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i} className="material-symbols-outlined text-[16px] text-primary dark:text-[#1E8C80]" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
            </div>

            {/* Review text */}
            <blockquote className="font-sans text-sm text-on-surface dark:text-[#FAF7F2] leading-relaxed flex-1">
              &ldquo;{t.text}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t-2 border-surface-container dark:border-[#2A2A2A]">
              <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center flex-shrink-0`} aria-hidden="true">
                <span className="font-sans text-xs font-bold text-white">{t.avatar}</span>
              </div>
              <div>
                <p className="font-sans text-xs font-semibold text-on-surface dark:text-[#FAF7F2]">{t.name}</p>
                <p className="font-sans text-[10px] text-outline dark:text-[rgba(250,247,242,0.5)] uppercase tracking-wider">
                  {t.location} → {t.destination}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
