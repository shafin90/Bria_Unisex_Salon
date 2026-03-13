const puppeteer = require('puppeteer');

const generateBookingTicket = async (booking) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        const totalAmount = booking.service.reduce((sum, service) => sum + service.servicePrice, 0);
        
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Booking Ticket - ${booking.confirmationCode}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Arial', sans-serif; background: #f4f4f4; padding: 20px; }
                .ticket { max-width: 400px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }
                .header { background: #667eea; color: white; padding: 25px; text-align: center; }
                .content { padding: 25px; }
                .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .label { font-weight: bold; color: #555; }
                .total { background: #667eea; color: white; padding: 15px; text-align: center; border-radius: 10px; margin-top: 20px; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="ticket">
                <div class="header">
                    <h2>Bria Salon</h2>
                    <p>Booking Confirmed</p>
                    <h3 style="margin-top:10px;">${booking.confirmationCode}</h3>
                </div>
                <div class="content">
                    <div class="info-row"><span class="label">Name:</span> <span>${booking.name}</span></div>
                    <div class="info-row"><span class="label">Phone:</span> <span>${booking.phoneNumber}</span></div>
                    <div class="info-row"><span class="label">Date:</span> <span>${booking.date}</span></div>
                    <div class="info-row"><span class="label">Time:</span> <span>${booking.time}</span></div>
                    <hr style="margin: 15px 0; border: 0; border-top: 1px solid #eee;">
                    <h4>Services:</h4>
                    ${booking.service.map(s => `<div class="info-row"><span>${s.serviceName}</span> <span>$${s.servicePrice}</span></div>`).join('')}
                    <div class="total">Total: $${totalAmount}</div>
                </div>
            </div>
        </body>
        </html>
        `;
        
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        return await page.pdf({ format: 'A4', printBackground: true });
    } catch (error) {
        console.error('Error generating PDF ticket:', error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
};

module.exports = { generateBookingTicket };
