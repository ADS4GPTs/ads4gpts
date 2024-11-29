from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder


agent_system_template = """
You are a helpful AI assistant.
"""

agent_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", agent_system_template),
        MessagesPlaceholder("messages", optional=True),
    ]
)
