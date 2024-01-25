/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const {TextDecoder} = require('util');
const {BedrockRuntimeClient, InvokeModelCommand} = require(
    '@aws-sdk/client-bedrock-runtime');
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require(
    'aws-serverless-express/middleware');
const fs = require('fs');
const path = require('path');
const {defaultProvider} = require('@aws-sdk/credential-provider-node');

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// Load the content of the prompt files at startup
const prompts = {
  SET_THEME: fs.readFileSync(
      path.join(__dirname, 'initial-prompt-set-theme.txt'), 'utf8'),
  CHUNLIAN_GEN: fs.readFileSync(
      path.join(__dirname, 'initial-prompt-chunlian-gen.txt'), 'utf8'),
  CHUNLIAN_REVIEW: fs.readFileSync(
      path.join(__dirname, 'initial-prompt-chunlian-review.txt'), 'utf8'),
};

// Primary Client used for All-hands booth
const reservedClient = new BedrockRuntimeClient();

// Define the role ARNs for your backup accounts
const roleArns = [
  "arn:aws:iam::242129332773:role/BedrockInvokeRole",
  "arn:aws:iam::203443299887:role/BedrockInvokeRole",
  "arn:aws:iam::276545714784:role/BedrockInvokeRole",
  "arn:aws:iam::480709606956:role/BedrockInvokeRole",
  "arn:aws:iam::913758768215:role/BedrockInvokeRole",
  "arn:aws:iam::915526176907:role/BedrockInvokeRole"
];

// Function to assume a role and return credentials
async function assumeRole(roleArn) {
  const stsClient = new STSClient({region: 'your-region'});
  const assumeRoleCommand = new AssumeRoleCommand({
    RoleArn: roleArn,
    RoleSessionName: 'bedrock-session-' +
        Math.random().toString(36).substring(7), // Generate a unique session name
  });

  const response = await stsClient.send(assumeRoleCommand);
  return {
    accessKeyId: response.Credentials.AccessKeyId,
    secretAccessKey: response.Credentials.SecretAccessKey,
    sessionToken: response.Credentials.SessionToken,
  };
}

// Initialize a pool of Bedrock clients
const bedrockClients = roleArns.map((roleArn) => {
  const credentials = defaultProvider({
    roleAssumer: async (sourceCreds, params) => {
      return assumeRole(roleArn);
    },
  });

  const bedrockClient = new BedrockRuntimeClient({
    credentials: credentials,
    region: 'us-west-2',
  });

  return {
    client: bedrockClient,
    identifier: roleArn
  };
});

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
  stop_sequences: ['\n\nHuman:'],
};

/**
 * Invokes the Anthropic Claude 2 model to run an inference using the input
 * provided in the request body.
 *
 * @param current_step
 * @param {string} prompt - The prompt that you want Claude to complete.
 * @param isFromBooth
 * @param bedrockClient
 * @returns {string} The inference response (completion) from the model.
 */
const invokeClaude = async (current_step, prompt,
        isFromBooth, bedrockClient) => {

      // Use the loaded prompt from the prompts object
      const initialPrompt = prompts[current_step];

      if (!initialPrompt) {
        console.log('Invalid step:', current_step);
        return 'Invalid step';
      }

      /* Claude requires you to enclose the prompt as follows: */
      const enclosedPrompt = `Human: ${initialPrompt}\\n\\n${prompt}\n\nAssistant:`;
      const payload = {
        ...modelParameters,
        prompt: enclosedPrompt,
      };

      const command = new InvokeModelCommand({
        body: JSON.stringify(payload),
        contentType: 'application/json',
        accept: 'application/json',
        modelId,
      });

      try {
        const response = await bedrockClient.send(command);
        const decodedResponseBody = new TextDecoder().decode(response.body);

        /** @type {ResponseBody} */
        const responseBody = JSON.parse(decodedResponseBody);

        return responseBody.completion;

      } catch (err) {
        console.error(err);
      }
    }
;

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
app.post('/chunlian-master', async function(req, res) {
  //TODO: edge cases

  console.log('Request body: ', req.body);
  const inputPrompt = req.body.prompt;
  const currentStep = req.body.current_step;
  const isFromBooth = !!req.body.is_from_booth;
  let bedrockClient;
  if (isFromBooth) {
    console.log('isFromBooth is true, using reserved client');
    bedrockClient = reservedClient;
  } else {
    console.log('isFromBooth is false, using backup client');
    const randomIndex = Math.floor(Math.random() * bedrockClients.length);
    const selectedClientInfo = bedrockClients[randomIndex];
    bedrockClient = selectedClientInfo.client
    console.log(`Using Bedrock client with identifier: ${selectedClientInfo.identifier}`);
  }

  let status;
  let result;

  if (currentStep === 'SET_THEME') {
    const completionOfSetTheme = await invokeClaude(currentStep, inputPrompt,
        isFromBooth, bedrockClient);
    console.log('Completion of SET_THEME:', completionOfSetTheme);

    let outputOfSetTheme;
    outputOfSetTheme = extractJson(completionOfSetTheme);

    const promptForChunlianGen = (outputOfSetTheme === undefined
        || outputOfSetTheme.theme === undefined)
        ? inputPrompt // Use customer input as theme as a backup
        : outputOfSetTheme.theme;

    const completionOfChunlianGen = await invokeClaude('CHUNLIAN_GEN',
        promptForChunlianGen, isFromBooth, bedrockClient);
    console.log('Completion of CHUNLIAN_GEN:', completionOfChunlianGen);
    status = 'OK';
    result = completionOfChunlianGen;

  } else if (currentStep === 'CHUNLIAN_REVIEW') {
    const completionOfChunlianReview = await invokeClaude('CHUNLIAN_REVIEW',
        inputPrompt, isFromBooth, bedrockClient);
    console.log('Completion of CHUNLIAN_REVIEW:', completionOfChunlianReview);
    status = 'OK';
    result = completionOfChunlianReview;
  }

  res.json({result: result, status: status});
});

function extractJson(data) {
  // fetch json out incase output is not just a json
  const leftBracketIndex = data.indexOf('{');
  const rightBracketIndex = data.lastIndexOf('}');
  let parseResult;
  if (leftBracketIndex >= 0 && rightBracketIndex >= 0 && leftBracketIndex <
      rightBracketIndex) {
    try {
      parseResult = JSON.parse(
          data.substring(leftBracketIndex, rightBracketIndex + 1),
      );
    } catch (e) {
      console.error('Can\'t parse JSON from: ', data);
    }
  } else {
    console.error('Can\'t parse JSON from: ', data);
  }

  return parseResult;
}

app.post('/chunlian-master/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body});
});

/****************************
 * Example put method *
 ****************************/

app.put('/chunlian-master', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body});
});

app.put('/chunlian-master/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body});
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
  console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
