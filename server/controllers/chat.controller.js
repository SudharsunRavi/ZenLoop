const Chat = require('../models/chat.module');

const getChatResponse = async (req, res) => {
  const { message: userMessage, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

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
    });

    const groqData = await groqRes.json();
    const reply = groqData.choices[0].message.content.trim();

    const newMessages = [
      { role: 'user', content: userMessage },
      { role: 'assistant', content: reply },
    ];

    await Chat.findOneAndUpdate(
      { userId },
      { $push: { messages: { $each: newMessages } } },
      { upsert: true, new: true }
    );

    res.json({ reply });
  } catch (err) {
    console.error('Groq API Error:', err.message);
    res.status(500).json({ reply: 'Oops! Something went wrong.' });
  }
};

const getChatHistory = async (req, res) => {
  const { userId } = req.query; 

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const chat = await Chat.findOne({ userId });
    if (!chat) return res.json({ messages: [] });

    res.json({ messages: chat.messages });
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

module.exports = { getChatResponse, getChatHistory };