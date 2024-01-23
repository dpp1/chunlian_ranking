import boto3
import json
from .llm_interface import LLMInterface
from config import BEDROCK_REGION
from initial_prompt.couplet_master import initialPromptForCoupletMaster

class BedrockClaude(LLMInterface):
    """
    For claude v2 model, the prompt must start with "Human:" and end with "Assistant:"
    """

    def __init__(self) -> None:
        self.bedrock_runtime = boto3.client(
            service_name = "bedrock-runtime",
            region_name = BEDROCK_REGION,
        )
        self.modelId="anthropic.claude-v2"

    def couplet_master(self, prompt: str) -> str:
        prompt_config = {
            "prompt": f'\n\nHuman: {initialPromptForCoupletMaster}\n\n{prompt}\n\nAssistant:',
            "max_tokens_to_sample": 2048,
            "temperature": 0.6,
            "top_p": 0.4,
            "top_k": 40
        }
        response = self.bedrock_runtime.invoke_model(
            body=json.dumps(prompt_config),
            modelId="anthropic.claude-instant-v1",
        )
        return json.loads(response.get("body").read()).get("completion")
