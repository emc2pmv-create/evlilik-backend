export default async function handler(req, res) {
    // CORS ayarları: Her yerden erişime izin ver
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Sadece POST isteği kabul edilir' });
    }

    const { text } = req.body;
    const GEMINI_KEY = process.env.GEMINI_KEY; // Vercel Settings'teki anahtar

    if (!GEMINI_KEY) {
        return res.status(500).json({ error: 'API anahtarı eksik (GEMINI_KEY)' });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Sen çok romantik bir şairisin. Tıp terimi asla kullanmadan şu geleceği kısa ve duygusal anlat: " + text }] }]
                })
            }
        );

        const data = await response.json();
        const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Bir sorun oluştu.";
        res.status(200).json({ text: result });
    } catch (error) {
        res.status(500).json({ error: 'Bağlantı hatası: ' + error.message });
    }
}
