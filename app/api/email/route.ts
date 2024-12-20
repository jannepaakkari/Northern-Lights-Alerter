import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { filterStationsByRIndex } from '../../utils/filterStationsByRIndex';

export async function POST(req: NextRequest, res: NextResponse) {

    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/weather`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Error fetching data from weather API: ${response}`);
        }

        const data = await response.json();

        // TODO: let users choose the R index threshold
        // Check in which stations R index is high enough to send an email
        const filteredStations = filterStationsByRIndex(data.data);

        if (filteredStations?.length > 0) {
            const client = await clientPromise;
            const db = client.db();
            const collection = db.collection('emails');
            const emails = await collection.find({}).toArray();

            const emailList = emails.filter((item) => {
                // Check if the users selectedStation is in filteredStations (is opted in for spesific station)
                const isStationMatch = filteredStations.includes(item.selectedStation);

                // TODO: Let users choose how often they want to receive emails.
                // If 'sentAt' exists and is more than 12 hours ago, exclude this email to avoid spam
                if (item.sentAt) {
                    const sentTime = new Date(item.sentAt);
                    const currentTime = new Date();
                    // Difference in hours
                    const hoursDifference = (currentTime.getTime() - sentTime.getTime()) / 1000 / 60 / 60;
                    const isMoreThan12Hours = hoursDifference >= 12;
                    return isStationMatch && isMoreThan12Hours;
                }

                // If 'sentAt' doesnt exist, include the email (first-time sending)
                return isStationMatch;
            }).map((item) => item.email);

            for (const email of emailList) {
                const existingEntry = await collection.findOne({ email });
                const userHash = existingEntry?.hash

                // Set up the transporter for sending email via Gmail
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                // Send an email
                await transporter.sendMail({
                    from: `"Northern Lights Alert" <${process.env.EMAIL_USER}>`,
                    to: `${email}`,
                    subject: 'Northern Lights Alert!',
                    text: `Conditions are perfect for viewing the northern lights! You can unsubscribe at any time by visiting the following link: ${process.env.NEXT_PUBLIC_BASE_URL}/api/unsubscribe?hash=${userHash}`,
                });

                // Update the sentAt timestamp for the user
                await collection.updateOne(
                    { email: email },
                    { $set: { sentAt: new Date() } }
                );
            }
            return NextResponse.json({ message: 'Emails sent successfully!' }, { status: 200 });
        }
        else {
            return NextResponse.json({ error: 'Not right conditions' }, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
    }
}
