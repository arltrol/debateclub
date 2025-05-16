// File: netlify/functions/generateDebate.js

const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  const { fighter1, fighter2, topic, tone, language } = JSON.parse(event.body);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const prompt = `Create a ${tone.toLowerCase()} debate between ${fighter1} and ${fighter2} on the topic "${topic}". 
The debate should be written in ${language}. Each character should speak 5 times in alternating order.
Stay in character. Format exactly as:
[${fighter1}]: ...
[${fighter2}]: ...
`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are simulating a fictional debate between two characters. Each will speak 5 times in alternating order. Use the language requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.9
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
