import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

interface RequestBody {
    email: string;
    selectedStation: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
    const { email }: RequestBody = await req.json();

    // Validate email and selectedStation
    if (!email || !email.includes('@')) {
        return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
    }


    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('emails');

        // Check if the email exist in the database
        const existingEntry = await collection.findOne({ email });

        if (existingEntry) {
            // If the email exist, remove the entry
            const result = await collection.deleteOne({ email });
            return NextResponse.json({ message: 'User unsubscribed successfully', result });
        } else {
            // If the email does not exist, return an error message
            return NextResponse.json({ message: 'Email not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error processing the request', error }, { status: 500 });
    }
}
