import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

interface RequestBody {
    email: string;
    selectedStation: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
    const { email, selectedStation }: RequestBody = await req.json();

    if (!email || !email.includes('@')) {
        return NextResponse.json(400);
    }

    if (!selectedStation) {
        return NextResponse.json(400);
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('emails');
        const result = await collection.insertOne({
            selectedStation,
            email,
            timestamp: new Date(),
        });
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(error);
    }
}
