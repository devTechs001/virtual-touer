/**
 * Maintenance Reminder Email Template
 * Sent before maintenance starts
 */

export const maintenanceReminderTemplate = (data) => ({
  subject: `⚠️ Maintenance in ${data.hoursBefore} hour(s) - Virtual Tourist`,
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
        .warning { 
          background: #fef3c7; 
          border: 1px solid #f59e0b; 
          border-radius: 12px; 
          padding: 16px; 
          margin-bottom: 24px; 
        }
        .warning p { 
          color: #92400e; 
          margin: 0; 
          font-weight: 500; 
        }
        h1 { 
          color: #f8fafc; 
          font-size: 24px; 
          margin-bottom: 16px; 
        }
        p { 
          color: #94a3b8; 
          line-height: 1.6; 
        }
        .countdown { 
          font-size: 48px; 
          font-weight: bold; 
          color: #f59e0b; 
          margin: 24px 0; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="warning">
            <p>⚠️ Maintenance Starting Soon</p>
          </div>
          
          <h1>Reminder: Scheduled Maintenance</h1>
          
          <p>Hi ${data.name},</p>
          
          <div class="countdown">${data.hoursBefore}h</div>
          
          <p>Virtual Tourist maintenance will begin in ${data.hoursBefore} hour(s) at:</p>
          <p style="font-size: 18px; color: #f8fafc; font-weight: 500;">
            ${new Date(data.startTime).toLocaleString()}
          </p>
          
          <p style="margin-top: 24px; font-size: 14px;">
            ${data.message}
          </p>
        </div>
      </div>
    </body>
    </html>
  `
});

export default maintenanceReminderTemplate;
