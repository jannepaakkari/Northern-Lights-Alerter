import { NextRequest, NextResponse } from 'next/server';

export default async function GET(req: NextRequest) {
    const cronJobUrl = `${process.env.BASE_URL}/api/email`;


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
