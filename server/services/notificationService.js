import Notification from '../models/Notification.model.js';
import User from '../models/User.model.js';
import sendEmail from '../utils/sendEmail.js';
import webpush from 'web-push';

// Configure web push
webpush.setVapidDetails(
  'mailto:hello@virtualtourist.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

class NotificationService {
  /**
   * Create and send a notification
   */
  async send(userId, type, data) {
    const templates = this.getTemplates();
    const template = templates[type];

    if (!template) {
      throw new Error(`Unknown notification type: ${type}`);
    }

    const { title, message } = template(data);

    // Create notification in database
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      data: {
        tourId: data.tourId,
        bookingId: data.bookingId,
        achievementId: data.achievementId,
        url: data.url
      }
    });

    // Get user preferences
    const user = await User.findById(userId);

    // Send email notification if enabled
    if (user?.preferences?.notifications && user?.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: title,
          template: 'notification',
          data: { title, message, url: data.url }
        });
        notification.emailSent = true;
        await notification.save();
      } catch (error) {
        console.error('Email notification failed:', error);
      }
    }

    // Send push notification if subscription exists
    if (user?.pushSubscription) {
      try {
        await webpush.sendNotification(
          user.pushSubscription,
          JSON.stringify({
            title,
            body: message,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            data: { url: data.url }
          })
        );
        notification.pushSent = true;
        await notification.save();
      } catch (error) {
        console.error('Push notification failed:', error);
      }
    }

    // Emit socket event for real-time notification
    const io = global.io;
    if (io) {
      io.to(`user:${userId}`).emit('notification', notification);
    }

    return notification;
  }

  /**
   * Get notifications for a user
   */
  async getNotifications(userId, { page = 1, limit = 20, unreadOnly = false }) {
    const query = { user: userId };
    if (unreadOnly) query.read = false;

    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user: userId, read: false });

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true, readAt: new Date() },
      { new: true }
    );
    return notification;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    await Notification.updateMany(
      { user: userId, read: false },
      { read: true, readAt: new Date() }
    );
  }

  /**
   * Delete old notifications
   */
  async cleanupOldNotifications(daysOld = 90) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
      read: true
    });
  }

  /**
   * Notification templates
   */
  getTemplates() {
    return {
      booking_confirmed: (data) => ({
        title: 'Booking Confirmed! 🎉',
        message: `Your booking for "${data.tourTitle}" has been confirmed. Confirmation code: ${data.confirmationCode}`
      }),
      booking_reminder: (data) => ({
        title: 'Tour Reminder 🗓️',
        message: `Your tour "${data.tourTitle}" starts in ${data.timeUntil}. Don't miss it!`
      }),
      tour_recommendation: (data) => ({
        title: 'Recommended for You 🌟',
        message: `Based on your interests, we think you'll love "${data.tourTitle}"`
      }),
      achievement_unlocked: (data) => ({
        title: 'Achievement Unlocked! 🏆',
        message: `Congratulations! You've earned the "${data.achievementName}" badge!`
      }),
      new_review: (data) => ({
        title: 'New Review 📝',
        message: `Someone left a ${data.rating}-star review on "${data.tourTitle}"`
      }),
      price_drop: (data) => ({
        title: 'Price Drop Alert! 💰',
        message: `"${data.tourTitle}" is now ${data.discount}% off! Don't miss this deal.`
      }),
      live_tour_starting: (data) => ({
        title: 'Live Tour Starting Soon! 🔴',
        message: `"${data.tourTitle}" is going live in ${data.timeUntil}. Join now!`
      }),
      system: (data) => ({
        title: data.title || 'System Notification',
        message: data.message
      })
    };
  }
}

export default new NotificationService();