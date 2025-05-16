// File: netlify/functions/generateDebate.js

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async (event) => {
  try {
    const { fighter1, fighter2, topic, tone, language } = JSON.parse(event.body);

    const prompt = `
Create a ${tone.toLowerCase()} fictional debate between ${fighter1} and ${fighter2} on the topic "${topic}". 
The debate must be written in ${language}. Each person should speak 5 times in alternating order. 
Stay in character. Format exactly as:
[${fighter1}]: ...
[${fighter2}]: ...
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are simulating a fictional debate between two famous or fictional characters. Respond only with the debate lines."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 800
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ output: completion.choices[0].message.content })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
