import { BannerAdsInputSchema } from '../../schemas/bannerAds';
import { ChatAdsInputSchema } from '../../schemas/chatAds';

const bannerDescription = `
This tool will retrieve relevant Banner Ads based on the provided context.

Arguments:
- context (string): The context to help retrieve the most relevant ads.
- num_ads (number, optional): Number of ads to retrieve. Defaults to 1.
`;

const chatDescription = `
This tool will retrieve relevant Chat Ads based on the provided context.

Arguments:
- context (string): The context to help retrieve the most relevant ads.
- num_ads (number, optional): Number of ads to retrieve. Defaults to 1.
`;

const tools = [
    {
        url: '/api/v1/banner_ads',
        name: 'ads4gpts_banner_tool',
        description: bannerDescription,
        parameters: BannerAdsInputSchema,
    },
    {
        url: '/api/v1/chat_ads',
        name: 'ads4gpts_chat_tool',
        description: chatDescription,
        parameters: ChatAdsInputSchema,
    },
];

export default tools;
