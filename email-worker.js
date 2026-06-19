// =========================================================================
//  CLOUDFLARE EMAIL WORKER SCRIPT
// =========================================================================
//  This script runs on Cloudflare Workers. It serves two purposes:
//  1. Incoming Emails: Automatically forwards incoming emails sent to 
//     your domain (e.g. admission@ftitraining.in) to your target inbox.
//  2. HTTP API: Receives contact & admission form submissions from your
//     website and sends a formatted notification email using Cloudflare's
//     send_email binding.
//
//  How to deploy this on Cloudflare:
//  1. Create a new Cloudflare Worker.
//  2. Paste this code into the Worker editor.
//  3. Under the Worker's Settings -> Variables, add an "Email Routing"
//     binding named "SEND_EMAIL" connected to your domain.
//  4. Deploy the Worker and note its URL (e.g., https://your-worker.workers.dev).
// =========================================================================

export default {
  // 1. Handles incoming email events routed from Cloudflare Email Routing
  async email(message, env, ctx) {
    // Automatically forward any incoming email to your destination inbox
    await message.forward("varun10vikash@mail.com");
  },

  // 2. Handles HTTP POST requests from the website forms
  async fetch(request, env, ctx) {
    // Enable CORS so the website frontend can communicate with this worker
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
        
        // -------------------------------------------------------
        //  TYPE: Demo Booking Confirmation → send to STUDENT
        // -------------------------------------------------------
        if (data.type === "demo_confirmation") {
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

          await env.SEND_EMAIL.send({
            from: "noreply@ftitraining.in",
            to: data.email,            // → Student's email
            subject: subject,
            text: bodyText,
          });

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // -------------------------------------------------------
        //  TYPE: Admission / Contact form → send to ADMIN
        // -------------------------------------------------------
        let subject = "New Website Submission";
        let bodyText = "";

        if (data.course) {
          // Admission Form Submission
          subject = `🎓 New Admission: ${data.fullName} (${data.course})`;
          bodyText = `
New student enrollment application received:

--------------------------------------------------
Student Name: ${data.fullName}
Email Address: ${data.email}
Phone Number: ${data.phone}
Course Selected: ${data.course}
Date: ${data.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
--------------------------------------------------

Remarks/Message:
${data.remarks || 'No additional remarks provided.'}
          `.trim();
        } else {
          // Contact Form Submission
          subject = `✉️ New Contact Message from ${data.name}`;
          bodyText = `
New inquiry received from the contact form:

--------------------------------------------------
Sender Name: ${data.name}
Email Address: ${data.email}
Phone Number: ${data.phone || 'Not provided'}
Date: ${data.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
--------------------------------------------------

Message Content:
${data.message}
          `.trim();
        }

        // Send the email using the Cloudflare SEND_EMAIL binding
        await env.SEND_EMAIL.send({
          from: "noreply@ftitraining.in", // Must be a verified address/domain in Cloudflare
          to: "varun10vikash@mail.com",
          subject: subject,
          text: bodyText,
        });

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
