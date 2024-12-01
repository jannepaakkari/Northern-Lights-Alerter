'use client'
import { button as buttonStyles } from "@nextui-org/theme";
import usePost from './hooks/usePost';
import useGet from './hooks/useGet';
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { SubscribeResponse } from './interfaces/subscribe';
import { UnsubscribeResponse } from './interfaces/unsubscribe';
import { WeatherResponse, WeatherData } from './interfaces/weather';
import { Select, SelectItem } from "@nextui-org/react";
import WeatherTable from './components/weatherTable';

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [subscribe, setSubscribe] = useState<boolean>(true);
  const [isInProcessing, setIsInProcessing] = useState<boolean>(false);
  const [{ isLoading: isLoadingSubscribe, error: subscribeError }, subscribeRequest] = usePost<SubscribeResponse>('/api/subscribe');
  const [{ isLoading: isLoadingunSubscribe }, unsubscribeRequest] = usePost<UnsubscribeResponse>('/api/unsubscribe');
  const [{ data: weatherData, isLoading: isWeatherLoading, error: weatherError }] = useGet<WeatherResponse>('/api/weather', true);

  const handleSubscribe = async () => {
    if (!selectedStation) {
      console.error("Invalid Station Key.");
      return;
    }
    if (!email || !email.includes("@")) {
      console.error("Invalid email address.");
      return;
    }
    try {
      await subscribeRequest({ email, selectedStation });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnsubscribe = async () => {
    if (!email || !email.includes("@")) {
      console.error("Invalid email address.");
      return;
    }
    try {
      await unsubscribeRequest({ email });
    } catch (error) {
      console.error(error);
    }
  };

  const parsedWeatherData: WeatherData | null = (weatherData?.data && typeof weatherData.data === 'object' && !Array.isArray(weatherData.data))
    ? weatherData.data as WeatherData
    : null;

  const weatherDataKeys = parsedWeatherData && Object.keys(parsedWeatherData);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-bold mb-2">Subscribe to Northern Lights Updates</h1>
        <p className="text-lg">
          Never miss a magical moment! Get notified when the weather is perfect for spotting the Northern Lights in Finland—straight to your inbox.
        </p>
      </div>
      <div className="text-center max-w-xl flex justify-center gap-4">
        <Button onClick={() => { setSubscribe(true); setIsInProcessing(true); }}>Subscribe</Button>
        <Button onClick={() => { setSubscribe(false); setIsInProcessing(true); }}>Unsubscribe</Button>
      </div>

      {isInProcessing && (
        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-md">
          {subscribe === true && (
            <Select
              label="Select a station key"
              placeholder="Key"
              className="max-w-xs"
              onChange={(e) => setSelectedStation(e.target.value)}
            >
              {weatherDataKeys ? weatherDataKeys.map((data) => (
                <SelectItem key={data}>
                  {data}
                </SelectItem>
              )) : []}
            </Select>
          )}

          <Input
            fullWidth
            placeholder="Enter your email address"
            className="bg-white text-black"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {subscribe === true ? (
            <Button
              onClick={handleSubscribe}
              className={buttonStyles({ variant: "solid", radius: "full", size: "lg" })}
              disabled={isWeatherLoading || isLoadingSubscribe || !selectedStation || !email}
            >
              {isLoadingSubscribe ? "Subscribing..." : "Subscribe"}
            </Button>
          )
            : (
              <Button
                onClick={handleUnsubscribe}
                className={buttonStyles({ variant: "solid", radius: "full", size: "lg" })}
                disabled={isWeatherLoading || isLoadingunSubscribe || !email}>Unsubscribe</Button>
            )}
        </div>
      )}

      {isWeatherLoading || !parsedWeatherData
        ? (<p>Loading...</p>)
        : <WeatherTable data={parsedWeatherData} />
      }


      {subscribeError && <p className="text-red-500 mt-4">{subscribeError}</p>}
      {weatherError && <p className="text-red-500 mt-4">{weatherError}</p>}
    </section>
  );
}
