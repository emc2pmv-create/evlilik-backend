export default async function handler(req, res) {
  // BÜTÜN DÜNYAYA ERİŞİM İZNİ VER (CORS Çözümü)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Burası GitHub'ın içeri girmesini sağlar
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Tarayıcılar bazen kontrol için 'OPTIONS' isteği gönderir, onu onaylayalım
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST isteği kabul edilir." });
  }

  const { text } = req.body;
  const key = process.env.GEMINI_KEY; // Vercel'deki gizli anahtarın

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Sen romantik bir şairisin. Tıp terimi asla kullanmadan şu hayali anlat: " + text }] }]
        })
      }
    );

    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Bir sorun oluştu, cevap gelmedi.";
    res.status(200).json({ text: result });

  } catch (error) {
    res.status(500).json({ error: "Gemini bağlantı hatası oluştu." });
  }
}
