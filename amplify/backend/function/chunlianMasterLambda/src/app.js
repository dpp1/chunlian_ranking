/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0


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


/**
 * @typedef {Object} ResponseBody
 * @property {string} completion
 */

/**
 * Invokes the Anthropic Claude 2 model to run an inference using the input
 * provided in the request body.
 *
 * @param {string} prompt - The prompt that you want Claude to complete.
 * @returns {string} The inference response (completion) from the model.
 */
const invokeClaude = async (prompt) => {
  const client = new BedrockRuntimeClient();

  const modelId = 'anthropic.claude-instant-v1';

  // If the file is in the same directory as your JS file
  const filePath = path.join(__dirname, 'initial-prompt.txt');

// Read the file content
  const initialPrompt = fs.readFileSync(filePath, 'utf8');

  /* Claude requires you to enclose the prompt as follows: */
  const enclosedPrompt = `Human: ${initialPrompt}\\n\\n${prompt}\n\nAssistant:`;

  /* The different model providers have individual request and response formats.
   * For the format, ranges, and default values for Anthropic Claude, refer to:
   * https://docs.anthropic.com/claude/reference/complete_post
   */
  const payload = {
    prompt: enclosedPrompt,
    max_tokens_to_sample: 2048,
    temperature: 0.7,
    top_p: 0.54,
    top_k: 398,
    stop_sequences: [ '\n\nHuman:' ],
  };

  const command = new InvokeModelCommand({
    body: JSON.stringify(payload),
    contentType: 'application/json',
    accept: 'application/json',
    modelId,
  });

  try {
    const response = await client.send(command);
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
 * Example post method *
 ****************************/

app.post('/chunlian-master', async function(req, res) {
  console.log(req.body);
  const prompt = req.body.prompt;
  console.log(`Prompt: ${prompt}`);
  const completion = (prompt !== undefined)
      ? await invokeClaude(prompt)
      : "";
  console.log('Completion:', completion);
  res.json({result: completion})
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
