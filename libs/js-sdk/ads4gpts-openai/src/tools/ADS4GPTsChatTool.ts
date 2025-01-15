import { ChatAdData, ChatAdsPayload } from '../types/chatAds';

// Chat tool
import { ADS4GPTsTool } from './ADS4GPTsTool';

export class ADS4GPTsChatTool extends ADS4GPTsTool<
    ChatAdsPayload,
    ChatAdData | ChatAdData[]
> {
    constructor(args: { apiKey?: string; baseUrl?: string } = {}) {
        super(args, 'ads4gpts_chat_tool', false);
    }
}
