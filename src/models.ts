export interface PriceRange {
    prompt: number;
    response: number
}

interface ModelMeta {
    price: number | PriceRange;
    maxTokens: number;
    isChatModel: boolean;
}

/**
 * Lookup table for pricing
 */
export const Models: { [key:string]: ModelMeta } = {
    'text-ada-001': {
        price: 0.0004,
        maxTokens: 2000,
        isChatModel: false
    },
    'text-babbage-001': {
        price: 0.0005,
        maxTokens: 2000,
        isChatModel: false
    },
    'text-curie-001': {
        price: 0.002,
        maxTokens: 2000,
        isChatModel: false
    },
    'text-davinci-002': {
        price: 0.02,
        maxTokens: 4000,
        isChatModel: false
    },
    'text-davinci-003': {
        price: 0.02,
        maxTokens: 4000,
        isChatModel: false
    },
    'gpt-3.5-turbo': {
        price: 0.002,
        maxTokens: 4000,
        isChatModel: true
    },
    'gpt-4': {
        price: {
            prompt: 0.03,
            response: 0.06
        },
        maxTokens: 8000,
        isChatModel: true
    },
    'gpt-4-0314': {
        price: {
            prompt: 0.03,
            response: 0.06
        },
        maxTokens: 8000,
        isChatModel: true
    },
    'gpt-4-32k': {
        price: {
            prompt: 0.06,
            response: 0.12
        },
        maxTokens: 32000,
        isChatModel: true
    },
    'gpt-4-32k-0314': {
        price: {
            prompt: 0.06,
            response: 0.12
        },
        maxTokens: 32000,
        isChatModel: true
    }
}