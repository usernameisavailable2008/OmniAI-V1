export async function chat(input: string): Promise<{ message: string; needsAuth?: boolean }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: input }),
  });
  const data = await res.json();
  if (!res.ok) {
    const message = (data && data.error) || 'Request failed';
    throw new Error(message);
  }
  const message: string = data.reply ?? data.message ?? '';
  return { message, needsAuth: data.needsAuth };
}
