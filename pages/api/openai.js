// Import necessary packages
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });
let model = 'gpt-4o';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey:"sk-proj-RjT060HylsmXjtKeYLz8T3BlbkFJrFuKACri0lEweh6JyWr3",
});

// Function to read the financial literacy level from the file
const getFinancialLiteracyLevel = () => {
  try {
    const data = fs.readFileSync(path.resolve(process.cwd(), 'data', 'financial_literacy_level.json'), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading financial literacy level:', error);
    return null;
  }
};

const saveFinancialLiteracyLevel = (level, meaning) => {
  const data = {
    financialLiteracyLevel: level,
    meaning: meaning,
  };

  try {
    const dirPath = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    fs.writeFileSync(path.join(dirPath, 'financial_literacy_level.json'), JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving financial literacy level:', error);
  }
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action, message, questions, responses, multipleChoiceAnswer, subjectiveAnswer } = req.body;

    if (action === 'sendMessage' && message) {
      const data = getFinancialLiteracyLevel();
      if (!data) {
        res.status(500).json({ error: 'Failed to retrieve literacy level' });
        return;
      }

      const { financialLiteracyLevel, meaning } = data;

      const prompt = `You are a professional investor and financial expert. The user is at level ${financialLiteracyLevel} financial literacy. ${meaning} Respond to the following message appropriately: ${message}`;

      try {
        const response = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 150,
          top_p: 1,
        });

        res.status(200).json({ message: response.choices[0].message.content.trim() });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else if (action === 'evaluateLiteracy' && questions && responses) {
      try {
        const userResponses = questions.map((q, index) => ({
          question: q.question,
          response: responses[index],
        }));

        const prompt = userResponses.map(ur => `${ur.question}\nResponse: ${ur.response}`).join('\n\n');

        const response = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'user',
              content: `You are a professional investor and financial expert. Based on the following questionnaire responses, evaluate the user's financial literacy level by assigning a number from 1 (weakest) to 5 (strongest). Use the following criteria:

1. *Level 1 (Weakest)*: Limited or no understanding of basic financial concepts. User struggles with basic budgeting and saving. Likely unfamiliar with investment and debt management.
2. *Level 2*: Basic understanding of financial concepts but limited practical application. User can budget and save but has minimal experience with investments and managing debt.
3. *Level 3 (Intermediate)*: Moderate understanding of financial concepts with some practical experience. User is comfortable with budgeting, saving, and has some knowledge of investments and debt management.
4. *Level 4*: Good understanding of financial concepts with significant practical application. User is proficient in budgeting, saving, investing, and managing debt. Can make informed financial decisions.
5. *Level 5 (Strongest)*: Advanced understanding of financial concepts and extensive practical application. User is highly proficient in all areas of personal finance, including advanced investments and complex financial planning.

No need to write any reason, just give the number. Only and only number, don't say any reason. \n\n${prompt}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 5,
          top_p: 1,
        });

        const level = response.choices[0].message.content.trim();

        let meaning;
        switch (level) {
          case '1':
            meaning = 'Limited or no understanding of basic financial concepts. User struggles with basic budgeting and saving. Likely unfamiliar with investment and debt management.';
            break;
          case '2':
            meaning = 'Basic understanding of financial concepts but limited practical application. User can budget and save but has minimal experience with investments and managing debt.';
            break;
          case '3':
            meaning = 'Moderate understanding of financial concepts with some practical experience. User is comfortable with budgeting, saving, and has some knowledge of investments and debt management.';
            break;
          case '4':
            meaning = 'Good understanding of financial concepts with significant practical application. User is proficient in budgeting, saving, investing, and managing debt. Can make informed financial decisions.';
            break;
          case '5':
            meaning = 'Advanced understanding of financial concepts and extensive practical application. User is highly proficient in all areas of personal finance, including advanced investments and complex financial planning.';
            break;
          default:
            meaning = 'Unknown literacy level.';
            break;
        }

        // Save the level and meaning to a file
        saveFinancialLiteracyLevel(level, meaning);

        res.status(200).json({ message: level });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else if (action === 'generateQuizContent') {
      try {
        const data = getFinancialLiteracyLevel();
        if (!data) {
          res.status(500).json({ error: 'Failed to retrieve literacy level' });
          return;
        }

        const { financialLiteracyLevel, meaning } = data;

        const prompt = `You are a professional investor and financial expert. Create learning content for a user with level ${financialLiteracyLevel} financial literacy on the topic of 'Saving Money'. This level of financial literacy means ${meaning}. Provide three short lectures to teach the concept, followed by a multiple-choice question and a subjective question. Ensure the content is suitable for the user's literacy level. Return the content in the following JSON format:

{
  "Scene1": "Your first scene goes here.",
  "Scene2": "Your second scene goes here.",
  "Scene3": "Your third scene goes here.",
  "MCQ": {
    "Q": "Your multiple-choice question goes here.",
    "A": "Option A",
    "B": "Option B",
    "C": "Option C",
    "D": "Option D"
  },
  "Subjective": "Your subjective question goes here."
}`;

        const response = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
        });

        res.status(200).json({ message: response.choices[0].message.content.trim() });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else if (action === 'evaluateQuiz' && multipleChoiceAnswer && subjectiveAnswer) {
      try {
        const data = getFinancialLiteracyLevel();
        if (!data) {
          res.status(500).json({ error: 'Failed to retrieve literacy level' });
          return;
        }

        const { financialLiteracyLevel, meaning } = data;

        const prompt = `You are a professional investor and financial expert. Evaluate the following answers based on a user with level ${financialLiteracyLevel} financial literacy:

Multiple Choice Question:
Q: What is the primary purpose of a budget?
A: ${multipleChoiceAnswer}

Subjective Question:
Q: Why is it important to save a part of your earnings regularly?
A: ${subjectiveAnswer}

Evaluate the answers and provide feedback on whether the answers are good and explain why.`;

        const response = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
        });

        res.status(200).json({ message: response.choices[0].message.content.trim() });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(400).json({ error: 'Invalid action or missing parameters' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
