import z from 'zod';

export type ads4GPTsTool = {
    method: string;
    name: string;
    description: string;
    parameters: z.ZodObject<any>;
};
