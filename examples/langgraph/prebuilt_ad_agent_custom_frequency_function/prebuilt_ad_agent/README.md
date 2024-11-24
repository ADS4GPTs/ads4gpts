# LangGraph App with the Ads4GPTs Prebuilt Agent

This repository contains code for a conversational agent powered by LangGraph and LangChain, enhanced with Ads4GPTs integration to dynamically generate contextually relevant advertisements during user interactions.

## Overview

The workflow uses a StateGraph to define and manage states and transitions in the conversation. The conversational agent alternates between generating responses and inserting ads based on configurable thresholds.

Core Features
- Ads Integration: Dynamically generates ads using the Ads4GPTsToolkit.
- Customizable States: Tracks ad counter to control frequency of Ads.
- Asynchronous Execution: Nodes utilize asynchronous operations for efficient processing.
- Improved UX: Custom and dynamic ad frequence

#### LLM App Design Choice
Ad frequency can be managed effectively in LLM applications with our Ads4GPTs package. In this example we utilize the Fibonacci sequence to balance monetization and user experience. This approach provides a structured and adaptable method for serving ads.

How It Works:
- Ads are shown at intervals based on the Fibonacci sequence, starting with smaller numbers.
- After each ad, the next number in the sequence determines the interval for the following ad.
- This results in more frequent ads early on, ensuring revenue generation, while intervals become longer over time, reducing disruption for engaged users.
This method brings a balance between maintaining revenue flow and providing a non-intrusive user experience. But you can implement your own!

## Files

### utils.py

It has the next_fibonacci_number function that we use to calculate the next ad_frequency number.

### langgraph.json

In case you want to use LangGraph Cloud or Studio to run this example.

### prebuilt_ad_agent_nb.ipynb

Notebook for inline execution

### prebuilt_ad_agent.py

Main workflow file defining the StateGraph:

#### Nodes:
- agent_node: Generates conversational responses.
- ad_node: Generates context-aware ads.
- ad_tool_node: Handles Ads4GPT tools.
- clean_up_ad_node: Removes the Ad messages.

#### Environment Variables:
- ADS4GPTS_API_KEY: Key for Ads4GPTs integration.

### datamodels.py
Defines the State data structure:
- messages: Stores chat messages.
- ad_counter: Tracks the number of interactions since the last ad.
- ad_frequency: How ofter the user should see ads. It changes dynamically through the course of the session

### llms.py
Sets up the conversational agent using LangChain:
Configures a language model (gpt-4o-mini) with custom prompts.

### nodes.py
Contains node logic for the graph:
- agent_node: Generates user-facing responses.
- ad_node: Requests ads from Ads4GPTs based on the conversation context.
- clean_up_ad_node: Removes the last two messages after ad injection.
- agent_edge: Determines the transition based on ad_counter.

### prompts.py
Defines prompt templates for the conversational agent.

## Usage

### Prerequisites
- Python 3.11
- API keys for OpenAI and Ads4GPTs.

### Installation

```bash
pip install ads4gpts-langchain, langchain-openai, langgraph, langchain
```

### Usage

1. Notebook execution (Preferred):
  Go to the prebuilt_ad_agent_nb.ipynb and execute the code inline
2. LangGraph Studio
3. Using the LangGraph CLI:
```bash
pip install langgraph-cli
langgraph up
```
