/*
 * GanjaGuardian strain quiz.
 * 20 questions, then a scored match from the local strain library.
 */
(function () {
  'use strict';

  var GG = window.GG;
  if (!GG) {
    return;
  }

  var el = GG.el;
  var QUESTIONS = [
    {
      key: 'place',
      title: 'Are you more of an outdoor or indoor person?',
      options: [
        { label: 'Outdoors', type: 'Sativa', effects: ['energetic', 'creative'] },
        { label: 'Indoors', type: 'Indica', effects: ['relaxed'] },
        { label: 'A bit of both', type: 'Hybrid', effects: ['happy'] }
      ]
    },
    {
      key: 'time',
      title: 'When do you usually want to use it?',
      options: [
        { label: 'Morning', type: 'Sativa', effects: ['energetic', 'creative'] },
        { label: 'Afternoon', type: 'Hybrid', effects: ['happy', 'creative'] },
        { label: 'Evening', type: 'Indica', effects: ['relaxed'] },
        { label: 'Late night', type: 'Indica', effects: ['sleepy', 'relaxed'] }
      ]
    },
    {
      key: 'experience',
      title: 'How much experience do you have?',
      options: [
        { label: 'New to it', thc: 'low', grow: { difficulty: 'Easy' } },
        { label: 'Some experience', thc: 'medium' },
        { label: 'Very experienced', thc: 'high' }
      ]
    },
    {
      key: 'effect',
      title: 'What effect do you want most?',
      options: [
        { label: 'Relaxed', type: 'Indica', effects: ['relaxed'] },
        { label: 'Happy', type: 'Hybrid', effects: ['happy'] },
        { label: 'Creative', type: 'Sativa', effects: ['creative'] },
        { label: 'Sleepy', type: 'Indica', effects: ['sleepy'] },
        { label: 'Euphoric', type: 'Hybrid', effects: ['euphoric'] },
        { label: 'Hungry', type: 'Indica', effects: ['hungry'] }
      ]
    },
    {
      key: 'feel',
      title: 'Do you want it to hit your body or your head?',
      options: [
        { label: 'Mostly body', type: 'Indica', effects: ['relaxed'] },
        { label: 'Mostly head', type: 'Sativa', effects: ['creative', 'euphoric'] },
        { label: 'A balance of both', type: 'Hybrid', effects: ['happy'] }
      ]
    },
    {
      key: 'energy',
      title: 'How much energy do you want?',
      options: [
        { label: 'Low and chilled', type: 'Indica', effects: ['relaxed', 'sleepy'] },
        { label: 'A medium lift', type: 'Hybrid', effects: ['happy'] },
        { label: 'High and active', type: 'Sativa', effects: ['energetic'] }
      ]
    },
    {
      key: 'flavour',
      title: 'Pick the flavour that sounds best.',
      options: [
        { label: 'Sweet', flavours: ['sweet'] },
        { label: 'Citrus', flavours: ['citrus'] },
        { label: 'Earthy', flavours: ['earthy'] },
        { label: 'Pine', flavours: ['pine'] },
        { label: 'Diesel', flavours: ['diesel'] },
        { label: 'Berry', flavours: ['berry'] },
        { label: 'Mint', flavours: ['mint'] },
        { label: 'Herbal', flavours: ['herbal'] }
      ]
    },
    {
      key: 'aroma',
      title: 'Sweet or gassy?',
      options: [
        { label: 'Sweet and dessert like', flavours: ['sweet', 'berry'] },
        { label: 'Gassy and earthy', flavours: ['diesel', 'earthy'] },
        { label: 'I like both', flavours: ['sweet', 'diesel'] }
      ]
    },
    {
      key: 'thc',
      title: 'What THC level do you want?',
      options: [
        { label: 'Low', thc: 'low' },
        { label: 'Medium', thc: 'medium' },
        { label: 'High', thc: 'high' },
        { label: 'No preference', thc: null }
      ]
    },
    {
      key: 'cbd',
      title: 'How much CBD do you want?',
      options: [
        { label: 'Low CBD', cbd: 'low' },
        { label: 'A balanced mix', cbd: 'balanced' },
        { label: 'High CBD', cbd: 'high' },
        { label: 'No preference', cbd: null }
      ]
    },
    {
      key: 'grow',
      title: 'Are you growing or buying?',
      options: [
        { label: 'Growing my own', growIntent: true },
        { label: 'Buying flower', growIntent: false },
        { label: 'A bit of both', growIntent: true }
      ]
    },
    {
      key: 'growPlace',
      title: 'If you grow, where would it live?',
      options: [
        { label: 'Indoors', grow: { height: 'Short', difficulty: 'Easy' } },
        { label: 'Outdoors', grow: { height: 'Tall', yield: 'High' } },
        { label: 'Greenhouse', grow: { height: 'Average', yield: 'Medium' } },
        { label: 'Not growing', grow: null }
      ]
    },
    {
      key: 'space',
      title: 'How much space do you have?',
      options: [
        { label: 'A small space', grow: { height: 'Short' } },
        { label: 'A medium space', grow: { height: 'Average' } },
        { label: 'A large space', grow: { height: 'Tall' } },
        { label: 'Not growing', grow: null }
      ]
    },
    {
      key: 'flowering',
      title: 'How long can you wait for flowering?',
      options: [
        { label: 'Keep it fast', grow: { flowering: '7-9' } },
        { label: 'Average is fine', grow: { flowering: '10-12' } },
        { label: 'I have time', grow: { flowering: '>12' } },
        { label: 'Not growing', grow: null }
      ]
    },
    {
      key: 'yield',
      title: 'How much yield do you want?',
      options: [
        { label: 'A small personal stash', grow: { yield: 'Low' } },
        { label: 'A medium harvest', grow: { yield: 'Medium' } },
        { label: 'As much as possible', grow: { yield: 'High' } },
        { label: 'Not growing', grow: null }
      ]
    },
    {
      key: 'effort',
      title: 'How much grow effort do you want?',
      options: [
        { label: 'Keep it easy', grow: { difficulty: 'Easy' } },
        { label: 'I can handle moderate', grow: { difficulty: 'Moderate' } },
        { label: 'I like a challenge', grow: { difficulty: 'Difficult' } },
        { label: 'Not growing', grow: null }
      ]
    },
    {
      key: 'sleep',
      title: 'Do you want help winding down for sleep?',
      options: [
        { label: 'Yes, make me sleepy', effects: ['sleepy'], type: 'Indica' },
        { label: 'No, keep me awake', avoid: ['sleepy'], type: 'Sativa' },
        { label: 'Only sometimes', effects: ['relaxed'] }
      ]
    },
    {
      key: 'social',
      title: 'Are you using it alone or with friends?',
      options: [
        { label: 'Alone and quiet', type: 'Indica', effects: ['relaxed'] },
        { label: 'With friends', type: 'Sativa', effects: ['happy', 'energetic'] },
        { label: 'Either is fine', type: 'Hybrid', effects: ['happy'] }
      ]
    },
    {
      key: 'hungry',
      title: 'Do you want the munchies?',
      options: [
        { label: 'Yes, bring snacks', effects: ['hungry'] },
        { label: 'No thanks', avoid: ['hungry'] },
        { label: 'I do not mind', effects: [] }
      ]
    },
    {
      key: 'focus',
      title: 'What matters more, flavour or strength?',
      options: [
        { label: 'Flavour first', mode: 'flavour' },
        { label: 'Strength first', mode: 'potency' },
        { label: 'A good balance', mode: 'balance' }
      ]
    }
  ];

  var root = document.getElementById('quiz-root');
  if (!root) {
    return;
  }

  var state = {
    index: 0,
    answers: new Array(QUESTIONS.length).fill(null)
  };

  function scoreValue(value, target) {
    var number = Number(value);
    if (!number || !target) {
      return 0;
    }
    if (target === 'low') {
      return number <= 18 ? 10 : number <= 22 ? 4 : 0;
    }
    if (target === 'medium') {
      return number >= 18 && number <= 26 ? 10 : number >= 16 && number <= 29 ? 4 : 0;
    }
    return number >= 24 ? 10 : number >= 21 ? 4 : 0;
  }

  function cbdValue(value, target) {
    var number = Number(value);
    if (isNaN(number) || !target) {
      return 0;
    }
    if (target === 'high') {
      return number >= 2 ? 10 : number > 0.5 ? 4 : 0;
    }
    if (target === 'balanced') {
      return number >= 0.5 && number <= 2 ? 10 : number > 0 && number <= 3 ? 4 : 0;
    }
    return number <= 0.5 ? 10 : number <= 1 ? 4 : 0;
  }

  function growValue(strain, key) {
    var attrs = (strain.grow && strain.grow.attributes) || [];
    for (var i = 0; i < attrs.length; i += 1) {
      if (attrs[i].key === key) {
        return attrs[i].selected;
      }
    }
    return '';
  }

  function scoreStrain(strain) {
    var score = 0;
    var types = {};
    var effects = {};
    var avoid = {};
    var flavours = {};
    var modes = [];
    var thcTargets = [];
    var cbdTargets = [];
    var growTargets = [];

    state.answers.forEach(function (answer) {
      if (!answer) {
        return;
      }
      if (answer.type) {
        types[answer.type] = (types[answer.type] || 0) + 1;
      }
      (answer.effects || []).forEach(function (effect) {
        effects[effect] = (effects[effect] || 0) + 1;
      });
      (answer.avoid || []).forEach(function (effect) {
        avoid[effect] = (avoid[effect] || 0) + 1;
      });
      (answer.flavours || []).forEach(function (flavour) {
        flavours[flavour] = (flavours[flavour] || 0) + 1;
      });
      if (answer.thc) {
        thcTargets.push(answer.thc);
      }
      if (answer.cbd) {
        cbdTargets.push(answer.cbd);
      }
      if (answer.grow) {
        growTargets.push(answer.grow);
      }
      if (answer.mode) {
        modes.push(answer.mode);
      }
    });

    Object.keys(types).forEach(function (type) {
      if (strain.classification === type) {
        score += types[type] * 18;
      } else if (strain.classification === 'Hybrid') {
        score += types[type] * 6;
      }
    });

    Object.keys(effects).forEach(function (effect) {
      if ((strain.effects.positive || []).indexOf(effect) >= 0) {
        score += effects[effect] * 12;
      }
    });

    Object.keys(avoid).forEach(function (effect) {
      if ((strain.effects.positive || []).indexOf(effect) >= 0) {
        score -= avoid[effect] * 7;
      }
    });

    var flavourScore = 0;
    Object.keys(flavours).forEach(function (flavour) {
      if ((strain.flavours || []).indexOf(flavour) >= 0) {
        flavourScore += flavours[flavour] * 9;
      }
    });

    var thcScore = 0;
    thcTargets.forEach(function (target) {
      thcScore += scoreValue(strain.thc, target);
    });

    var cbdScore = 0;
    cbdTargets.forEach(function (target) {
      cbdScore += cbdValue(strain.cbd, target);
    });

    var mode = modes[modes.length - 1] || 'balance';
    score += flavourScore * (mode === 'flavour' ? 1.6 : 1);
    score += thcScore * (mode === 'potency' ? 1.6 : 1);
    score += cbdScore;

    growTargets.forEach(function (target) {
      Object.keys(target).forEach(function (key) {
        if (growValue(strain, key) === target[key]) {
          score += 8;
        }
      });
    });

    return score;
  }

  function topMatches() {
    var matches = GG.STRAINS.map(function (strain) {
      return { strain: strain, score: scoreStrain(strain) };
    });
    matches.sort(function (a, b) {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.strain.name.localeCompare(b.strain.name);
    });
    return matches.slice(0, 3);
  }

  function labelFor(key, value) {
    if (key === 'effects' && GG.EFFECTS[value]) {
      return GG.EFFECTS[value].label;
    }
    if (key === 'flavours' && GG.FLAVOURS[value]) {
      return GG.FLAVOURS[value].label;
    }
    return value;
  }

  function renderQuestion() {
    var question = QUESTIONS[state.index];
    var answer = state.answers[state.index];

    root.textContent = '';
    var card = el('div', 'quiz-card');

    var progress = el('div', 'quiz-progress');
    var progressText = el('span', 'quiz-progress__text', 'Question ' + (state.index + 1) + ' of ' + QUESTIONS.length);
    var tracker = el('div', 'quiz-progress__track');
    var fill = el('span', 'quiz-progress__fill');
    fill.style.width = (((state.index + 1) / QUESTIONS.length) * 100) + '%';
    tracker.appendChild(fill);
    progress.appendChild(progressText);
    progress.appendChild(tracker);
    card.appendChild(progress);

    var heading = el('h2', 'quiz-question', question.title);
    heading.id = 'quiz-question-' + question.key;
    card.appendChild(heading);

    var options = el('div', 'quiz-options');
    options.setAttribute('role', 'radiogroup');
    options.setAttribute('aria-labelledby', heading.id);

    question.options.forEach(function (option, index) {
      var label = el('label', 'quiz-option');
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'quiz-' + question.key;
      input.value = String(index);
      input.checked = answer === option;
      input.addEventListener('change', function () {
        state.answers[state.index] = option;
        nextButton.disabled = false;
      });
      var text = el('span', 'quiz-option__text', option.label);
      label.appendChild(input);
      label.appendChild(text);
      options.appendChild(label);
    });
    card.appendChild(options);

    var actions = el('div', 'quiz-actions');
    var back = el('button', 'button button--ghost', 'Back');
    back.type = 'button';
    back.disabled = state.index === 0;
    back.addEventListener('click', function () {
      if (state.index > 0) {
        state.index -= 1;
        renderQuestion();
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    var nextButton = el('button', 'button', state.index === QUESTIONS.length - 1 ? 'Show my match' : 'Next');
    nextButton.type = 'button';
    nextButton.disabled = !answer;
    nextButton.addEventListener('click', function () {
      if (!state.answers[state.index]) {
        return;
      }
      if (state.index === QUESTIONS.length - 1) {
        renderResult();
        return;
      }
      state.index += 1;
      renderQuestion();
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    actions.appendChild(back);
    actions.appendChild(nextButton);
    card.appendChild(actions);
    root.appendChild(card);
  }

  function renderResult() {
    var matches = topMatches();
    var top = matches[0];
    var strain = top.strain;
    var photos = GG.strainPhotos(strain);
    var photo = photos.length ? photos[0].photo : strain.photo;

    root.textContent = '';
    var result = el('div', 'quiz-result');

    var head = el('div', 'quiz-result__head');
    head.appendChild(el('p', 'eyebrow', 'Your closest match'));
    var title = el('h2', 'quiz-result__title', strain.name);
    head.appendChild(title);
    head.appendChild(GG.badgeFor(strain));
    result.appendChild(head);

    var match = el('div', 'quiz-match');
    if (photo) {
      var media = el('figure', 'quiz-match__media');
      var img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.alt || '';
      img.loading = 'eager';
      media.appendChild(img);
      var credit = el('figcaption', 'photo-credit', GG.photoCreditText(photo, false));
      media.appendChild(credit);
      if (photo.representative) {
        media.appendChild(el('span', 'photo-badge', 'Reference photo, not verified'));
      }
      match.appendChild(media);
    } else {
      var artMedia = el('div', 'quiz-match__media');
      artMedia.appendChild(GG.strainArt(strain));
      match.appendChild(artMedia);
    }

    var body = el('div', 'quiz-match__body');
    var stats = el('p', 'quiz-match__stats');
    stats.appendChild(document.createTextNode('THC ' + (strain.thc || 'n/a') + '%'));
    stats.appendChild(document.createTextNode('  ·  CBD ' + (strain.cbd || 'n/a') + '%'));
    stats.appendChild(document.createTextNode('  ·  ' + strain.classification));
    body.appendChild(stats);

    if (strain.description && strain.description[0]) {
      body.appendChild(el('p', 'quiz-match__copy', strain.description[0]));
    }

    var effectLabels = (strain.effects.positive || []).slice(0, 3).map(function (key) {
      return labelFor('effects', key);
    });
    var flavourLabels = (strain.flavours || []).slice(0, 3).map(function (key) {
      return labelFor('flavours', key);
    });
    if (effectLabels.length) {
      body.appendChild(el('p', 'quiz-match__line', 'Effects: ' + effectLabels.join(', ')));
    }
    if (flavourLabels.length) {
      body.appendChild(el('p', 'quiz-match__line', 'Flavours: ' + flavourLabels.join(', ')));
    }

    var actions = el('div', 'quiz-result__actions');
    var profile = el('a', 'button', 'Open this strain');
    profile.href = 'strain.html?strain=' + encodeURIComponent(strain.slug);
    var restart = el('button', 'button button--ghost', 'Start over');
    restart.type = 'button';
    restart.addEventListener('click', function () {
      state.index = 0;
      state.answers = new Array(QUESTIONS.length).fill(null);
      renderQuestion();
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    actions.appendChild(profile);
    actions.appendChild(restart);
    body.appendChild(actions);
    match.appendChild(body);
    result.appendChild(match);

    if (matches.length > 1) {
      var alt = el('div', 'quiz-alts');
      alt.appendChild(el('h3', 'quiz-alts__title', 'Close matches'));
      var list = el('ul', 'quiz-alts__list');
      matches.slice(1).forEach(function (item) {
        var li = el('li');
        var link = el('a', 'quiz-alt', item.strain.name);
        link.href = 'strain.html?strain=' + encodeURIComponent(item.strain.slug);
        li.appendChild(link);
        li.appendChild(el('span', 'quiz-alt__meta', '  ' + item.strain.classification + ' · THC ' + (item.strain.thc || 'n/a') + '%'));
        list.appendChild(li);
      });
      alt.appendChild(list);
      result.appendChild(alt);
    }

    root.appendChild(result);
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  renderQuestion();
})();
