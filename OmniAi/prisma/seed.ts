import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const testUsers = [
    {
      email: 'tier1@example.com',
      name: 'Tier 1 User',
      shopId: 'tier1-shop.myshopify.com',
      tier: 1,
      settings: {
        darkMode: false,
        notifications: true,
        language: 'en',
      },
    },
    {
      email: 'tier2@example.com',
      name: 'Tier 2 User',
      shopId: 'tier2-shop.myshopify.com',
      tier: 2,
      settings: {
        darkMode: true,
        notifications: true,
        language: 'en',
      },
    },
    {
      email: 'tier3@example.com',
      name: 'Tier 3 User',
      shopId: 'tier3-shop.myshopify.com',
      tier: 3,
      settings: {
        darkMode: false,
        notifications: true,
        language: 'en',
      },
    },
  ];

  const createdUsers = [];
  for (const userData of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: userData,
      create: userData,
    });
    createdUsers.push(user);
    console.log(`✅ Created user: ${user.email}`);
  }

  // Create test sessions
  for (const user of createdUsers) {
    await prisma.session.upsert({
      where: { id: `session-${user.id}` },
      update: {},
      create: {
        id: `session-${user.id}`,
        userId: user.id,
        shop: user.shopId!,
        token: randomBytes(32).toString('hex'),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });
    console.log(`✅ Created session for user: ${user.email}`);
  }

  // Create test subscriptions
  for (const user of createdUsers) {
    await prisma.subscription.upsert({
      where: { id: `sub-${user.id}` },
      update: {},
      create: {
        id: `sub-${user.id}`,
        userId: user.id,
        tier: user.tier,
        status: 'active',
        stripeCustomerId: `cus_${randomBytes(8).toString('hex')}`,
        stripeSubscriptionId: `sub_${randomBytes(8).toString('hex')}`,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
      },
    });
    console.log(`✅ Created subscription for user: ${user.email}`);
  }

  // Create test commands
  const commandTypes = ['product', 'order', 'customer', 'theme', 'code', 'store'];
  const commandActions = ['update', 'create', 'delete', 'bulk-update'];
  const commandStatuses = ['completed', 'failed', 'processing'];

  for (const user of createdUsers) {
    for (let i = 0; i < 5; i++) {
      const type = commandTypes[Math.floor(Math.random() * commandTypes.length)];
      const action = commandActions[Math.floor(Math.random() * commandActions.length)];
      const status = commandStatuses[Math.floor(Math.random() * commandStatuses.length)];
      
      await prisma.command.create({
        data: {
          userId: user.id,
          shop: user.shopId!,
          type,
          action,
          parameters: {
            target: 'all',
            field: 'title',
            value: `Test ${type} ${action}`,
          },
          status,
          result: status === 'completed' ? {
            message: `Successfully ${action}d ${type}`,
            affectedCount: Math.floor(Math.random() * 10) + 1,
          } : null,
          error: status === 'failed' ? 'Test error message' : null,
          executionTime: Math.floor(Math.random() * 5000) + 100,
        },
      });
    }
    console.log(`✅ Created test commands for user: ${user.email}`);
  }

  // Create test feedback
  const feedbackTypes = ['command', 'general', 'bug', 'feature'];
  const feedbackStatuses = ['open', 'in_progress', 'resolved'];

  for (const user of createdUsers) {
    for (let i = 0; i < 3; i++) {
      const type = feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)];
      const status = feedbackStatuses[Math.floor(Math.random() * feedbackStatuses.length)];
      
      await prisma.feedback.create({
        data: {
          userId: user.id,
          rating: Math.floor(Math.random() * 5) + 1,
          comment: `Test ${type} feedback comment`,
          type,
          status,
        },
      });
    }
    console.log(`✅ Created test feedback for user: ${user.email}`);
  }

  // Create test audit logs
  const auditActions = ['login', 'logout', 'command_executed', 'subscription_changed'];
  
  for (const user of createdUsers) {
    for (let i = 0; i < 10; i++) {
      const action = auditActions[Math.floor(Math.random() * auditActions.length)];
      
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action,
          resource: user.shopId!,
          details: {
            action,
            timestamp: new Date(),
            userAgent: 'Test User Agent',
          },
          ipAddress: '127.0.0.1',
          userAgent: 'Test User Agent',
        },
      });
    }
    console.log(`✅ Created test audit logs for user: ${user.email}`);
  }

  // Create test cache entries
  const cacheEntries = [
    {
      key: 'gpt-response:product-update',
      value: {
        response: 'Test GPT response for product update',
        timestamp: new Date(),
      },
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
    {
      key: 'shopify-products:tier1-shop',
      value: {
        products: [
          { id: 1, title: 'Test Product 1' },
          { id: 2, title: 'Test Product 2' },
        ],
        lastFetch: new Date(),
      },
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    },
  ];

  for (const entry of cacheEntries) {
    await prisma.cache.upsert({
      where: { key: entry.key },
      update: entry,
      create: entry,
    });
    console.log(`✅ Created cache entry: ${entry.key}`);
  }

  // Create test performance metrics
  const metrics = ['response_time', 'error_rate', 'active_users', 'commands_per_minute'];
  
  for (let i = 0; i < 50; i++) {
    const metric = metrics[Math.floor(Math.random() * metrics.length)];
    
    await prisma.performanceMetric.create({
      data: {
        metric,
        value: Math.random() * 100,
        tags: {
          environment: 'development',
          service: 'omniai',
        },
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)),
      },
    });
  }
  console.log('✅ Created test performance metrics');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 