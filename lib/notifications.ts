/**
 * Notification Service for Wanderpals
 * Handles Email (Resend) and WhatsApp (Interakt/Twilio) integrations.
 */

export async function sendBookingConfirmationEmail(booking: any, user: any) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
        console.warn('RESEND_API_KEY missing. Skipping email.');
        return;
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Wanderpals <bookings@wanderpals.com>',
                to: [user.email],
                subject: `Booking Confirmed: ${booking.trips?.title}`,
                html: `
          <h1>Pack your bags!</h1>
          <p>Hi ${user.full_name || 'Traveler'},</p>
          <p>Your booking for <strong>${booking.trips?.title}</strong> is received and pending confirmation.</p>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p>We will contact you shortly via WhatsApp for next steps.</p>
        `,
            }),
        });

        return await response.json();
    } catch (error) {
        console.error('Failed to send booking email:', error);
    }
}

export async function sendWhatsAppNotification(phoneNumber: string, message: string) {
    // Logic for Interakt or Twilio would go here.
    // For now, we log it to console as a mock.
    console.log(`[WHATSAPP] Sending to ${phoneNumber}: ${message}`);

    /**
     * Example Twilio Implementation:
     * const client = require('twilio')(sid, token);
     * await client.messages.create({ from: 'whatsapp:+...', to: `whatsapp:${phoneNumber}`, body: message });
     */
}
