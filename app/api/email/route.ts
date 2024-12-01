import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { filterStationsByRIndex } from '../../utils/filterStationsByRIndex';

// TODO: maybe implement better solution i.e. auth, however this will do for now (while POC:ing)
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(req: NextRequest, res: NextResponse) {

    const secret = req.headers.get('x-cron-secret');

    if (!secret || secret !== CRON_SECRET) {
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
        const filteredStations = filterStationsByRIndex(data.data);

        if (filteredStations?.length > 0) {
            const client = await clientPromise;
            const db = client.db();
            const collection = db.collection('emails');
            const emails = await collection.find({}).toArray();

            const emailList = emails.filter((item) => {
                // Check if the users selectedStation is in filteredStations (is opted in for spesific station)
                const isStationMatch = filteredStations.includes(item.selectedStation);

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
                    text: 'Conditions are perfect for viewing the northern lights! You can unsubscribe at any time by visiting the website.',
                });

                // Update the sentAt timestamp for the user
                await collection.updateOne(
                    { email: email },
                    { $set: { sentAt: new Date() } }
                );
            }
            return NextResponse.json({ message: 'Emails sent successfully!' });
        }
        else {
            return NextResponse.json({ error: 'Not right conditions' }, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
    }
}
