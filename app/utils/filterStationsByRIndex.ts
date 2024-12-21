export function filterStationsByRIndex(
    data: { [key: string]: { 'R-index': string; Station: string } },
    threshold: number = 75
): string[] {
    const stationsWithHighRIndex: string[] = [];

    for (const key in data) {
        const entry = data[key];
        if (Number(entry['R-index']) > threshold) {
            stationsWithHighRIndex.push(entry.Station);
        }
    }

    return stationsWithHighRIndex;
}
