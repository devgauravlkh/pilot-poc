import express from 'express';
import OpenAI from "openai";
import { environment } from './env';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const openai = new OpenAI({ apiKey: environment.OpenAiAPIKey });

app.get('/', (req, res) => {
  res.send({ message: 'Server Running' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

app.get('/result', (req, res) => {
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
  const content = `You are a financial planner preparing to meet with a prospective client. The client you are meeting with is a ${client.occupation}, ${client.lifestage}, ${client.maritalStatus} individual with ${client.children} and ${client.parents}, and has ${client.savings}. Your task is to generate a note outlining the client's main concerns, questions to ask during the meeting, and documents to request from the client to bring with them. The concerns, questions, and documents should be tailored to the client's specific profile.
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
      }
    ],
    model: "gpt-3.5-turbo-0125"
  });
  return completion?.choices[0];
}