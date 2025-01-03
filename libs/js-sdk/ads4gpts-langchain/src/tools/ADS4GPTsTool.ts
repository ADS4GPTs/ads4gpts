import { z } from 'zod';
import { StructuredTool } from '@langchain/core/tools';
import { ADS4GPTsAPI } from '../lib/api/ADS4GPTsAPI';
import { CallbackManagerForToolRun } from '@langchain/core/callbacks/manager';
import { RunnableConfig } from '@langchain/core/runnables';
import { BannerAdsPayload } from '../types/bannerAds';
import { ChatAdsPayload } from '../types/chatAds';

export class ADS4GPTsTool extends StructuredTool {
    ads4gptsAPI: ADS4GPTsAPI;
    url: string;
    name: string;
    description: string;
    schema: z.ZodObject<any>;

    constructor(
        ads4gptsAPI: ADS4GPTsAPI,
        name: string,
        url: string,
        description: string,
        schema: z.ZodObject<any>
    ) {
        super();
        this.ads4gptsAPI = ads4gptsAPI;
        this.url = url;
        this.name = name;
        this.description = description;
        this.schema = schema;
    }

    _call(
        arg: z.output<typeof this.schema>,
        _runManager?: CallbackManagerForToolRun,
        _parentConfig?: RunnableConfig
    ): Promise<string> {
        return this.ads4gptsAPI.run(
            this.url,
            arg as BannerAdsPayload | ChatAdsPayload
        );
    }
}
