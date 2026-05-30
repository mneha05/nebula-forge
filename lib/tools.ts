// Simple tool implementations with retry wrapper
import { sleep } from './utils';

export async function getWeather(city: string): Promise<string> {
  // Simulated external call (could be swapped with real API)
  const weatherData: Record<string, string> = {
    London: '15°C, cloudy',
    Tokyo: '22°C, sunny',
    'New York': '8°C, rain'
  };
  // Simulate latency
  await sleep(200);
  if (Math.random() < 0.05) throw new Error('Transient weather API error');
  return weatherData[city] ?? `No data for ${city}`;
}

export async function convertTemperature(celsius: number): Promise<string> {
  await sleep(50);
  const fahrenheit = (celsius * 9) / 5 + 32;
  return `${celsius}°C = ${fahrenheit.toFixed(1)}°F`;
}

export async function callWithRetry<T>(fn: () => Promise<T>, maxAttempts = 3) {
  let attempt = 0;
  let lastErr: any = null;
  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      attempt++;
      const backoff = Math.pow(2, attempt) * 100;
      await sleep(backoff);
    }
  }
  throw lastErr;
}
