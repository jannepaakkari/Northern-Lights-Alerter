'use client'
import useGet from './hooks/useGet';
import { WeatherResponse, WeatherData } from './interfaces/weatherResponse';
import { CircularProgress } from "@nextui-org/react";
import WeatherTable from './components/Tables/WeatherTable';
import Subscribe from './components/Subscribe/subscribe';

export default function Home() {
  const [{ data: weatherData, isLoading: isWeatherLoading }] = useGet<WeatherResponse>('/api/weather', true);

  const parsedWeatherData: WeatherData | null = (weatherData?.data && typeof weatherData.data === 'object' && !Array.isArray(weatherData.data))
    ? weatherData.data as WeatherData
    : null;

  return (
    <section>
      <Subscribe />
      {isWeatherLoading || !parsedWeatherData
        ? (<CircularProgress label="Loading..." />)
        : <WeatherTable data={parsedWeatherData} />
      }
    </section>
  );
}
