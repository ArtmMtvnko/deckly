import { Type } from '@google/genai'

import { gemini } from './gemini'
import { editedFlashcardSchema, type EditedFlashcard } from './ai.schemas'

const MODEL = 'gemini-2.5-flash-lite'

const editedFlashcardResponseSchema = {
  type: Type.OBJECT,
  properties: {
    frontsideText: {
      type: Type.STRING,
      description: 'Updated front side text of the flashcard.',
    },
    backsideText: {
      type: Type.STRING,
      description: 'Updated back side text of the flashcard.',
    },
    hint: {
      type: Type.STRING,
      description:
        'Updated hint. May be an empty string when the original hint is empty and the instruction does not address it.',
    },
  },
  required: ['frontsideText', 'backsideText', 'hint'],
  propertyOrdering: ['frontsideText', 'backsideText', 'hint'],
}

interface FlashcardInput {
  frontsideText: string
  backsideText: string
  hint: string
}

export async function editFlashcard(
  card: FlashcardInput,
  instruction: string
): Promise<EditedFlashcard> {
  const instructionPrompt = [
    'You are editing a single existing flashcard. Apply the user instruction.',
    '',
    'RULES:',
    '- Only change what the instruction asks for. Any field the instruction does not address must be returned exactly as provided.',
    '- If the instruction does not mention the hint, return the existing hint unchanged. If the existing hint is empty, return an empty string.',
    '- Keep edits concise and consistent with flashcard style: short front, short back.',
    '',
    'Current flashcard:',
    `  Front: ${card.frontsideText || '(empty)'}`,
    `  Back:  ${card.backsideText || '(empty)'}`,
    `  Hint:  ${card.hint || '(empty)'}`,
    '',
    `Instruction: ${instruction}`,
  ].join('\n')

  const response = await gemini.models.generateContent({
    model: MODEL,
    contents: instructionPrompt,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: editedFlashcardResponseSchema,
    },
  })

  const text = response.text
  if (!text) {
    throw new Error('Gemini returned an empty edit response')
  }

  const parsed = JSON.parse(text)
  return editedFlashcardSchema.parse(parsed)
}
