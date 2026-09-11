export const grammarCategories = [
  { id: "all", nameTr: "Tüm Konular", nameEn: "All Topics" },
  { id: "tenses", nameTr: "Zamanlar (12 Tenses)", nameEn: "Tenses & Aspects" },
  { id: "modals", nameTr: "Modallar & Past Modals", nameEn: "Modals & Semi-Modals" },
  { id: "passives", nameTr: "Pasif & Ettirgen Yapılar", nameEn: "Passives & Causatives" },
  { id: "conditionals", nameTr: "Koşul Cümleleri & Wish", nameEn: "Conditionals & Wishes" },
  { id: "clauses", nameTr: "Noun & Relative Clauses", nameEn: "Relative & Noun Clauses" },
  { id: "conjunctions", nameTr: "Bağlaçlar & Geçiş İfadeleri", nameEn: "Conjunctions & Transitions" },
  { id: "gerund_infinitive", nameTr: "Gerund & Infinitive", nameEn: "Gerunds & Infinitives" },
  { id: "advanced_c1", nameTr: "Devrik Yapılar & İleri C1", nameEn: "Inversion & Advanced C1" },
  { id: "phrasals", nameTr: "Phrasal Verbs & Prepositions", nameEn: "Phrasal Verbs Bank" }
];

export const grammarTopics = [
  {
    id: "tenses-overview",
    category: "tenses",
    level: "A1-B2",
    titleTr: "12 Zaman (Tenses) ve Zaman Uyumu Kuralları",
    titleEn: "All 12 Tenses, Aspects & Sequence of Tenses",
    summaryTr: "İngilizcedeki 12 temel zaman yapısı, zaman ekseni şemaları ve YDS/IELTS sınavlarında hayati olan zaman uyumu kuralları.",
    summaryEn: "Master all 12 English tenses, aspectual timelines, and critical tense harmony rules for exams.",
    formula: "Present (V1/is-are/has V3) ↔ Present/Future; Past (V2/was-were/had V3) ↔ Past",
    signalWords: ["By the time", "Since (+ Past Simple, Present Perfect)", "For the last decade", "Currently / At present", "Until", "As soon as"],
    traps: [
      "⚠️ 'Since' kuralı: Since + Simple Past (V2), Main Clause -> Present Perfect (Have/Has V3). Örn: 'Since she moved to London, she has published three books.'",
      "⚠️ 'By the time' kuralı: By the time + V1 -> Future Perfect (Will have V3); By the time + V2 -> Past Perfect (Had V3).",
      "⚠️ Stative (Durum) fiiller (know, believe, understand, belong, own) Continuous (-ing) almaz."
    ],
    sections: [
      {
        heading: "1. Present Tenses (Geniş & Şimdiki Zamanlar)",
        content: "• Simple Present (V1 / -s): Genel gerçekler, bilimsel olgular, rutinler.\n• Present Continuous (am/is/are + V-ing): Konuşma anında süren ya da geçici durumlar, geleceğe dair planlar.\n• Present Perfect (have/has + V3): Geçmişte başlayıp etkisi süren veya zamanı belirtilmeyen deneyimler.\n• Present Perfect Continuous (have/has been + V-ing): Geçmişten bugüne kesintisiz süren eylemler."
      },
      {
        heading: "2. Past Tenses (Geçmiş Zamanlar)",
        content: "• Simple Past (V2): Geçmişte belirli bir zamanda bitmiş eylemler (yesterday, in 1999, ago).\n• Past Continuous (was/were + V-ing): Geçmişte bir anda devam etmekte olan eylem.\n• Past Perfect (had + V3): Geçmişteki iki olaydan DAHA ÖNCE olanı anlatır.\n• Past Perfect Continuous (had been + V-ing): Geçmişteki bir noktaya kadar devam etmiş olan süreç."
      },
      {
        heading: "3. Future Tenses (Gelecek Zamanlar)",
        content: "• Simple Future (will + V1): Anlık kararlar, tahminler, vaatler.\n• Be going to (am/is/are going to + V1): Planlanmış eylemler ve güçlü kanıta dayalı tahminler.\n• Future Continuous (will be + V-ing): Gelecekte belirli bir anda sürüyor olacak eylem.\n• Future Perfect (will have + V3): Gelecekteki bir tarihe kadar tamamlanmış olacak eylem (By next year, I will have graduated)."
      }
    ],
    examples: [
      {
        en: "By the end of this century, scientists will have developed comprehensive solutions to carbon emissions.",
        tr: "Bu yüzyılın sonuna kadar, bilim insanları karbon salınımına kapsamlı çözümler geliştirmiş olacaklar.",
        note: "'By the end of this century' ifadesi kesinlikle Future Perfect (will have V3) gerektirir."
      },
      {
        en: "Hardly had the meeting started when the fire alarm went off.",
        tr: "Toplantı henüz yeni başlamıştı ki yangın alarmı çaldı.",
        note: "Past Perfect (had started) eylemi, alarmın çalmasından (went off) önce gerçekleşmiştir."
      }
    ]
  },
  {
    id: "modals-deductions",
    category: "modals",
    level: "B1-C1",
    titleTr: "Modallar, Yarı-Modallar ve Geçmiş Çıkarımlar (Past Modals)",
    titleEn: "Modals, Semi-Modals & Past Deductions",
    summaryTr: "Olasılık, zorunluluk, tavsiye ve geçmişe yönelik güçlü çıkarım/pişmanlık kalıpları (must have V3, should have V3, can't have V3).",
    summaryEn: "Expressing probability, obligation, regret, and strong past deductions in academic contexts.",
    formula: "Modal + have + V3 (Geçmişe yönelik çıkarım ve varsayımlar)",
    signalWords: ["Must have V3 (Kesin yapmış olmalı)", "Can't / Couldn't have V3 (Yapmış olamaz)", "Should have V3 (Yapsaydı iyi olurdu / yapmadı)", "Needn't have V3 (Yapmasına gerek yoktu ama yaptı)", "Might / Could have V3 (Yapmış olabilirdi)"],
    traps: [
      "⚠️ 'Should have V3' eylemin YAPILMADIĞINI ve pişmanlık duyulduğunu gösterir. (You should have studied = Çalışmalıydın ama çalışmadın).",
      "⚠️ 'Must have V3' geçmişe ait %95 kesinlikteki olumlu tahmindir. Olumsuz kesinlik için 'Mustn't have' KULLANILMAZ, 'Can't have V3' kullanılır!",
      "⚠️ 'Didn't need to do' (Yapmaya gerek yoktu ve yapmadı) ile 'Needn't have done' (Gerek yoktu ama boşuna yaptı) farkına dikkat edin."
    ],
    sections: [
      {
        heading: "Geçmiş Çıkarım Matrisi (High-Yield YDS/IELTS)",
        content: "1. Must have V3: The ground is wet; it must have rained heavily last night.\n2. Can't have V3: He can't have committed the crime; he was abroad at that time.\n3. May / Might / Could have V3: She didn't answer; she might have fallen asleep.\n4. Would rather + have V3: Tercih edilirdi ama olmadı."
      }
    ],
    examples: [
      {
        en: "Given the meticulous preparation of the team, they must have anticipated these technological bottlenecks.",
        tr: "Ekibin titiz hazırlığı göz önüne alındığında, bu teknolojik darboğazları kesinlikle öngörmüş olmalılar.",
        note: "Güçlü kanıta dayalı geçmiş çıkarım."
      }
    ]
  },
  {
    id: "passives-causatives",
    category: "passives",
    level: "B1-C1",
    titleTr: "Pasif Çatı ve Ettirgen Yapılar (Causatives & Impersonal Passives)",
    titleEn: "Passive Voice, Reporting Passives & Causatives",
    summaryTr: "Akademik makalelerde ve sınavlarda en çok karşılaşılan nesne odaklı pasif yapılar, 'It is said that...' ve 'have/get sth done' kalıpları.",
    summaryEn: "Academic passive transformations, impersonal passive reporting structures, and causative patterns.",
    formula: "Subject + Be (in tense) + V3 / Subject + is said/believed to + V1 or have V3",
    signalWords: ["It is claimed that...", "is believed to have been...", "have something done", "make somebody do something"],
    traps: [
      "⚠️ 'He is said to have escaped' (Kaçtığı söyleniyor) cümlesinde 'to have V3', eylemin söylenme anından DAHA ÖNCE gerçekleştiğini gösterir.",
      "⚠️ Make sb DO (yalın fiil) ↔ Pasif hali: He was made TO DO (to alır!)."
    ],
    sections: [
      {
        heading: "İleri Düzey Raporlama Pasifleri (Impersonal Passives)",
        content: "• Active: People believe that the ancient Egyptians built the pyramids.\n• Passive 1: It is believed that the ancient Egyptians built the pyramids.\n• Passive 2 (İleri Düzey): The ancient Egyptians are believed to have built the pyramids."
      },
      {
        heading: "Ettirgen (Causative) Yapılar",
        content: "• Have sb do sth (Birine bir şey yaptırmak / rica/ücret)\n• Get sb TO do sth (Birini ikna ederek yaptırmak)\n• Have / Get sth DONE (Bir işi başkasına yaptırmak - I had my car repaired)\n• Make sb do sth (Zorla yaptırmak)"
      }
    ],
    examples: [
      {
        en: "The newly discovered manuscript is claimed to have been written during the Byzantine era.",
        tr: "Yeni keşfedilen el yazmasının Bizans döneminde yazılmış olduğu iddia edilmektedir.",
        note: "Zaman farkı olduğu için 'to have been written' kullanılmıştır."
      }
    ]
  },
  {
    id: "conditionals-wishes",
    category: "conditionals",
    level: "B1-C1",
    titleTr: "Koşul Cümleleri (Conditionals 0-3, Mixed) ve Devrik Şartlar",
    titleEn: "Conditionals (0, 1, 2, 3, Mixed) & Inverted Conditions",
    summaryTr: "Type 0, 1, 2, 3 koşul cümleleri, zamanların karıştığı Mixed Conditionals ve 'If' düşerek yapılan devrik kalıplar (Had I known...).",
    summaryEn: "Real and unreal conditionals, mixed temporal conditions, and subjunctive inversions.",
    formula: "Type 1: If + Present, will / Type 2: If + Past, would / Type 3: If + Past Perf, would have V3 / Mixed: If + Past Perf, would V1 (today)",
    signalWords: ["Unless (If not)", "Provided that / Providing", "As long as", "Had it not been for (O olmasaydı)", "But for (+ Noun)", "In case"],
    traps: [
      "⚠️ Mixed Conditional (Geçmişteki neden ➔ Şimdiki sonuç): 'If I had accepted that job last year, I would be living in Paris now.' (Geçmişte kabul etseydim, ŞU AN Paris'te yaşıyor olurdum).",
      "⚠️ Devrik Şartlar (Inversion in If Clauses):\n  • Type 1: Should you need help... (If you need help...)\n  • Type 2: Were I you... (If I were you...)\n  • Type 3: Had we known the risks... (If we had known the risks...)"
    ],
    sections: [
      {
        heading: "Devrik Şart Yapıları (Sınavlarda Soru Olarak Çıkar)",
        content: "1. Type 1 Inversion: 'Should you have any inquiries, do not hesitate to contact us.'\n2. Type 2 Inversion: 'Were the company to increase salaries, employee morale would improve.'\n3. Type 3 Inversion: 'Had the captain followed the radar warnings, the catastrophe could have been averted.'"
      }
    ],
    examples: [
      {
        en: "Had the authorities implemented stringent lockdown measures earlier, the epidemic would not have escalated so catastrophically.",
        tr: "Yetkililer sıkı karantina tedbirlerini daha önce uygulamış olsalardı, salgın bu denli feci bir şekilde tırmanmazdı.",
        note: "Type 3 devrik şart yapısı (If kaldırılmış, Had başa gelmiştir)."
      }
    ]
  },
  {
    id: "conjunctions-transitions",
    category: "conjunctions",
    level: "B1-C1",
    titleTr: "Bağlaçlar, Geçiş Sözcükleri ve Zıtlık Kalıpları (Essential Conjunctions)",
    titleEn: "Conjunctions, Transitions & Discourse Markers",
    summaryTr: "YDS ve IELTS sınavlarının omurgasını oluşturan zıtlık, sebep, sonuç, amaç ve ekleme bağlaçları matrisi.",
    summaryEn: "Contrast, concession, cause-effect, purpose, and addition discourse markers essential for high band scores.",
    formula: "Conjunction + Clause / Preposition + Noun/Ving / Transition Adverb (However; Furthermore)",
    signalWords: ["Although / Even though (+ Cümle)", "Despite / In spite of (+ İsim/Ving)", "Whereas / While (Tam Zıtlık)", "Because / Since / As (+ Cümle)", "Due to / Owing to (+ İsim)", "Therefore / Hence / Thus", "Furthermore / Moreover / In addition"],
    traps: [
      "⚠️ 'Although' cümle (S+V) alır; 'In spite of / Despite' ise İsim veya V-ing alır! (Despite the rain ↔ Although it was raining).",
      "⚠️ 'Whereas / While' doğrudan karşılaştırma yapar: 'While solar energy is renewable, fossil fuels are finite.'",
      "⚠️ 'Due to' sıfat gibi 'be due to' olarak veya isim tamlaması ile kullanılır; arkasından tam cümle gelmesi için 'Due to the fact that...' kalıbı gerekir."
    ],
    sections: [
      {
        heading: "1. Zıtlık & Beklenmedik Sonuç Bağlaçları",
        content: "• Cümle Alanlar: Although, Even though, Though, Much as, In spite of the fact that\n• İsim/V-ing Alanlar: Despite, In spite of, Notwithstanding, Regardless of\n• Geçiş Zarfları (Noktalı virgül / Nokta sonrası): However, Nevertheless, Nonetheless, Even so, On the contrary"
      },
      {
        heading: "2. Sebep & Sonuç Bağlaçları",
        content: "• Sebep (Cümle): Because, Since, As, Inasmuch as, Seeing that\n• Sebep (İsim): Due to, Owing to, Because of, On account of, Thanks to\n• Sonuç (Zarf): Therefore, Consequently, Thus, Hence, As a result"
      }
    ],
    examples: [
      {
        en: "Notwithstanding the stringent regulations imposed by the European Union, certain corporations continue to circumvent environmental laws.",
        tr: "Avrupa Birliği tarafından getirilen katı düzenlemelere rağmen, bazı şirketler çevre yasalarının etrafından dolaşmaya devam ediyor.",
        note: "'Notwithstanding' C1 seviyesinde 'Despite' anlamına gelen ileri düzey bir edattır."
      }
    ]
  },
  {
    id: "inversion-advanced-c1",
    category: "advanced_c1",
    level: "C1",
    titleTr: "Devrik Cümleler (Inversion) & İleri Düzey Vurgu Yapıları (Cleft Sentences)",
    titleEn: "Inversion, Cleft Sentences & Subjunctive Mood",
    summaryTr: "C1 seviyesi ve sınavların en seçici sorularını oluşturan olumsuz zarf devrikleri (Hardly, Seldom, Not only), Cleft vurguları ve Subjunctive yapılar.",
    summaryEn: "Master negative adverbial inversion, emphatic cleft sentences, and subjunctive mandates.",
    formula: "Negative Adverb + Auxiliary Verb + Subject + Main Verb (Örn: Seldom have I seen...)",
    signalWords: ["Hardly ... when", "No sooner ... than", "Scarcely ... when", "Seldom / Rarely / Little", "Not only ... but also", "Under no circumstances", "Only after / Only when"],
    traps: [
      "⚠️ 'No sooner' daima 'than' ile; 'Hardly / Scarcely' ise daima 'when' ile eşleşir! (No sooner had I arrived than it began to snow).",
      "⚠️ 'Only when / Only after' ile başlayan cümlelerde devriklik İKİNCİ (ana) cümlede yapılır! (Only after she left DID he realize his mistake)."
    ],
    sections: [
      {
        heading: "Olumsuz Başlangıçlı Devriklik Formülleri",
        content: "• Under no circumstances should you disclose this password.\n• Not only did the company increase its revenue, but it also expanded internationally.\n• Little did they know that the project would change history."
      },
      {
        heading: "Cleft (Vurgu) Cümleleri",
        content: "• It was Alexander Fleming who discovered penicillin in 1928.\n• What intrigued the researchers most was the unprecedented rate of cell regeneration."
      }
    ],
    examples: [
      {
        en: "Rarely has an archaeological discovery sparked such intense international debate among historians.",
        tr: "Bir arkeolojik keşfin tarihçiler arasında böylesine yoğun bir uluslararası tartışmayı ateşlediği nadiren görülmüştür.",
        note: "'Rarely' başa geldiğinde 'has an archaeological discovery sparked' şeklinde soru dizilimi (devriklik) kazanır."
      }
    ]
  }
];
