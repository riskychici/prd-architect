// api/analyze-prd.js

export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Handling aman untuk parse body jika dikirim sebagai string
    let bodyData = req.body;
    if (typeof bodyData === 'string') {
      try {
        bodyData = JSON.parse(bodyData);
      } catch (e) {
        return res.status(400).json({ error: 'Format JSON request body tidak valid.' });
      }
    }

    const prdData = bodyData?.prdData;

    if (!prdData) {
      return res.status(400).json({ error: 'Data PRD tidak boleh kosong.' });
    }

    // Mengambil API Key dari Environment Variable (Node.js)
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY belum dikonfigurasi di server.' });
    }

    // Memanggil API Gemini 1.5 Flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Kamu adalah seorang System Analyst dan Senior Product Manager handal.
Analisis data PRD berikut. Berikan masukan konkret mengenai:
1. Kekurangan atau hal yang belum jelas (Missing Requirements).
2. Saran perbaikan deskripsi / Acceptance Criteria / Tech Stack.
3. Potensi risiko teknis atau bisnis.

Data PRD:
${JSON.stringify(prdData, null, 2)}`
                }
              ]
            }
          ]
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Gagal memproses request ke Gemini API'
      });
    }

    // Mengambil hasil teks dari response Gemini
    const aiFeedback = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada analisis yang dihasilkan.';

    return res.status(200).json({ feedback: aiFeedback });
  } catch (error) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan internal.' });
  }
}