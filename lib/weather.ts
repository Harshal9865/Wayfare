export interface RealTimeWeather {
  currentTemp: number;
  currentCondition: string;
  sunriseTime: string;
  dailyForecast: {
    dayLabel: string;
    conditionEmoji: string;
    conditionText: string;
    maxTemp: number;
    minTemp: number;
    rainProb: number;
  }[];
}

const WEATHER_CODE_MAP: Record<number, { emoji: string; text: string }> = {
  0: { emoji: "☀️", text: "Clear Sky" },
  1: { emoji: "🌤️", text: "Mainly Clear" },
  2: { emoji: "⛅", text: "Partly Cloudy" },
  3: { emoji: "☁️", text: "Overcast" },
  45: { emoji: "🌫️", text: "Fog" },
  48: { emoji: "🌫️", text: "Depositing Rime Fog" },
  51: { emoji: "🌦️", text: "Light Drizzle" },
  53: { emoji: "🌦️", text: "Moderate Drizzle" },
  55: { emoji: "🌧️", text: "Dense Drizzle" },
  61: { emoji: "🌧️", text: "Slight Rain" },
  63: { emoji: "🌧️", text: "Moderate Rain" },
  65: { emoji: "🌧️", text: "Heavy Rain" },
  71: { emoji: "🌨️", text: "Slight Snow" },
  73: { emoji: "🌨️", text: "Moderate Snow" },
  75: { emoji: "❄️", text: "Heavy Snow" },
  80: { emoji: "🌦️", text: "Rain Showers" },
  81: { emoji: "🌧️", text: "Heavy Showers" },
  95: { emoji: "⛈️", text: "Thunderstorm" },
};

export async function fetchLiveWeather(lat: number, lng: number): Promise<RealTimeWeather | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = await res.json();
    const currentCode = data.current?.weather_code ?? 0;
    const currentInfo = WEATHER_CODE_MAP[currentCode] || { emoji: "🌤️", text: "Fair" };

    // Format sunrise time
    let sunriseFormatted = "06:00 AM";
    if (data.daily?.sunrise?.[0]) {
      const date = new Date(data.daily.sunrise[0]);
      sunriseFormatted = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    }

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyForecast = (data.daily?.time || []).slice(0, 3).map((timeStr: string, idx: number) => {
      const d = new Date(timeStr);
      const code = data.daily?.weather_code?.[idx] ?? 0;
      const info = WEATHER_CODE_MAP[code] || { emoji: "🌤️", text: "Mild" };
      return {
        dayLabel: `Day ${idx + 1} (${days[d.getDay()]})`,
        conditionEmoji: info.emoji,
        conditionText: info.text,
        maxTemp: Math.round(data.daily?.temperature_2m_max?.[idx] ?? 20),
        minTemp: Math.round(data.daily?.temperature_2m_min?.[idx] ?? 14),
        rainProb: data.daily?.precipitation_probability_max?.[idx] ?? 0,
      };
    });

    return {
      currentTemp: Math.round(data.current?.temperature_2m ?? 20),
      currentCondition: `${currentInfo.emoji} ${Math.round(data.current?.temperature_2m ?? 20)}°C ${currentInfo.text}`,
      sunriseTime: sunriseFormatted,
      dailyForecast,
    };
  } catch (err) {
    console.warn("Open-Meteo weather fetch error:", err);
    return null;
  }
}
