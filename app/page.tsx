'use client'
import usePost from './hooks/usePost';
import useGet from './hooks/useGet';
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { SubscribeResponse } from './interfaces/subscribe';
import { UnsubscribeResponse } from './interfaces/unsubscribe';
import { WeatherResponse, WeatherData } from './interfaces/weather';
import { CircularProgress } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import WeatherTable from './components/Tables/WeatherTable';
import { useError } from "./hooks/useError";
import { useSuccess } from "./hooks/useSuccess";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [subscribe, setSubscribe] = useState<boolean>(true);
  const [isInProcessing, setIsInProcessing] = useState<boolean>(false);
  const [{ isLoading: isLoadingSubscribe }, subscribeRequest] = usePost<SubscribeResponse>('/api/subscribe');
  const [, unsubscribeRequest] = usePost<UnsubscribeResponse>('/api/unsubscribe');
  const [{ data: weatherData, isLoading: isWeatherLoading }] = useGet<WeatherResponse>('/api/weather', true);
  const { setError } = useError();
  const { setSuccess } = useSuccess();

  const handleSubscribe = async () => {
    if (!selectedStation) {
      setError('Error: Please select a station key.');
      return;
    }
    if (!email || !email.includes("@")) {
      setError('Error: Please enter a valid email address.');
      return;
    }
    try {
      await subscribeRequest({ email, selectedStation });
      setSuccess('Successfully subscribed!');
    } catch (error) {
      setError(typeof error === 'string' ? error : 'Error: Something went wrong.');
    }
  };

  const handleUnsubscribe = async () => {
    if (!email || !email.includes("@")) {
      setError('Error: Please enter a valid email address.');
      return;
    }
    try {
      await unsubscribeRequest({ email });
      setSuccess('Successfully unsubscribed!');
    } catch (error) {
      setError(typeof error === 'string' ? error : 'Error: Something went wrong.');
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
        <Button color="primary" onClick={() => { setSubscribe(true); setIsInProcessing(true); }}>Subscribe</Button>
        <Button color="secondary" onClick={() => { setSubscribe(false); setIsInProcessing(true); setSelectedStation(null) }}>Unsubscribe</Button>
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
              color="primary"
              onClick={handleSubscribe}
              disabled={isWeatherLoading || isLoadingSubscribe}
            >
              {isLoadingSubscribe ? "Subscribing..." : "Subscribe"}
            </Button>
          )
            : (
              <Button
                color="primary"
                onClick={handleUnsubscribe}
                disabled={isWeatherLoading || isLoadingSubscribe}>Unsubscribe</Button>
            )}
        </div>
      )}

      {isWeatherLoading || !parsedWeatherData
        ? (<CircularProgress label="Loading..." />)
        : <WeatherTable data={parsedWeatherData} />
      }
    </section>
  );
}
