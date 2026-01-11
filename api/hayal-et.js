export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Metin eksik" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Çok romantik bir şairsin. Tıp terimi kullanmadan şu hayali anlat: " + text }] }]
        })
      }
    );
    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Hata oluştu";
    res.status(200).json({ text: result });
  } catch (err) {
    res.status(500).json({ error: "Bağlantı hatası" });
  }
}
