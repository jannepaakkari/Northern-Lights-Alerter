import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { SpaceWeatherData, WeatherData } from '../interfaces/weather';


const WeatherTable = ({ data }: { data: WeatherData }) => {
    const columns = ['Time', 'R-index', 'Probability of auroras', 'Station'];

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
                        {columns.map((columnKey) => (
                            <TableCell key={`${stationKey}-${columnKey}`}>
                                {stationData[columnKey as keyof SpaceWeatherData]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default WeatherTable;
