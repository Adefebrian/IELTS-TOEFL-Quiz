const QuizConfig = {
    allQuestions: [],
    allGrammarTopics: [], // Grammar topics dari semua level
    formulaData: [], // Data formula tenses
    modalData: [], // Data modal verbs
    answeredIds: new Set(),
    questionStats: {},
    levelHistory: [],
    currentQuestion: null,
    currentMode: null,
    selectedAnswer: null,
    sessionStats: {
        total: 0,
        correct: 0,
        incorrect: 0
    },
    shuffledOptionsContent: [],
    shuffledCorrectLetter: null,
    chartInstance: null,
    menuChartInstance: null,
    // Learn Grammar state
    selectedLevel: null,
    selectedTopic: null,
    // Learn Vocab state
    currentVocabWord: null,
    vocabHistory: [],
    vocabLearned: new Set(), // Kata yang sudah dipelajari (dengan Yes)
    vocabLearnedData: [] // Data lengkap vocab yang sudah dipelajari
};

