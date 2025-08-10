import express from 'express';
import fetch from 'node-fetch';
import { getShopAccessToken } from './shopify';

const router = express.Router();

router.get('/create-subscription', async (req, res) => {
  try {
    const tier = String(req.query.tier || '1');
    const shop = String((req as any).session?.shop || req.query.shop || '');
    if (!shop) return res.status(401).send('Not authenticated with Shopify');

    const token = getShopAccessToken(shop);
    if (!token) return res.status(401).send('Missing Shopify token');

    let price = '85.00';
    let name = 'Tier 1 Subscription';
    if (tier === '2') {
      price = '170.00';
      name = 'Tier 2 Subscription';
    }
    if (tier === '3') {
      price = '299.00';
      name = 'Tier 3 Subscription';
    }

    const resp = await fetch(`https://${shop}/admin/api/2023-07/recurring_application_charges.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({
        recurring_application_charge: {
          name,
          price,
          return_url: `${process.env.SHOPIFY_APP_URL || process.env.APP_URL || 'http://localhost:3000'}`,
          test: true, // NOTE: remove for production
        },
      }),
    });

    const data = (await resp.json()) as any;
    const confirmationUrl = data?.recurring_application_charge?.confirmation_url;
    if (!confirmationUrl) {
      console.error('Billing error', data);
      return res.status(500).send('Failed to create subscription');
    }

    res.redirect(confirmationUrl);
  } catch (e) {
    console.error('create-subscription error', e);
    res.status(500).send('Billing error');
  }
});

export default router;
