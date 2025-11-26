/**
 * Notification Service
 * Manages user notifications for submission status changes and admin notes
 */

export const notificationService = {
    /**
     * Get all notifications from localStorage
     */
    getNotifications: () => {
        const stored = localStorage.getItem('notifications');
        return stored ? JSON.parse(stored) : [];
    },

    /**
     * Save notifications to localStorage
     */
    saveNotifications: (notifications) => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    },

    /**
     * Create a new notification
     */
    createNotification: (userId, type, submissionId, message) => {
        const notifications = notificationService.getNotifications();
        const newNotification = {
            id: `notif_${Date.now()}`,
            userId,
            type, // 'status_changed', 'note_added', 'deadline_warning'
            submissionId,
            message,
            read: false,
            createdAt: new Date().toISOString()
        };
        notifications.push(newNotification);
        notificationService.saveNotifications(notifications);
        return newNotification;
    },

    /**
     * Get notifications for a specific user
     */
    getUserNotifications: (userId) => {
        const notifications = notificationService.getNotifications();
        return notifications
            .filter(n => n.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    /**
     * Get unread count for a user
     */
    getUnreadCount: (userId) => {
        const notifications = notificationService.getUserNotifications(userId);
        return notifications.filter(n => !n.read).length;
    },

    /**
     * Mark notification as read
     */
    markAsRead: (notificationId) => {
        const notifications = notificationService.getNotifications();
        const updated = notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        );
        notificationService.saveNotifications(updated);
    },

    /**
     * Mark all notifications as read for a user
     */
    markAllAsRead: (userId) => {
        const notifications = notificationService.getNotifications();
        const updated = notifications.map(n =>
            n.userId === userId ? { ...n, read: true } : n
        );
        notificationService.saveNotifications(updated);
    },

    /**
     * Delete a notification
     */
    deleteNotification: (notificationId) => {
        const notifications = notificationService.getNotifications();
        const updated = notifications.filter(n => n.id !== notificationId);
        notificationService.saveNotifications(updated);
    },

    /**
     * Clear all notifications for a user
     */
    clearAllNotifications: (userId) => {
        const notifications = notificationService.getNotifications();
        const updated = notifications.filter(n => n.userId !== userId);
        notificationService.saveNotifications(updated);
    }
};

export default notificationService;
