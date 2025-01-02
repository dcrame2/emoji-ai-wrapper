import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt, numOfEmojis } = req.body;
    try {
      const openAI = new OpenAI(process.env.OPENAI_API_KEY);
      const completion = await openAI.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant generating emojis for the input text.',
          },
          {
            role: 'user',
            // content: `Give me ${numOfEmojis} emojis that match this sentence: ${prompt}. No words, no letters, no spaces and no random characters. Only emojis. There should be no duplicate emojis and each time I regenerate the emojis, it should be different.`,
            content: `ChatGPT, please act as an emoji translator. Your task is to translate the given word, phrase, or sentence into emojis. Please adhere to the following guidelines:

            For single words, translate to only one corresponding emoji that best represents the meaning or essence of the word.
            For phrases and sentences, use as few emojis as possible, selecting those that capture the main idea or sentiment of the input.
            Prioritize clarity and accuracy of translation over the number of emojis used.
            Please refrain from using words in your response, and only use emoji(s).
            Given these guidelines, could you please translate the following "${prompt}" into emoji?`,
          },
        ],
        model: 'gpt-4o-mini',
      });
      const emojis = completion.choices[0].message.content.trim();
      res.status(200).json({ emojis });
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      res.status(500).json({ error: 'Failed to fetch emojis from OpenAI' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
