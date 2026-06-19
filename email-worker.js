// =========================================================================
//  CLOUDFLARE EMAIL WORKER (MAILCHANNELS)
// =========================================================================

export default {
  // 1. Handles incoming email events routed from Cloudflare Email Routing
  async email(message, env, ctx) {
    await message.forward("varun10vikash@mail.com");
  },

  // 2. Handles HTTP POST requests from the website forms
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "POST") {
      try {
        const data = await request.json();
        
        let toEmail = "varun10vikash@mail.com";
        let subject = "New Website Submission";
        let bodyText = "";

        // -------------------------------------------------------
        //  TYPE: Demo Booking Confirmation → send to STUDENT
        // -------------------------------------------------------
        if (data.type === "demo_confirmation") {
          toEmail = data.email; // Send to student
          subject = `✅ Your Demo Session is Confirmed — FutureTech Training Institute`;
          bodyText = `
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
        } else if (data.course) {
          // Admission Form
          subject = `🎓 New Admission: ${data.fullName} (${data.course})`;
          bodyText = `New student enrollment application received:\n\nStudent Name: ${data.fullName}\nEmail Address: ${data.email}\nPhone Number: ${data.phone}\nCourse Selected: ${data.course}\nDate: ${data.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\nRemarks:\n${data.remarks || 'No additional remarks provided.'}`;
        } else {
          // Contact Form
          subject = `✉️ New Contact Message from ${data.name}`;
          bodyText = `New inquiry received from the contact form:\n\nSender Name: ${data.name}\nEmail Address: ${data.email}\nPhone Number: ${data.phone || 'Not provided'}\nDate: ${data.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\nMessage Content:\n${data.message}`;
        }

        // Send via MailChannels API
        const mailChannelsRes = await fetch("https://api.mailchannels.net/tx/v1/send", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email: toEmail, name: data.fullName || data.name || "Recipient" }],
              },
            ],
            from: {
              email: "contact@ftitraining.in",
              name: "FutureTech Training Institute",
            },
            subject: subject,
            content: [
              {
                type: "text/plain",
                value: bodyText,
              },
            ],
          }),
        });

        if (!mailChannelsRes.ok) {
          const errText = await mailChannelsRes.text();
          throw new Error(`MailChannels Error: ${errText}`);
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};
