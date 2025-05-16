const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const { fighter1, fighter2, topic, tone, language } = body;

  const prompt = `
Create a ${tone.toLowerCase()} fictional debate in ${language} between ${fighter1} and ${fighter2} on the topic "${topic}".

Each fighter should speak 5 times, alternating turns.
IMPORTANT: The entire debate must be written in ${language}, including punctuation, idioms, and tone.

Use this format exactly:
[${fighter1}]: ...
[${fighter2}]: ...
[${fighter1}]: ...
[${fighter2}]: ...
(continue alternating until each has spoken 5 times)
`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are simulating a fictional debate. Respond entirely in ${language}.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 900,
      temperature: 0.9,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        output: completion.data.choices[0].message.content,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
