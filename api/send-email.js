const nodemailer = require('nodemailer');

export default async function handler(req, res) {
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

        // Use Brevo SMTP (or any custom SMTP configured in Vercel Env Vars)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for 587
            auth: {
                user: process.env.SMTP_USER || 'contact@ftitraining.in',
                pass: process.env.SMTP_PASS || 'YOUR_SMTP_PASSWORD_HERE'
            }
        });

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
                to: data.email, 
                subject: subject,
                text: bodyText,
            });

            return res.status(200).json({ success: true });
        }

        // ==========================================
        //  SECURE BACKUP EMAILS (TO ADMIN)
        // ==========================================
        const adminEmail = process.env.ADMIN_EMAIL || 'abishstk@gmail.com'; // Send backups here
        
        if (data.type === 'backup_enrollment') {
            await transporter.sendMail({
                from: '"FTI System Backup" <contact@ftitraining.in>',
                to: adminEmail,
                subject: `🔒 DATA BACKUP: New Enrollment - ${data.fullName}`,
                text: `SECURE BACKUP RECORD\n\nType: New Student Admission\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nCourse: ${data.course}\nDate: ${data.date}\nRemarks: ${data.remarks || 'None'}`
            });
            return res.status(200).json({ success: true });
        }

        if (data.type === 'backup_demo') {
            await transporter.sendMail({
                from: '"FTI System Backup" <contact@ftitraining.in>',
                to: adminEmail,
                subject: `🔒 DATA BACKUP: New Demo Booking - ${data.fullName}`,
                text: `SECURE BACKUP RECORD\n\nType: Demo Class Booking\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nCourse: ${data.course}\nLocation: ${data.location || 'N/A'}\nPincode: ${data.pincode || 'N/A'}\nDate: ${data.date}`
            });
            return res.status(200).json({ success: true });
        }

        if (data.type === 'backup_message') {
            await transporter.sendMail({
                from: '"FTI System Backup" <contact@ftitraining.in>',
                to: adminEmail,
                subject: `🔒 DATA BACKUP: New Inquiry - ${data.name}`,
                text: `SECURE BACKUP RECORD\n\nType: Contact Form Inquiry\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nDate: ${data.date}\n\nMessage:\n${data.message}`
            });
            return res.status(200).json({ success: true });
        }

        return res.status(400).json({ success: false, error: 'Unknown email type' });

    } catch (error) {
        console.error('Email API Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
