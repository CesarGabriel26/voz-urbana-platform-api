import webpush from 'web-push';

const vapidKeys = {
  publicKey: 'BJoJIWa3BxxjTxe7fY57dEeWWDzH3629mzpaKOoFWboj2JT8F762J9Vq5jRPEGUzY_0o884I_ZCsRfyVwT4PzO8',
  privateKey: 'iRfvlLMHTweZlmXZUOOuZh4metMQBEPnp4J0kWDxjs8'
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
