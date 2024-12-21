import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const hash = req.nextUrl.searchParams.get('hash');

        // Validate the hash
        if (!hash) {
            return NextResponse.json(
                { message: 'Missing or invalid hash', result: 'error' },
                { status: 400 }
            );
        }

        // Connect to the database
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection('emails');

        // Find and delete the user by hash
        const result = await collection.deleteOne({ hash });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { message: 'Hash not found. No action was taken.', result: 'ok' },
                { status: 200 }
            );
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe`);

    } catch (error) {
        console.error('Error processing unsubscribe request:', error);
        return NextResponse.json(
            { message: 'Error processing the request', result: 'error' },
            { status: 500 }
        );
    }
}
