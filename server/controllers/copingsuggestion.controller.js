const Journal = require('../models/journal.module');
const Chat = require('../models/chat.module');

const getCopingSuggestion = async (req, res) => {
  const userId = req.body.userId;

  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const journals = await Journal.find({
      userId,
      createdAt: { $gte: threeDaysAgo }  // <-- only journals in last 3 days
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('summary');

    const userChatDocs = await Chat.find({ userId }).select('messages');

    let userChats = [];
    userChatDocs.forEach(doc => {
      doc.messages.forEach(msg => {
        if (msg.role === 'user' && new Date(msg.timestamp) >= threeDaysAgo) {
          userChats.push(msg);
        }
      });
    });

    userChats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    userChats = userChats.slice(0, 5);

    const prompt = `
      You are a supportive mental wellness coach.
      Analyze the following user's emotional patterns based on their journals and recent chat conversations.

      Journals:
      ${journals.length ? journals.map((j, idx) => `(${idx + 1}) ${j.summary}`).join('\n') : 'No journal entries found.'}

      Recent Chat Messages:
      ${userChats.length ? userChats.map((c, idx) => `(${idx + 1}) ${c.content || c.message}`).join('\n') : 'No chat messages found.'}

      Now, based on the above, provide a detailed, kind, and personalized coping suggestion paragraph.
      `;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'You are a supportive mental wellness coach.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const groqData = await groqRes.json();

    const suggestion = groqData.choices[0]?.message?.content?.trim();

    if (!suggestion) {
      return res.status(500).json({ error: 'Failed to generate suggestion' });
    }

    res.json({ suggestion });

  } catch (err) {
    console.error('Groq API Error:', err.message);
    res.status(500).json({ error: 'Oops! Something went wrong while generating suggestion.' });
  }
};

module.exports = { getCopingSuggestion };
