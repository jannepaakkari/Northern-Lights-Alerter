import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import allowedStations from '@/app/config/allowedStations';

interface RequestBody {
    email: string;
    selectedStation: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
    const { email, selectedStation }: RequestBody = await req.json();

    // Validate email and selectedStation
    if (!email || !email.includes('@') || email.length > 200) {
        return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
    }
    if (!selectedStation && !allowedStations.includes(selectedStation)) {
        return NextResponse.json({ message: 'Selected station is required' }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('emails');

        // Check if email already exists in the database
        const existingEntry = await collection.findOne({ email });

        if (existingEntry) {
            // If the email exists, update the selectedStation and timestamp
            const result = await collection.updateOne(
                { email },
                {
                    $set: {
                        selectedStation,
                        timestamp: new Date(),
                    },
                }
            );
            return NextResponse.json({ message: 'User subscription updated', result });
        } else {
            // If the email doesn't exist, insert a new entry
            const result = await collection.insertOne({
                selectedStation,
                email,
                timestamp: new Date(),
            });
            return NextResponse.json({ message: 'User subscribed successfully', result }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error processing the request', error }, { status: 500 });
    }
}