import webpush from 'web-push';

const vapidKeys = {
  publicKey: 'BLO114RXRFYrH6Ha_MKSW-Jc4AZRdl4PNRGmYRWojyh9ESkTEEhXIM9X6OwOeWAZUL-QgCup0xgHy_9JyfSfuE8',
  privateKey: 'PVaIRNRGPNzQLePJ6NtkoKSg2ZkTyuwXCEITEY6WXW8'
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
