import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { validateEmail } from '@/app/utils/validateEmail';

interface RequestBody {
    email: string;
    selectedStation: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
    const { email }: RequestBody = await req.json();

    // Validate email and selectedStation
    if (!email || !validateEmail(email)) {
        return NextResponse.json({ message: 'Invalid email', result: 'error' }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('emails');

        // If the email exist, remove the entry, if it does not exist we anyway return success message
        await collection.deleteOne({ email });
        return NextResponse.json({ message: 'User unsubscribed successfully if they were subscribed', result: "ok" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error processing the request', result: 'error' }, { status: 500 });
    }
}
