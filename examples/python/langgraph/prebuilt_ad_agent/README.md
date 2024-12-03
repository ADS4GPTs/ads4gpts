# LangGraph App with the Ads4GPTs Prebuilt Agent

This repository contains code for a conversational agent powered by LangGraph and LangChain, enhanced with Ads4GPTs integration to dynamically generate contextually relevant advertisements during user interactions.

## Overview

The workflow uses a StateGraph to define and manage states and transitions in the conversation. The conversational agent alternates between generating responses and inserting ads based on configurable thresholds.

Core Features

-   Ads Integration: Dynamically generates ads using the Ads4GPTsToolkit.
-   Customizable States: Tracks ad counter to control frequency of Ads.
-   Asynchronous Execution: Nodes utilize asynchronous operations for efficient processing.

## Files

### .env

You need to put your own .env with ADS4GPTS_API_KEY and OPENAI_API_KEY

### langgraph.json

In case you want to use LangGraph Cloud or Studio to run this example.

### prebuilt_ad_agent_nb.ipynb

Notebook for inline execution

### prebuilt_ad_agent.py

Main workflow file defining the StateGraph:

#### Nodes:

-   agent_node: Generates conversational responses.
-   ad_node: Generates context-aware ads.
-   ad_tool_node: Handles Ads4GPT tools.
-   clean_up_ad_node: Removes the Ad messages.

#### Environment Variables:

-   ADS4GPTS_API_KEY: Key for Ads4GPTs integration.
-   AD_FREQUENCY: Determines how often ads appear.

### datamodels.py

Defines the State data structure:

-   messages: Stores chat messages.
-   ad_counter: Tracks the number of interactions since the last ad.

### llms.py

Sets up the conversational agent using LangChain:
Configures a language model (gpt-4o-mini) with custom prompts.

### nodes.py

Contains node logic for the graph:

-   agent_node: Generates user-facing responses.
-   ad_node: Requests ads from Ads4GPTs based on the conversation context.
-   clean_up_ad_node: Removes the last two messages after ad injection.
-   agent_edge: Determines the transition based on ad_counter.

### prompts.py

Defines prompt templates for the conversational agent.

## Usage

### Prerequisites

-   Python 3.11
-   API keys for OpenAI and Ads4GPTs.

### Usage

#### Notebook execution (Preferred)

Go to the prebuilt_ad_agent_nb.ipynb and execute the code inline

#### Local deployment

Prerequisites: Docker installed

-   LangGraph Studio
    Point the Studio to this folder `ads4gpts/examples/python/langgraph/prebuilt_ad_agent`

3. Using the LangGraph CLI:

Clone the main repo and come to this folder

```bash
git clone git@github.com:ADS4GPTs/ads4gpts.git
cd ads4gpts/examples/python/langgraph/prebuilt_ad_agent
```

Install langgraph-cli and run the deployment command.

```bash
pip install langgraph-cli
langgraph up
```
