import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function handleAI(prompt: string, model?: 'gpt-3.5-turbo' | 'gpt-4o') {
  const chosenModel = model || 'gpt-3.5-turbo';
  if (!process.env.OPENAI_API_KEY) {
    return 'OPENAI_API_KEY is not set on the server. Please configure your environment.';
  }

  const response = await openai.chat.completions.create({
    model: chosenModel,
    messages: [
      { role: 'system', content: 'You are OmniAI, a helpful assistant for Shopify merchants.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
  });

  return response.choices?.[0]?.message?.content ?? '';
}
