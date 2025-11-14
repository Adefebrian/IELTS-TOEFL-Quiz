function updateProgress() {
    const total = QuizConfig.allQuestions.length;
    const answered = QuizConfig.answeredIds.size;
    const unanswered = total - answered;
    
    document.getElementById('progressText').textContent = `${answered}/${total}`;
    document.getElementById('unansweredCount').textContent = unanswered;
    document.getElementById('answeredCount').textContent = answered;
    
    const percentage = total > 0 ? (answered / total) * 100 : 0;
    document.getElementById('progressBar').style.width = percentage + '%';
    
    updateMenuChart();
}

function getOverallStats() {
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalAnswered = 0;
    
    Object.values(QuizConfig.questionStats).forEach(stat => {
        totalCorrect += stat.correct || 0;
        totalIncorrect += stat.incorrect || 0;
        totalAnswered += (stat.correct || 0) + (stat.incorrect || 0);
    });
    
    return {
        total: totalAnswered,
        correct: totalCorrect,
        incorrect: totalIncorrect,
        percentage: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0
    };
}

