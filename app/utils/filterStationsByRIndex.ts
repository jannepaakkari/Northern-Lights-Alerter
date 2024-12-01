export function filterStationsByRIndex(
    data: { [key: string]: { 'R-index': string } },
    threshold: number = 7
): string[] {
    const stationsWithHighRIndex: string[] = [];
    for (const key in data) {
        if (Number(data[key]['R-index']) > threshold) {
            stationsWithHighRIndex.push(key);
        }
    }
    return stationsWithHighRIndex;
}