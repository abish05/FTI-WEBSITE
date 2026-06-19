const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // 1. Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = req.body;

        // Create the SMTP transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'contact@ftitraining.in',
                // IMPORTANT: You MUST use an App Password here, not the standard login password.
                // Replace this with the generated 16-character App Password.
                pass: process.env.EMAIL_PASSWORD || 'YOUR_APP_PASSWORD_HERE'
            }
        });

        // Demo Confirmation Email (sent to the student)
        if (data.type === 'demo_confirmation') {
            const subject = `✅ Your Demo Session is Confirmed — FutureTech Training Institute`;
            const bodyText = `
Dear ${data.fullName},

Great news! Your free demo session request has been CONFIRMED. 🎉

--------------------------------------------------
  BOOKING DETAILS
--------------------------------------------------
  Name          : ${data.fullName}
  Phone         : ${data.phone}
  Email         : ${data.email}
  Course        : ${data.course}
  Location      : ${data.location || 'N/A'}
  Pincode       : ${data.pincode || 'N/A'}
--------------------------------------------------

Our team will reach out to you shortly on your phone number (${data.phone}) to confirm the exact date and time for your session.

What to expect in your free demo:
  • A personalised 1-on-1 walkthrough of the course
  • Guidance from an industry expert
  • Honest advice on whether the course is right for you
  • No pressure, no obligation

If you have any questions before your session, feel free to contact us:
  📞 Phone   : +91 77085 88508
  🌐 Website : https://ftitraining.in

Thank you for choosing FutureTech Training Institute!

Warm regards,
The FutureTech Team
https://ftitraining.in
            `.trim();

            await transporter.sendMail({
                from: '"FutureTech Training Institute" <contact@ftitraining.in>',
                to: data.email, // Sent to student
                subject: subject,
                text: bodyText,
            });

            return res.status(200).json({ success: true });
        }

        // Return 400 for unknown types
        return res.status(400).json({ success: false, error: 'Unknown email type' });

    } catch (error) {
        console.error('Email API Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
