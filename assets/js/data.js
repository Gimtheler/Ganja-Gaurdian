/*
 * GanjaGuardian strain reference data
 * ---------------------------------------------------------------------------
 * Everything on the site is rendered from this file. Keep content here and
 * presentation in CSS/JS.
 *
 * IMPORTANT
 * - Potency figures are rounded reference examples, not laboratory results.
 *   They vary by batch, grower, product and test method.
 * - Effects, flavours and lineage are commonly reported reference information,
 *   not verified testing.
 * - Photos are local, openly licensed images. Keep author/license/sourceUrl
 *   accurate, and set representative: true for generic flower photos that are
 *   not verified samples of the named strain. See credits.html.
 * - `photoStage` ('plant' or 'cut') plus optional plantPhoto/cutPhoto drive the
 *   plant-vs-cut comparison; GG.GROWTH_STAGES drives the stage strip.
 * - `reports` is optional. Leave it null unless you have a real report count
 *   and can name its source. The UI omits the line when it is missing.
 */
(function () {
  'use strict';

  var GG = (window.GG = window.GG || {});

  /* Terpenes shared across strain profiles. `key` is used for the marker colour. */
  GG.TERPENES = {
    myrcene: { label: 'Myrcene', aroma: 'herbal' },
    limonene: { label: 'Limonene', aroma: 'citrus' },
    caryophyllene: { label: 'Caryophyllene', aroma: 'pepper' },
    pinene: { label: 'Pinene', aroma: 'pine' },
    terpinolene: { label: 'Terpinolene', aroma: 'floral' },
    humulene: { label: 'Humulene', aroma: 'hoppy' }
  };

  /* Reported effects and their outline icon. */
  GG.EFFECTS = {
    hungry: { label: 'Hungry', icon: 'appetite' },
    relaxed: { label: 'Relaxed', icon: 'balanced-stones' },
    sleepy: { label: 'Sleepy', icon: 'sleep' },
    happy: { label: 'Happy', icon: 'smile' },
    creative: { label: 'Creative', icon: 'spark' },
    energetic: { label: 'Energetic', icon: 'bolt' },
    euphoric: { label: 'Euphoric', icon: 'sun' },
    'dry-mouth': { label: 'Dry mouth', icon: 'dry-mouth' },
    'dry-eyes': { label: 'Dry eyes', icon: 'eye' },
    dizzy: { label: 'Dizzy', icon: 'spiral' }
  };

  /* Flavours and their outline icon. */
  GG.FLAVOURS = {
    woody: { label: 'Woody', icon: 'wood' },
    pine: { label: 'Pine', icon: 'pine' },
    earthy: { label: 'Earthy', icon: 'landscape' },
    berry: { label: 'Berry', icon: 'berry' },
    sweet: { label: 'Sweet', icon: 'sweet' },
    herbal: { label: 'Herbal', icon: 'herbal' },
    diesel: { label: 'Diesel', icon: 'diesel' },
    citrus: { label: 'Citrus', icon: 'citrus' },
    mint: { label: 'Mint', icon: 'mint' },
    vanilla: { label: 'Vanilla', icon: 'vanilla' }
  };

  /*
   * Shared representative photos. These are used for the growth-stage strip and
   * for the missing side of a strain's plant/cut comparison. They are always
   * presented as representative references, never as verified strain samples.
   */
  function localPhoto(file, alt, author, license, licenseUrl, sourceUrl) {
    return {
      src: 'assets/images/' + file,
      alt: alt,
      author: author,
      license: license,
      licenseUrl: licenseUrl || '',
      sourceUrl: sourceUrl,
      representative: true
    };
  }

  var PLANT_REFERENCE = localPhoto(
    'young-plants.jpg',
    'Young cannabis plants in a vegetative stage (representative photo)',
    'My 420 Tours',
    'CC BY-SA 4.0',
    'https://creativecommons.org/licenses/by-sa/4.0',
    'https://commons.wikimedia.org/wiki/File:Seedling_cannabis_plant.jpg'
  );

  var CUT_REFERENCE = localPhoto(
    'cut-reference.jpg',
    'Dried cannabis flower (representative photo)',
    'Evan-Amos',
    'Public domain',
    '',
    'https://commons.wikimedia.org/wiki/File:Marijuana-Cannabis-Weed-Bud-Gram.jpg'
  );

  GG.REFERENCE_PHOTOS = {
    plant: PLANT_REFERENCE,
    cut: CUT_REFERENCE
  };

  GG.GROWTH_STAGES = [
    {
      key: 'seedling',
      label: 'Seedling',
      note: 'First leaves appear.',
      photo: localPhoto(
        'seedling-seven-days.jpg',
        'Cannabis seedling about a week old (representative growth-stage photo)',
        'Trav1085',
        'CC BY-SA 3.0',
        'https://creativecommons.org/licenses/by-sa/3.0',
        'https://commons.wikimedia.org/wiki/File:Cannabis_seedling_-_seven_days.jpg'
      )
    },
    {
      key: 'vegetative',
      label: 'Vegetative',
      note: 'Leaves and stems develop.',
      photo: PLANT_REFERENCE
    },
    {
      key: 'flowering',
      label: 'Flowering',
      note: 'Flower sites form and swell.',
      photo: localPhoto(
        'blue-dream.jpg',
        'Cannabis plant in flower (representative growth-stage photo)',
        'My 420 Tours',
        'CC BY-SA 4.0',
        'https://creativecommons.org/licenses/by-sa/4.0',
        'https://commons.wikimedia.org/wiki/File:Blooming_Blue_Dream.jpg'
      )
    },
    {
      key: 'harvest',
      label: 'Harvest & dry',
      note: 'Branches are cut and hung.',
      photo: localPhoto(
        'harvest-drying.jpg',
        'Cannabis branches hanging in a drying room (representative harvest photo)',
        'Beeblebrox',
        'CC BY-SA 4.0',
        'https://creativecommons.org/licenses/by-sa/4.0',
        'https://commons.wikimedia.org/wiki/File:Cannabis_drying_room.jpg'
      )
    },
    {
      key: 'dried',
      label: 'Dried flower',
      note: 'Trimmed and cured buds.',
      photo: CUT_REFERENCE
    }
  ];

  /* Representative close-up photos used to give every strain a small gallery. */
  GG.PHOTO_DETAILS = [
    localPhoto(
      'cannabis-colors-macro.jpg',
      'Macro detail of a cannabis flower (representative photo)',
      'Jbarraco',
      'CC BY 3.0',
      'https://creativecommons.org/licenses/by/3.0',
      'https://commons.wikimedia.org/wiki/File:Cannabis_Colors_Macro.jpg'
    ),
    localPhoto(
      'macro-bud.jpg',
      'Close-up of a cannabis flower (representative photo)',
      'yogi Bushby',
      'CC BY 2.5',
      'https://creativecommons.org/licenses/by/2.5',
      'https://commons.wikimedia.org/wiki/File:Macro_cannabis_bud.jpg'
    ),
    localPhoto(
      'cannabis-macro.jpg',
      'Cannabis flower macro (representative photo)',
      'Garretttaggs55',
      'CC BY-SA 3.0',
      'https://creativecommons.org/licenses/by-sa/3.0',
      'https://commons.wikimedia.org/wiki/File:Cannabis_macro.JPG'
    ),
    localPhoto(
      'kush-trichome.jpg',
      'Close-up of cannabis trichomes (representative photo)',
      'Derrylwc',
      'Public domain',
      '',
      'https://commons.wikimedia.org/wiki/File:Kush-trichome-closeup.jpg'
    )
  ];

  var DATA_NOTE =
    'A friendly guide built from commonly reported strain information. Potency changes with the grower, ' +
    'batch and product, so treat the numbers as a rough reference.';
  var LINEAGE_NOTE = 'Lineage is commonly reported rather than genetically verified.';
  var EFFECTS_NOTE = 'Effects are based on common reports and vary from person to person.';
  var GROW_NOTE = 'Grow times and yields vary with environment, phenotype and method.';

  GG.STRAINS = [
    {
      slug: 'og-kush',
      name: 'OG Kush',
      abbreviation: 'Og',
      aliases: ['Premium OG Kush'],
      classification: 'Hybrid',
      tagline: 'The earthy Kush classic behind a hundred modern hybrids.',
      description: [
        'OG Kush is one of those strains you run into everywhere — in dispensaries, in family trees, and in conversation. It first made noise in California in the 1990s and quickly became the benchmark for a certain kind of Kush: earthy, piney, and a little bit gassy.',
        'The high usually lands behind the eyes before spreading into a relaxed, chatty body buzz. It is a solid evening strain for a movie, a long dinner, or music, but it can hit harder than newer smokers expect — start low and give it time.'
      ],
      facts: [
        'OG Kush is all over the cannabis family tree — GSC, Bruce Banner and plenty of modern classics trace part of their story back to it.',
        'Nobody can agree on what “OG” stands for. Original Gangster and Ocean Grown are the two favourite theories, and the debate is still going.',
        'The aroma is love-it-or-hate-it: earthy, piney, and a little funky, with a citrus note hiding underneath.'
      ],
      photo: {
        src: 'assets/images/og-kush-pd.jpg',
        alt: 'Close-up of an OG Kush cannabis flower',
        author: 'Coaster420',
        license: 'Public domain',
        licenseUrl: '',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:OG_Kush.jpg',
        representative: false
      },
      photoStage: 'cut',
      plantPhoto: PLANT_REFERENCE,
      detailPhotos: [
        {
          src: 'assets/images/og-kush-plant.jpg',
          alt: 'OG Kush branches hanging to dry after harvest',
          author: 'Psychonaught',
          license: 'Public domain',
          licenseUrl: '',
          sourceUrl: 'https://commons.wikimedia.org/wiki/File:OG_Kush_Plant.jpg',
          representative: false,
          stageLabel: 'Harvest & dry'
        }
      ],
      thc: 25,
      cbd: 0,
      effects: {
        positive: ['hungry', 'relaxed', 'sleepy'],
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: ['woody', 'pine', 'earthy'],
      terpenes: [
        {
          key: 'myrcene',
          prominent: true,
          description:
            'Earthy and herbal, with that classic forest-floor Kush smell.'
        },
        { key: 'limonene' },
        { key: 'caryophyllene' }
      ],
      indicators: { calming: 45, thc: 80 },
      scienceNote: 'Reference profile only. No laboratory verification or certification is implied.',
      genetics: {
        parents: [
          { name: 'Chemdawg', abbr: 'Cd', color: 'magenta' },
          { name: 'Hindu Kush', abbr: 'Hk', color: 'yellow' }
        ],
        children: [
          { name: 'GSC', abbr: 'Gsc', color: 'magenta', slug: 'gsc' },
          { name: 'Bruce Banner', abbr: 'Bnr', color: 'magenta', slug: 'bruce-banner' }
        ],
        note: LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: 'Hybrid' },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: 'Difficult' },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: 'Tall' },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: 'Medium' },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: '7–9' }
        ],
        notes: [
          'Best suited to growers with some experience.',
          'Grows well indoors or outdoors.',
          'Prefers a dry climate.',
          'Plants get large, so give them room.',
          'Flowering takes about eight weeks.',
          'Outdoor plants usually finish in early October in the northern hemisphere.',
          'Expect a medium yield.',
          'Four phenotypes are often reported, with three leaning sativa and one leaning indica.'
        ],
        note:
          'Reference grow information. Outdoor finish dates depend on hemisphere, latitude and climate; ' +
          'treat them as a general reference, not a schedule.'
      },
      sources: [DATA_NOTE, LINEAGE_NOTE, EFFECTS_NOTE, GROW_NOTE]
    },

    {
      slug: 'blue-dream',
      name: 'Blue Dream',
      abbreviation: 'Bd',
      aliases: ['Blue Dream Haze'],
      classification: 'Hybrid',
      tagline: 'A berry-sweet sativa hybrid that keeps things light and creative.',
      description: [
        'Blue Dream is the cannabis equivalent of a sunny afternoon. The Blueberry parent brings a sweet berry aroma, while Haze adds a bright, clear-headed lift that never feels too heavy.',
        'It is a go-to for daytime creativity, walks and low-key social plans. The high is usually happy and functional rather than couch-locking, which is why it has stayed popular with both new and experienced smokers.'
      ],
      facts: [
        'Blue Dream is the friendly overachiever of the cannabis world: easy to grow, easy to find and hard to dislike.',
        'Its name comes from the Blueberry parent, while the Haze side is what gives it that bright, creative lift.',
        'You will usually smell berries first, then a sweet herbal note that lingers in the air.'
      ],
      photo: {
        src: 'assets/images/blue-dream.jpg',
        alt: 'Blue Dream cannabis plant in flower',
        author: 'My 420 Tours',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Blooming_Blue_Dream.jpg',
        representative: false
      },
      photoStage: 'plant',
      cutPhoto: {
        src: 'assets/images/blue-dream-cut.jpg',
        alt: 'Dried Blue Dream cannabis flower',
        author: 'Nickel Bag of Funk',
        license: 'CC BY 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Blue_Dream_(cannabis).jpg',
        representative: false
      },
      thc: 21,
      cbd: 0.1,
      effects: {
        positive: ['happy', 'creative', 'energetic'],
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: ['berry', 'sweet', 'herbal'],
      terpenes: [
        { key: 'myrcene', prominent: true, description: 'Sweet and herbal, like blueberries warmed in the sun.' },
        { key: 'pinene' },
        { key: 'caryophyllene' }
      ],
      indicators: { calming: 40, thc: 70 },
      scienceNote: 'Reference profile only. No laboratory verification or certification is implied.',
      genetics: {
        parents: [
          { name: 'Blueberry', abbr: 'Bb', color: 'magenta' },
          { name: 'Haze', abbr: 'Hz', color: 'yellow' }
        ],
        children: [],
        note: LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: 'Hybrid' },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: 'Easy' },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: 'Tall' },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: 'High' },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: '10–12' }
        ],
        notes: [
          'A good choice for first-time growers.',
          'Happy indoors or outdoors.',
          'Tall, vigorous plants.',
          'Usually a high yielder.'
        ],
        note: GROW_NOTE
      },
      sources: [DATA_NOTE, LINEAGE_NOTE, EFFECTS_NOTE, GROW_NOTE]
    },

    {
      slug: 'sour-diesel',
      name: 'Sour Diesel',
      abbreviation: 'Sd',
      aliases: ['Sour D'],
      classification: 'Sativa',
      tagline: 'Sharp citrus, fuel and a fast-moving daytime buzz.',
      description: [
        'Sour Diesel smells like a gas station squeezed a lemon — and somehow that is the appeal. The sharp citrus and diesel notes come through on the inhale, with an earthy, skunky finish that lingers.',
        'The high is usually energetic and heady, the kind that makes a boring afternoon feel a little more interesting. It is a classic daytime strain for people who like a sativa that actually feels lively.'
      ],
      facts: [
        'Sour Diesel earned its name honestly: open the jar and you get sharp citrus, fuel and a whiff of skunk.',
        'It is a classic daytime pick for people who want energy without feeling wired.',
        'The Chemdawg side of its family gives it that pungent, diesel-heavy personality.'
      ],
      photo: {
        src: 'assets/images/sour-diesel.jpg',
        alt: 'Sour Diesel cannabis flower on the plant',
        author: 'Alapoet',
        license: 'CC BY 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cannabis_(Sour_Diesel)_Flower.jpg',
        representative: false
      },
      photoStage: 'plant',
      cutPhoto: {
        src: 'assets/images/sour-diesel-cut.jpg',
        alt: 'Dried Sour Diesel cannabis flower',
        author: 'Sour Diesel',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sour_Diesel_Strain.jpg',
        representative: false
      },
      thc: 22,
      cbd: 0.1,
      effects: {
        positive: ['energetic', 'happy', 'euphoric'],
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: ['diesel', 'citrus', 'earthy'],
      terpenes: [
        { key: 'limonene', prominent: true, description: 'Bright citrus that cuts through the fuel.' },
        { key: 'caryophyllene' },
        { key: 'myrcene' }
      ],
      indicators: { calming: 30, thc: 75 },
      scienceNote: 'Reference profile only. No laboratory verification or certification is implied.',
      genetics: {
        parents: [
          { name: 'Chemdawg', abbr: 'Cd', color: 'magenta' },
          { name: 'Super Skunk', abbr: 'Ss', color: 'yellow' }
        ],
        children: [],
        note: LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: 'Sativa' },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: 'Moderate' },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: 'Tall' },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: 'Medium' },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: '10–12' }
        ],
        notes: [
          'Best for growers with a little experience.',
          'Works indoors or outdoors.',
          'Plants stretch, so plan for the height.',
          'Flowering takes longer than average.'
        ],
        note: GROW_NOTE
      },
      sources: [DATA_NOTE, LINEAGE_NOTE, EFFECTS_NOTE, GROW_NOTE]
    },

    {
      slug: 'northern-lights',
      name: 'Northern Lights',
      abbreviation: 'Nl',
      aliases: ['NL'],
      classification: 'Indica',
      tagline: 'The old-school indica for slow evenings and deep relaxation.',
      description: [
        'Northern Lights is one of the strains that built the modern cannabis scene. It is compact, resinous and famously easy to grow, with an earthy, piney aroma that feels more cozy than flashy.',
        'The high is a slow, heavy body relaxation that often ends with a snack and a nap. This is not the strain for a busy to-do list; it is the one you reach for when the day is done.'
      ],
      facts: [
        'Northern Lights is the old-school indica people picture when they hear “couch-lock” — cozy, quiet and built for a slow evening.',
        'It is compact and resinous, which is part of why growers have kept it around since the 1980s.',
        'The Afghani side brings the earthy calm, while the Thai side keeps it from feeling flat.'
      ],
      photo: {
        src: 'assets/images/northern-lights.jpg',
        alt: 'Northern Lights cannabis plants flowering under light',
        author: 'User Dan',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Northern-lights-flowering.jpg',
        representative: false
      },
      photoStage: 'plant',
      thc: 20,
      cbd: 0.1,
      effects: {
        positive: ['relaxed', 'sleepy', 'happy'],
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: ['pine', 'earthy', 'sweet'],
      terpenes: [
        { key: 'myrcene', prominent: true, description: 'Earthy pine with a soft, sweet finish.' },
        { key: 'caryophyllene' },
        { key: 'pinene' }
      ],
      indicators: { calming: 70, thc: 65 },
      scienceNote: 'Reference profile only. No laboratory verification or certification is implied.',
      genetics: {
        parents: [
          { name: 'Afghani', abbr: 'Af', color: 'magenta' },
          { name: 'Thai', abbr: 'Th', color: 'yellow' }
        ],
        children: [],
        note: LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: 'Indica' },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: 'Easy' },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: 'Short' },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: 'Medium' },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: '7–9' }
        ],
        notes: [
          'Beginner-friendly.',
          'Grows indoors or outdoors.',
          'Compact, bushy plants.',
          'A relatively short flowering time.'
        ],
        note: GROW_NOTE
      },
      sources: [DATA_NOTE, LINEAGE_NOTE, EFFECTS_NOTE, GROW_NOTE]
    },

    {
      slug: 'gsc',
      name: 'GSC',
      abbreviation: 'Gsc',
      aliases: ['Girl Scout Cookies'],
      classification: 'Hybrid',
      tagline: 'A dessert-sweet hybrid with a relaxed, happy buzz.',
      description: [
        'GSC — better known as Girl Scout Cookies — tastes like a bakery and hits like a proper hybrid. Sweet dough and mint sit on top, with a peppery, earthy note underneath.',
        'The high usually starts in the head with a warm, happy buzz before settling into the body. It is a good pick for a lazy afternoon, a creative project or a night in with friends.'
      ],
      facts: [
        'GSC is short for Girl Scout Cookies, and the dessert name fits the sweet, minty flavour.',
        'OG Kush and Durban Poison are the parents most people point to, which explains the relaxed body and the heady lift.',
        'A little goes a long way with GSC — it is friendly, but it is not a lightweight hybrid.'
      ],
      photo: {
        src: 'assets/images/cannabis-colors-macro.jpg',
        alt: 'Representative close-up of a cannabis flower',
        author: 'Jbarraco',
        license: 'CC BY 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cannabis_Colors_Macro.jpg',
        representative: true
      },
      photoStage: 'cut',
      thc: 24,
      cbd: 0.1,
      effects: {
        positive: ['happy', 'relaxed', 'hungry'],
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: ['sweet', 'earthy', 'mint'],
      terpenes: [
        { key: 'caryophyllene', prominent: true, description: 'Peppery and sweet, like a fresh cookie with a spicy edge.' },
        { key: 'limonene' },
        { key: 'myrcene' }
      ],
      indicators: { calming: 55, thc: 75 },
      scienceNote: 'Reference profile only. No laboratory verification or certification is implied.',
      genetics: {
        parents: [
          { name: 'OG Kush', abbr: 'Og', color: 'blue', slug: 'og-kush' },
          { name: 'Durban Poison', abbr: 'Dp', color: 'yellow' }
        ],
        children: [],
        note: LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: 'Hybrid' },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: 'Moderate' },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: 'Average' },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: 'Medium' },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: '7–9' }
        ],
        notes: [
          'Best for growers with a little experience.',
          'Grows indoors or outdoors.',
          'Medium, bushy plants.',
          'Usually a medium yielder.'
        ],
        note: GROW_NOTE
      },
      sources: [DATA_NOTE, LINEAGE_NOTE, EFFECTS_NOTE, GROW_NOTE]
    },

    {
      slug: 'bruce-banner',
      name: 'Bruce Banner',
      abbreviation: 'Bnr',
      aliases: [],
      classification: 'Sativa',
      tagline: 'A gassy, fast-hitting sativa with serious punch.',
      description: [
        'Bruce Banner is named after the Hulk for a reason. This one is known for a strong, fast-hitting high that can catch you off guard if you are new to it.',
        'The flavour is sweet and diesel-heavy, with a citrus edge that keeps it from tasting too heavy. Experienced smokers love the rush; everyone else should start with a small amount and see how it lands.'
      ],
      facts: [
        'Bruce Banner gets its name from the Hulk, and the nickname fits: it is known for a strong, fast-hitting high.',
        'OG Kush and Strawberry Diesel give it a sweet, gassy flavour that is easier to enjoy than its reputation suggests.',
        'It is a popular pick for experienced smokers, but new smokers should definitely start slow.'
      ],
      photo: {
        src: 'assets/images/macro-bud.jpg',
        alt: 'Representative macro photo of a cannabis flower',
        author: 'yogi Bushby',
        license: 'CC BY 2.5',
        licenseUrl: 'https://creativecommons.org/licenses/by/2.5',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Macro_cannabis_bud.jpg',
        representative: true
      },
      photoStage: 'cut',
      thc: 26,
      cbd: 0.1,
      effects: {
        positive: ['creative', 'energetic', 'euphoric'],
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: ['diesel', 'sweet', 'citrus'],
      terpenes: [
        { key: 'myrcene', prominent: true, description: 'Sweet diesel with a smooth, earthy backbone.' },
        { key: 'limonene' },
        { key: 'caryophyllene' }
      ],
      indicators: { calming: 35, thc: 85 },
      scienceNote: 'Reference profile only. No laboratory verification or certification is implied.',
      genetics: {
        parents: [
          { name: 'OG Kush', abbr: 'Og', color: 'blue', slug: 'og-kush' },
          { name: 'Strawberry Diesel', abbr: 'Sd', color: 'yellow' }
        ],
        children: [],
        note: LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: 'Sativa' },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: 'Difficult' },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: 'Tall' },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: 'High' },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: '10–12' }
        ],
        notes: [
          'Best for experienced growers.',
          'Grows indoors or outdoors.',
          'Tall plants.',
          'Usually a high yielder.'
        ],
        note: GROW_NOTE
      },
      sources: [DATA_NOTE, LINEAGE_NOTE, EFFECTS_NOTE, GROW_NOTE]
    },

    {
      slug: 'purple-haze',
      name: 'Purple Haze',
      abbreviation: 'Ph',
      aliases: [],
      classification: 'Sativa',
      tagline: 'A berry-sweet sativa with a bright, creative lift.',
      description: [
        'Purple Haze is a psychedelic-era classic with a berry-sweet aroma and a hint of spice. The purple colour is not guaranteed — it depends on the phenotype and growing conditions — but the flavour is reliably fruity and herbal.',
        'The high is usually cerebral and energetic, the kind that pairs well with music, art or a long walk. It is a daytime strain, not a bedtime one.'
      ],
      facts: [
        'Purple Haze is more than a Jimi Hendrix song — it is a sativa with a berry-sweet, slightly spicy aroma.',
        'Cooler growing conditions can bring out purple shades, though the colour depends on the phenotype.',
        'The Haze in its family gives it a cerebral, creative energy that is best saved for daytime.'
      ],
      photo: {
        src: 'assets/images/purple-haze.webp',
        alt: 'Close-up of a Purple Haze cannabis flower with purple leaves',
        author: 'PlacidDocu',
        license: 'CC BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cannabis_Sativa_Purple_Haze.webp',
        representative: false
      },
      photoStage: 'plant',
      thc: 19,
      cbd: 0.1,
      effects: {
        positive: ['creative', 'energetic', 'happy'],
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: ['berry', 'sweet', 'earthy'],
      terpenes: [
        { key: 'myrcene', prominent: true, description: 'Berries and herbs with a hint of forest floor.' },
        { key: 'pinene' },
        { key: 'caryophyllene' }
      ],
      indicators: { calming: 35, thc: 60 },
      scienceNote: 'Reference profile only. No laboratory verification or certification is implied.',
      genetics: {
        parents: [
          { name: 'Purple Thai', abbr: 'Pt', color: 'magenta' },
          { name: 'Haze', abbr: 'Hz', color: 'yellow' }
        ],
        children: [],
        note: LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: 'Sativa' },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: 'Moderate' },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: 'Tall' },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: 'Medium' },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: '10–12' }
        ],
        notes: [
          'Best for growers with a little experience.',
          'Grows indoors or outdoors.',
          'Tall plants.',
          'Flowering takes longer than average.'
        ],
        note: GROW_NOTE
      },
      sources: [DATA_NOTE, LINEAGE_NOTE, EFFECTS_NOTE, GROW_NOTE]
    },

    {
      slug: 'jack-herer',
      name: 'Jack Herer',
      abbreviation: 'Jh',
      aliases: [],
      classification: 'Sativa',
      tagline: 'Pine, citrus and a clear-headed creative spark.',
      description: [
        'Jack Herer is named after the activist and author who spent decades pushing back against cannabis prohibition. The strain itself is a Dutch coffee-shop classic: piney, citrusy and a little bit floral.',
        'The high is usually clear and energetic, with a happy head buzz that does not leave you glued to the sofa. It is a favourite for creative work, chores and anyone who wants a sativa that feels sharp rather than jittery.'
      ],
      facts: [
        'Jack Herer is named after the cannabis activist and author of “The Emperor Wears No Clothes”.',
        'The smell is unmistakable: pine, citrus and a floral note that is almost perfumed.',
        'Terpinolene gives it that bright, clear-headed energy people love for creative projects.'
      ],
      photo: {
        src: 'assets/images/jack-herer.jpg',
        alt: 'Jack Herer cannabis flower against a white background',
        author: 'Forcefield21',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:KOROVA_OR_FLOWER_WE_OG_JACK_HERER_MACRO_1080.png',
        representative: false
      },
      photoStage: 'cut',
      thc: 21,
      cbd: 0.1,
      effects: {
        positive: ['creative', 'energetic', 'happy'],
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: ['pine', 'earthy', 'citrus'],
      terpenes: [
        { key: 'terpinolene', prominent: true, description: 'Floral and piney with a bright, almost citrus lift.' },
        { key: 'pinene' },
        { key: 'caryophyllene' }
      ],
      indicators: { calming: 35, thc: 70 },
      scienceNote: 'Reference profile only. No laboratory verification or certification is implied.',
      genetics: {
        parents: [
          { name: 'Haze', abbr: 'Hz', color: 'magenta' },
          { name: 'Northern Lights #5', abbr: 'Nl5', color: 'yellow' }
        ],
        children: [],
        note: LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: 'Sativa' },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: 'Moderate' },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: 'Tall' },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: 'High' },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: '7–9' }
        ],
        notes: [
          'Best for growers with a little experience.',
          'Grows indoors or outdoors.',
          'Tall plants.',
          'Usually a high yielder.'
        ],
        note: GROW_NOTE
      },
      sources: [DATA_NOTE, LINEAGE_NOTE, EFFECTS_NOTE, GROW_NOTE]
    },

    {
      slug: 'white-widow',
      name: 'White Widow',
      abbreviation: 'Ww',
      aliases: [],
      classification: 'Hybrid',
      tagline: 'A frosty Dutch classic with a balanced, social high.',
      description: [
        'White Widow earned its name from the thick layer of white trichomes that covers the buds. It became a Dutch coffee-shop staple in the 1990s and is still one of the easiest strains to recognise in a jar.',
        'The high is balanced and social, with a happy head buzz and a gentle body relaxation. It is a good choice for a low-key hangout or an afternoon where you want to stay present.'
      ],
      facts: [
        'White Widow got its name from the frosty white trichomes that cover the buds — a look that still sells it today.',
        'It is a balanced hybrid with a happy, social high that does not glue you to the couch.',
        'The Brazilian sativa and South Indian indica parents give it a mix of energy and calm.'
      ],
      photo: {
        src: 'assets/images/white-widow.jpg',
        alt: 'White Widow cannabis plant in flower',
        author: 'Yuri Che',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:White_Widow_(Green_House_Seeds)_01.jpg',
        representative: false
      },
      photoStage: 'plant',
      cutPhoto: {
        src: 'assets/images/white-widow-cut.jpg',
        alt: 'Dried G-13 and White Widow hybrid cannabis flower',
        author: 'KungPaoChicken',
        license: 'Public domain',
        licenseUrl: '',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:G-13_White_Widow_hybrid.jpg',
        representative: true
      },
      thc: 22,
      cbd: 0.2,
      effects: {
        positive: ['relaxed', 'happy', 'creative'],
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: ['earthy', 'pine', 'sweet'],
      terpenes: [
        { key: 'myrcene', prominent: true, description: 'Earthy and piney with a clean, resinous finish.' },
        { key: 'pinene' },
        { key: 'caryophyllene' }
      ],
      indicators: { calming: 50, thc: 70 },
      scienceNote: 'Reference profile only. No laboratory verification or certification is implied.',
      genetics: {
        parents: [
          { name: 'Brazilian Sativa', abbr: 'Bs', color: 'magenta' },
          { name: 'South Indian Indica', abbr: 'Si', color: 'yellow' }
        ],
        children: [],
        note: LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: 'Hybrid' },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: 'Moderate' },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: 'Average' },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: 'High' },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: '7–9' }
        ],
        notes: [
          'Best for growers with a little experience.',
          'Grows indoors or outdoors.',
          'Compact, resinous plants.',
          'Usually a high yielder.'
        ],
        note: GROW_NOTE
      },
      sources: [DATA_NOTE, LINEAGE_NOTE, EFFECTS_NOTE, GROW_NOTE]
    },

    {
      slug: 'ak-47',
      name: 'AK-47',
      abbreviation: 'Ak',
      aliases: ['AK47'],
      classification: 'Hybrid',
      tagline: 'Sweet, earthy and stronger than it looks.',
      description: [
        'AK-47 has been around since the 1990s and picked up plenty of cannabis-cup hardware along the way. The name is a nod to the knockout high rather than a military lineage, and the smoke is surprisingly smooth and sweet for such a potent hybrid.',
        'The flavour leans earthy and citrusy, with a mellow herbal finish. The high is usually happy and relaxing, but it can creep up on you, so it is worth pacing yourself.'
      ],
      facts: [
        'AK-47 is not named for the gun — it is more about how hard the high hits when it lands.',
        'It has a sweet, earthy smell with a citrus edge, which makes the smoke surprisingly smooth.',
        'It picked up a reputation in 1990s cannabis cups and has not really left the spotlight since.'
      ],
      photo: {
        src: 'assets/images/cannabis-macro.jpg',
        alt: 'Representative macro photo of a cannabis flower',
        author: 'Garretttaggs55',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cannabis_macro.JPG',
        representative: true
      },
      photoStage: 'cut',
      thc: 23,
      cbd: 0.1,
      effects: {
        positive: ['happy', 'relaxed', 'creative'],
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: ['earthy', 'sweet', 'citrus'],
      terpenes: [
        { key: 'myrcene', prominent: true, description: 'Sweet earth and spice with a mellow herbal finish.' },
        { key: 'limonene' },
        { key: 'caryophyllene' }
      ],
      indicators: { calming: 50, thc: 75 },
      scienceNote: 'Reference profile only. No laboratory verification or certification is implied.',
      genetics: {
        parents: [
          { name: 'Colombian', abbr: 'Cl', color: 'magenta' },
          { name: 'Thai', abbr: 'Th', color: 'yellow' }
        ],
        children: [],
        note: 'Commonly reported as a multi-lineage cross. ' + LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: 'Hybrid' },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: 'Moderate' },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: 'Average' },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: 'High' },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: '7–9' }
        ],
        notes: [
          'Best for growers with a little experience.',
          'Grows indoors or outdoors.',
          'Medium-sized plants.',
          'Usually a high yielder.'
        ],
        note: GROW_NOTE
      },
      sources: [DATA_NOTE, LINEAGE_NOTE, EFFECTS_NOTE, GROW_NOTE]
    },

    {
      slug: 'wedding-cake',
      name: 'Wedding Cake',
      abbreviation: 'Wc',
      aliases: ['Triangle Mints'],
      classification: 'Hybrid',
      tagline: 'Vanilla frosting, peppery dough and a cozy body high.',
      description: [
        'Wedding Cake tastes like the last bite of a vanilla dessert: sweet, creamy and a little peppery. The buds are usually dense and frosty, with an aroma that gets louder as you break them up.',
        'The high is relaxed and happy, with a gentle body buzz that is great for a quiet night in. It is a modern dessert strain that lives up to the hype.'
      ],
      facts: [
        'Wedding Cake tastes like the name suggests: vanilla frosting, sweet dough and a peppery finish.',
        'It is a Triangle Kush and Animal Mints cross, which gives it a relaxed body high with a happy head buzz.',
        'The buds tend to be dense and frosty, with a creamy aroma that gets stronger as you break them up.'
      ],
      photo: {
        src: 'assets/images/wedding-cake.jpg',
        alt: 'Wedding Cake cannabis flower against a white background',
        author: 'Forcefield21',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wedding_Cake_Cannabis_Strain.jpg',
        representative: false
      },
      photoStage: 'cut',
      thc: 25,
      cbd: 0.1,
      effects: {
        positive: ['relaxed', 'happy', 'hungry'],
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: ['vanilla', 'sweet', 'earthy'],
      terpenes: [
        { key: 'caryophyllene', prominent: true, description: 'Sweet pepper and vanilla frosting.' },
        { key: 'limonene' },
        { key: 'myrcene' }
      ],
      indicators: { calming: 60, thc: 80 },
      scienceNote: 'Reference profile only. No laboratory verification or certification is implied.',
      genetics: {
        parents: [
          { name: 'Triangle Kush', abbr: 'Tk', color: 'magenta' },
          { name: 'Animal Mints', abbr: 'Am', color: 'yellow' }
        ],
        children: [],
        note: LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: 'Hybrid' },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: 'Difficult' },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: 'Average' },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: 'Medium' },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: '7–9' }
        ],
        notes: [
          'Best for experienced growers.',
          'Grows indoors or outdoors.',
          'Medium plants.',
          'Usually a medium yield.'
        ],
        note: GROW_NOTE
      },
      sources: [DATA_NOTE, LINEAGE_NOTE, EFFECTS_NOTE, GROW_NOTE]
    },

    {
      slug: 'gelato',
      name: 'Gelato',
      abbreviation: 'Gl',
      aliases: ['Gelato 33'],
      classification: 'Hybrid',
      tagline: 'Creamy, citrusy and seriously frosty.',
      description: [
        'Gelato is a dessert strain with a name that fits: sweet cream, citrus and a peppery exhale. It is a cross of Sunset Sherbet and Thin Mint GSC, and the family resemblance shows in its frosty buds and colourful leaves.',
        'The high is usually happy and relaxed, with a creative head buzz that does not flatten you. It is a solid choice for a lazy afternoon or a night of good food and better conversation.'
      ],
      facts: [
        'Gelato is the dessert strain that became a modern classic — sweet, creamy and seriously frosty.',
        'Sunset Sherbet and Thin Mint GSC are its parents, which explains the minty, citrusy flavour and the relaxed-but-happy high.',
        'The name covers a family of phenotypes; Gelato #33 is the one most people mean.'
      ],
      photo: {
        src: 'assets/images/kush-trichome.jpg',
        alt: 'Representative close-up of cannabis flower trichomes',
        author: 'Derrylwc',
        license: 'Public domain',
        licenseUrl: '',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kush-trichome-closeup.jpg',
        representative: true
      },
      photoStage: 'cut',
      thc: 26,
      cbd: 0.1,
      effects: {
        positive: ['happy', 'relaxed', 'creative'],
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: ['sweet', 'citrus', 'earthy'],
      terpenes: [
        { key: 'caryophyllene', prominent: true, description: 'Creamy citrus with a peppery exhale.' },
        { key: 'limonene' },
        { key: 'humulene' }
      ],
      indicators: { calming: 45, thc: 85 },
      scienceNote: 'Reference profile only. No laboratory verification or certification is implied.',
      genetics: {
        parents: [
          { name: 'Sunset Sherbet', abbr: 'Ss', color: 'magenta' },
          { name: 'Thin Mint GSC', abbr: 'Tm', color: 'yellow' }
        ],
        children: [],
        note: LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: 'Hybrid' },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: 'Moderate' },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: 'Average' },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: 'Medium' },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: '7–9' }
        ],
        notes: [
          'Best for growers with a little experience.',
          'Grows indoors or outdoors.',
          'Medium plants.',
          'Usually a medium yield.'
        ],
        note: GROW_NOTE
      },
      sources: [DATA_NOTE, LINEAGE_NOTE, EFFECTS_NOTE, GROW_NOTE]
    }
  ];

  /*
   * Expanded strain library.
   * The compact rows in strains-extra.js are expanded into full profile objects
   * here so every strain can use the same data-driven pages, cards and compare UI.
   */
  var EXTRA_TERPENE_DESCRIPTIONS = {
    myrcene: 'Earthy and herbal, with a soft, resinous finish.',
    limonene: 'Bright citrus with a clean, lifted edge.',
    caryophyllene: 'Peppery and warm, with a spicy exhale.',
    pinene: 'Pine needles and fresh forest air.',
    terpinolene: 'Floral and herbal, with a hint of citrus.',
    humulene: 'Hoppy and herbal, like a fresh garden.'
  };
  var EXTRA_EFFECT_ORDER = ['happy', 'relaxed', 'euphoric', 'creative', 'energetic', 'sleepy', 'hungry'];

  function extraHash(text) {
    var hash = 0;
    for (var i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  }

  function extraArticle(word) {
    return /^[aeiou]/i.test(word) ? 'an ' : 'a ';
  }

  function extraCap(word) {
    return word ? word.charAt(0).toUpperCase() + word.slice(1) : '';
  }

  function extraAbbr(name) {
    var words = name.replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    var word = words[0] || 'Gg';
    return (word.charAt(0) + (word.charAt(1) || 'g')).toUpperCase();
  }

  function extraPhoto(index) {
    var pool = GG.PHOTO_DETAILS.concat([CUT_REFERENCE]);
    return pool[index % pool.length];
  }

  function extraLabels(keys, table) {
    return (keys || []).map(function (key) {
      return table[key] ? table[key].label : key;
    });
  }

  function buildExtraStrain(row, index) {
    var name = row.n;
    var type = row.t;
    var typeLower = type.toLowerCase();
    var effects = row.e && row.e.length ? row.e.slice() : ['happy', 'relaxed', 'euphoric'];
    effects.sort(function (a, b) {
      return EXTRA_EFFECT_ORDER.indexOf(a) - EXTRA_EFFECT_ORDER.indexOf(b);
    });
    var flavours = row.f && row.f.length ? row.f : ['sweet', 'earthy', 'citrus'];
    var terpenes = row.tp && row.tp.length ? row.tp : ['myrcene', 'limonene', 'caryophyllene'];
    var parents = (row.p || []).filter(function (parent) {
      return parent && parent.toLowerCase() !== name.toLowerCase();
    }).slice(0, 2);
    var effectLabels = extraLabels(effects, GG.EFFECTS);
    var flavourLabels = extraLabels(flavours, GG.FLAVOURS);
    var terpeneLabels = extraLabels(terpenes, GG.TERPENES);
    var effectText = effectLabels.slice(0, 3).join(', ').toLowerCase();
    var hash = extraHash(row.s || name);
    var useCase =
      type === 'Indica'
        ? 'a quiet night in'
        : type === 'Sativa'
          ? 'daytime plans and creative projects'
          : 'a lazy afternoon or a night with friends';
    var lineageSentence =
      parents.length >= 2
        ? 'Its reported parents are ' + parents[0] + ' and ' + parents[1] + '.'
        : parents.length === 1
          ? 'It is commonly linked to ' + parents[0] + '.'
          : 'Its exact family tree is not widely documented.';

    var taglines = [
      extraCap(extraArticle(typeLower)) + typeLower + ' with ' + flavourLabels[0].toLowerCase() + ', ' +
        flavourLabels[1].toLowerCase() + ' notes and a ' +
        (type === 'Indica' ? 'slow, cozy' : type === 'Sativa' ? 'bright, heady' : 'balanced, easygoing') +
        ' finish.',
      extraCap(flavourLabels[0]) + ' on the nose, ' + flavourLabels[1].toLowerCase() + ' on the exhale.',
      extraCap(flavourLabels[0]) + '-forward ' + typeLower + ' with a ' +
        (type === 'Indica' ? 'soft' : type === 'Sativa' ? 'clean' : 'rounded') + ' finish.',
      extraCap(flavourLabels[0]) + ' and ' + flavourLabels[1].toLowerCase() + ' notes, with a ' +
        (type === 'Indica' ? 'cozy' : type === 'Sativa' ? 'bright' : 'balanced') + ' edge.'
    ];

    var descriptions = [
      [
        name + ' is ' + extraArticle(typeLower) + typeLower + ' strain with ' + flavourLabels[0].toLowerCase() +
          ' and ' + flavourLabels[1].toLowerCase() + ' notes on the nose. ' + lineageSentence +
          ' People often reach for it when they want that ' + effectText + ' high.',
        'The high is usually described as ' + effectText + ', and the exhale keeps ' + flavourLabels[0].toLowerCase() +
          ' in the mix. It fits ' + useCase + ', especially if you like ' + flavourLabels[1].toLowerCase() + ' strains.'
      ],
      [
        name + ' brings ' + flavourLabels[0].toLowerCase() + ' and ' + flavourLabels[1].toLowerCase() +
          ' notes to the table, with effects that are usually described as ' + effectText + '. ' + lineageSentence,
        'Expect ' + effectText + ' effects with plenty of ' + flavourLabels[0].toLowerCase() +
          ' on the exhale. It is a solid pick for ' + useCase + '.'
      ],
      [
        name + ' is ' + extraArticle(typeLower) + typeLower + ' that leads with ' + flavourLabels[0].toLowerCase() +
          ' and ' + flavourLabels[1].toLowerCase() + ' notes. ' + lineageSentence,
        'People tend to describe it as ' + effectText + '. Start slowly if you are new — ' + name +
          ' can feel stronger than the ' + typeLower + ' label suggests.'
      ]
    ];

    var facts = [
      row.b
        ? name + ' is linked to ' + row.b + ' in public seed listings.'
        : name + ' is ' + extraArticle(typeLower) + typeLower + ' with ' + flavourLabels[0].toLowerCase() + ' on the nose.',
      parents.length >= 2
        ? 'Reported parents: ' + parents.join(' and ') + '.'
        : parents.length === 1
          ? 'It is commonly linked to ' + parents[0] + '.'
          : 'Its exact family tree is not widely documented.',
      terpeneLabels[0] + ' leads the aroma, bringing ' + (GG.TERPENES[terpenes[0]] || { aroma: 'herbal' }).aroma + ' notes.'
    ];

    var height = row.h
      ? row.h >= 130
        ? 'Tall'
        : row.h <= 90
          ? 'Short'
          : 'Average'
      : type === 'Indica'
        ? 'Short'
        : type === 'Sativa'
          ? 'Tall'
          : 'Average';
    var yieldSize = row.y
      ? row.y >= 500
        ? 'High'
        : row.y <= 300
          ? 'Low'
          : 'Medium'
      : 'Medium';
    var flowering = row.fd
      ? row.fd < 60
        ? '7–9'
        : row.fd <= 84
          ? '10–12'
          : '>12'
      : type === 'Sativa'
        ? '10–12'
        : '7–9';
    var difficulty = type === 'Indica' ? 'Easy' : 'Moderate';
    var heightPhrase = height === 'Short' ? 'compact' : height === 'Tall' ? 'tall' : 'medium-sized';
    var growNotes = [
      'Best for growers with ' + (difficulty === 'Easy' ? 'a little experience.' : 'some experience.'),
      'Grows indoors or outdoors.',
      'Plants usually stay ' + heightPhrase + '.',
      'Expect a ' + yieldSize.toLowerCase() + ' yield.'
    ];
    if (row.fd) {
      growNotes.push('Flowering takes about ' + Math.round(row.fd) + ' days.');
    } else {
      growNotes.push('Flowering time varies by phenotype.');
    }

    return {
      slug: row.s,
      name: name,
      abbreviation: extraAbbr(name),
      aliases: row.a || [],
      classification: type,
      tagline: taglines[(hash + index) % taglines.length],
      description: descriptions[(hash + index) % descriptions.length],
      facts: facts,
      photo: extraPhoto(index),
      photoStage: 'cut',
      plantPhoto: PLANT_REFERENCE,
      thc: row.th,
      cbd: row.cb,
      effects: {
        positive: effects.slice(0, 3),
        negative: ['dry-mouth', 'dry-eyes', 'dizzy']
      },
      reports: null,
      flavours: flavours.slice(0, 3),
      terpenes: terpenes.slice(0, 3).map(function (key, terpeneIndex) {
        return {
          key: key,
          prominent: terpeneIndex === 0,
          description: EXTRA_TERPENE_DESCRIPTIONS[key] || 'A distinctive aroma in this strain.'
        };
      }),
      indicators: {
        calming: type === 'Indica' ? 70 : type === 'Sativa' ? 30 : 50,
        thc: Math.max(30, Math.min(95, Math.round((row.th / 35) * 100)))
      },
      scienceNote: 'Aroma and potency details are a reference guide, not lab results.',
      genetics: {
        parents: parents.map(function (parent, parentIndex) {
          return { name: parent, abbr: extraAbbr(parent), color: parentIndex === 0 ? 'magenta' : 'yellow' };
        }),
        children: [],
        note: LINEAGE_NOTE
      },
      grow: {
        attributes: [
          { key: 'type', label: 'Type', options: ['Indica', 'Sativa', 'Hybrid'], selected: type },
          { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Moderate', 'Difficult'], selected: difficulty },
          { key: 'height', label: 'Height', options: ['Short', 'Average', 'Tall'], selected: height },
          { key: 'yield', label: 'Yield', options: ['Low', 'Medium', 'High'], selected: yieldSize },
          { key: 'flowering', label: 'Flowering (weeks)', options: ['7–9', '10–12', '>12'], selected: flowering }
        ],
        notes: growNotes,
        note: GROW_NOTE
      },
      sources: [DATA_NOTE],
      breeder: row.b || '',
      expanded: true
    };
  }

  if (GG.EXTRA_STRAIN_ROWS && GG.EXTRA_STRAIN_ROWS.length) {
    GG.STRAINS = GG.STRAINS.concat(GG.EXTRA_STRAIN_ROWS.map(buildExtraStrain));
  }

  /* Keep visible copy free of em dashes and en-dash prose. */
  function scrubDashes(value) {
    if (typeof value === 'string') {
      return value
        .replace(/(\d)\s*–\s*(\d)/g, '$1-$2')
        .replace(/\s*–\s*/g, '-')
        .replace(/\s*—\s*/g, ', ');
    }
    if (Array.isArray(value)) {
      return value.map(scrubDashes);
    }
    if (value && typeof value === 'object') {
      Object.keys(value).forEach(function (key) {
        value[key] = scrubDashes(value[key]);
      });
    }
    return value;
  }

  GG.STRAINS.forEach(function (strain) {
    scrubDashes(strain);
  });

  GG.HOME_STRAINS = [
    'og-kush',
    'blue-dream',
    'sour-diesel',
    'northern-lights',
    'gsc',
    'bruce-banner',
    'purple-haze',
    'jack-herer',
    'white-widow',
    'ak-47',
    'wedding-cake',
    'gelato'
  ];

  /* Convenience lookup used by both pages. */
  GG.findStrain = function (slug) {
    for (var i = 0; i < GG.STRAINS.length; i += 1) {
      if (GG.STRAINS[i].slug === slug) {
        return GG.STRAINS[i];
      }
    }
    return null;
  };
})();
