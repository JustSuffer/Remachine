// AI Language Coach Engine (Interactive Bilingual Language Tutor)

export const initialBotMessages = [
  {
    id: "msg-1",
    sender: "bot",
    persona: "ielts",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: "Hello! I am your AI IELTS Examiner & Advanced English Coach. Let's practice Band 8.0+ Lexical Resource and Speaking tasks, or examine any complex sentence together. What would you like to discuss today?",
    feedback: null
  }
];

export function generateBotResponse(userMessage, persona = "ielts") {
  const lower = userMessage.toLowerCase().trim();

  let botText = "";
  let feedback = null;

  // Check common grammatical improvements in user's input
  if (lower.includes("i am agree") || lower.includes("i'm agree")) {
    feedback = {
      detectedIssue: "Grammar Mistake: 'I am agree' is incorrect.",
      correction: "I agree (or 'I am in agreement with...')",
      rule: "'Agree' is a verb, not an adjective. Therefore, do not use the auxiliary 'am' with it in the present simple.",
      bandScore: "Band 5.5 -> Elevated to Band 7.5"
    };
    botText = "That's an interesting viewpoint! By the way, notice that we say 'I agree' rather than 'I am agree'. How would you support this stance with an academic example?";
  } else if (lower.includes("despite of")) {
    feedback = {
      detectedIssue: "Collocation Trap: 'Despite of'",
      correction: "Despite + [Noun/Ving] OR In spite of + [Noun/Ving]",
      rule: "'Despite' does NOT take 'of'. Only 'In spite of' uses 'of'.",
      bandScore: "Frequent YDS / IELTS Grammar Trap"
    };
    botText = "Great point! Remember that 'despite' never takes 'of'—you can say either 'Despite the difficulty' or 'In spite of the difficulty'. Could you elaborate further?";
  } else if (lower.includes("he don't") || lower.includes("she don't") || lower.includes("it don't")) {
    feedback = {
      detectedIssue: "Subject-Verb Agreement",
      correction: "He/She/It doesn't...",
      rule: "Third-person singular subjects take 'does / doesn't' in present simple.",
      bandScore: "Band 5.0 -> 7.0"
    };
    botText = "I see your point! Remember the subject-verb concord: 'he/she/it doesn't'. How might this situation develop in the future?";
  } else if (lower.includes("yds") || lower.includes("yökdil") || persona === "yds") {
    botText = "YDS & YÖKDİL sınavlarında en belirleyici faktör, zıtlık bağlaçları (Although, Despite, Notwithstanding) ile devrik yapılar (Hardly... when, Seldom, Had I known) arasındaki nüansları hızlı yakalamaktır. İstersen sana son yılların en çok yanıltan C1 soru tiplerinden birini sorabilirim veya yazdığın bir cümleyi YDS formatında analiz edebilirim!";
    feedback = {
      detectedIssue: "YDS Taktik Hatırlatması",
      correction: "Soru Kökü Analizi",
      rule: "Zaman uyumu (Tense Agreement) ve bağlaç arkası yapı (Cümle mi isim mi?) ilk elenecek şıkları belirler.",
      bandScore: "YDS 90+ Stratejisi"
    };
  } else if (persona === "ielts") {
    botText = `That is a compelling perspective. In IELTS Speaking Part 3 and Writing Task 2, examiners look for cohesive discourse markers such as 'Furthermore', 'Consequently', and 'It is widely argued that...'. 
    
Try incorporating higher-tier vocabulary such as 'indispensable', 'mitigate', or 'exacerbate' into your next sentence!`;
    feedback = {
      detectedIssue: "Lexical Resource Enhancement",
      correction: `Try phrasing: 'It is arguably evident that ${userMessage.slice(0, 30)}...'`,
      rule: "Using hedging language (arguably, potentially, plausibly) demonstrates academic sophistication.",
      bandScore: "Band 8.0 Target"
    };
  } else {
    botText = `Thank you for sharing that! Your communication is clear. To make it sound even more native and articulate, try using advanced collocations. Would you like to practice another topic, or analyze a specific grammar dilemma?`;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: "bot",
    persona,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: botText,
    feedback
  };
}
