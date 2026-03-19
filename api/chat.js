export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { messages, system } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1000,
      messages: [{ role: 'system', content: system }, ...messages]
    })
  });

  const data = await response.json();
  if (data.error) return res.status(500).json({ error: data.error.message });
  res.json({ result: data.choices?.[0]?.message?.content || 'No response.' });
}
