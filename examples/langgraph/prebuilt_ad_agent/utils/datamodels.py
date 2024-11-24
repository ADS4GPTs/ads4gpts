from typing import Annotated, List, TypedDict
from langchain_core.messages.base import BaseMessage
from langgraph.graph.message import add_messages


class State(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    ad_counter: int = 0
