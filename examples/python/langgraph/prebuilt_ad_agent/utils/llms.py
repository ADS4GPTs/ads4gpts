from langchain_openai import ChatOpenAI
from utils.prompts import agent_prompt

agent_llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)

agent = agent_prompt | agent_llm
