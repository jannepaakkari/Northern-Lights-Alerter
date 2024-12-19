import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import allowedStations from '@/app/config/allowedStations';
import { validateEmail } from '@/app/utils/validateEmail';

interface RequestBody {
    email: string;
    selectedStation: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
    const { email, selectedStation }: RequestBody = await req.json();

    // Validate email and selectedStation
    if (!email || !validateEmail(email)) {
        return NextResponse.json({ message: 'Invalid email', result: "error" }, { status: 400 });
    }
    if (!selectedStation && !allowedStations.includes(selectedStation)) {
        return NextResponse.json({ message: 'Selected station is required', result: "error" }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('emails');

        // Check if email already exists in the database
        const existingEntry = await collection.findOne({ email });

        if (existingEntry) {
            // If the email exists, update the selectedStation and timestamp
            await collection.updateOne(
                { email },
                {
                    $set: {
                        selectedStation,
                        timestamp: new Date(),
                    },
                }
            );
            return NextResponse.json({ message: 'User subscribed successfully', result: "ok" }, { status: 200 });
        } else {
            // If the email doesn't exist, insert a new entry
            await collection.insertOne({
                selectedStation,
                email,
                timestamp: new Date(),
            });
            return NextResponse.json({ message: 'User subscribed successfully', result: "ok" }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error processing the request', result: "error" }, { status: 500 });
    }
}