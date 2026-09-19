export const BOOKS_DATA: any[] = [
  // 1. Frankenstein
  {
    id: 'frankenstein',
    title: 'Frankenstein',
    subtitle: 'The Modern Prometheus',
    author: 'Mary Wollstonecraft Shelley',
    authorBio: 'Mary Shelley was an English novelist who wrote the Gothic masterpiece Frankenstein at age eighteen, pioneering modern science fiction.',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    spineColor: '#1e293b',
    category: 'fiction',
    categoryLabel: 'Fiction',
    subcategories: ['Gothic Fiction', 'Classic Horror', 'Science Fiction'],
    rating: 4.8,
    reviewCount: 1420,
    pageCount: 280,
    publishedYear: 1818,
    language: 'English',
    isbn: '978-0141439471',
    price: 0,
    isPublicDomain: true,
    isTrending: true,
    isFeatured: true,
    synopsis: 'Frankenstein tells the story of Victor Frankenstein, a young scientist who creates a sapient creature in an unorthodox scientific experiment. Shelley explores the boundaries of scientific inquiry, human empathy, and the consequences of abandoning our creations.',
    excerpt: 'You seek for knowledge and wisdom, as I once did; and I ardently hope that the gratification of your wishes may not be a serpent to sting you, as mine has been.',
    readsCount: 48320,
    tags: ['classic', 'public-domain', 'gothic', 'science-fiction'],
    chapters: [
      {
        id: 'ch-1',
        number: 1,
        title: 'Letter I - Mrs. Saville, England',
        content: [
          'St. Petersburgh, Dec. 11th, 17—',
          'You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.',
          'I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes.',
          'Inspirited by this wind of promise, my daydreams become more fervent and vivid. I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight.',
          'There, Margaret, the sun is for ever visible, its broad disk just skirting the horizon and diffusing a perpetual splendour. There—for with your leave, my sister, I will put some trust in preceding navigators—there snow and frost are banished; and, sailing over a calm sea, we may be wafted to a land surpassing in wonders and in beauty every region hitherto discovered on the habitable globe.'
        ]
      },
      {
        id: 'ch-2',
        number: 2,
        title: 'Chapter I - Genevese Origins',
        content: [
          'I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation.',
          'He was respected by all who knew him for his integrity and indefatigable attention to public business. He passed his younger days perpetually occupied by the affairs of his country; nor was it until the decline of life that he became a husband and the father of a family.',
          'As the circumstances of his marriage illustrate his character, I cannot refrain from relating them. One of his most intimate friends was a merchant who, from a flourishing state, fell, through numerous mischances, into poverty. This man, whose name was Beaufort, was of a proud and unbending disposition and could not bear to live in poverty and oblivion in the same country where he had once been distinguished for his rank and magnificence.',
          'Having paid his debts, therefore, in the most honourable manner, he retreated with his daughter to the town of Lucerne, where he lived unknown and in wretchedness.'
        ]
      },
      {
        id: 'ch-3',
        number: 3,
        title: 'Chapter IV - The Creation of Life',
        content: [
          'From this day natural philosophy, and particularly chemistry, in the most comprehensive sense of the term, became nearly my sole occupation. I read with ardour those works, so full of genius and discrimination, which modern inquirers have written on these subjects.',
          'I attended the lectures and cultivated the acquaintance of the celebrated men of the university. I found even in M. Krempe a great deal of sound sense and real information, combined, it is true, with a repulsive physiognomy and manners, but not on that account the less valuable.',
          'In a thousand ways did I attempt to discover the origin of life; but no human being can imagine the variety of feelings which bore me onwards, like a whirlwind, among the first days of my success.',
          'It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet. It was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out, when, by the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs.'
        ]
      }
    ],
    reviews: [
      {
        id: 'r1',
        userName: 'Aarav Sharma',
        rating: 5,
        date: '2 days ago',
        comment: 'A hauntingly modern exploration of ethics and scientific obsession. Reading it in this distraction-free reader with sepia mode is an absolute delight.',
        badge: 'Verified Reader'
      },
      {
        id: 'r2',
        userName: 'Elena Rostova',
        rating: 5,
        date: '1 week ago',
        comment: 'Incredible how Mary Shelley was only 18 when she conceived this. The psychological depth of the creature is tragic and profound.',
        badge: 'Literature Scholar'
      }
    ]
  },

  // 2. The Adventures of Sherlock Holmes
  {
    id: 'sherlock-holmes',
    title: 'The Adventures of Sherlock Holmes',
    subtitle: 'Classic Baker Street Detective Mysteries',
    author: 'Arthur Conan Doyle',
    authorBio: 'Sir Arthur Conan Doyle was a British writer and physician who created the legendary detective Sherlock Holmes and Dr. John Watson.',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    spineColor: '#831843',
    category: 'literature',
    categoryLabel: 'Literature & Classics',
    subcategories: ['Mystery', 'Detective', 'Victorian Era'],
    rating: 4.9,
    reviewCount: 3290,
    pageCount: 307,
    publishedYear: 1892,
    language: 'English',
    isbn: '978-0140437713',
    price: 0,
    isPublicDomain: true,
    isTrending: true,
    isFeatured: true,
    synopsis: 'A collection of twelve short detective stories featuring Sherlock Holmes and Dr. John Watson, beginning with "A Scandal in Bohemia". Holmes uses razor-sharp deductive reasoning and forensic observation to solve puzzles that baffle Scotland Yard.',
    excerpt: 'It is a capital mistake to theorize before one has data. Insensibly one begins to twist facts to suit theories, instead of theories to suit facts.',
    readsCount: 65400,
    tags: ['mystery', 'detective', 'public-domain', 'sherlock', 'london'],
    chapters: [
      {
        id: 'sh-1',
        number: 1,
        title: 'I. A Scandal in Bohemia',
        content: [
          'To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex.',
          'It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.',
          'He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer.',
          'They were admirable things for the observer—excellent for drawing the veil from men\'s motives and actions. But for the trained reasoner to admit such intrusions into his own delicate and finely adjusted temperament was to introduce a distracting factor which might throw a doubt upon all his mental results.',
          'Grit in a sensitive instrument, or a crack in one of his own high-power lenses, would not be more disturbing than a strong emotion in a nature such as his. And yet there was but one woman to him, and that woman was the late Irene Adler, of dubious and questionable memory.'
        ]
      },
      {
        id: 'sh-2',
        number: 2,
        title: 'II. The Red-Headed League',
        content: [
          'I had called upon my friend, Mr. Sherlock Holmes, one day in the autumn of last year and found him in deep conversation with a very stout, florid-faced, elderly gentleman with fiery red hair.',
          'With an apology for my intrusion, I was about to withdraw when Holmes pulled me abruptly into the room and closed the door behind me.',
          '"You could not have come at a better time, my dear Watson," he said cordially.',
          '"I was afraid that you were engaged."',
          '"So I am. Very much so."',
          '"Then I can wait in the next room."',
          '"Not at all. This gentleman, Mr. Wilson, has been my partner and helper in many of my most successful cases, and I have no doubt that he will be of the utmost use to me in yours also."'
        ]
      }
    ],
    reviews: [
      {
        id: 'sh-r1',
        userName: 'Priya Mukherjee',
        rating: 5,
        date: 'Yesterday',
        comment: 'Doyle\'s pacing is unmatched. Having instant access without borrowing queues or physical library returns is a revolution.',
        badge: 'Top Reviewer'
      }
    ]
  },

  // 3. Pride and Prejudice
  {
    id: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    subtitle: 'A Novel of Manners and Wit',
    author: 'Jane Austen',
    authorBio: 'Jane Austen was an English novelist known primarily for her six major novels interpreting, critiquing, and commenting upon the British landed gentry at the end of the 18th century.',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    spineColor: '#431407',
    category: 'literature',
    categoryLabel: 'Literature & Classics',
    subcategories: ['Romantic Fiction', 'Classic Literature', 'Satire'],
    rating: 4.9,
    reviewCount: 4500,
    pageCount: 384,
    publishedYear: 1813,
    language: 'English',
    isbn: '978-0141439518',
    price: 0,
    isPublicDomain: true,
    isTrending: true,
    isFeatured: true,
    synopsis: 'Jane Austen’s beloved romantic masterpiece follows the lively and outspoken Elizabeth Bennet as she navigates societal expectations, family pressures, and the enigmatic Mr. Fitzwilliam Darcy.',
    excerpt: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    readsCount: 71200,
    tags: ['romance', 'classic', 'satire', 'austen', 'public-domain'],
    chapters: [
      {
        id: 'pp-1',
        number: 1,
        title: 'Chapter I - The Arrival at Netherfield',
        content: [
          'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
          'However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.',
          '"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"',
          'Mr. Bennet replied that he had not.',
          '"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."',
          'Mr. Bennet made no answer.',
          '"Do you not want to know who has taken it?" cried his wife impatiently.',
          '"You want to tell me, and I have no objection to hearing it."',
          'This was invitation enough.'
        ]
      },
      {
        id: 'pp-2',
        number: 2,
        title: 'Chapter II - The First Impression',
        content: [
          'Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it.',
          'It was then disclosed in the following manner. Observing his second daughter employed in trimming a hat, he suddenly addressed her with:',
          '"I hope Mr. Bingley will like it, Lizzy."',
          '"We are not in a way to know what Mr. Bingley likes," said her mother resentfully, "since we are not to visit."',
          '"But you forget, mamma," said Elizabeth, "that we shall meet him at the assemblies, and that Mrs. Long has promised to introduce him."'
        ]
      }
    ],
    reviews: [
      {
        id: 'pp-r1',
        userName: 'Rohan Deshmukh',
        rating: 5,
        date: '3 days ago',
        comment: 'Elizabeth Bennet\'s dialogue is as sharp and hilarious today as it was 200 years ago.',
        badge: 'Verified Reader'
      }
    ]
  },

  // 4. The Great Gatsby
  {
    id: 'the-great-gatsby',
    title: 'The Great Gatsby',
    subtitle: 'The Gilded Age of Long Island',
    author: 'F. Scott Fitzgerald',
    authorBio: 'Francis Scott Key Fitzgerald was an American novelist, essayist, and short story writer whose works illustrate the Jazz Age.',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800',
    spineColor: '#1e1b4b',
    category: 'fiction',
    categoryLabel: 'Fiction',
    subcategories: ['American Literature', 'Jazz Age', 'Tragedy'],
    rating: 4.7,
    reviewCount: 2890,
    pageCount: 180,
    publishedYear: 1925,
    language: 'English',
    isbn: '978-0743273565',
    price: 5,
    isPublicDomain: true,
    isTrending: true,
    isFeatured: true,
    synopsis: 'Set in Jazz Age New York, The Great Gatsby paints an unforgettable portrait of Jay Gatsby’s obsessive quest to reunite with Daisy Buchanan, dissecting the illusory promise of the American Dream.',
    excerpt: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
    readsCount: 52100,
    tags: ['jazz-age', 'classic', 'american-dream', 'fiction'],
    chapters: [
      {
        id: 'gg-1',
        number: 1,
        title: 'Chapter I - West Egg',
        content: [
          'In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since.',
          '"Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven\'t had the advantages that you\'ve had."',
          'He didn\'t say any more, but we\'ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.',
          'In consequence, I\'m inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.',
          'The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men.'
        ]
      }
    ],
    reviews: [
      {
        id: 'gg-r1',
        userName: 'Sarah Jenkins',
        rating: 5,
        date: '5 days ago',
        comment: 'A lyrical masterpiece. For just ₹5 to read this whenever I travel on the subway, Libris is pure genius.',
        badge: 'Verified Reader'
      }
    ]
  },

  // 5. The Time Machine
  {
    id: 'the-time-machine',
    title: 'The Time Machine',
    subtitle: 'An Invention and a Journey to 802,701 AD',
    author: 'H. G. Wells',
    authorBio: 'Herbert George Wells was an English writer prolific in many genres. He is widely referred to as the father of science fiction alongside Jules Verne.',
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800',
    spineColor: '#064e3b',
    category: 'fiction',
    categoryLabel: 'Fiction',
    subcategories: ['Sci-Fi', 'Dystopian', 'Time Travel'],
    rating: 4.6,
    reviewCount: 1640,
    pageCount: 118,
    publishedYear: 1895,
    language: 'English',
    isbn: '978-0451530707',
    price: 0,
    isPublicDomain: true,
    isTrending: false,
    synopsis: 'A Victorian scientist invents a device capable of navigating the fourth dimension of time, propelling him into the far distant year 802,701 AD where he discovers humanity split into the peaceful Eloi and subterranean Morlocks.',
    excerpt: 'There is no difference between Time and any of the three dimensions of Space except that our consciousness moves along it.',
    readsCount: 31200,
    tags: ['time-travel', 'sci-fi', 'dystopian', 'public-domain'],
    chapters: [
      {
        id: 'tm-1',
        number: 1,
        title: 'Chapter I - The Fourth Dimension',
        content: [
          'The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated.',
          'The fire burned brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles that flashed and passed in our glasses.',
          'Our chairs, being his patents, embraced and caressed us rather than submitted to be sat upon, and there was that luxurious after-dinner atmosphere when thought roams gracefully free of the trammels of precision.',
          '"You must follow me carefully. I shall have to controvert one or two ideas that are almost universally accepted. The geometry, for instance, they taught you at school is founded on a misconception."',
          '"Is not that rather a large thing to expect us to begin upon?" said Filby, an argumentative person with red hair.'
        ]
      }
    ],
    reviews: []
  },

  // 6. Relativity: The Special and General Theory
  {
    id: 'relativity-theory',
    title: 'Relativity: Special & General Theory',
    subtitle: 'A Popular Exposition for Inquiring Minds',
    author: 'Albert Einstein',
    authorBio: 'Albert Einstein was a German-born theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics.',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    spineColor: '#172554',
    category: 'science',
    categoryLabel: 'Science & Cosmos',
    subcategories: ['Astrophysics', 'Theoretical Physics', 'Cosmology'],
    rating: 4.9,
    reviewCount: 2150,
    pageCount: 168,
    publishedYear: 1916,
    language: 'English',
    isbn: '978-0486417141',
    price: 0,
    isPublicDomain: true,
    isTrending: true,
    synopsis: 'Written by Einstein himself to explain the profound revolution in space, time, gravity, and mass to general readers without advanced mathematical training.',
    excerpt: 'The non-mathematician is seized by a mysterious shuddering when he hears of four-dimensional things, but there is no simpler proposition than that our world is a four-dimensional space-time continuum.',
    readsCount: 41200,
    tags: ['physics', 'einstein', 'relativity', 'science', 'space'],
    chapters: [
      {
        id: 'rel-1',
        number: 1,
        title: 'Part I - Physical Meaning of Geometrical Propositions',
        content: [
          'In your school days you were probably made acquainted with the proud edifice of Euclid’s geometry, and you remember, perhaps with more respect than love, the magnificent structure, on the lofty staircase of which you were chased about for unnumbered hours by conscientious teachers.',
          'By virtue of this geometry you are told that two points in space determine a straight line, and you accept it without question.',
          'Geometry sets out from certain intuitive ideas such as "plane," "point," and "straight line," to which we are accustomed to associate more or less definite ideas, and from certain simple propositions (axioms) which, in virtue of these ideas, we are inclined to accept as "true."',
          'Then, on the basis of a logical process, the justification of which we feel ourselves compelled to admit, all remaining propositions are shown to follow from those axioms.'
        ]
      }
    ],
    reviews: []
  },

  // 7. On the Origin of Species
  {
    id: 'origin-of-species',
    title: 'On the Origin of Species',
    subtitle: 'By Means of Natural Selection',
    author: 'Charles Darwin',
    authorBio: 'Charles Robert Darwin was an English naturalist, geologist and biologist, widely known for his contributions to evolutionary biology.',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    spineColor: '#14532d',
    category: 'science',
    categoryLabel: 'Science & Cosmos',
    subcategories: ['Evolutionary Biology', 'Natural History', 'Ecology'],
    rating: 4.8,
    reviewCount: 1890,
    pageCount: 502,
    publishedYear: 1859,
    language: 'English',
    isbn: '978-0451529060',
    price: 0,
    isPublicDomain: true,
    synopsis: 'Considered the foundation of modern evolutionary biology, Darwin introduces the scientific theory that populations evolve over generations through a process of natural selection.',
    excerpt: 'There is grandeur in this view of life, with its several powers, having been originally breathed into a few forms or into one; and that, whilst this planet has gone cycling on according to the fixed law of gravity, from so simple a beginning endless forms most beautiful and most wonderful have been, and are being, evolved.',
    readsCount: 29800,
    tags: ['biology', 'darwin', 'evolution', 'science', 'nature'],
    chapters: [
      {
        id: 'dar-1',
        number: 1,
        title: 'Introduction - The Mystery of Mysteries',
        content: [
          'When on board H.M.S. Beagle, as naturalist, I was much struck with certain facts in the distribution of the organic beings inhabiting South America, and in the geological relations of the present to the past inhabitants of that continent.',
          'These facts, as will be seen in the latter chapters of this volume, seemed to throw some light on the origin of species—that mystery of mysteries, as it has been called by one of our greatest philosophers.',
          'On my return home, it occurred to me in 1837, that something might perhaps be made out on this question by patiently accumulating and reflecting on all sorts of facts which could possibly have any bearing on it.'
        ]
      }
    ],
    reviews: []
  },

  // 8. Meditations
  {
    id: 'meditations-marcus-aurelius',
    title: 'Meditations',
    subtitle: 'Thoughts on Stoic Fortitude and Inner Peace',
    author: 'Marcus Aurelius',
    authorBio: 'Marcus Aurelius was Roman emperor from 161 to 180 AD and a Stoic philosopher whose private personal journal remains an eternal pillar of wisdom.',
    coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
    spineColor: '#78350f',
    category: 'self-development',
    categoryLabel: 'Self Development',
    subcategories: ['Stoicism', 'Philosophy', 'Personal Growth'],
    rating: 4.95,
    reviewCount: 5400,
    pageCount: 220,
    publishedYear: 180,
    language: 'English',
    isbn: '978-0140449334',
    price: 0,
    isPublicDomain: true,
    isTrending: true,
    isFeatured: true,
    synopsis: 'A private journal written by the Roman Emperor for his own guidance and self-discipline. Marcus reflects on impermanence, integrity, duties of civic leadership, and mastering one’s own reactions.',
    excerpt: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
    readsCount: 88900,
    tags: ['stoicism', 'philosophy', 'mindset', 'habits', 'wisdom'],
    chapters: [
      {
        id: 'med-1',
        number: 1,
        title: 'Book II - On Daily Resilience',
        content: [
          'When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly.',
          'They are like this because they cannot distinguish good from evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own—not of the same blood or birth, but the same mind, and possessing a share of the divine.',
          'And so none of them can hurt me. No one can implicate me in ugliness. Nor can I feel angry at my relative, or hate him.',
          'We were made to work together like feet, like hands, like the rows of the upper and lower teeth. To obstruct each other is against Nature.'
        ]
      }
    ],
    reviews: [
      {
        id: 'med-r1',
        userName: 'Vikram Sengupta',
        rating: 5,
        date: '4 days ago',
        comment: 'I re-read Book II every month. The typography on this platform makes reading philosophy a peaceful ritual.',
        badge: 'Top Reader'
      }
    ]
  },

  // 9. The Art of War
  {
    id: 'the-art-of-war',
    title: 'The Art of War',
    subtitle: 'Strategic Wisdom on Conflict and Harmony',
    author: 'Sun Tzu',
    authorBio: 'Sun Tzu was an ancient Chinese military general, strategist, and philosopher from the Eastern Zhou period.',
    coverUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&q=80&w=800',
    spineColor: '#881337',
    category: 'history',
    categoryLabel: 'History & Civilization',
    subcategories: ['Military Strategy', 'Eastern Philosophy', 'Leadership'],
    rating: 4.8,
    reviewCount: 3100,
    pageCount: 112,
    publishedYear: -500,
    language: 'English',
    isbn: '978-1590302255',
    price: 5,
    isPublicDomain: true,
    isTrending: true,
    synopsis: 'Ancient military treatise consisting of 13 chapters, each devoted to one aspect of warfare and tactical strategy. Its principles have influenced corporate leadership, sports, and negotiation worldwide.',
    excerpt: 'The supreme art of war is to subdue the enemy without fighting.',
    readsCount: 56000,
    tags: ['strategy', 'leadership', 'ancient-china', 'philosophy'],
    chapters: [
      {
        id: 'aow-1',
        number: 1,
        title: 'Chapter I - Laying Plans',
        content: [
          'Sun Tzu said: The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.',
          'The art of war, then, is governed by five constant factors, to be taken into account in one\'s deliberations, when seeking to determine the conditions obtaining in the field.',
          'These are: The Moral Law; Heaven; Earth; The Commander; Method and discipline.',
          'The Moral Law causes the people to be in complete accord with their ruler, so that they will follow him regardless of their lives, undismayed by any danger.'
        ]
      }
    ],
    reviews: []
  },

  // 10. The Wealth of Nations
  {
    id: 'wealth-of-nations',
    title: 'The Wealth of Nations',
    subtitle: 'An Inquiry into the Nature and Causes',
    author: 'Adam Smith',
    authorBio: 'Adam Smith was a Scottish philosopher and economist who is considered the father of modern economics and capitalism.',
    coverUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800',
    spineColor: '#134e4a',
    category: 'business',
    categoryLabel: 'Business & Economics',
    subcategories: ['Classical Economics', 'Trade Policy', 'Markets'],
    rating: 4.6,
    reviewCount: 1420,
    pageCount: 590,
    publishedYear: 1776,
    language: 'English',
    isbn: '978-0553585971',
    price: 10,
    isPublicDomain: true,
    synopsis: 'Adam Smith’s fundamental work on economics, introducing the division of labor, productivity, trade incentives, and the celebrated concept of the invisible hand.',
    excerpt: 'It is not from the benevolence of the butcher, the brewer, or the baker that we expect our dinner, but from their regard to their own self-interest.',
    readsCount: 22400,
    tags: ['economics', 'business', 'adam-smith', 'free-market'],
    chapters: [
      {
        id: 'wn-1',
        number: 1,
        title: 'Book I, Chapter I - Of the Division of Labour',
        content: [
          'The greatest improvement in the productive powers of labour, and the greater part of the skill, dexterity, and judgment with which it is anywhere directed, or applied, seem to have been the effects of the division of labour.',
          'The effects of the division of labour, in the general business of society, will be more easily understood by considering in what manner it operates in some very trifling manufactures.',
          'To take an example, therefore, from a very trifling manufacture; but one in which the division of labour has been very often taken notice of, the trade of the pin-maker; a workman not educated to this business could scarce, perhaps, with his utmost industry, make one pin in a day, and certainly could not make twenty.',
          'But in the way in which this business is now carried on, not only the whole work is a peculiar trade, but it is divided into a number of branches, of which the greater part are likewise peculiar trades.'
        ]
      }
    ],
    reviews: []
  },

  // 11. Euclid's Elements
  {
    id: 'euclid-elements',
    title: "Euclid's Elements",
    subtitle: 'The Foundations of Geometry and Number Theory',
    author: 'Euclid of Alexandria',
    authorBio: 'Euclid was an ancient Greek mathematician active in Hellenistic Alexandria during the reign of Ptolemy I.',
    coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    spineColor: '#1e3a8a',
    category: 'mathematics',
    categoryLabel: 'Mathematics',
    subcategories: ['Axiomatic Geometry', 'Number Theory', 'Pure Math'],
    rating: 4.9,
    reviewCount: 980,
    pageCount: 460,
    publishedYear: -300,
    language: 'English',
    isbn: '978-1888009187',
    price: 0,
    isPublicDomain: true,
    synopsis: 'The most influential textbook ever written, Euclid builds axiomatic geometry from five self-evident postulates into hundreds of deductive mathematical propositions.',
    excerpt: 'There is no royal road to geometry.',
    readsCount: 18400,
    tags: ['mathematics', 'geometry', 'euclid', 'logic', 'proofs'],
    chapters: [
      {
        id: 'euc-1',
        number: 1,
        title: 'Book I - Definitions, Postulates, and Axioms',
        content: [
          'Definition 1. A point is that which has no part.',
          'Definition 2. A line is breadthless length.',
          'Definition 3. The ends of a line are points.',
          'Definition 4. A straight line is a line which lies evenly with the points on itself.',
          'Postulate 1. To draw a straight line from any point to any point.',
          'Postulate 2. To produce a finite straight line continuously in a straight line.',
          'Postulate 3. To describe a circle with any center and radius.',
          'Postulate 4. That all right angles are equal to one another.'
        ]
      }
    ],
    reviews: []
  },

  // 12. Structure and Interpretation of Computer Programs
  {
    id: 'sicp',
    title: 'Structure and Interpretation of Computer Programs',
    subtitle: 'MIT Electrical Engineering and Computer Science Series',
    author: 'Harold Abelson & Gerald Jay Sussman',
    authorBio: 'Harold Abelson and Gerald Jay Sussman are professors of Computer Science and Engineering at MIT.',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    spineColor: '#312e81',
    category: 'programming',
    categoryLabel: 'Programming & CS',
    subcategories: ['Computer Science', 'Lisp / Scheme', 'Abstraction'],
    rating: 4.9,
    reviewCount: 3820,
    pageCount: 657,
    publishedYear: 1996,
    language: 'English',
    isbn: '978-0262510875',
    price: 15,
    isPublicDomain: false,
    isTrending: true,
    isFeatured: true,
    synopsis: 'SICP teaches the fundamental principles of computation, recursive data abstraction, state machines, metalinguistic abstraction, and register machines.',
    excerpt: 'Programs must be written for people to read, and only incidentally for machines to execute.',
    readsCount: 44300,
    tags: ['programming', 'mit', 'computer-science', 'algorithms'],
    chapters: [
      {
        id: 'sicp-1',
        number: 1,
        title: 'Chapter 1 - Building Abstractions with Procedures',
        content: [
          'The acts of the mind, wherein it exerts its power over its simple ideas, are chiefly these three: 1. Combining several simple ideas into one compound one, and thus all complex ideas are made.',
          '2. The second is bringing two ideas, whether simple or complex, together, and setting them by one another, so as to take a view of them at once, without uniting them into one, by which way it gets all its ideas of relations.',
          '3. The third is separating them from all other ideas that accompany them in their real existence: this is called abstraction: and thus all its general ideas are made. — John Locke, An Essay Concerning Human Understanding (1690)',
          'We are about to study the idea of a computational process. Computational processes are abstract beings that inhabit computers. As they evolve, processes manipulate other abstract things called data.'
        ]
      }
    ],
    reviews: []
  },

  // 13. Alice's Adventures in Wonderland
  {
    id: 'alice-in-wonderland',
    title: "Alice's Adventures in Wonderland",
    subtitle: 'Down the Rabbit Hole of Whimsical Logic',
    author: 'Lewis Carroll',
    authorBio: 'Lewis Carroll was the pen name of Charles Lutwidge Dodgson, an English mathematician and Oxford deacon.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    spineColor: '#831843',
    category: 'children',
    categoryLabel: "Children's Books",
    subcategories: ['Fairy Tale', 'Literary Nonsense', 'Fantasy'],
    rating: 4.8,
    reviewCount: 3120,
    pageCount: 192,
    publishedYear: 1865,
    language: 'English',
    isbn: '978-0141439761',
    price: 0,
    isPublicDomain: true,
    synopsis: 'Alice falls down a rabbit hole into a bizarre fantasy world populated by anthropomorphic creatures like the Cheshire Cat, the Mad Hatter, and the Queen of Hearts.',
    excerpt: 'Curiouser and curiouser!',
    readsCount: 47200,
    tags: ['children', 'classic', 'fantasy', 'wonderland', 'alice'],
    chapters: [
      {
        id: 'al-1',
        number: 1,
        title: 'Chapter I - Down the Rabbit-Hole',
        content: [
          'Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"',
          'So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.',
          'There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.'
        ]
      }
    ],
    reviews: []
  },

  // 14. Think and Grow Rich
  {
    id: 'think-and-grow-rich',
    title: 'Think and Grow Rich',
    subtitle: 'The Landmark 1937 Philosophy of Achievement',
    author: 'Napoleon Hill',
    authorBio: 'Oliver Napoleon Hill was an American self-help author best known for his book Think and Grow Rich based on interviewing Andrew Carnegie and top industrialists.',
    coverUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800',
    spineColor: '#713f12',
    category: 'self-development',
    categoryLabel: 'Self Development',
    subcategories: ['Success Mindset', 'Wealth Principles', 'Drive'],
    rating: 4.7,
    reviewCount: 3900,
    pageCount: 238,
    publishedYear: 1937,
    language: 'English',
    isbn: '978-1585424337',
    price: 5,
    isPublicDomain: true,
    synopsis: 'Examines the psychological power of thought, persistence, and mastermind groups in translating ambition into tangible monetary and personal achievement.',
    excerpt: 'Whatever the mind can conceive and believe, it can achieve.',
    readsCount: 63000,
    tags: ['wealth', 'mindset', 'self-help', 'classic'],
    chapters: [
      {
        id: 'tgr-1',
        number: 1,
        title: 'Chapter 1 - The Power of Thought',
        content: [
          'TRULY, "thoughts are things," and powerful things at that, when they are mixed with definiteness of purpose, persistence, and a BURNING DESIRE for their translation into riches, or other material objects.',
          'A little more than thirty years ago, Edwin C. Barnes discovered how true it is that men really do THINK AND GROW RICH. His discovery did not come about at one sitting. It came by little and little, beginning with a BURNING DESIRE to become a business associate of the great Thomas A. Edison.',
          'One of the chief characteristics of Barnes\' Desire was that it was definite. He wanted to work WITH Edison, not for him.'
        ]
      }
    ],
    reviews: []
  },

  // 15. The Interpretation of Dreams
  {
    id: 'interpretation-of-dreams',
    title: 'The Interpretation of Dreams',
    subtitle: 'The Royal Road to the Unconscious Mind',
    author: 'Sigmund Freud',
    authorBio: 'Sigmund Freud was an Austrian neurologist and the founder of psychoanalysis, a clinical method for evaluating and treating pathologies.',
    coverUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=800',
    spineColor: '#581c87',
    category: 'psychology',
    categoryLabel: 'Psychology',
    subcategories: ['Psychoanalysis', 'Cognitive Psychology', 'Subconscious'],
    rating: 4.6,
    reviewCount: 1780,
    pageCount: 480,
    publishedYear: 1899,
    language: 'English',
    isbn: '978-0465019779',
    price: 10,
    isPublicDomain: true,
    synopsis: 'Freud presents his theory of the unconscious with respect to dream interpretation, arguing that dreams represent wish-fulfillments disguised by psychological censorship.',
    excerpt: 'The interpretation of dreams is the royal road to a knowledge of the unconscious activities of the mind.',
    readsCount: 27900,
    tags: ['freud', 'psychology', 'dreams', 'mind', 'classic'],
    chapters: [
      {
        id: 'freud-1',
        number: 1,
        title: 'Chapter I - The Scientific Literature of Dream Problems',
        content: [
          'In the following pages I shall prove that there exists a psychological technique by which dreams may be interpreted, and that upon the application of this method every dream reveals itself as a psychic structure which has a meaning and which can be inserted at an assignable point in the mental activities of waking life.',
          'I shall further endeavor to elucidate the processes which underlie the strangeness and obscurity of dreams, and to deduce from these processes the nature of the psychic forces by whose cooperation or antagonism the dream is generated.'
        ]
      }
    ],
    reviews: []
  },

  // 16. A Byte of Python
  {
    id: 'byte-of-python',
    title: 'A Byte of Python',
    subtitle: 'Beginner to Intermediate Practical Programming',
    author: 'C.H. Swaroop',
    authorBio: 'Swaroop C H is an Indian software engineer, author, and open source advocate.',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    spineColor: '#0c4a6e',
    category: 'programming',
    categoryLabel: 'Programming & CS',
    subcategories: ['Python', 'Software Engineering', 'Open Source'],
    rating: 4.85,
    reviewCount: 2900,
    pageCount: 160,
    publishedYear: 2018,
    language: 'English',
    isbn: '978-1502476579',
    price: 0,
    isPublicDomain: false,
    isTrending: true,
    synopsis: 'The celebrated open-license tutorial and reference book for learning computer programming using the Python language. Praised by universities and autodidacts alike for its clarity.',
    excerpt: 'Python is probably one of the few programming languages which is both simple and powerful.',
    readsCount: 58900,
    tags: ['python', 'programming', 'code', 'open-license', 'tutorial'],
    chapters: [
      {
        id: 'py-1',
        number: 1,
        title: 'Chapter 1 - Introduction to Python Philosophy',
        content: [
          '"A Byte of Python" is a free book on programming using the Python language. It serves as a tutorial or guide to the Python language for a beginner audience.',
          'If your only experience with computers is how to save text files, then this is the book for you.',
          'Python is an easy to learn, powerful programming language. It has efficient high-level data structures and a simple but effective approach to object-oriented programming.',
          'Python\'s elegant syntax and dynamic typing, together with its interpreted nature, make it an ideal language for scripting and rapid application development in many areas on most platforms.'
        ]
      }
    ],
    reviews: []
  },

  // 17. The History of the Peloponnesian War
  {
    id: 'peloponnesian-war',
    title: 'The History of the Peloponnesian War',
    subtitle: 'Athens, Sparta, and the Reality of Empire',
    author: 'Thucydides',
    authorBio: 'Thucydides was an Athenian historian and general. His history recount of the fifth-century BC war between Sparta and Athens is considered the father of political realism.',
    coverUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
    spineColor: '#365314',
    category: 'history',
    categoryLabel: 'History & Civilization',
    subcategories: ['Ancient Greece', 'Geopolitics', 'Classical History'],
    rating: 4.7,
    reviewCount: 1100,
    pageCount: 650,
    publishedYear: -411,
    language: 'English',
    isbn: '978-0140440393',
    price: 10,
    isPublicDomain: true,
    synopsis: 'A foundational historical record chronicling the brutal conflict between the Peloponnesian League led by Sparta and the Delian League led by Athens, featuring Pericles’ Funeral Oration and the Melian Dialogue.',
    excerpt: 'The strong do what they can and the weak suffer what they must.',
    readsCount: 19800,
    tags: ['history', 'greece', 'war', 'realism', 'thucydides'],
    chapters: [
      {
        id: 'thuc-1',
        number: 1,
        title: 'Book I - The State of Greece from the Earliest Times',
        content: [
          'Thucydides, an Athenian, wrote the history of the war between the Peloponnesians and the Athenians, beginning at the moment that it broke out, and believing that it would be a great war, and more worthy of relation than any that had preceded it.',
          'This belief was not without grounds. The preparation of both combatants was in every department in the last state of perfection; and he could see the rest of the Hellenic race taking sides in the quarrel; those who delayed doing so at once having it in contemplation.'
        ]
      }
    ],
    reviews: []
  },

  // 18. Indian Polity & Constitutional Framework
  {
    id: 'indian-polity-exam',
    title: 'Indian Polity & Constitutional Framework',
    subtitle: 'Comprehensive Civil Services & State Exams Reference',
    author: 'Dr. Rajeshwar Rao (Academic Panel)',
    authorBio: 'Dr. Rao is an emeritus fellow in constitutional law and senior administrative coach for national civil service aspirants.',
    coverUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    spineColor: '#1e3a8a',
    category: 'competitive-exams',
    categoryLabel: 'Competitive Exams',
    subcategories: ['Civil Services', 'UPSC', 'Constitutional Law'],
    rating: 4.9,
    reviewCount: 4620,
    pageCount: 520,
    publishedYear: 2023,
    language: 'English',
    isbn: '978-9352603893',
    price: 20,
    isPublicDomain: false,
    isTrending: true,
    synopsis: 'A systematic breakdown of the Indian Constitution, Fundamental Rights, Parliament, Judiciary, and Federal Relations designed specifically for high-yield competitive examination preparation.',
    excerpt: 'Democracy is not merely a form of government. It is primarily a mode of associated living, of conjoint communicated experience.',
    readsCount: 78500,
    tags: ['polity', 'upsc', 'constitution', 'exams', 'competitive'],
    chapters: [
      {
        id: 'pol-1',
        number: 1,
        title: 'Chapter 1 - Historical Underpinnings & The Constituent Assembly',
        content: [
          'The Indian Constitution is the supreme law of India. It lays down the framework that demarcates fundamental political code, structure, procedures, powers, and duties of government institutions.',
          'The demand for a Constituent Assembly was first made in 1934 by M.N. Roy. In 1935, the Indian National Congress (INC) officially demanded a Constituent Assembly to frame the Constitution of India.',
          'The Constituent Assembly met for the first time on December 9, 1946. Dr. Sachchidananda Sinha, the oldest member, was elected as the temporary President of the Assembly, following the French practice.'
        ]
      }
    ],
    reviews: []
  },

  // 19. General Aptitude & Mental Ability Masterclass
  {
    id: 'aptitude-masterclass',
    title: 'General Aptitude & Logical Reasoning',
    subtitle: 'Frameworks and Shortcuts for Competitive Aspirants',
    author: 'Prof. K. V. Raman',
    authorBio: 'Mathematics educator and aptitude architect training thousands of banking, civil service, and graduate entrance candidates.',
    coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    spineColor: '#374151',
    category: 'competitive-exams',
    categoryLabel: 'Competitive Exams',
    subcategories: ['Logical Reasoning', 'Quantitative Ability', 'Banking & GATE'],
    rating: 4.8,
    reviewCount: 3180,
    pageCount: 390,
    publishedYear: 2022,
    language: 'English',
    isbn: '978-9389845321',
    price: 15,
    isPublicDomain: false,
    isTrending: false,
    synopsis: 'Fast mental math techniques, syllogisms, data interpretation grids, and spatial reasoning problems designed to give students a competitive speed edge.',
    excerpt: 'Mastering quantitative aptitude is not about memorizing formulas; it is about recognizing patterns under time constraints.',
    readsCount: 42100,
    tags: ['aptitude', 'math', 'reasoning', 'exams', 'competitive'],
    chapters: [
      {
        id: 'apt-1',
        number: 1,
        title: 'Chapter 1 - Number Systems & Divisibility Shortcuts',
        content: [
          'In any competitive exam, speed is the differentiator. Before diving into complex algebra, understanding the modular properties of integers saves critical seconds.',
          'Rule for Divisibility by 7, 11, and 13: Take the alternating sum of blocks of three digits from right to left.',
          'Vedic arithmetic shortcuts for two-digit multiplication and base-100 squaring eliminate scratch paper dependencies.'
        ]
      }
    ],
    reviews: []
  },

  // 20. The Picture of Dorian Gray
  {
    id: 'dorian-gray',
    title: 'The Picture of Dorian Gray',
    subtitle: 'The Faustian Tale of Aesthetic Vanity',
    author: 'Oscar Wilde',
    authorBio: 'Oscar Fingal O\'Flahertie Wills Wilde was an Irish poet and playwright known for his biting wit, flamboyant style, and philosophical novel.',
    coverUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
    spineColor: '#4c0519',
    category: 'fiction',
    categoryLabel: 'Fiction',
    subcategories: ['Philosophical Fiction', 'Gothic Novel', 'Aestheticism'],
    rating: 4.8,
    reviewCount: 2750,
    pageCount: 254,
    publishedYear: 1890,
    language: 'English',
    isbn: '978-0141439570',
    price: 0,
    isPublicDomain: true,
    isTrending: true,
    synopsis: 'A hedonistic young man sells his soul to preserve his youthful beauty while a hidden portrait in his attic bears the grotesque decay of his sins and moral decline.',
    excerpt: 'The only way to get rid of a temptation is to yield to it. Resist it, and your soul grows sick with longing for the things it has forbidden to itself.',
    readsCount: 46100,
    tags: ['oscar-wilde', 'classic', 'gothic', 'aestheticism', 'fiction'],
    chapters: [
      {
        id: 'dg-1',
        number: 1,
        title: 'Chapter I - The Studio of Basil Hallward',
        content: [
          'The studio was filled with the rich odour of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.',
          'From the corner of the divan of Persian saddle-bags on which he was lying, smoking, as was his custom, innumerable cigarettes, Lord Henry Wotton could just catch the gleam of the honey-sweet and honey-coloured blossoms of a laburnum.',
          'In the centre of the room, clamped to an upright easel, stood the full-length portrait of a young man of extraordinary personal beauty, and in front of it, some little distance away, was sitting the artist himself, Basil Hallward.'
        ]
      }
    ],
    reviews: []
  },

  // 21. Flatland: A Romance of Many Dimensions
  {
    id: 'flatland',
    title: 'Flatland: A Romance of Many Dimensions',
    subtitle: 'Mathematical Satire and Higher Dimensional Space',
    author: 'Edwin A. Abbott',
    authorBio: 'Edwin Abbott Abbott was an English schoolmaster and theologian, best known for his mathematical novella Flatland.',
    coverUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&q=80&w=800',
    spineColor: '#1e293b',
    category: 'mathematics',
    categoryLabel: 'Mathematics',
    subcategories: ['Geometry', 'Satire', 'Dimensionality'],
    rating: 4.75,
    reviewCount: 1540,
    pageCount: 96,
    publishedYear: 1884,
    language: 'English',
    isbn: '978-0486272634',
    price: 0,
    isPublicDomain: true,
    synopsis: 'A Square guides readers through a two-dimensional world where social rank corresponds to the number of sides, before being visited by a Sphere from the third dimension.',
    excerpt: 'Look yonder, into that Spaceless and Dimensionless Infinity. That is the realm of Pointland.',
    readsCount: 23100,
    tags: ['math', 'dimensions', 'satire', 'geometry', 'classic'],
    chapters: [
      {
        id: 'flat-1',
        number: 1,
        title: 'Part I: This World - Of the Nature of Flatland',
        content: [
          'I call our world Flatland, not because we call it so, but to make its nature clearer to you, my happy readers, who are privileged to live in Space.',
          'Imagine a vast sheet of paper on which straight Lines, Triangles, Squares, Pentagons, Hexagons, and other figures, instead of remaining fixed in their places, move freely about, on or in the surface, but without the power of rising above or sinking below it, very much like shadows—only hard and with luminous edges—and you will then have a tolerably correct notion of my country and countrymen.'
        ]
      }
    ],
    reviews: []
  },

  // 22. The Secret Garden
  {
    id: 'the-secret-garden',
    title: 'The Secret Garden',
    subtitle: 'Healing, Friendship, and Nature’s Awakening',
    author: 'Frances Hodgson Burnett',
    authorBio: 'Frances Eliza Hodgson Burnett was a British-American novelist and playwright best known for her children\'s stories.',
    coverUrl: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=800',
    spineColor: '#065f46',
    category: 'children',
    categoryLabel: "Children's Books",
    subcategories: ['Victorian Children', 'Classics', 'Friendship'],
    rating: 4.85,
    reviewCount: 2340,
    pageCount: 312,
    publishedYear: 1911,
    language: 'English',
    isbn: '978-0141321066',
    price: 0,
    isPublicDomain: true,
    synopsis: 'Orphaned Mary Lennox is sent from India to her uncle’s mysterious estate on the Yorkshire moors, where she uncovers a walled garden locked for ten years.',
    excerpt: 'If you look the right way, you can see that the whole world is a garden.',
    readsCount: 35600,
    tags: ['children', 'garden', 'healing', 'classic', 'public-domain'],
    chapters: [
      {
        id: 'sg-1',
        number: 1,
        title: 'Chapter I - There is No One Left',
        content: [
          'When Mary Lennox was sent to Misselthwaite Manor to live with her uncle everybody said she was the most disagreeable-looking child ever seen.',
          'It was true, too. She had a little thin face and a little thin body, thin light hair and a sour expression.',
          'Her hair was yellow, and her face was yellow because she had been born in India and had always been ill in one way or another.'
        ]
      }
    ],
    reviews: []
  },

  // 23. The Cathedral & the Bazaar
  {
    id: 'cathedral-and-bazaar',
    title: 'The Cathedral and the Bazaar',
    subtitle: 'Musings on Linux and Open Source by an Accidental Revolutionary',
    author: 'Eric S. Raymond',
    authorBio: 'Eric Steven Raymond is an American software developer, open-source software advocate, and author.',
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    spineColor: '#1e1b4b',
    category: 'technology',
    categoryLabel: 'Technology',
    subcategories: ['Open Source', 'Software Architecture', 'Hacker Culture'],
    rating: 4.75,
    reviewCount: 2120,
    pageCount: 241,
    publishedYear: 1999,
    language: 'English',
    isbn: '978-0596001087',
    price: 5,
    isPublicDomain: false,
    isTrending: false,
    synopsis: 'A seminal essay and book comparing two free software development models: the quiet Cathedral model and the bustling Bazaar model of Linux.',
    excerpt: 'Given enough eyeballs, all bugs are shallow.',
    readsCount: 38200,
    tags: ['technology', 'open-source', 'linux', 'software-culture'],
    chapters: [
      {
        id: 'cb-1',
        number: 1,
        title: 'Chapter 1 - The Cathedral and the Bazaar',
        content: [
          'Linux overturned much of what I thought I knew. I had been preaching the Unix gospel of small, self-contained tools, but Linux was built by a huge horde of casual volunteers over the internet.',
          'No cathedral-building architectural committee. No corporate milestone gates. Just release early, release often, delegate everything you can, and be open to the point of promiscuity.'
        ]
      }
    ],
    reviews: []
  },

  // 24. As a Man Thinketh
  {
    id: 'as-a-man-thinketh',
    title: 'As a Man Thinketh',
    subtitle: 'The Cultivation of Thought and Character',
    author: 'James Allen',
    authorBio: 'James Allen was a British philosophical writer known for his inspirational books and poetry on conscious living.',
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    spineColor: '#854d0e',
    category: 'self-development',
    categoryLabel: 'Self Development',
    subcategories: ['Consciousness', 'Habits', 'Character'],
    rating: 4.9,
    reviewCount: 3410,
    pageCount: 84,
    publishedYear: 1903,
    language: 'English',
    isbn: '978-1585428649',
    price: 0,
    isPublicDomain: true,
    synopsis: 'Allen explains how noble thoughts produce noble actions and serene circumstances, whereas degraded thoughts inevitably cultivate despair.',
    excerpt: 'A man is literally what he thinks, his character being the complete sum of all his thoughts.',
    readsCount: 51200,
    tags: ['mindset', 'habits', 'stoic', 'classic', 'wisdom'],
    chapters: [
      {
        id: 'aamt-1',
        number: 1,
        title: 'Chapter 1 - Thought and Character',
        content: [
          'The aphorism, "As a man thinketh in his heart so is he," not only embraces the whole of a man\'s being, but is so comprehensive as to reach out to every condition and circumstance of his life.',
          'A man is literally what he thinks, his character being the complete sum of all his thoughts.',
          'As the plant springs from, and could not be without, the seed, so every act of a man springs from the hidden seeds of thought, and could not have appeared without them.'
        ]
      }
    ],
    reviews: []
  },

  // 25. The Metamorphosis
  {
    id: 'the-metamorphosis',
    title: 'The Metamorphosis',
    subtitle: 'The Alienation of Gregor Samsa',
    author: 'Franz Kafka',
    authorBio: 'Franz Kafka was a German-speaking Bohemian novelist and short-story writer, widely regarded as one of the major figures of 20th-century literature.',
    coverUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800',
    spineColor: '#27272a',
    category: 'literature',
    categoryLabel: 'Literature & Classics',
    subcategories: ['Existentialism', 'Absurdist Fiction', 'Classics'],
    rating: 4.75,
    reviewCount: 3890,
    pageCount: 110,
    publishedYear: 1915,
    language: 'English',
    isbn: '978-0141199610',
    price: 0,
    isPublicDomain: true,
    synopsis: 'Gregor Samsa wakes one morning from uneasy dreams to find himself transformed into an enormous monstrous insect, exploring familial guilt and existential isolation.',
    excerpt: 'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin.',
    readsCount: 59300,
    tags: ['kafka', 'classic', 'absurdist', 'existentialism', 'literature'],
    chapters: [
      {
        id: 'kaf-1',
        number: 1,
        title: 'Chapter I - The Awakening',
        content: [
          'One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin.',
          'He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff sections.',
          'The bedding was hardly able to cover it and seemed ready to slide off any moment. His many legs, pitifully thin compared with the size of the rest of him, waved about helplessly as he looked.',
          '"What\'s happened to me?" he thought. It wasn\'t a dream.'
        ]
      }
    ],
    reviews: []
  },

  // 26. Little Women
  {
    id: 'little-women',
    title: 'Little Women',
    subtitle: 'The March Sisters and Growing Up in Concord',
    author: 'Louisa May Alcott',
    authorBio: 'Louisa May Alcott was an American novelist, short story writer, and poet best known as the author of the novel Little Women.',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    spineColor: '#701a75',
    category: 'literature',
    categoryLabel: 'Literature & Classics',
    subcategories: ['Coming of Age', 'Family Drama', 'Classic American'],
    rating: 4.85,
    reviewCount: 3100,
    pageCount: 448,
    publishedYear: 1868,
    language: 'English',
    isbn: '978-0141439686',
    price: 0,
    isPublicDomain: true,
    synopsis: 'Follows the lives of the four March sisters—Meg, Jo, Beth, and Amy—navigating poverty, creative ambition, love, and tragedy in Civil War Massachusetts.',
    excerpt: 'I want to do something splendid, something heroic or wonderful that won\'t be forgotten after I\'m dead.',
    readsCount: 43200,
    tags: ['classic', 'family', 'alcott', 'coming-of-age', 'sisterhood'],
    chapters: [
      {
        id: 'lw-1',
        number: 1,
        title: 'Chapter 1 - Playing Pilgrims',
        content: [
          '"Christmas won\'t be Christmas without any presents," grumbled Jo, lying on the rug.',
          '"It\'s so dreadful to be poor!" sighed Meg, looking down at her old dress.',
          '"I don\'t think it\'s fair for some girls to have plenty of pretty things, and other girls nothing at all," added little Amy, with an injured sniff.',
          '"We\'ve got Father and Mother, and each other," said Beth contentedly from her corner.'
        ]
      }
    ],
    reviews: []
  },

  // 27. The Wonderful Wizard of Oz
  {
    id: 'wizard-of-oz',
    title: 'The Wonderful Wizard of Oz',
    subtitle: 'The Emerald City and the Yellow Brick Road',
    author: 'L. Frank Baum',
    authorBio: 'Lyman Frank Baum was an American author chiefly famous for his children\'s books, particularly The Wonderful Wizard of Oz.',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    spineColor: '#047857',
    category: 'children',
    categoryLabel: "Children's Books",
    subcategories: ['Fairytale', 'American Myth', 'Adventure'],
    rating: 4.8,
    reviewCount: 1980,
    pageCount: 220,
    publishedYear: 1900,
    language: 'English',
    isbn: '978-0141321028',
    price: 0,
    isPublicDomain: true,
    synopsis: 'Dorothy and her dog Toto are whisked away by a Kansas cyclone to the magical Land of Oz where they befriend the Scarecrow, the Tin Woodman, and the Cowardly Lion.',
    excerpt: 'There is no place like home.',
    readsCount: 33400,
    tags: ['oz', 'children', 'fairytale', 'classic', 'yellow-brick-road'],
    chapters: [
      {
        id: 'oz-1',
        number: 1,
        title: 'Chapter I - The Cyclone',
        content: [
          'Dorothy lived in the midst of the great Kansas prairies, with Uncle Henry, who was a farmer, and Aunt Em, who was the farmer\'s wife.',
          'Their house was small, for the lumber to build it had to be carried by wagon many miles. There were four walls, a floor and a roof, which made one room; and this room contained an old rusty looking cookstove, a cupboard for the dishes, a table, three or four chairs, and the beds.',
          'Uncle Henry and Aunt Em had a big bed in one corner, and Dorothy a little bed in another corner. There was no garret at all, and no cellar—except a small hole dug in the ground, called a cyclone cellar.'
        ]
      }
    ],
    reviews: []
  },

  // 28. Thinking in Systems: A Primer
  {
    id: 'thinking-in-systems',
    title: 'Thinking in Systems (Study Edition)',
    subtitle: 'Feedback Loops, Stocks, and Emergent Complexity',
    author: 'Donella H. Meadows',
    authorBio: 'Donella "Dana" Meadows was a pioneering American environmental scientist, educator, and MacArthur Fellow.',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    spineColor: '#0369a1',
    category: 'psychology',
    categoryLabel: 'Psychology',
    subcategories: ['Systems Thinking', 'Decision Making', 'Cognition'],
    rating: 4.9,
    reviewCount: 2450,
    pageCount: 240,
    publishedYear: 2008,
    language: 'English',
    isbn: '978-1603580557',
    price: 15,
    isPublicDomain: false,
    isTrending: true,
    synopsis: 'A masterclass in problem-solving that moves beyond linear cause-and-effect to reveal how feedback loops, delays, and hidden incentives govern our world.',
    excerpt: 'Remember that what you know is only a model. A model is a simplification. The map is not the territory.',
    readsCount: 46700,
    tags: ['systems', 'cognition', 'psychology', 'models', 'complexity'],
    chapters: [
      {
        id: 'tis-1',
        number: 1,
        title: 'Introduction - The System Zoo',
        content: [
          'A system is an interconnected set of elements coherently organized in a way that achieves something.',
          'It must consist of three kinds of things: elements, interconnections, and a function or purpose.',
          'Notice that a collection without interconnections is merely a heap, not a system. Sand on a beach is a heap. A digestive tract is a system.'
        ]
      }
    ],
    reviews: []
  },

  // 29. A Mathematician's Apology
  {
    id: 'mathematicians-apology',
    title: "A Mathematician's Apology",
    subtitle: 'The Aesthetics of Pure Creative Mathematics',
    author: 'G. H. Hardy',
    authorBio: 'Godfrey Harold Hardy was an English mathematician, known for his achievements in number theory and mathematical analysis, and his mentorship of Srinivasa Ramanujan.',
    coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    spineColor: '#1e1b4b',
    category: 'mathematics',
    categoryLabel: 'Mathematics',
    subcategories: ['Pure Mathematics', 'Philosophy of Math', 'Memoir'],
    rating: 4.8,
    reviewCount: 1620,
    pageCount: 140,
    publishedYear: 1940,
    language: 'English',
    isbn: '978-1107604636',
    price: 0,
    isPublicDomain: true,
    synopsis: 'A lyrical personal essay on the beauty and artistic integrity of pure mathematics, famously documenting Hardy’s belief that mathematical beauty is timeless.',
    excerpt: 'A mathematician, like a painter or a poet, is a maker of patterns. If his patterns are more permanent than theirs, it is because they are made with ideas.',
    readsCount: 27100,
    tags: ['math', 'ramanujan', 'hardy', 'beauty', 'intellect'],
    chapters: [
      {
        id: 'hardy-1',
        number: 1,
        title: 'Section 1 - The Justification of a Life',
        content: [
          'It is a melancholy experience for a professional mathematician to find himself writing about mathematics.',
          'The function of a mathematician is to do something, to prove new theorems, to add to mathematics, and not to talk about what he or other mathematicians have done.',
          'Statesmen despise publicists, painters despise art critics, and mathematicians despise expositors. But when the creative power wanes, one may still offer an apology for one\'s chosen art.'
        ]
      }
    ],
    reviews: []
  },

  // 30. Peter and Wendy (Peter Pan)
  {
    id: 'peter-pan',
    title: 'Peter and Wendy (Peter Pan)',
    subtitle: 'Neverland, Pirates, and the Boy Who Wouldn\'t Grow Up',
    author: 'J. M. Barrie',
    authorBio: 'Sir James Matthew Barrie was a Scottish novelist and playwright, best remembered for creating Peter Pan.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    spineColor: '#0f766e',
    category: 'children',
    categoryLabel: "Children's Books",
    subcategories: ['Fantasy', 'Fables', 'Adventure'],
    rating: 4.75,
    reviewCount: 2200,
    pageCount: 240,
    publishedYear: 1911,
    language: 'English',
    isbn: '978-0141322520',
    price: 0,
    isPublicDomain: true,
    synopsis: 'The beloved story of Peter Pan, Tinker Bell, and the Darling children as they fly out of their London nursery window and journey towards Neverland.',
    excerpt: 'To die will be an awfully big adventure.',
    readsCount: 39500,
    tags: ['peter-pan', 'children', 'neverland', 'fantasy', 'classic'],
    chapters: [
      {
        id: 'pan-1',
        number: 1,
        title: 'Chapter I - Peter Breaks Through',
        content: [
          'All children, except one, grow up. They soon know that they will grow up, and the way Wendy knew was this.',
          'One day when she was two years old she was playing in a garden, and she plucked another flower and ran with it to her mother.',
          'I suppose she must have looked rather delightful, for Mrs. Darling put her hand to her heart and cried, "Oh, why can\'t you remain like this for ever!"',
          'This was all that passed between them on the subject, but henceforth Wendy knew that she must grow up. You always know after you are two. Two is the beginning of the end.'
        ]
      }
    ],
    reviews: []
  },

  // 31. The Decline and Fall of the Roman Empire
  {
    id: 'decline-and-fall-roman-empire',
    title: 'The Decline and Fall of the Roman Empire',
    subtitle: 'From Antoninus to the Fall of Constantinople',
    author: 'Edward Gibbon',
    authorBio: 'Edward Gibbon was an English historian, writer, and member of Parliament whose magnum opus remains a literary tour de force.',
    coverUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=800',
    spineColor: '#451a03',
    category: 'history',
    categoryLabel: 'History & Civilization',
    subcategories: ['Roman History', 'Empires', 'Historiography'],
    rating: 4.85,
    reviewCount: 1850,
    pageCount: 810,
    publishedYear: 1776,
    language: 'English',
    isbn: '978-0140437645',
    price: 10,
    isPublicDomain: true,
    synopsis: 'Gibbon traces Western civilization from the height of the Roman Empire to the collapse of Byzantium, probing corruption, political overextension, and religious shifts.',
    excerpt: 'History is, indeed, little more than the register of the crimes, follies, and misfortunes of mankind.',
    readsCount: 25400,
    tags: ['rome', 'history', 'gibbon', 'empires', 'classics'],
    chapters: [
      {
        id: 'gib-1',
        number: 1,
        title: 'Chapter I - The Extent and Military Force of the Empire in the Age of the Antonines',
        content: [
          'In the second century of the Christian era, the Empire of Rome comprehended the fairest part of the earth, and the most civilized portion of mankind.',
          'The frontiers of that extensive monarchy were guarded by ancient renown and disciplined valour. The gentle but powerful influence of laws and manners had gradually cemented the union of the provinces.',
          'Their peaceful inhabitants enjoyed and abused the advantages of wealth and luxury. The image of a free constitution was preserved with decent reverence.'
        ]
      }
    ],
    reviews: []
  },

  // 32. Eloquent JavaScript
  {
    id: 'eloquent-javascript',
    title: 'Eloquent JavaScript',
    subtitle: 'A Modern Introduction to Programming (Digital Edition)',
    author: 'Marijn Haverbeke',
    authorBio: 'Marijn Haverbeke is an independent software developer and author of CodeMirror, Acorn, and ProseMirror.',
    coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    spineColor: '#854d0e',
    category: 'programming',
    categoryLabel: 'Programming & CS',
    subcategories: ['Web Development', 'JavaScript', 'Functional Programming'],
    rating: 4.9,
    reviewCount: 4200,
    pageCount: 472,
    publishedYear: 2021,
    language: 'English',
    isbn: '978-1593279509',
    price: 0,
    isPublicDomain: false,
    isTrending: true,
    synopsis: 'A modern, beautifully articulated guide to JavaScript, covering syntax, data structures, closures, asynchronous code, the browser DOM, and Node.js.',
    excerpt: 'The art of programming is the skill of controlling complexity. The great program is subdued—made simple in its complexity.',
    readsCount: 62400,
    tags: ['javascript', 'web-development', 'programming', 'code'],
    chapters: [
      {
        id: 'ejs-1',
        number: 1,
        title: 'Introduction - On Programming',
        content: [
          'Below the surface of the machine, the program moves. Without effort, it expands and contracts.',
          'In great harmony, electrons scatter and regroup. The forms on the monitor are but ripples on the water. The essence remains invisibly beneath.',
          'There are terrible pitfalls. Writing a program requires clarity and patience. A single semicolon or misspelled variable will derail the entire apparatus.'
        ]
      }
    ],
    reviews: []
  }
];
