const getChatResponse = async (req, res) => {
  
  const userMessage = req.body.message;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
      }),
    })

    const groqData = await groqRes.json()
    const reply = groqData.choices[0].message.content.trim()
    res.json({ reply })
  } catch (err) {
    console.error('Groq API Error:', err.message)
    res.status(500).json({ reply: 'Oops! Something went wrong.' })
  }
}

module.exports = { getChatResponse }
