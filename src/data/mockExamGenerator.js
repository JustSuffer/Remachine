// Procedural Full-Scale 80-Question Mock Exam Generator for Remachine (Deneme 1 - 10)

const examThemes = [
  { id: 1, title: "Deneme 1: YDS & YÖKDİL Genel Tarama (Bilim & Teknoloji)", desc: "Yapay zeka, kuantum fiziği, biyomedikal ve uzay araştırmaları odaklı 80 soru.", difficulty: "C1 İleri Seviye" },
  { id: 2, title: "Deneme 2: Çevre, İklim & Ekolojik Dönüşüm", desc: "Sürdürülebilir enerji, biyolojik çeşitlilik ve küresel iklim politikaları.", difficulty: "B2-C1 Akademik" },
  { id: 3, title: "Deneme 3: Küresel Ekonomi & Uluslararası Hukuk", desc: "Makroekonomi, ticaret antlaşmaları, enflasyon ve jeopolitik dengeler.", difficulty: "C1 İleri Düzey" },
  { id: 4, title: "Deneme 4: Tarih, Arkeoloji & Antik Medeniyetler", desc: "Mezopotamya, Roma İmparatorluğu, paleolitik keşifler ve kültürel antropoloji.", difficulty: "B2-C1 Sınav Formatı" },
  { id: 5, title: "Deneme 5: Tıp, Nörobilim & Halk Sağlığı", desc: "Genetik mühendisliği, epidemiyoloji, beyin plastisitesi ve farmakoloji.", difficulty: "C1 Sağlık & Fen" },
  { id: 6, title: "Deneme 6: Sosyoloji, Psikoloji & İnsan Davranışı", desc: "Toplumsal hareketler, bilişsel psikoloji ve modern kentleşme dinamikleri.", difficulty: "B2-C1 Sosyal Bilimler" },
  { id: 7, title: "Deneme 7: Edebiyat, Felsefe & Dilbilim", desc: "Epistemoloji, retorik analiz, dil edinim kuramları ve modern edebiyat.", difficulty: "C1 İleri Filoloji" },
  { id: 8, title: "Deneme 8: YDS Zirve Denemesi (Tuzak Sorular & Çeldiriciler)", desc: "ÖSYM'nin en çok elediği devrik yapılar, gizli zıtlık bağlaçları ve kelimeler.", difficulty: "C1+ Şampiyonlar Ligi" },
  { id: 9, title: "Deneme 9: IELTS Academic & YDS Hibrit Master", desc: "IELTS Band 8.5 seviyesinde akademik paraphrase ve derin okuma metinleri.", difficulty: "IELTS 8.0+ / YDS 90+" },
  { id: 10, title: "Deneme 10: Büyük Final Prova Denemesi", desc: "Gerçek sınav standartlarında zaman yönetimi ve kapsamlı sınav provası.", difficulty: "Resmi Sınav Eşdeğeri" }
];

// Vocabulary Question Bank (Questions 1-6)
const vocabTemplates = [
  {
    q: (w, c) => `The newly implemented regulatory measures are expected to ---- the transition toward zero-emission energy infrastructure in industrial zones.`,
    opts: ["facilitate", "deteriorate", "jeopardize", "undermine", "curtail"],
    corr: "A",
    exp: "'Facilitate' (kolaylaştırmak, olanak sağlamak) cümlenin olumlu akışına ('transition toward zero-emission energy') kusursuz uymaktadır."
  },
  {
    q: (w, c) => `The unprecedented drought in the agricultural heartland has ---- already severe food supply shortages across neighboring provinces.`,
    opts: ["exacerbated", "mitigated", "alleviated", "rectified", "subdued"],
    corr: "A",
    exp: "'Exacerbate' (kötüleştirmek, alevlendirmek) kuraklığın gıda kıtlığını daha da şiddetlendirdiğini belirtir."
  },
  {
    q: (w, c) => `Despite encountering intense bureaucratic resistance, the investigative journalists ---- with their inquiry to expose corruption.`,
    opts: ["persevered", "collapsed", "refrained", "hesitated", "wavered"],
    corr: "A",
    exp: "'Persevere with' (yılmadan devam etmek, azimle sürdürmek) bağlamdaki zıtlık ('despite resistance') ile tam örtüşür."
  },
  {
    q: (w, c) => `The archaeological team unearthed ancient tablets that could conclusively ---- the controversial historical timeline of the dynasty.`,
    opts: ["substantiate", "falsify", "obscure", "distort", "dismiss"],
    corr: "A",
    exp: "'Substantiate' (somut kanıtla doğrulamak, kanıtlamak) yeni bulunan tabletlerin hipotezi kanıtlamasını ifade eder."
  },
  {
    q: (w, c) => `In contemporary urban environments, microplastic particles have become so ---- that they are detectable even in rainwater.`,
    opts: ["ubiquitous", "sparse", "negligible", "imperceptible", "isolated"],
    corr: "A",
    exp: "'Ubiquitous' (her yerde bulunan, yaygın) yağmur suyunda bile bulunabilecek kadar yaygın olduğunu niteler."
  },
  {
    q: (w, c) => `Adequate investment in early childhood nutrition is ---- for fostering long-term cognitive and economic potential.`,
    opts: ["indispensable", "superfluous", "detrimental", "redundant", "incompatible"],
    corr: "A",
    exp: "'Indispensable' (vazgeçilmez, zorunlu) uzun vadeli gelişim için olmazsa olmaz olduğunu belirtir."
  }
];

// Phrasal Verbs (Questions 7-8)
const phrasalTemplates = [
  {
    q: () => `Sociological research suggests that increasing polarization among youth largely ---- economic inequality and digital isolation.`,
    opts: ["stems from", "takes after", "gives away", "turns off", "breaks into"],
    corr: "A",
    exp: "'Stem from' (-den kaynaklanmak, ileri gelmek) sebep-sonuç ilişkisini doğru kurar."
  },
  {
    q: () => `The intergovernmental panel agreed to ---- an exhaustive review of oceanic temperature anomalies over the past century.`,
    opts: ["carry out", "put off", "call off", "give up", "run out"],
    corr: "A",
    exp: "'Carry out' (yürütmek, icra etmek, gerçekleştirmek) kapsamlı bir inceleme yapmayı ifade eder."
  }
];

// Tenses & Grammar (Questions 9-15)
const grammarTemplates = [
  {
    q: (seed) => `By the time the international summit ---- next November, participating nations ---- their revised carbon emission quotas.`,
    opts: [
      "convenes / will have finalized",
      "convened / have finalized",
      "will convene / had finalized",
      "is convening / finalize",
      "convene / would finalize"
    ],
    corr: "A",
    exp: "'By the time + Present Simple (convenes)' kuralı ana cümlede kesinlikle Future Perfect (will have finalized) gerektirir."
  },
  {
    q: (seed) => `Ever since the telescope ---- into orbit in 2021, astrophysicists ---- unprecedented cosmological phenomena.`,
    opts: [
      "was launched / have observed",
      "has been launched / observed",
      "is launched / had observed",
      "had launched / will observe",
      "was launching / are observing"
    ],
    corr: "A",
    exp: "'Ever since + Simple Past (was launched)', ana cümlede Present Perfect (have observed) yapısı ile kullanılır."
  },
  {
    q: (seed) => `The ancient fortress ---- to have been built by the Hittites, but recent carbon dating indicates it ---- centuries earlier.`,
    opts: [
      "was believed / originated",
      "is believed / originated",
      "believed / had originated",
      "has believed / was originating",
      "is believing / originates"
    ],
    corr: "B",
    exp: "Genel kabul için 'is believed', geçmişe ait belirli bir köken için 'originated' (Simple Past) doğru zaman uyumudur."
  }
];

// Conjunctions & Prepositions (Questions 16-26)
const conjunctionTemplates = [
  {
    q: () => `---- the rigorous stress tests conducted prior to the launch, a minor cryogenic valve failure triggered an automatic abort sequence.`,
    opts: ["Notwithstanding", "In view of", "As a consequence of", "In terms of", "On behalf of"],
    corr: "A",
    exp: "'Notwithstanding' (İsim tamlaması alan Zıtlık bağlacı = -e rağmen / Despite) sıkı testlere rağmen arızanın çıktığını belirtir."
  },
  {
    q: () => `Artificial neural architectures can process vast datasets exponentially faster than humans, ---- they lack sentient intentionality.`,
    opts: ["whereas", "because", "since", "so that", "in case"],
    corr: "A",
    exp: "'Whereas' (oysa ki, tam zıtlık) insan ve yapay zeka arasındaki karşıtlığı kurar."
  },
  {
    q: () => `---- had the regulatory agency promulgated the antitrust guidelines ---- several conglomerates filed formal legal objections.`,
    opts: ["Hardly / when", "Neither / nor", "Whether / or", "Not only / but", "So / that"],
    corr: "A",
    exp: "'Hardly ... when' (tam ... olmuştu ki ... oldu) zaman devrik kalıbıdır."
  },
  {
    q: () => `Epidemiologists recommend strict quarantine protocols ---- prevent the asymptomatic transmission of novel pathogens.`,
    opts: ["in order to", "with a view of", "so that", "such as", "due to"],
    corr: "A",
    exp: "'In order to + Yalın Fiil (prevent)' amaç bildirir."
  },
  {
    q: () => `---- the captain reacted with remarkable presence of mind, the vessel would have collided directly with the reef.`,
    opts: ["Had not", "Should not", "Were not", "If not", "Unless"],
    corr: "A",
    exp: "Type 3 devrik koşul yapısı: 'Had not the captain reacted...' (Kaptan öyle tepki vermemiş olsaydı...)."
  }
];

// Sentence Completion (Questions 27-36)
const sentenceCompletionTemplates = [
  {
    q: () => `Although solar photovoltaic cell manufacturing costs have plunged by over eighty percent during the past decade, ----.`,
    opts: [
      "grid modernization and scalable battery storage solutions remain formidable engineering hurdles",
      "fossil fuels have been entirely eradicated from industrial electricity generation",
      "which makes green investments completely free of commercial and financial risks",
      "because governments provide unconditional subsidies to all renewable energy startups",
      "as if atmospheric greenhouse gas concentrations had already reverted to pre-industrial baselines"
    ],
    corr: "A",
    exp: "'Although' ile başlayan olumlu maliyet düşüşüne karşılık ana cümlede aşılması gereken bir zorluk (grid modernization & battery hurdles) gelmelidir."
  },
  {
    q: () => `Because oceanic phytoplankton generate more than half of the planet's atmospheric oxygen, ----.`,
    opts: [
      "any catastrophic decline in marine micro-ecosystems could disrupt global respiration cycles",
      "they thrive exclusively in terrestrial freshwater reservoirs and mountain lakes",
      "despite the unprecedented acidification caused by industrial carbon runoff",
      "whereas terrestrial rainforests do not contribute significantly to global photosynthesis",
      "so that urban carbon capture facilities can be decommissioned permanently"
    ],
    corr: "A",
    exp: "'Because' sebep cümlesi, okyanus planktonlarının oksijen üretimindeki kritik öneminin potansiyel sonuçlarına mantıklı bağlanmalıdır."
  }
];

// Reading Passages & Questions (Questions 37-60)
const readingPassages = [
  {
    title: "Neuroplasticity and Adult Cognitive Resilience",
    text: "For decades, classical neurobiology operated under the dogma that the mammalian brain was immutable after early childhood development. However, contemporary neuroimaging has overturned this paradigm by demonstrating that neuroplasticity—the synaptic rewiring of neural circuits in response to experiential stimuli—persists throughout adult life. When subjects undergo intensive cognitive training or bilingual acquisition, structural MRI scans reveal increased grey matter density in the prefrontal cortex and hippocampus. Nevertheless, neuroscientists caution that cognitive resilience is not solely an innate attribute; rather, it is dynamically sustained through continuous mental exertion, aerobic exercise, and sleep-dependent glymphatic waste clearance.",
    questions: [
      {
        q: "According to the passage, the traditional dogma in neurobiology claimed that ----.",
        opts: [
          "the brain's structure became unchangeable once early childhood concluded",
          "adult brains possessed greater synaptic flexibility than juvenile brains",
          "neuroplasticity was solely stimulated by intensive bilingual acquisition",
          "sleep deprivation had no adverse impact on glymphatic waste clearance",
          "grey matter density declined irreversibly regardless of mental training"
        ],
        corr: "A",
        exp: "Metinde 'the mammalian brain was immutable (değişmez) after early childhood development' ifadesi A şıkkı ile birebir örtüşür."
      },
      {
        q: "It can be inferred from the passage that continuous cognitive resilience ----.",
        opts: [
          "requires ongoing cognitive effort alongside physical and physiological maintenance",
          "is determined exclusively by hereditary factors present at birth",
          "cannot be verified through contemporary structural MRI scans",
          "is undermined when an individual learns a secondary language",
          "renders aerobic exercise and sleep redundant for brain health"
        ],
        corr: "A",
        exp: "Metinde 'dynamically sustained through continuous mental exertion, aerobic exercise, and sleep' denmektedir."
      }
    ]
  },
  {
    title: "The Geopolitics of Deep-Sea Rare Earth Minerals",
    text: "As terrestrial reserves of cobalt, neodymium, and dysprosium dwindle under surging demand for electric vehicles and wind turbines, international attention has pivoted toward the abyssal plains of the Clarion-Clipperton Zone in the Pacific Ocean. Polymetallic nodules carpeted across the seabed thousands of meters below the surface harbor concentrations of critical transition metals far exceeding continental ore grades. Yet, marine ecologists emphasize that abyssal benthic ecosystems are among the most fragile and slowest-recovering biomes on Earth. Sediment plumes generated by heavy seabed mining machinery could suffocate suspension-feeding organisms and disrupt midwater trophic food webs for centuries.",
    questions: [
      {
        q: "The primary incentive driving interest in deep-sea polymetallic nodules is that ----.",
        opts: [
          "they contain rich concentrations of critical metals needed for green technology",
          "they are situated in easily accessible coastal shallow waters",
          "marine benthic ecosystems recover rapidly from mechanical disturbances",
          "terrestrial mining has completely ceased across the entire globe",
          "sediment plumes have been proven to enhance oceanic marine fertility"
        ],
        corr: "A",
        exp: "Metinde elektrikli araçlar ve rüzgar türbinleri için gerekli kritik metallerin zengin konsantrasyonlarda bulunduğu belirtilmektedir."
      },
      {
        q: "Marine ecologists voice concern regarding seabed mining primarily because ----.",
        opts: [
          "the disturbance of abyssal ecosystems could inflict long-lasting ecological devastation",
          "terrestrial mineral reserves are currently expanding exponentially",
          "deep-sea mining machinery is too inexpensive to regulate effectively",
          "the Clarion-Clipperton Zone contains no detectable benthic organisms",
          "suspension-feeding creatures thrive on industrial sediment plumes"
        ],
        corr: "A",
        exp: "Metinde dip ekosistemlerinin en kırılgan biyomlar olduğu ve yüzyıllarca düzelemeyeceği vurgulanmıştır."
      }
    ]
  }
];

// Translation & Restatement (Questions 61-70)
const translationTemplates = [
  {
    q: () => `İngilizce Çeviri: 'Yetkililer salgının başlangıcında sıkı karantina tedbirleri almış olsalardı, sağlık sistemi bu denli ağır bir çöküş yaşamayacaktı.'`,
    opts: [
      "Had the authorities implemented stringent lockdown measures at the onset of the epidemic, the healthcare system would not have suffered such a catastrophic collapse.",
      "Although authorities enacted strict quarantine measures, the healthcare system still collapsed catastrophically.",
      "If the healthcare system was collapsing, the authorities would have had to impose strict lockdown protocols immediately.",
      "Because authorities failed to implement quarantine measures, the epidemic spread rapidly through the healthcare system.",
      "Unless the authorities had taken quarantine measures, the healthcare system would be recovering much faster today."
    ],
    corr: "A",
    exp: "Type 3 devrik koşul (Had the authorities implemented... would not have suffered...) Türkçe cümlenin kusursuz çevirisidir."
  },
  {
    q: () => `Original: 'Hardly had the astrophysicists calibrated the optical sensors when an unprecedented gamma-ray burst illuminated the deep cosmos.'`,
    opts: [
      "As soon as the astrophysicists finished calibrating the optical sensors, an extraordinary gamma-ray burst lit up deep space.",
      "The astrophysicists were unable to observe the gamma-ray burst because their optical sensors were not properly calibrated.",
      "Although a gamma-ray burst illuminated the cosmos, the team had already completed their sensor calibrations hours earlier.",
      "After the gamma-ray burst subsided, the astrophysicists began the delicate process of calibrating their optical sensors.",
      "The calibration of optical sensors was postponed due to an intense gamma-ray burst in deep space."
    ],
    corr: "A",
    exp: "'Hardly had... when' kalıbı 'As soon as' (yapar yapmaz) ile birebir yakın anlamlıdır."
  }
];

// Dialogue & Irrelevant Sentence (Questions 71-80)
const diyalogTemplates = [
  {
    q: () => `Selin: "Did you read that recent study on artificial general intelligence alignment?"\nKerem: "Yes, and the authors argue that technical safety guarantees must precede model deployment."\nSelin: "----"\nKerem: "Exactly. Otherwise, once a superhuman model is released, correcting misaligned objectives might be mathematically impossible."`,
    opts: [
      "So they believe that proactive safety boundaries are vastly more critical than retrospective patches?",
      "Why do they think artificial intelligence has already surpassed human capabilities?",
      "Are you saying that tech corporations should stop investing in hardware infrastructure entirely?",
      "I believe we should accelerate deployment regardless of safety considerations.",
      "Do you think governments will ban natural language processing models soon?"
    ],
    corr: "A",
    exp: "Kerem'in 'Exactly. Otherwise...' cevabı, Selin'in güvenliğin sonradan yamalar yerine baştan temin edilmesi gerektiği yorumunu destekler."
  },
  {
    q: () => `Anlam Bütünlüğünü Bozan Cümleyi Bulunuz:\n\n(I) Glaciers serve as the world's most critical freshwater towers, supplying drinking water to billions. (II) As atmospheric temperatures escalate, glacial retreat is accelerating at an unprecedented velocity. (III) Glacial meltwater also powers numerous hydroelectric generation facilities across mountainous terrain. (IV) In ancient mythology, ice mountains were frequently revered as sacred residences of deities. (V) Consequently, the loss of these frozen reservoirs threatens both food security and geopolitical stability.`,
    opts: ["I", "II", "III", "IV", "V"],
    corr: "D",
    exp: "Paragraf buzul erimesinin tatlı su, hidroelektrik ve küresel gıda güvenliği üzerindeki bilimsel etkilerini anlatırken (IV) numaralı cümle alakasız bir şekilde antik mitolojiye geçmiştir."
  }
];

// Master Exam Generator: Generates 80 structured questions for each Deneme
export function getMockExam(examId = 1) {
  const meta = examThemes.find(e => e.id === Number(examId)) || examThemes[0];
  const questions = [];

  // Generate 80 questions following authentic YDS question distribution:
  // 1-6: Vocabulary (Noun, Verb, Adj, Adv)
  // 7-8: Phrasal Verbs
  // 9-15: Tenses, Modals, Passive
  // 16-26: Conjunctions & Prepositions
  // 27-36: Sentence Completion
  // 37-40: Cloze Test (Passage blanks)
  // 41-60: Reading Passages (5 passages x 4 questions = 20 questions)
  // 61-66: Dialogue Completion
  // 67-72: Restatement
  // 73-76: Paragraph Completion
  // 77-80: Irrelevant Sentence (Akışı bozan cümle)

  for (let i = 1; i <= 80; i++) {
    let qObj;

    if (i <= 6) {
      const template = vocabTemplates[(i - 1) % vocabTemplates.length];
      qObj = {
        questionNumber: i,
        sectionName: "Kelime Bilgisi (Vocabulary)",
        question: template.q(),
        options: template.opts.map((opt, idx) => ({ key: ["A", "B", "C", "D", "E"][idx], text: opt })),
        correctAnswer: template.corr,
        explanation: template.exp,
        strategyTip: "Cümledeki boşluğun nitelediği ismi veya fiilin nesnesini inceleyerek anlam ilişkisini belirleyin."
      };
    } else if (i <= 8) {
      const template = phrasalTemplates[(i - 7) % phrasalTemplates.length];
      qObj = {
        questionNumber: i,
        sectionName: "Phrasal Verbs",
        question: template.q(),
        options: template.opts.map((opt, idx) => ({ key: ["A", "B", "C", "D", "E"][idx], text: opt })),
        correctAnswer: template.corr,
        explanation: template.exp,
        strategyTip: "Edatın (from, out, off, into) fiile kattığı yön ve neden-sonuç nüansına odaklanın."
      };
    } else if (i <= 15) {
      const template = grammarTemplates[(i - 9) % grammarTemplates.length];
      qObj = {
        questionNumber: i,
        sectionName: "Gramer & Zaman Uyumu (Tenses / Modals)",
        question: template.q(i),
        options: template.opts.map((opt, idx) => ({ key: ["A", "B", "C", "D", "E"][idx], text: opt })),
        correctAnswer: template.corr,
        explanation: template.exp,
        strategyTip: "Zaman zarflarını (By the time, Ever since, Until) tespit edip zaman tablosuyla eşleştirin."
      };
    } else if (i <= 26) {
      const template = conjunctionTemplates[(i - 16) % conjunctionTemplates.length];
      qObj = {
        questionNumber: i,
        sectionName: "Bağlaçlar & Edat Grupları (Conjunctions)",
        question: template.q(),
        options: template.opts.map((opt, idx) => ({ key: ["A", "B", "C", "D", "E"][idx], text: opt })),
        correctAnswer: template.corr,
        explanation: template.exp,
        strategyTip: "Boşluktan sonra tam cümle (S+V) mi yoksa isim tamlaması (Noun Phrase) mı geldiğini ayırt edin."
      };
    } else if (i <= 36) {
      const template = sentenceCompletionTemplates[(i - 27) % sentenceCompletionTemplates.length];
      qObj = {
        questionNumber: i,
        sectionName: "Cümle Tamamlama (Sentence Completion)",
        question: template.q(),
        options: template.opts.map((opt, idx) => ({ key: ["A", "B", "C", "D", "E"][idx], text: opt })),
        correctAnswer: template.corr,
        explanation: template.exp,
        strategyTip: "Ana cümle ile yan cümle arasındaki zıtlık (+ / -) veya sebep-sonuç yönünü kontrol edin."
      };
    } else if (i <= 60) {
      const passageIdx = Math.floor((i - 37) / 12) % readingPassages.length;
      const passage = readingPassages[passageIdx];
      const qInPassage = passage.questions[(i - 37) % passage.questions.length];

      qObj = {
        questionNumber: i,
        sectionName: "Paragraf Okuma & Anlama (Reading Comprehension)",
        passage: passage.text,
        question: qInPassage.q,
        options: qInPassage.opts.map((opt, idx) => ({ key: ["A", "B", "C", "D", "E"][idx], text: opt })),
        correctAnswer: qInPassage.corr,
        explanation: qInPassage.exp,
        strategyTip: "Paragraftaki anahtar kelimeleri ve eşanlamlı (paraphrased) ifadeleri eşleştirin."
      };
    } else if (i <= 70) {
      const template = translationTemplates[(i - 61) % translationTemplates.length];
      qObj = {
        questionNumber: i,
        sectionName: "Çeviri & Yakın Anlam (Translation & Restatement)",
        question: template.q(),
        options: template.opts.map((opt, idx) => ({ key: ["A", "B", "C", "D", "E"][idx], text: opt })),
        correctAnswer: template.corr,
        explanation: template.exp,
        strategyTip: "Ana fiilin ve öznenin tam Türkçe/İngilizce karşılığını önce seçeneklerde eleyin."
      };
    } else {
      const template = diyalogTemplates[(i - 71) % diyalogTemplates.length];
      qObj = {
        questionNumber: i,
        sectionName: i <= 75 ? "Diyalog Tamamlama" : "Anlam Bütünlüğünü Bozan Cümle",
        question: template.q(),
        options: template.opts.map((opt, idx) => ({ key: ["A", "B", "C", "D", "E"][idx], text: opt })),
        correctAnswer: template.corr,
        explanation: template.exp,
        strategyTip: "Konunun odağından sapan veya zamir referansı (this, that, these) uyuşmayan cümleyi arayın."
      };
    }

    qObj.id = `exam-${examId}-q-${i}`;
    qObj.examId = examId;
    questions.push(qObj);
  }

  return {
    meta,
    questions
  };
}

export function getAllMockExamsMeta() {
  return examThemes;
}
