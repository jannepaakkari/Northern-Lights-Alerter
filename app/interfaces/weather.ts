export interface WeatherResponse {
    data: string[];
}
export interface WeatherData {
    'Time': string;
    'R-index': number;
    'Probability of auroras': string;
    'Station': string;
}