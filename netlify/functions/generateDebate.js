// File: netlify/functions/generateDebate.js

const { Configuration, OpenAIApi } = require("openai");

exports.handler = async (event) => {
  const { fighter1, fighter2, topic, tone } = JSON.parse(event.body);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const prompt = `Create a ${tone.toLowerCase()} debate between ${fighter1} and ${fighter2} on the topic "${topic}". 
  Each character should speak 5 times. Make it funny, engaging, and in-character. Format as:
  [${fighter1}]: ...\n[${fighter2}]: ...\n...`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are simulating a fictional debate between two famous characters. Each will speak 5 times in alternating order, in character, and based on the tone requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 700,
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
