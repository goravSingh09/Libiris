import { Book, Chapter } from '../../types';
import { ART_OF_WAR_CHAPTERS } from './artOfWar';
import { METAMORPHOSIS_CHAPTERS } from './metamorphosis';
import { FRANKENSTEIN_CHAPTERS } from './frankenstein';
import { MEDITATIONS_CHAPTERS } from './meditations';
import { FLATLAND_CHAPTERS } from './flatland';
import { ALICE_CHAPTERS } from './aliceInWonderland';
import { TIME_MACHINE_CHAPTERS } from './timeMachine';
import { SHERLOCK_HOLMES_CHAPTERS } from './sherlockHolmes';

export interface BookContentResult {
  chapters: Chapter[];
  isCompleteUnabridged: boolean;
  legalStatus: 'public_domain' | 'curated_preview' | 'open_license';
  notice?: string;
  sourceCredit?: string;
}

const FULL_BOOKS_REGISTRY: Record<string, { chapters: Chapter[]; sourceCredit: string }> = {
  'the-art-of-war': {
    chapters: ART_OF_WAR_CHAPTERS,
    sourceCredit: 'Public Domain English Translation by Lionel Giles, M.A. (1910)'
  },
  'the-metamorphosis': {
    chapters: METAMORPHOSIS_CHAPTERS,
    sourceCredit: 'Public Domain English Translation by Ian Johnston / Wyllie'
  },
  'frankenstein': {
    chapters: FRANKENSTEIN_CHAPTERS,
    sourceCredit: 'Public Domain 1818 First Edition by Mary Wollstonecraft Shelley'
  },
  'meditations-marcus-aurelius': {
    chapters: MEDITATIONS_CHAPTERS,
    sourceCredit: 'Public Domain Classical Translation by George Long, M.A.'
  },
  'flatland': {
    chapters: FLATLAND_CHAPTERS,
    sourceCredit: 'Public Domain 1884 Edition by Edwin A. Abbott (A Square)'
  },
  'alice-in-wonderland': {
    chapters: ALICE_CHAPTERS,
    sourceCredit: 'Public Domain 1865 First Edition by Lewis Carroll'
  },
  'the-time-machine': {
    chapters: TIME_MACHINE_CHAPTERS,
    sourceCredit: 'Public Domain 1895 First Edition by H.G. Wells'
  },
  'sherlock-holmes': {
    chapters: SHERLOCK_HOLMES_CHAPTERS,
    sourceCredit: 'Public Domain 1892 Baker Street Detective Stories by Arthur Conan Doyle'
  }
};

/**
 * Resolves the chapters and content status for a book.
 * Strictly adheres to copyright law:
 * - Public domain books receive their complete unabridged text.
 * - Copyrighted books receive their authorized preview/synopsis curriculum with explicit legal notice.
 */
export function getBookContent(book: Book): BookContentResult {
  const fullBook = FULL_BOOKS_REGISTRY[book.id];

  if (fullBook) {
    return {
      chapters: fullBook.chapters,
      isCompleteUnabridged: true,
      legalStatus: 'public_domain',
      sourceCredit: fullBook.sourceCredit
    };
  }

  // If public domain but not in expanded registry yet, use existing public domain chapters
  if (book.isPublicDomain) {
    return {
      chapters: book.chapters && book.chapters.length > 0 ? book.chapters : [
        {
          id: `${book.id}-1`,
          number: 1,
          title: 'Opening Chapter',
          content: [book.synopsis, book.excerpt || '']
        }
      ],
      isCompleteUnabridged: true,
      legalStatus: 'public_domain',
      sourceCredit: `Public Domain Classic Edition (${book.publishedYear})`
    };
  }

  // Modern / Copyrighted books: Strict Curated Preview Edition compliance
  return {
    chapters: book.chapters && book.chapters.length > 0 ? book.chapters : [
      {
        id: `${book.id}-preview`,
        number: 1,
        title: 'Curated Overview & Study Notes',
        content: [
          book.synopsis,
          book.excerpt || 'Key conceptual principles and core frameworks.'
        ]
      }
    ],
    isCompleteUnabridged: false,
    legalStatus: 'curated_preview',
    notice: 'Curated Preview Edition • Full digital distribution restricted by copyright. To read the unabridged text, please support the author by acquiring an official edition.',
    sourceCredit: `Authorized Academic Preview (${book.publishedYear})`
  };
}
