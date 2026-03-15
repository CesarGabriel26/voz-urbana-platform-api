import webpush from 'web-push';

const vapidKeys = {
  publicKey: 'BL-OMKwskMGpiyNQmJ1waIWXN0Cydf1aOXfUBVjre9Y-LPh982RQ1tyCNr6x0rrDreyI-UzRpFC-rUYXT5EuW1E',
  privateKey: 'UqylFYQ-twIaGMBEfPWbLXGSjCYrci6J3fuwGRUhoQw'
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
        // TODO: Remove from database
      } else {
        console.error('Error sending notification', error);
      }
    }
  }

  getPublicKey() {
    return vapidKeys.publicKey;
  }
}
