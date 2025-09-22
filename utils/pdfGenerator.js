const puppeteer = require('puppeteer');
const path = require('path');

const generateBookingTicket = async (booking) => {
    let browser;
    
    try {
        // Launch browser
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Calculate total amount
        const totalAmount = booking.service.reduce((sum, service) => sum + service.servicePrice, 0);
        
        // Generate HTML content for the ticket
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Ticket - ${booking.confirmationCode}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Arial', sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                    min-height: 100vh;
                }
                
                .ticket {
                    max-width: 400px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                    position: relative;
                }
                
                .header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    opacity: 0.3;
                }
                
                .salon-logo {
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 8px;
                    position: relative;
                    z-index: 1;
                }
                
                .ticket-title {
                    font-size: 18px;
                    opacity: 0.9;
                    position: relative;
                    z-index: 1;
                }
                
                .confirmation-code {
                    background: rgba(255,255,255,0.2);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-family: 'Courier New', monospace;
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 15px;
                    display: inline-block;
                    position: relative;
                    z-index: 1;
                }
                
                .content {
                    padding: 30px 20px;
                }
                
                .customer-info {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                }
                
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .info-row:last-child {
                    margin-bottom: 0;
                    border-bottom: none;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #495057;
                    font-size: 14px;
                }
                
                .info-value {
                    color: #212529;
                    font-size: 14px;
                    text-align: right;
                }
                
                .services-section {
                    margin-bottom: 20px;
                }
                
                .section-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #495057;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                }
                
                .section-title::before {
                    content: '✂️';
                    margin-right: 8px;
                }
                
                .service-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .service-item:last-child {
                    border-bottom: none;
                }
                
                .service-name {
                    font-weight: 500;
                    color: #495057;
                }
                
                .service-price {
                    font-weight: bold;
                    color: #667eea;
                }
                
                .total-section {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 12px;
                    text-align: center;
                }
                
                .total-label {
                    font-size: 14px;
                    opacity: 0.9;
                    margin-bottom: 5px;
                }
                
                .total-amount {
                    font-size: 24px;
                    font-weight: bold;
                }
                
                .footer {
                    padding: 20px;
                    text-align: center;
                    background: #f8f9fa;
                    border-top: 1px solid #e9ecef;
                }
                
                .footer-text {
                    color: #6c757d;
                    font-size: 12px;
                    line-height: 1.5;
                }
                
                .qr-placeholder {
                    width: 80px;
                    height: 80px;
                    background: #e9ecef;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 15px auto;
                    font-size: 12px;
                    color: #6c757d;
                    text-align: center;
                }
                
                .important-notes {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 20px;
                }
                
                .important-notes h4 {
                    color: #856404;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                
                .important-notes ul {
                    color: #856404;
                    font-size: 12px;
                    padding-left: 20px;
                }
                
                .important-notes li {
                    margin-bottom: 4px;
                }
                
                @media print {
                    body {
                        background: white;
                        padding: 0;
                    }
                    .ticket {
                        box-shadow: none;
                        border: 1px solid #ddd;
                    }
                }
            </style>
        </head>
        <body>
            <div class="ticket">
                <div class="header">
                    <div class="salon-logo">Bria Salon</div>
                    <div class="ticket-title">Booking Confirmation</div>
                    <div class="confirmation-code">${booking.confirmationCode}</div>
                </div>
                
                <div class="content">
                    <div class="customer-info">
                        <div class="info-row">
                            <span class="info-label">Customer Name</span>
                            <span class="info-value">${booking.name}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Phone Number</span>
                            <span class="info-value">${booking.phoneNumber}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Appointment Date</span>
                            <span class="info-value">${booking.date}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Appointment Time</span>
                            <span class="info-value">${booking.time}</span>
                        </div>
                    </div>
                    
                    <div class="services-section">
                        <div class="section-title">Services Booked</div>
                        ${booking.service.map(service => `
                            <div class="service-item">
                                <span class="service-name">${service.serviceName}</span>
                                <span class="service-price">$${service.servicePrice}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="total-section">
                        <div class="total-label">Total Amount</div>
                        <div class="total-amount">$${totalAmount}</div>
                    </div>
                    
                    <div class="qr-placeholder">
                        QR Code<br>
                        ${booking.confirmationCode}
                    </div>
                    
                    <div class="important-notes">
                        <h4>Important Reminders:</h4>
                        <ul>
                            <li>Please arrive 10 minutes before your appointment</li>
                            <li>Bring this ticket or show the confirmation code</li>
                            <li>Contact us if you need to reschedule</li>
                            <li>Valid only for the specified date and time</li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="footer-text">
                        Thank you for choosing Bria Salon!<br>
                        We look forward to serving you.<br><br>
                        <strong>Contact:</strong> +1 (555) 123-4567<br>
                        <strong>Email:</strong> info@briasalon.com
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
        
        // Set content and generate PDF
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            }
        });
        
        return pdfBuffer;
        
    } catch (error) {
        console.error('Error generating PDF ticket:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

module.exports = {
    generateBookingTicket
};
