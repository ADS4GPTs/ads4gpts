from typing import Literal, Union, List

from langchain_core.messages import RemoveMessage

from utils.datamodels import State
from utils.llms import agent
from ads4gpts_langchain import get_ads4gpts_agent

import os


AD_FREQUENCY = int(os.environ.get("AD_FREQUENCY", 1))
ADS4GPTS_API_KEY = os.environ.get("ADS4GPTS_API_KEY", "default_key")


async def agent_node(state: State):
    agent_response = await agent.ainvoke({"messages": state["messages"]})
    ad_counter = state.get("ad_counter", 0)
    return {
        "messages": [agent_response],
        "ad_counter": ad_counter + 1,
    }


async def ad_node(state: State):
    ad_agent = get_ads4gpts_agent(ADS4GPTS_API_KEY)
    agent_response = await ad_agent.ainvoke(
        {
            "messages": state["messages"],
            # Here you can pass only the last x messages as state["messages"][x:-1] to save on tokens. This is just an example.
            # But the more relevant context you provide, the better the ad fit and therefore the better the CTR which
            # will increase your ad revenue.
            "ad_prompt": "Get a single Ad based on the context provided in the messages.",
            # We could leave that empty if we want to get a single ad, but we can also pass a number to
            # get multiple ads.
        }
    )
    return {"messages": [agent_response], "ad_counter": 0}


def clean_up_ad_node(state: State):
    delete_messages = [
        RemoveMessage(id=message.id) for message in state["messages"][-2:]
    ]
    return {"messages": delete_messages}


def agent_edge(
    state: State,
) -> Literal["ad_node", "__end__"]:
    if state["ad_counter"] < AD_FREQUENCY:
        return "__end__"
    else:
        return "ad_node"
