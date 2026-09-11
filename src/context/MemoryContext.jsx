import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialVocabulary } from '../data/initialVocab';

const MemoryContext = createContext();

// SuperMemo SM-2 Spaced Repetition Algorithm Implementation
function calculateSM2(quality, repetitions, previousInterval, previousEaseFactor) {
  // Quality: 0 to 5
  let nextRepetitions = repetitions;
  let nextInterval = 1;
  let nextEaseFactor = previousEaseFactor;

  if (quality >= 3) {
    if (repetitions === 0) {
      nextInterval = 1;
    } else if (repetitions === 1) {
      nextInterval = 3;
    } else {
      nextInterval = Math.round(previousInterval * previousEaseFactor);
    }
    nextRepetitions = repetitions + 1;
  } else {
    nextRepetitions = 0;
    nextInterval = 1;
  }

  // Calculate new Ease Factor (EF)
  nextEaseFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (nextEaseFactor < 1.3) nextEaseFactor = 1.3;

  return {
    repetitions: nextRepetitions,
    interval: nextInterval,
    easeFactor: nextEaseFactor
  };
}

export function MemoryProvider({ children }) {
  const [vocabulary, setVocabulary] = useState(() => {
    const saved = localStorage.getItem('remachine_vocab');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading vocab from local storage', e);
      }
    }
    return initialVocabulary;
  });

  const [analyzedSentences, setAnalyzedSentences] = useState(() => {
    const saved = localStorage.getItem('remachine_sentences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('remachine_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      streak: 7,
      totalReviews: 42,
      lastActive: new Date().toISOString(),
      testsCompleted: 12,
      accuracyRate: 84
    };
  });

  useEffect(() => {
    localStorage.setItem('remachine_vocab', JSON.stringify(vocabulary));
  }, [vocabulary]);

  useEffect(() => {
    localStorage.setItem('remachine_sentences', JSON.stringify(analyzedSentences));
  }, [analyzedSentences]);

  useEffect(() => {
    localStorage.setItem('remachine_stats', JSON.stringify(stats));
  }, [stats]);

  // Add single word to vault
  const addWord = (wordData) => {
    const newWord = {
      id: `vocab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      word: wordData.word.trim(),
      ipa: wordData.ipa || '',
      pos: wordData.pos || 'noun',
      meaningTr: wordData.meaningTr || '',
      meaningEn: wordData.meaningEn || '',
      exampleEn: wordData.exampleEn || '',
      exampleTr: wordData.exampleTr || '',
      collocations: wordData.collocations || [],
      synonyms: wordData.synonyms || [],
      tags: wordData.tags || ['Custom'],
      level: wordData.level || 'B2',
      interval: 1,
      repetition: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString(),
      status: 'due',
      createdAt: new Date().toISOString()
    };

    setVocabulary((prev) => {
      // Check if word already exists
      const existingIdx = prev.findIndex(w => w.word.toLowerCase() === newWord.word.toLowerCase());
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...newWord, id: updated[existingIdx].id };
        return updated;
      }
      return [newWord, ...prev];
    });
    return newWord;
  };

  // Batch add words
  const batchAddWords = (wordsArray) => {
    let addedCount = 0;
    setVocabulary((prev) => {
      const existingWords = new Set(prev.map(w => w.word.toLowerCase()));
      const toAdd = [];
      wordsArray.forEach(item => {
        if (!existingWords.has(item.word.toLowerCase())) {
          toAdd.push({
            id: `vocab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            word: item.word.trim(),
            ipa: item.ipa || '',
            pos: item.pos || 'word',
            meaningTr: item.meaningTr || '',
            meaningEn: item.meaningEn || '',
            exampleEn: item.exampleEn || '',
            exampleTr: item.exampleTr || '',
            collocations: item.collocations || [],
            synonyms: item.synonyms || [],
            tags: item.tags || ['Sentence-Extracted'],
            level: item.level || 'B2',
            interval: 1,
            repetition: 0,
            easeFactor: 2.5,
            dueDate: new Date().toISOString(),
            status: 'due',
            createdAt: new Date().toISOString()
          });
          addedCount++;
        }
      });
      return [...toAdd, ...prev];
    });
    return addedCount;
  };

  // Review word with SRS grade (0-5)
  const reviewWord = (wordId, grade) => {
    setVocabulary((prev) =>
      prev.map((word) => {
        if (word.id !== wordId) return word;

        const { repetitions, interval, easeFactor } = calculateSM2(
          grade,
          word.repetition || 0,
          word.interval || 1,
          word.easeFactor || 2.5
        );

        const nextDueDate = new Date();
        nextDueDate.setDate(nextDueDate.getDate() + interval);

        let newStatus = 'learning';
        if (repetitions >= 4 && interval >= 14) {
          newStatus = 'mastered';
        } else if (grade < 3) {
          newStatus = 'due';
        }

        return {
          ...word,
          repetition: repetitions,
          interval,
          easeFactor,
          dueDate: nextDueDate.toISOString(),
          status: newStatus,
          lastReviewed: new Date().toISOString()
        };
      })
    );

    // Update global stats
    setStats((prev) => ({
      ...prev,
      totalReviews: prev.totalReviews + 1,
      lastActive: new Date().toISOString()
    }));
  };

  const deleteWord = (id) => {
    setVocabulary((prev) => prev.filter(w => w.id !== id));
  };

  // Add analyzed sentence history
  const addSentenceBreakdown = (sentenceData) => {
    setAnalyzedSentences((prev) => [
      {
        id: `sent-${Date.now()}`,
        ...sentenceData,
        date: new Date().toISOString()
      },
      ...prev.slice(0, 49) // Keep last 50
    ]);
  };

  // Export & import
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ vocabulary, stats, analyzedSentences }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `remachine_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.vocabulary && Array.isArray(parsed.vocabulary)) {
        setVocabulary(parsed.vocabulary);
      }
      if (parsed.stats) setStats(parsed.stats);
      if (parsed.analyzedSentences) setAnalyzedSentences(parsed.analyzedSentences);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  // Speech helper
  const speakText = (text, langCode = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const dueWords = vocabulary.filter(w => new Date(w.dueDate) <= new Date() || w.status === 'due');
  const masteredWords = vocabulary.filter(w => w.status === 'mastered');

  return (
    <MemoryContext.Provider
      value={{
        vocabulary,
        analyzedSentences,
        stats,
        dueWords,
        masteredWords,
        addWord,
        batchAddWords,
        reviewWord,
        deleteWord,
        addSentenceBreakdown,
        exportData,
        importData,
        speakText
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemory() {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
}
