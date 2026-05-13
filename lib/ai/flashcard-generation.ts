import { Type } from '@google/genai'

import { searchUnsplashPhotos } from '@/lib/unsplash'
import { gemini } from './gemini'
import {
  flashcardTypeSchema,
  generatedFlashcardsSchema,
  type FlashcardType,
  type GeneratedFlashcard,
} from './ai.schemas'

const MODEL = 'gemini-2.5-flash-lite'

const IMAGE_INTENT_RE =
  /\b(image|images|picture|pictures|photo|photos|visual|visuals)\b/i

const INSTRUCTIONS_BY_TYPE: Record<FlashcardType, string> = {
  vocabulary:
    'Front = word or phrase in the source language. Back = translation, with a short usage example when helpful. Hint = pronunciation or category cue when useful.',
  definitions:
    'Front = term. Back = concise definition. Hint = mnemonic or category cue when useful.',
  qa: 'Front = question. Back = concise answer. Hint = a short cue toward the answer when useful.',
  other:
    'Front = concise question or term. Back = concise answer or definition. Hint = optional short cue.',
}

const cardItemProperties = {
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
  imageSearchQuery: {
    type: Type.STRING,
    description:
      'Short 1-3 word concrete English noun phrase suitable for an Unsplash photo search representing this card.',
  },
}

function buildFlashcardsResponseSchema(includeImageQuery: boolean) {
  const properties = includeImageQuery
    ? cardItemProperties
    : {
        frontsideText: cardItemProperties.frontsideText,
        backsideText: cardItemProperties.backsideText,
        hint: cardItemProperties.hint,
      }

  const required = includeImageQuery
    ? ['frontsideText', 'backsideText', 'imageSearchQuery']
    : ['frontsideText', 'backsideText']

  const propertyOrdering = includeImageQuery
    ? ['frontsideText', 'backsideText', 'hint', 'imageSearchQuery']
    : ['frontsideText', 'backsideText', 'hint']

  return {
    type: Type.ARRAY,
    minItems: 3,
    maxItems: 3,
    items: {
      type: Type.OBJECT,
      properties,
      propertyOrdering,
      required,
    },
  }
}

const classifyResponseSchema = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      enum: ['vocabulary', 'definitions', 'qa', 'other'],
      description: 'The kind of flashcards best suited to the user prompt.',
    },
  },
  required: ['type'],
}

async function classifyPrompt(prompt: string): Promise<FlashcardType> {
  const instruction = [
    'Classify the following flashcard prompt into one of these categories:',
    '- vocabulary: learning words or phrases of a language (term + translation).',
    '- definitions: terms paired with their definitions (concepts, glossaries, exam terminology).',
    '- qa: question/answer recall (facts, dates, trivia, exam questions).',
    '- other: anything that does not clearly fit the categories above.',
    `Prompt: ${prompt}`,
  ].join('\n')

  const response = await gemini.models.generateContent({
    model: MODEL,
    contents: instruction,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: classifyResponseSchema,
    },
  })

  const text = response.text
  if (!text) {
    throw new Error('Gemini returned an empty classification response')
  }

  const parsed = JSON.parse(text)
  return flashcardTypeSchema.parse(parsed.type)
}

async function generateCards(
  prompt: string,
  type: FlashcardType,
  wantsImages: boolean
): Promise<GeneratedFlashcard[]> {
  const instruction = [
    'Generate exactly 3 flashcards on the topic described by the user.',
    INSTRUCTIONS_BY_TYPE[type],
    wantsImages
      ? 'Also include an imageSearchQuery for each card: a short 1-3 word concrete English noun phrase suitable for finding a representative photo on Unsplash. Prefer tangible objects or scenes over abstract terms.'
      : null,
    `Topic: ${prompt}`,
  ]
    .filter(Boolean)
    .join('\n')

  const response = await gemini.models.generateContent({
    model: MODEL,
    contents: instruction,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: buildFlashcardsResponseSchema(wantsImages),
    },
  })

  const text = response.text
  if (!text) {
    throw new Error('Gemini returned an empty response')
  }

  const parsed = JSON.parse(text)
  return generatedFlashcardsSchema.parse(parsed)
}

async function findImageUrl(query: string): Promise<string | null> {
  try {
    const results = await searchUnsplashPhotos(query, 1)
    return results[0]?.smallUrl ?? null
  } catch {
    return null
  }
}

async function attachImages(
  cards: GeneratedFlashcard[],
  type: FlashcardType
): Promise<GeneratedFlashcard[]> {
  const useBackside = type === 'qa'

  return Promise.all(
    cards.map(async (card) => {
      const fallback = useBackside ? card.backsideText : card.frontsideText
      const query = card.imageSearchQuery?.trim() || fallback
      const imageUrl = await findImageUrl(query)

      return useBackside
        ? { ...card, backsideImageUrl: imageUrl }
        : { ...card, frontsideImageUrl: imageUrl }
    })
  )
}

export async function generateFlashcards(
  prompt: string
): Promise<GeneratedFlashcard[]> {
  const wantsImages = IMAGE_INTENT_RE.test(prompt)
  const type = await classifyPrompt(prompt)
  const cards = await generateCards(prompt, type, wantsImages)

  if (!wantsImages) {
    return cards
  }

  return attachImages(cards, type)
}
