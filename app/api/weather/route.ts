import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://space.fmi.fi/MIRACLE/RWC/data/r_index_latest_en.json', {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
        });

        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
