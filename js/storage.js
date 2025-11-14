function loadState() {
    const saved = localStorage.getItem('quizState');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            QuizConfig.answeredIds = new Set(data.answered_ids || []);
            QuizConfig.questionStats = data.question_stats || {};
        } catch (e) {
            QuizConfig.answeredIds = new Set();
            QuizConfig.questionStats = {};
        }
    }
}

function saveState() {
    const data = {
        answered_ids: Array.from(QuizConfig.answeredIds),
        question_stats: QuizConfig.questionStats
    };
    localStorage.setItem('quizState', JSON.stringify(data));
}

