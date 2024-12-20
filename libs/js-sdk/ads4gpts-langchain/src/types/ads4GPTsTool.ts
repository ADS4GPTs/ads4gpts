import z from 'zod';

export type ads4GPTsTool = {
    url: string;
    name: string;
    description: string;
    parameters: z.ZodObject<any>;
};
