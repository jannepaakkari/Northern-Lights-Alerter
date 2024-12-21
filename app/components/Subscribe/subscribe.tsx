'use client'
import { useState, useEffect, useRef } from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import usePost from '../../hooks/usePost';
import useGet from '../../hooks/useGet';
import { useError } from "../../hooks/useError";
import { useSuccess } from "../../hooks/useSuccess";
import { SubscribeResponse } from '../../interfaces/subscribeResponse';
import { WeatherResponse, WeatherData } from '../../interfaces/weatherResponse';
import { handleDataChange } from "@/app/utils/handleDataChange";

export default function Subscribe() {
    const [email, setEmail] = useState<string>("");
    const [selectedStation, setSelectedStation] = useState<string | null>(null);
    const [subscribe, setSubscribe] = useState<boolean>(false);
    const [{ data: subscribeData, isLoading: isLoadingSubscribe }, subscribeRequest] = usePost<SubscribeResponse>('/api/subscribe');
    const [{ data: weatherData, isLoading: isWeatherLoading }] = useGet<WeatherResponse>('/api/weather', true);
    const prevSubscribeData = useRef(subscribeData);
    const { setError } = useError();
    const { setSuccess } = useSuccess();

    useEffect(() => {
        const prevData = {
            subscribeData: prevSubscribeData.current,
        };
        handleDataChange(subscribeData, prevData.subscribeData, setSuccess, setError);
        prevSubscribeData.current = subscribeData;
    }, [subscribeData]);

    const handleSubscribe = async () => {
        try {
            await subscribeRequest({ email, selectedStation });

        } catch (error) {
            setError(typeof error === 'string' ? error : 'Error: Something went wrong.');
        }
    };

    const parsedWeatherData: WeatherData | null = (weatherData?.data && typeof weatherData.data === 'object' && !Array.isArray(weatherData.data))
        ? weatherData.data as WeatherData
        : null;

    const stationData = parsedWeatherData
        ? Object.values(parsedWeatherData).map(item => item?.Station)
        : [];

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="text-center max-w-xl">
                <h1 className="text-3xl font-bold mb-2">Subscribe to Northern Lights Updates</h1>
                <p className="text-lg">
                    Never miss a magical moment! Get notified when the weather is perfect for spotting the Northern Lights in Finland—straight to your inbox. Unsubscribe at any time.
                </p>
            </div>
            <div className="text-center max-w-xl flex justify-center gap-4">
                <Button color={subscribe ? undefined : "primary"} onClick={() => { setSubscribe(!subscribe); }}>Subscribe</Button>
            </div>

            {subscribe && (
                <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-md">
                    <Select
                        label="Select a station"
                        placeholder="Station"
                        className="max-w-xs"
                        onChange={(e) => setSelectedStation(e.target.value)}
                    >
                        {stationData ? stationData.map((data) => (
                            <SelectItem key={data}>
                                {data}
                            </SelectItem>
                        )) : []}
                    </Select>
                    <Input
                        fullWidth
                        placeholder="Email address"
                        className="bg-white text-black"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        color="primary"
                        onClick={handleSubscribe}
                        disabled={isWeatherLoading || isLoadingSubscribe}
                    >
                        {isLoadingSubscribe ? "Subscribing..." : "Subscribe"}
                    </Button>

                </div>
            )}
        </section>
    );
}
