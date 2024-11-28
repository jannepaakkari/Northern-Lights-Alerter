import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
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
            from: `"Aurora Alert" <${process.env.EMAIL_USER}>`,
            to: `'${process.env.EMAIL_USER2}'`,
            subject: 'Northern Lights Alert!',
            text: 'Conditions are perfect for viewing the northern lights!',
        });
        return NextResponse.json({ message: 'Email sent!' });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}