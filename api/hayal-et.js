export default async function handler(req, res) {
  // CORS ayarları
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { text } = req.body;
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Sen romantik bir şairisin. Tıp terimi asla kullanmadan şu hayali anlat: " + text }] }]
        })
      }
    );

    const data = await response.json();

    // HATA TEŞHİSİ: Eğer Google hata döndürürse bunu ekrana yazdır
    if (data.error) {
      return res.status(200).json({ text: "Google Hatası: " + data.error.message });
    }

    // Cevap gelip gelmediğini kontrol et
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (result) {
      res.status(200).json({ text: result });
    } else {
      // Güvenlik filtresine takılmış olabilir
      res.status(200).json({ text: "İçerik üretilemedi. (Filtre veya boş yanıt)" });
    }

  } catch (error) {
    res.status(500).json({ error: "Bağlantı hatası: " + error.message });
  }
}
