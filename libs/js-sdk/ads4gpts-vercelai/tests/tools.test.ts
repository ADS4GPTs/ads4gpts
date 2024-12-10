// import { ads4gptsBannerTool, ads4gptsChatTool } from '../src/tools';

// describe('Ads4GPTs Tools', () => {
//     const API_KEY = 'test-api-key';
//     const mockToolExecutionOptions = {
//         toolCallId: 'test-tool-call-id',
//         messages: [
//             {
//                 role: 'user' as 'user',
//                 content: 'What are the best travel deals?',
//             },
//             {
//                 role: 'system' as 'system',
//                 content: 'Fetching ads for travel deals...',
//             },
//         ],
//         abortSignal: new AbortController().signal,
//     };

//     beforeEach(() => {
//         global.fetch = jest.fn();
//     });

//     afterEach(() => {
//         jest.restoreAllMocks();
//     });

//     describe('ads4gptsBannerTool', () => {
//         it('should return a single ad object when num_ads is 1 and response is a single object', async () => {
//             const mockResponse = {
//                 status: 'success',
//                 data: {
//                     ads: {
//                         creative: 'Creative Content',
//                         header: 'Ad Header',
//                         copy: 'Ad Copy',
//                         cta_link: 'https://example.com',
//                     },
//                 },
//             };

//             (global.fetch as jest.Mock).mockResolvedValueOnce({
//                 ok: true,
//                 json: async () => mockResponse,
//             });

//             const bannerTool = ads4gptsBannerTool(API_KEY);
//             const result = await bannerTool.execute(
//                 { context: 'test-context', num_ads: 1 },
//                 mockToolExecutionOptions
//             );

//             expect(result).toEqual({
//                 creative: 'Creative Content',
//                 header: 'Ad Header',
//                 copy: 'Ad Copy',
//                 cta_link: 'https://example.com',
//             });
//         });

//         it('should return a single ad object when num_ads is 1 and response is an array with one item', async () => {
//             const mockResponse = {
//                 status: 'success',
//                 data: {
//                     ads: [
//                         {
//                             creative: 'Creative Content',
//                             header: 'Ad Header',
//                             copy: 'Ad Copy',
//                             cta_link: 'https://example.com',
//                         },
//                     ],
//                 },
//             };

//             (global.fetch as jest.Mock).mockResolvedValueOnce({
//                 ok: true,
//                 json: async () => mockResponse,
//             });

//             const bannerTool = ads4gptsBannerTool(API_KEY);
//             const result = await bannerTool.execute(
//                 { context: 'test-context', num_ads: 1 },
//                 mockToolExecutionOptions
//             );

//             expect(result).toEqual({
//                 creative: 'Creative Content',
//                 header: 'Ad Header',
//                 copy: 'Ad Copy',
//                 cta_link: 'https://example.com',
//             });
//         });

//         it('should return multiple ads when num_ads is greater than 1', async () => {
//             const mockResponse = {
//                 status: 'success',
//                 data: {
//                     ads: [
//                         {
//                             creative: 'Creative Content 1',
//                             header: 'Ad Header 1',
//                             copy: 'Ad Copy 1',
//                             cta_link: 'https://example1.com',
//                         },
//                         {
//                             creative: 'Creative Content 2',
//                             header: 'Ad Header 2',
//                             copy: 'Ad Copy 2',
//                             cta_link: 'https://example2.com',
//                         },
//                     ],
//                 },
//             };

//             (global.fetch as jest.Mock).mockResolvedValueOnce({
//                 ok: true,
//                 json: async () => mockResponse,
//             });

//             const bannerTool = ads4gptsBannerTool(API_KEY);
//             const result = await bannerTool.execute(
//                 { context: 'test-context', num_ads: 2 },
//                 mockToolExecutionOptions
//             );

//             expect(result).toEqual([
//                 {
//                     creative: 'Creative Content 1',
//                     header: 'Ad Header 1',
//                     copy: 'Ad Copy 1',
//                     cta_link: 'https://example1.com',
//                 },
//                 {
//                     creative: 'Creative Content 2',
//                     header: 'Ad Header 2',
//                     copy: 'Ad Copy 2',
//                     cta_link: 'https://example2.com',
//                 },
//             ]);
//         });
//     });

//     describe('ads4gptsChatTool', () => {
//         it('should return a single ad object when num_ads is 1 and response is a single object', async () => {
//             const mockResponse = {
//                 status: 'success',
//                 data: {
//                     ads: {
//                         ad_text: 'Chat Ad Text',
//                         ad_link: 'https://chat.example.com',
//                     },
//                 },
//             };

//             (global.fetch as jest.Mock).mockResolvedValueOnce({
//                 ok: true,
//                 json: async () => mockResponse,
//             });

//             const chatTool = ads4gptsChatTool(API_KEY);
//             const result = await chatTool.execute(
//                 { context: 'test-context', num_ads: 1 },
//                 mockToolExecutionOptions
//             );

//             expect(result).toEqual({
//                 ad_text: 'Chat Ad Text',
//                 ad_link: 'https://chat.example.com',
//             });
//         });

//         it('should return a single ad object when num_ads is 1 and response is an array with one item', async () => {
//             const mockResponse = {
//                 status: 'success',
//                 data: {
//                     ads: [
//                         {
//                             ad_text: 'Chat Ad Text',
//                             ad_link: 'https://chat.example.com',
//                         },
//                     ],
//                 },
//             };

//             (global.fetch as jest.Mock).mockResolvedValueOnce({
//                 ok: true,
//                 json: async () => mockResponse,
//             });

//             const chatTool = ads4gptsChatTool(API_KEY);
//             const result = await chatTool.execute(
//                 { context: 'test-context', num_ads: 1 },
//                 mockToolExecutionOptions
//             );

//             expect(result).toEqual({
//                 ad_text: 'Chat Ad Text',
//                 ad_link: 'https://chat.example.com',
//             });
//         });

//         it('should return multiple ads when num_ads is greater than 1', async () => {
//             const mockResponse = {
//                 status: 'success',
//                 data: {
//                     ads: [
//                         {
//                             ad_text: 'Chat Ad Text 1',
//                             ad_link: 'https://chat1.example.com',
//                         },
//                         {
//                             ad_text: 'Chat Ad Text 2',
//                             ad_link: 'https://chat2.example.com',
//                         },
//                     ],
//                 },
//             };

//             (global.fetch as jest.Mock).mockResolvedValueOnce({
//                 ok: true,
//                 json: async () => mockResponse,
//             });

//             const chatTool = ads4gptsChatTool(API_KEY);
//             const result = await chatTool.execute(
//                 { context: 'test-context', num_ads: 2 },
//                 mockToolExecutionOptions
//             );

//             expect(result).toEqual([
//                 {
//                     ad_text: 'Chat Ad Text 1',
//                     ad_link: 'https://chat1.example.com',
//                 },
//                 {
//                     ad_text: 'Chat Ad Text 2',
//                     ad_link: 'https://chat2.example.com',
//                 },
//             ]);
//         });
//     });
// });

import { ads4gptsBannerTool, ads4gptsChatTool } from '../src/tools';

describe('Ads4GPTs Tools', () => {
    const API_KEY = 'test-api-key';
    const mockToolExecutionOptions = {
        toolCallId: 'test-tool-call-id',
        messages: [
            {
                role: 'user' as 'user',
                content: 'What are the best travel deals?',
            },
            {
                role: 'system' as 'system',
                content: 'Fetching ads for travel deals...',
            },
        ],
        abortSignal: new AbortController().signal,
    };

    beforeEach(() => {
        global.fetch = jest.fn();
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('ads4gptsBannerTool', () => {
        it('should log and throw an error if fetching banner ads fails', async () => {
            const errorMessage = 'Network error';
            (global.fetch as jest.Mock).mockRejectedValue(
                new Error(errorMessage)
            );

            const bannerTool = ads4gptsBannerTool(API_KEY);

            await expect(
                bannerTool.execute(
                    { context: 'test-context', num_ads: 1 },
                    mockToolExecutionOptions
                )
            ).rejects.toThrow(
                `ads4gpts_banner_tool failed: Failed to fetch after 5 attempts: ${errorMessage}`
            );

            // Verify all retry logs
            expect(console.error).toHaveBeenNthCalledWith(
                1,
                `Fetch attempt 1/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                2,
                `Fetch attempt 2/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                3,
                `Fetch attempt 3/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                4,
                `Fetch attempt 4/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                5,
                `Fetch attempt 5/5 failed: ${errorMessage}`
            );

            // Verify final error log from the tool
            expect(console.error).toHaveBeenLastCalledWith(
                `Error retrieving banner ads: Failed to fetch after 5 attempts: ${errorMessage}`
            );
        });
    });

    describe('ads4gptsChatTool', () => {
        it('should log and throw an error if fetching chat ads fails', async () => {
            const errorMessage = 'Timeout error';
            (global.fetch as jest.Mock).mockRejectedValue(
                new Error(errorMessage)
            );

            const chatTool = ads4gptsChatTool(API_KEY);

            await expect(
                chatTool.execute(
                    { context: 'test-context', num_ads: 1 },
                    mockToolExecutionOptions
                )
            ).rejects.toThrow(
                `ads4gpts_chat_tool failed: Failed to fetch after 5 attempts: ${errorMessage}`
            );

            // Verify all retry logs
            expect(console.error).toHaveBeenNthCalledWith(
                1,
                `Fetch attempt 1/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                2,
                `Fetch attempt 2/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                3,
                `Fetch attempt 3/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                4,
                `Fetch attempt 4/5 failed: ${errorMessage}`
            );
            expect(console.error).toHaveBeenNthCalledWith(
                5,
                `Fetch attempt 5/5 failed: ${errorMessage}`
            );

            // Verify final error log from the tool
            expect(console.error).toHaveBeenLastCalledWith(
                `Error retrieving chat ads: Failed to fetch after 5 attempts: ${errorMessage}`
            );
        });
    });
});
