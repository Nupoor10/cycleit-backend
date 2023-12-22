const cohere = require('cohere-ai');
const dotenv = require('dotenv');

dotenv.config();
const cohereApiKey = process.env.COHERE_KEY;

const getCohereResponse = async(givenPrompt) => {
    try {  
        cohere.init(cohereApiKey);
        const response = await cohere.generate({
            model: 'command-nightly',
            prompt: givenPrompt,
            max_tokens: 500,
            temperature: 0.9,
            k: 0,
            p: 0.75,
            stop_sequences: [],
            return_likelihoods: 'NONE'
          });

        return response?.body?.generations[0]?.text;
    } catch(error) {
        console.error(error);
    }
}

module.exports = getCohereResponse;

