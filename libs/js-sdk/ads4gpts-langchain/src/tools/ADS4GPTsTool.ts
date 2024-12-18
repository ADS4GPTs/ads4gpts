import { z } from 'zod';
import { StructuredTool } from '@langchain/core/tools';
import { ADS4GPTsAPI } from '../lib/api/ADS4GPTsAPI';
import { CallbackManagerForToolRun } from '@langchain/core/callbacks/manager';
import { RunnableConfig } from '@langchain/core/runnables';
import { BannerAdsPayload } from '../types/bannerAds';
import { ChatAdsPayload } from '../types/chatAds';

export class ADS4GPTsTool extends StructuredTool {
    ads4gptsAPI: ADS4GPTsAPI;
    method: string;
    name: string;
    description: string;
    schema: z.ZodObject<any>;

    constructor(
        ads4gptsAPI: ADS4GPTsAPI,
        method: string,
        description: string,
        schema: z.ZodObject<any>
    ) {
        super();
        this.ads4gptsAPI = ads4gptsAPI;
        this.method = method;
        this.name = method;
        this.description = description;
        this.schema = schema;
    }

    _call(
        arg: z.output<typeof this.schema>,
        _runManager?: CallbackManagerForToolRun,
        _parentConfig?: RunnableConfig
    ): Promise<any> {
        return this.ads4gptsAPI.run(
            this.method,
            arg as BannerAdsPayload | ChatAdsPayload
        );
    }
}
