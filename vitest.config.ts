import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
      // Scope coverage to the units we actually test, so the numbers reflect
      // the tested code rather than the whole (mostly I/O) codebase. The text
      // reporter only prints rows for files below 100%; the html report
      // (coverage/index.html) lists every file, including the 100%-covered ones.
      include: [
        'lib/srs/sm2.ts',
        'lib/srs/srs.types.ts',
        'lib/auth/schemas.ts',
        'lib/search/search.schemas.ts',
        'lib/search/search.service.ts',
        'lib/decks/deck.schemas.ts',
        'lib/ai/flashcard-generation.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
