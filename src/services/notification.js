import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from "../configs/firebase"; // Your Firestore setup

export const fetchNotifications = async (userId, callback) => {
    const notificationsRef = collection(db, "notifications");

    // Query tìm kiếm
    const q = query(
        notificationsRef,
        where(`participants.${userId}.isRead`, "!=", null)
    );

    // Lắng nghe thay đổi
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        callback(notifications);
    });

    return unsubscribe; 
};
/**
 * Marks a specific notification as read for a given user.
 * @param {string} notificationId - The ID of the notification.
 * @param {string} userId - The ID of the user marking the notification as read.
 */
export const markNotificationAsRead = async (notificationId, userId) => {
    try {
        const notificationRef = doc(db, "notifications", notificationId);
        await updateDoc(notificationRef, {
            [`participants.${userId}.isRead`]: true,
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};
// push notification to firestore
export const sendNotification = async ({
    appointmentId,
    message,
    participants,
    reportId,
    senderId,
    status,
    title,
}) => {
    try {
        const notificationData = {
            appointmentId,
            message,
            participants,
            reportId,
            sender: senderId,
            status,
            timestamp: serverTimestamp(),
            title,
        };
        // Gửi thông báo lên Firestore
        await addDoc(collection(db, "notifications"), notificationData);
    } catch (error) {
        console.error("Error sending notification:", error);
        throw new Error("Failed to send notification");
    }
};
