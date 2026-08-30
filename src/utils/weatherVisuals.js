/** weatherVisuals.js — icon URLs and hero background themes per condition. */

export function iconUrl(icon, size = 4) {
  return `https://openweathermap.org/img/wn/${icon}@${size}x.png`;
}

/**
 * Maps an OpenWeather condition code + icon (day/night) to a named theme,
 * used to pick the hero card's gradient background.
 * Codes: https://openweathermap.org/weather-conditions
 */
export function weatherTheme(conditionId, icon) {
  const isNight = icon?.endsWith("n");
  if (conditionId >= 200 && conditionId < 300) return "thunderstorm";
  if (conditionId >= 300 && conditionId < 600) return "rain";
  if (conditionId >= 600 && conditionId < 700) return "snow";
  if (conditionId >= 700 && conditionId < 800) return "fog";
  if (conditionId === 800) return isNight ? "clear-night" : "sunny";
  if (conditionId > 800) return isNight ? "cloudy-night" : "cloudy";
  return "sunny";
}

export const THEME_GRADIENTS = {
  sunny: "linear-gradient(140deg, #ffb347 0%, #ff7a45 38%, #a83279 78%, #4a1942 100%)",
  "clear-night": "linear-gradient(140deg, #263a80 0%, #131b47 45%, #090c1f 100%)",
  cloudy: "linear-gradient(140deg, #7d90c9 0%, #4d5a94 45%, #232a4d 100%)",
  "cloudy-night": "linear-gradient(140deg, #313e73 0%, #1b2246 50%, #0a0d20 100%)",
  rain: "linear-gradient(140deg, #2f6690 0%, #1e3f66 50%, #10192f 100%)",
  thunderstorm: "linear-gradient(140deg, #4b3a6e 0%, #2a2050 50%, #0d0a1f 100%)",
  snow: "linear-gradient(140deg, #9fc4e8 0%, #d7f1f7 55%, #a7c8e0 100%)",
  fog: "linear-gradient(140deg, #8993ab 0%, #56607d 50%, #2b3148 100%)",
};

export const THEME_EMOJI = {
  sunny: "☀️",
  "clear-night": "🌙",
  cloudy: "⛅",
  "cloudy-night": "☁️",
  rain: "🌧️",
  thunderstorm: "⛈️",
  snow: "❄️",
  fog: "🌫️",
};
