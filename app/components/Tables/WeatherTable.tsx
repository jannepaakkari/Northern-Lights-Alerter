import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { WeatherData } from '../../interfaces/weatherResponse';
import { formatTime } from "@/app/utils/fromatTime";

const WeatherTable = ({ data }: { data: WeatherData }) => {
    const columns = ['Time (dd.mm.yyyy)', 'R-index', 'Probability of auroras', 'Station'];

    return (
        <Table aria-label="Space Weather Table">
            <TableHeader>
                {columns.map((column) => (
                    <TableColumn key={column}>{column}</TableColumn>
                ))}
            </TableHeader>
            <TableBody>
                {Object.entries(data).map(([stationKey, stationData]) => (
                    <TableRow key={stationKey}>
                        <TableCell>{formatTime(stationData['Time'])}</TableCell>
                        <TableCell>{stationData['R-index']}</TableCell>
                        <TableCell>{stationData['Probability of auroras']}</TableCell>
                        <TableCell>{stationData['Station']}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default WeatherTable;
