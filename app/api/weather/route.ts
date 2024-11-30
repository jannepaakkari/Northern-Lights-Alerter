import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://space.fmi.fi/MIRACLE/RWC/data/r_index_latest_en.json');
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json(500);
    }
}