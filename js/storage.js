function loadState() {
    const saved = localStorage.getItem('quizState');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            QuizConfig.answeredIds = new Set(data.answered_ids || []);
            QuizConfig.questionStats = data.question_stats || {};
            QuizConfig.levelHistory = data.level_history || [];
        } catch (e) {
            QuizConfig.answeredIds = new Set();
            QuizConfig.questionStats = {};
            QuizConfig.levelHistory = [];
        }
    } else {
        QuizConfig.levelHistory = [];
    }
}

function saveState() {
    const stats = getOverallStats();
    const currentLevel = getLevel(stats.percentage);
    
    if (!QuizConfig.levelHistory) {
        QuizConfig.levelHistory = [];
    }
    
    const shouldAddNewEntry = QuizConfig.levelHistory.length === 0 || 
        QuizConfig.levelHistory[QuizConfig.levelHistory.length - 1].level !== currentLevel.name ||
        QuizConfig.levelHistory[QuizConfig.levelHistory.length - 1].total !== stats.total;
    
    if (shouldAddNewEntry) {
        QuizConfig.levelHistory.push({
            level: currentLevel.name,
            percentage: stats.percentage,
            timestamp: Date.now(),
            total: stats.total
        });
        
        if (QuizConfig.levelHistory.length > 50) {
            QuizConfig.levelHistory = QuizConfig.levelHistory.slice(-50);
        }
    } else {
        QuizConfig.levelHistory[QuizConfig.levelHistory.length - 1] = {
            level: currentLevel.name,
            percentage: stats.percentage,
            timestamp: Date.now(),
            total: stats.total
        };
    }
    
    const data = {
        answered_ids: Array.from(QuizConfig.answeredIds),
        question_stats: QuizConfig.questionStats,
        level_history: QuizConfig.levelHistory
    };
    localStorage.setItem('quizState', JSON.stringify(data));
    
    console.log('State saved. Level history:', QuizConfig.levelHistory);
}

