import webpush from 'web-push';

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || ''
};

webpush.setVapidDetails(
  'mailto:contato@vozurbana.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export class PushNotificationService {
  async sendNotification(subscription: any, payload: any) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (error: any) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        console.log('Subscription has expired or is no longer valid');
      } else {
        console.error('Error sending notification', error);
      }
    }
  }

  async notifyUser(user: any, title: string, body: string, type: string) {
    if (!user.push_subscriptions || !user.push_subscriptions.length) return;

    // Check notification settings
    const settings = user.notificationSettings;
    if (settings && settings.subjects && settings.subjects[type] === false) {
      return;
    }

    const payload = {
      notification: {
        title,
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        data: {
          url: '/'
        }
      }
    };

    const promises = user.push_subscriptions.map((sub: any) => 
      this.sendNotification(sub, payload)
    );

    await Promise.all(promises);
  }

  getPublicKey() {
    return vapidKeys.publicKey;
  }
}
