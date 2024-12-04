import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    const cronJobUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/email`;

    const response = await fetch(cronJobUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.CRON_SECRET}`,
        },
    });

    if (response.ok) {
        return NextResponse.json({ message: 'OK' }, { status: 200 });
    } else {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}
