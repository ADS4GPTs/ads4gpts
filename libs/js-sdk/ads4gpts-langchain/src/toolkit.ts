import { BaseToolkit } from '@langchain/core/tools';
import { ADS4GPTsAPI } from './lib/api/ADS4GPTsAPI';
import { ADS4GPTsTool } from './tools/ADS4GPTsTool';
import tools from './lib/config/toolsConfig';

class ADS4GPTsToolkit implements BaseToolkit {
    private ads4gptsAPI: ADS4GPTsAPI;
    tools: ADS4GPTsTool[];

    constructor({ apiKey }: { apiKey?: string } = {}) {
        this.ads4gptsAPI = new ADS4GPTsAPI(
            apiKey ?? process.env.ADS4GPTS_API_KEY ?? ''
        );

        this.tools = tools.map(
            (tool) =>
                new ADS4GPTsTool(
                    this.ads4gptsAPI,
                    tool.method,
                    tool.description,
                    tool.parameters
                )
        );
    }

    getTools(): ADS4GPTsTool[] {
        return this.tools;
    }
}

export default ADS4GPTsToolkit;
