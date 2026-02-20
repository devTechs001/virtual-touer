/**
 * Maintenance Notification Email Template
 * Sent when maintenance is scheduled
 */

export const maintenanceNotificationTemplate = (data) => ({
  subject: '🔧 Scheduled Maintenance - Virtual Tourist',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          background: #0f172a; 
          color: #e2e8f0; 
          margin: 0; 
          padding: 0; 
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 40px 20px; 
        }
        .card { 
          background: #1e293b; 
          border-radius: 16px; 
          padding: 40px; 
          text-align: center; 
        }
        .icon { 
          width: 80px; 
          height: 80px; 
          background: linear-gradient(135deg, #3b82f6, #2563eb); 
          border-radius: 20px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin: 0 auto 24px; 
        }
        h1 { 
          color: #f8fafc; 
          font-size: 28px; 
          margin-bottom: 16px; 
        }
        p { 
          color: #94a3b8; 
          line-height: 1.6; 
          margin-bottom: 20px; 
        }
        .message-box { 
          background: #0f172a; 
          border-radius: 12px; 
          padding: 20px; 
          margin: 24px 0; 
          text-align: left; 
        }
        .message-box p { 
          margin: 0; 
          color: #e2e8f0; 
        }
        .info-row { 
          display: flex; 
          justify-content: space-between; 
          padding: 12px 0; 
          border-bottom: 1px solid #334155; 
        }
        .info-row:last-child { 
          border-bottom: none; 
        }
        .info-label { 
          color: #64748b; 
        }
        .info-value { 
          color: #f8fafc; 
          font-weight: 500; 
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          color: #64748b; 
          font-size: 14px; 
        }
        .social-links { 
          margin-top: 20px; 
        }
        .social-links a { 
          display: inline-block; 
          margin: 0 8px; 
          color: #3b82f6; 
          text-decoration: none; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          
          <h1>Scheduled Maintenance</h1>
          
          <p>Hi ${data.name},</p>
          <p>We're writing to let you know that Virtual Tourist will be undergoing scheduled maintenance.</p>
          
          <div class="message-box">
            <p>${data.message}</p>
          </div>
          
          ${data.estimatedEndTime ? `
          <div style="background: #0f172a; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <div class="info-row">
              <span class="info-label">Estimated End Time</span>
              <span class="info-value">${new Date(data.estimatedEndTime).toLocaleString()}</span>
            </div>
          </div>
          ` : ''}
          
          <p style="font-size: 14px; color: #64748b;">
            We apologize for any inconvenience. Our team is working to improve your experience.
          </p>
          
          ${data.contactEmail ? `
          <p style="font-size: 14px;">
            Need help? Contact us at <a href="mailto:${data.contactEmail}" style="color: #3b82f6;">${data.contactEmail}</a>
          </p>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Virtual Tourist. All rights reserved.</p>
          <div class="social-links">
            <a href="https://twitter.com/virtualtourist">Twitter</a>
            <a href="https://facebook.com/virtualtourist">Facebook</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
});

export default maintenanceNotificationTemplate;
