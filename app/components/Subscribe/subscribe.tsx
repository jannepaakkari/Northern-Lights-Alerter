'use client'
import { useState, useEffect, useRef } from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import usePost from '../../hooks/usePost';
import useGet from '../../hooks/useGet';
import { useError } from "../../hooks/useError";
import { useSuccess } from "../../hooks/useSuccess";
import { SubscribeResponse } from '../../interfaces/subscribeResponse';
import { UnsubscribeResponse } from '../../interfaces/unsubscribeResponse';
import { WeatherResponse, WeatherData } from '../../interfaces/weatherResponse';
import { handleDataChange } from "@/app/utils/handleDataChange";

export default function Subscribe() {
    const [email, setEmail] = useState<string>("");
    const [selectedStation, setSelectedStation] = useState<string | null>(null);
    const [subscribe, setSubscribe] = useState<boolean>(true);
    const [isInProcessing, setIsInProcessing] = useState<boolean>(false);
    const [{ data: subscribeData, isLoading: isLoadingSubscribe }, subscribeRequest] = usePost<SubscribeResponse>('/api/subscribe');
    const [{ data: unsubscribeData }, unsubscribeRequest] = usePost<UnsubscribeResponse>('/api/unsubscribe');
    const [{ data: weatherData, isLoading: isWeatherLoading }] = useGet<WeatherResponse>('/api/weather', true);
    const prevSubscribeData = useRef(subscribeData);
    const prevUnsubscribeData = useRef(unsubscribeData);
    const { setError } = useError();
    const { setSuccess } = useSuccess();

    useEffect(() => {
        const prevData = {
            subscribeData: prevSubscribeData.current,
            unsubscribeData: prevUnsubscribeData.current
        };

        handleDataChange(subscribeData, prevData.subscribeData, setSuccess, setError);
        handleDataChange(unsubscribeData, prevData.unsubscribeData, setSuccess, setError);

        prevSubscribeData.current = subscribeData;
        prevUnsubscribeData.current = unsubscribeData;
    }, [subscribeData, unsubscribeData]);

    const handleSubscribe = async () => {
        try {
            await subscribeRequest({ email, selectedStation });

        } catch (error) {
            setError(typeof error === 'string' ? error : 'Error: Something went wrong.');
        }
    };

    const handleUnsubscribe = async () => {
        try {
            await unsubscribeRequest({ email });
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
                    )}

                    <Input
                        fullWidth
                        placeholder="Email address"
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
        </section>
    );
}
