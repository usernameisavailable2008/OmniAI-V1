# OmniAI - AI-Powered Shopify Store Management

OmniAI is an advanced Shopify application that leverages artificial intelligence to automate and optimize eCommerce store management through an intuitive chatbot interface. The application integrates GPT-3.5 and GPT-4 for different tiers of functionality, providing a seamless experience for store owners.

## Features

### Tier 1 (€85/month)
- Basic product management
- Automated product description updates
- Price and discount management
- Inventory tracking
- Order management

### Tier 2 (€170/month)
- All Tier 1 features
- Advanced store management
- AI-powered code generation
- Theme customization
- Custom automation workflows

### Tier 3 (€299/month)
- All Tier 2 features
- Full store builds
- AI-driven product recommendations
- Advanced analytics
- Custom integrations

## Tech Stack

- Node.js
- Remix
- Shopify Admin API
- OpenAI API (GPT-3.5 and GPT-4)
- Shopify Billing API

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/omniai.git
cd omniai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=your_app_url
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_session_secret
```

4. Start the development server:
```bash
npm run dev
```

## Development

The application is built with Remix and uses the Shopify App Bridge for authentication and API access. The main components are:

- `app/components/Chatbot.tsx`: The main chatbot interface
- `app/routes/_index.tsx`: The main application route
- `app/routes/api.chat.ts`: The API endpoint for chat processing
- `app/utils/shopify.server.ts`: Shopify authentication utilities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@omniai.com or join our Slack channel. 