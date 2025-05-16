// File: netlify/functions/generateDebate.js

const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  const { fighter1, fighter2, topic, tone, language } = JSON.parse(event.body);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const prompt = `You are writing a ${tone.toLowerCase()} internet-style parody debate between ${fighter1} and ${fighter2} on the topic "${topic}".
Use exaggerated personalities, modern slang, meme references, sarcasm, and surreal logic.
Make it sound like a viral YouTube comment war between two iconic characters.
Each character should speak 5 times, alternating, starting with ${fighter1}.
Format it exactly as:
[${fighter1}]: ...
[${fighter2}]: ...
...
The entire debate should be written in ${language}.`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are simulating a bold, ridiculous, and very funny internet-style fictional debate between two famous characters. Be unpredictable and creative, but safe."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 700,
      temperature: 0.95
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ output: completion.data.choices[0].message.content })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
