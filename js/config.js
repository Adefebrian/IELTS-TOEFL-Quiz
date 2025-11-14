const QuizConfig = {
    allQuestions: [],
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
    menuChartInstance: null
};

