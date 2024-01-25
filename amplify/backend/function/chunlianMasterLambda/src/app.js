/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const { TextDecoder } = require('util');
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const fs = require('fs');
const path = require('path');

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// Load the content of the prompt files at startup
const prompts = {
  SET_THEME: fs.readFileSync(path.join(__dirname, 'initial-prompt-set-theme.txt'), 'utf8'),
  CHUNLIAN_GEN: fs.readFileSync(path.join(__dirname, 'initial-prompt-chunlian-gen.txt'), 'utf8'),
  CHUNLIAN_REVIEW: fs.readFileSync(path.join(__dirname, 'initial-prompt-chunlian-review.txt'), 'utf8'),
};

const bedrockRuntimeClient = new BedrockRuntimeClient();
const modelId = 'anthropic.claude-instant-v1';
/* The different model providers have individual request and response formats.
   * For the format, ranges, and default values for Anthropic Claude, refer to:
   * https://docs.anthropic.com/claude/reference/complete_post
   */
const modelParameters = {
  max_tokens_to_sample: 2048,
  temperature: 0.7,
  top_p: 0.54,
  top_k: 398,
  stop_sequences: [ '\n\nHuman:' ],
};

/**
 * Invokes the Anthropic Claude 2 model to run an inference using the input
 * provided in the request body.
 *
 * @param current_step
 * @param {string} prompt - The prompt that you want Claude to complete.
 * @returns {string} The inference response (completion) from the model.
 */
const invokeClaude = async (current_step, prompt) => {
  // Use the loaded prompt from the prompts object
  const initialPrompt = prompts[current_step];

  if (!initialPrompt) {
    console.log("Invalid step:", current_step);
    return "Invalid step";
  }

  /* Claude requires you to enclose the prompt as follows: */
  const enclosedPrompt = `Human: ${initialPrompt}\\n\\n${prompt}\n\nAssistant:`;
  const payload = {
    ...modelParameters,
    prompt: enclosedPrompt
  }

  const command = new InvokeModelCommand({
    body: JSON.stringify(payload),
    contentType: 'application/json',
    accept: 'application/json',
    modelId,
  });

  try {
    const response = await bedrockRuntimeClient.send(command);
    const decodedResponseBody = new TextDecoder().decode(response.body);

    /** @type {ResponseBody} */
    const responseBody = JSON.parse(decodedResponseBody);

    return responseBody.completion;

  } catch (err) {
    console.error(err);
  }
};

/**********************
 * Example get method *
 **********************/

app.get('/chunlian-master', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/chunlian-master/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
 * POST Method to for Chunlian Master actions*
 ****************************/

/**
 * Tries to find and parse the first JSON object in a string.
 *
 * @param {string} text - The string to parse.
 * @returns {{parsedJson: Object|null, isValid: boolean}} An object containing the parsed JSON and a validity flag.
 */
function parseFirstJson(text) {
  try {
    // Regex to match the first JSON object
    const jsonMatch = text.match(/{.*?}/);
    if (jsonMatch && jsonMatch[0]) {
      return {
        parsedJson: JSON.parse(jsonMatch[0]),
        isValid: true
      };
    }
    return { parsedJson: null, isValid: false };
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return { parsedJson: null, isValid: false };
  }
}

app.post('/chunlian-master', async function(req, res) {
  //TODO: edge cases
  console.log(req.body);
  const inputPrompt = req.body.prompt;
  const current_step = req.body.current_step;
  let status;
  let result;

  if (current_step === 'SET_THEME') {
    const completionOfSetTheme = await invokeClaude(current_step, inputPrompt);
    console.log('Completion of SET_THEME:', completionOfSetTheme);
    const { parsedJson, isValid } = parseFirstJson(completionOfSetTheme);

    const outputOfSetTheme = JSON.parse(completionOfSetTheme);
    if (!isValid || !parsedJson || !parsedJson.theme) {
      status = 'ERROR';
      console.error('Invalid or missing theme in output of SET_THEME', completionOfSetTheme);
    } else {
      const completionOfChunlianGen = await invokeClaude('CHUNLIAN_GEN', outputOfSetTheme.theme);
      console.log('Completion of CHUNLIAN_GEN:', completionOfChunlianGen);
      status = 'OK';
      result = completionOfChunlianGen;
    }
  } else if (current_step === 'CHUNLIAN_REVIEW') {
    const completionOfChunlianReview = await invokeClaude('CHUNLIAN_REVIEW', inputPrompt);
    console.log('Completion of CHUNLIAN_REVIEW:', completionOfChunlianReview);
    status = 'OK';
    result = completionOfChunlianReview;
  }

  res.json({result: result, status: status});
});

app.post('/chunlian-master/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
 * Example put method *
 ****************************/

app.put('/chunlian-master', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/chunlian-master/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
 * Example delete method *
 ****************************/

app.delete('/chunlian-master', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/chunlian-master/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
