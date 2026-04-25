import { Type } from '@google/genai'

import { gemini } from './gemini'
import {
  generatedFlashcardsSchema,
  type GeneratedFlashcard,
} from './ai.schemas'

const MODEL = 'gemini-2.5-flash'

const responseSchema = {
  type: Type.ARRAY,
  minItems: 3,
  maxItems: 3,
  items: {
    type: Type.OBJECT,
    properties: {
      frontsideText: {
        type: Type.STRING,
        description: 'Concise question or term shown on the front of the card.',
      },
      backsideText: {
        type: Type.STRING,
        description: 'Concise answer or definition shown on the back.',
      },
      hint: {
        type: Type.STRING,
        description: 'Optional short cue to help recall the answer.',
      },
    },
    propertyOrdering: ['frontsideText', 'backsideText', 'hint'],
    required: ['frontsideText', 'backsideText'],
  },
}

export async function generateFlashcards(
  prompt: string
): Promise<GeneratedFlashcard[]> {
  const instruction = [
    'Generate exactly 3 flashcards on the topic described by the user.',
    'Front = concise question or term.',
    'Back = concise answer or definition.',
    'Hint = optional short cue (omit if not useful).',
    `Topic: ${prompt}`,
  ].join('\n')

  const response = await gemini.models.generateContent({
    model: MODEL,
    contents: instruction,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: responseSchema,
    },
  })

  const text = response.text
  if (!text) {
    throw new Error('Gemini returned an empty response')
  }

  const parsed = JSON.parse(text)
  return generatedFlashcardsSchema.parse(parsed)
}
