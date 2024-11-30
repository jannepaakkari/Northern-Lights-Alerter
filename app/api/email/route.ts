import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// TODO: maybe implement better solution i.e. auth, however this will do for now (while POC:ing)
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(req: NextRequest) {

    const secret = req.headers.get('x-cron-secret');

    if (!secret || secret !== CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: implement condition check
    const conditions = true;

    if (conditions) {
        try {
            const client = await clientPromise;
            const db = client.db();
            const collection = db.collection('emails');
            const emails = await collection.find({}).toArray();
            const emailList = emails.map((item) => item.email);

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
                    text: 'Conditions are perfect for viewing the northern lights!',
                });
            }

            return NextResponse.json({ message: 'Emails sent successfully!' });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
        }
    }
    else {
        return NextResponse.json({ error: 'Not right conditions' }, { status: 200 });
    }
}