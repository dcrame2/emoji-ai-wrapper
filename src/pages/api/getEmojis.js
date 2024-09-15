import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { prompt, numOfEmojis } = req.body;

    try {
      // Initialize OpenAI API client
      const openAI = new OpenAI(process.env.OPENAI_API_KEY);

      // Call OpenAI API with the input prompt
      const completion = await openAI.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant generating emojis for the input text.",
          },
          {
            role: "user",
            content: `Give me ${numOfEmojis} emojis that match this sentence: ${prompt}. No words at all or spaces or random characters. Only emojis. There should be no duplicate emojis and each time i regenerate the emojis, it should be different.`,
          },
        ],
        model: "gpt-4o-mini",
      });

      // Extract emojis from OpenAI's response
      const emojis = completion.choices[0].message.content.trim();

      // Return the emojis to the client
      res.status(200).json({ emojis });
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      res.status(500).json({ error: "Failed to fetch emojis from OpenAI" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
