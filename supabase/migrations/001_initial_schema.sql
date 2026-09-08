-- TravelGuide Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table (Augments Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  auth_provider TEXT DEFAULT 'email',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location_name TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  start_date DATE,
  end_date DATE,
  duration_days INT NOT NULL DEFAULT 3,
  trip_style TEXT DEFAULT 'balanced', -- 'backpacker', 'pilgrimage', 'family', 'leisure'
  dietary_pref TEXT DEFAULT 'any', -- 'pure_veg', 'jain', 'any'
  budget_estimate_min NUMERIC(10, 2),
  budget_estimate_max NUMERIC(10, 2),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Places Cache (Local cache of Google Places results to avoid re-querying)
CREATE TABLE IF NOT EXISTS public.places_cache (
  place_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  formatted_address TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  category TEXT NOT NULL, -- 'attraction', 'food', 'stay'
  sub_category TEXT,
  business_status TEXT, -- 'OPERATIONAL', 'CLOSED_TEMPORARILY', 'CLOSED_PERMANENTLY'
  rating NUMERIC(3, 2),
  user_ratings_total INT,
  price_level INT,
  photo_url TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  opening_hours JSONB,
  veg_status TEXT DEFAULT 'unverified', -- 'pure_veg', 'jain_friendly', 'veg_options', 'non_veg', 'unverified'
  last_refreshed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast spatial and status lookup
CREATE INDEX IF NOT EXISTS idx_places_cache_lat_lng ON public.places_cache(lat, lng);
CREATE INDEX IF NOT EXISTS idx_places_cache_status ON public.places_cache(business_status);

-- 5. Itinerary Items
CREATE TABLE IF NOT EXISTS public.itinerary_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  time_slot TEXT, -- 'morning', 'afternoon', 'evening', 'night'
  place_id TEXT REFERENCES public.places_cache(place_id),
  place_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'attraction', 'food', 'stay'
  order_index INT NOT NULL,
  suggested_duration_mins INT DEFAULT 90,
  travel_notes TEXT,
  user_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_itinerary_trip_day ON public.itinerary_items(trip_id, day_number, order_index);

-- 6. Saved Lists ("My Trips")
CREATE TABLE IF NOT EXISTS public.saved_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, trip_id)
);

-- 7. Food Tags (Crowdsourced Veg/Jain tagging)
CREATE TABLE IF NOT EXISTS public.food_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  place_id TEXT REFERENCES public.places_cache(place_id) ON DELETE CASCADE,
  veg_status TEXT NOT NULL, -- 'pure_veg', 'jain_options', 'non_veg'
  notes TEXT,
  submitted_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  upvotes INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read of places_cache
CREATE POLICY "Public read places cache" ON public.places_cache FOR SELECT USING (true);
-- Allow public read of public trips
CREATE POLICY "Public read public trips" ON public.trips FOR SELECT USING (is_public = true OR auth.uid() = user_id);
-- Allow owners full control on trips
CREATE POLICY "Users control own trips" ON public.trips FOR ALL USING (auth.uid() = user_id);
-- Allow owners control on itinerary items
CREATE POLICY "Users control own itinerary items" ON public.itinerary_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itinerary_items.trip_id AND trips.user_id = auth.uid())
);
-- Allow read on itinerary items for public trips
CREATE POLICY "Public read itinerary items for public trips" ON public.itinerary_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itinerary_items.trip_id AND (trips.is_public = true OR trips.user_id = auth.uid()))
);
-- Allow read food tags
CREATE POLICY "Public read food tags" ON public.food_tags FOR SELECT USING (true);
