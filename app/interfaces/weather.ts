export interface WeatherResponse {
    data: string[];
}
export interface SpaceWeatherData {
    'Time': string;
    'R-index': number;
    'Probability of auroras': string;
    'Station': string;
}

export interface WeatherData {
    [key: string]: SpaceWeatherData;
}