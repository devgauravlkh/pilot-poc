import express from 'express';
import OpenAI from "openai";

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
console.log(" => process.env.OpenAiAPIKey: ", process.env.OpenAiAPIKey);
const openai = new OpenAI({ apiKey: process.env.OpenAiAPIKey });

// Parse JSON bodies
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send({ message: 'Server Running' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

app.post('/result', (req, res) => {
  const clientDetails = req?.body;
  // const clientDetails = {
  //   occupation    : "farmer/rancher",
  //   lifestage     : "approaching retirement",
  //   maritalStatus : "married",
  //   children      : "dependent children",
  //   parents       : "aging parents",
  //   savings       : "$2MM-$10MM"
  // }
  generateFinPlanNote(clientDetails)
    .then(note => {
      res.send({ message: note });
    })
    .catch(error => {
      console.error(error)
    });
});

async function generateFinPlanNote(client) {
  const occupation = client.facts.find((fact: any) => fact.name === 'Occupation')?.value;
  const lifestage = client.facts.find((fact: any) => fact.name === 'Life Stage')?.value;
  const maritalStatus = client.facts.find((fact: any) => fact.name === 'Marital Status')?.value;
  const children = client.facts.find((fact: any) => fact.name === 'Children')?.value;
  const parents = client.facts.find((fact: any) => fact.name === 'Parents')?.value;
  const savings = client.facts.find((fact: any) => fact.name === 'Savings')?.value;
  const content = `You are a financial planner preparing to meet with a prospective client. The client you are meeting with is a ${occupation}, ${lifestage}, ${maritalStatus} individual with ${children} and ${parents}, and has ${savings}. Your task is to generate a note outlining the client's main concerns, questions to ask during the meeting, and documents to request from the client to bring with them. The concerns, questions, and documents should be tailored to the client's specific profile.
    Please generate:
    1. **Concerns**:
    2. **Questions**:
    3. **Documents to Bring**:
    `;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output HTML.",
      },
      { role: "user", content: content },
      {
        role: "user",
        content: "Note output should be valid HTML only.",
      },
      {
        role: "user",
        content: "Note I need information presented in a clean HTML format suitable for direct use in web content. Please do not include any markdown or code block characters such as ``` around the HTML content. The information should be structured with proper HTML tags, including doctype, html, head, and body sections. It should be ready to be inserted into a webpage as is.",
      }
    ],
    model: "gpt-3.5-turbo-0125"
  });
  return completion?.choices[0];
}
