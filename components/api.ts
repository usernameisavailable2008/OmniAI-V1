export async function chat(input: string) {
  const res = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: input }),
  });
  const data = await res.json();
  if (!res.ok) {
    const message = (data && data.error) || 'Request failed';
    throw new Error(message);
  }
  return data;
}
