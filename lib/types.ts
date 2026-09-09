export type PlaceCategory = 'attraction' | 'food' | 'stay';

export type BusinessStatus = 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY' | 'UNKNOWN';

export type VegDietaryStatus = 'pure_veg' | 'jain_friendly' | 'veg_options' | 'non_veg' | 'unverified' | 'satvik' | 'any';

export type TripStyle = 'backpacker' | 'pilgrimage' | 'family' | 'leisure' | 'balanced' | string;

export interface Place {
  id: string;
  place_id: string;
  name: string;
  formatted_address?: string;
  vicinity?: string;
  lat: number;
  lng: number;
  category: PlaceCategory;
  sub_category?: string;
  business_status?: BusinessStatus;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number; // 0 to 4
  photo_url: string;
  photos?: string[];
  editorial_summary?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  veg_status?: VegDietaryStatus;
  booking_url?: string;
  stay_meta?: {
    price_per_night_inr?: number;
    stay_type?: 'hostel' | 'homestay' | 'dharamshala' | 'resort' | 'hotel' | 'guesthouse';
  };
}

export interface ItineraryItem {
  id: string;
  day_number: number;
  time_slot: 'morning' | 'afternoon' | 'evening' | 'night';
  place: Place;
  order_index: number;
  suggested_duration_mins: number;
  travel_notes?: string;
  user_notes?: string;
  best_time_to_visit?: string;
  entry_fee_estimate_inr?: number;
}

export interface ItineraryDay {
  day_number: number;
  theme_title: string;
  description: string;
  items: ItineraryItem[];
  stay_recommendation?: Place;
}

export interface BudgetBreakdown {
  hotel_cost_min: number;
  hotel_cost_max: number;
  food_cost_min: number;
  food_cost_max: number;
  transport_cost_min: number;
  transport_cost_max: number;
  activities_cost_min: number;
  activities_cost_max: number;
  total_estimate_min: number;
  total_estimate_max: number;
  currency: string;
  is_estimate: true;
}

export interface TripPlan {
  id: string;
  title: string;
  location_name: string;
  state_country: string;
  lat: number;
  lng: number;
  duration_days: number;
  trip_style: TripStyle;
  dietary_pref: VegDietaryStatus;
  travelers_count: number;
  days: ItineraryDay[];
  budget: BudgetBreakdown;
  stays: Place[];
  created_at?: string;
}

export interface PlaceSearchSuggestion {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
  lat?: number;
  lng?: number;
}

export interface GenerateItineraryRequest {
  location_name: string;
  lat: number;
  lng: number;
  duration_days: number;
  trip_style: TripStyle;
  dietary_pref: VegDietaryStatus;
  travelers_count?: number;
}
