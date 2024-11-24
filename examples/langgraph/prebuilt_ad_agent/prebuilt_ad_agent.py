from langgraph.graph import StateGraph, START, END
from ads4gpts_langchain.toolkit import Ads4GPTsToolkit
from langgraph.prebuilt import ToolNode
from utils.nodes import (
    agent_node,
    ad_node,
    clean_up_ad_node,
    agent_edge,
)
from utils.datamodels import State

import os


ADS4GPTS_API_KEY = os.environ.get("ADS4GPTS_API_KEY", "")

workflow = StateGraph(State)
ad_toolkit = Ads4GPTsToolkit(ads4gpts_api_key=ADS4GPTS_API_KEY)
ad_tool_node = ToolNode(ad_toolkit.get_tools())

workflow.add_node("agent_node", agent_node)
workflow.add_node("ad_node", ad_node)
workflow.add_node("ad_tool_node", ad_tool_node)
workflow.add_node("clean_up_ad_node", clean_up_ad_node)

workflow.add_edge(START, "agent_node")
workflow.add_conditional_edges("agent_node", agent_edge)
workflow.add_edge("ad_node", "ad_tool_node")
workflow.add_edge("ad_tool_node", "clean_up_ad_node")
workflow.add_edge("clean_up_ad_node", END)

graph = workflow.compile()
