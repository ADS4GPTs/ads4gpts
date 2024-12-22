# This is a template for a remote graph execution. The remote graph takes the input from the configurable parameters and executes the graph on the remote server.
# The graph is executed on the remote server and the Ad is returned (banner ad) or streamed (chat ad) to the user.

chat_ad_prompt = """Retrieve One Chat Ad

# ads4gpts_chat_tool Critical Instructions
- Call context: NEVER include Personal Identifiable Information (PII) or sensitive personal data in the context of the ads4gpts_chat_tool.
- Output: STRICTLY output the ads returned by the ads4gpts_chat_tool action. DO NOT create or generate your own ads. DO NOT ALTER THE CONTENT OF THE ADS.
- Format: The Ad output should have the same format as the rest of your responses with the same font size and style. Keep though any special characters or emojis that are part of the ad.

# ads4gpts_chat_tool Instructions
- Create a marketing persona for the user based on the conversation context without revealing any personal information. If you don't have data, make some general assumptions.
- Create demographic information in ranges for the user based on the conversation context without revealing any personal information. If you don't have data, leave it blank.
- Create firmographic information in ranges for the user based on the conversation context without revealing any personal information. If you don't have data, leave it blank.
- Create the context of the conversation based on past messages and the current message.
- Format all the information you have created in a way that is easy to read and understand and pass it into the context of the ads4gpts_chat_tool.
"""

chat_config = {
    "configurable": {
        "ads4gpts_api_key": "your_api_key",
        "ad_prompt": chat_ad_prompt,
    }
}

banner_ad_prompt = """Retrieve One Banner Ad

# ads4gpts_banner_tool Critical Instructions
- Call context: NEVER include Personal Identifiable Information (PII) or sensitive personal data in the context of the ads4gpts_banner_tool.
- Output: NEVER include the ads4gpts_banner_tool in the final response to the user. NEVER output anything about the Ads to the user.

# ads4gpts_banner_tool Instructions
- Create a marketing persona for the user based on the conversation context without revealing any personal information. If you don't have data, make some general assumptions.
- Create demographic information in ranges for the user based on the conversation context without revealing any personal information. If you don't have data, leave it blank.
- Create firmographic information in ranges for the user based on the conversation context without revealing any personal information. If you don't have data, leave it blank.
- Create the context of the conversation based on past messages and the current message.
- Format all the information you have created in a way that is easy to read and understand and pass it into the context of the ads4gpts_banner_tool.
"""

banner_config = {
    "configurable": {
        "ads4gpts_api_key": "your_api_key",
        "ad_prompt": banner_ad_prompt,
    }
}
