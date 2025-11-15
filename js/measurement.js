function showMeasurement() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library tidak terload');
        alert('Chart library tidak terload. Silakan refresh halaman.');
        return;
    }
    
    if (QuizConfig.sessionStats.total === 0) {
        alert('Belum ada soal yang dikerjakan dalam session ini.');
        backToMenu();
        return;
    }
    
    const percentage = QuizConfig.sessionStats.total > 0 ? Math.round((QuizConfig.sessionStats.correct / QuizConfig.sessionStats.total) * 100) : 0;
    const level = getLevel(percentage);
    
    document.getElementById('measurementModal').classList.remove('hidden');
    document.getElementById('quizScreen').classList.add('hidden');
    
    document.getElementById('measurementTotal').textContent = QuizConfig.sessionStats.total;
    document.getElementById('measurementTotalLabel').textContent = QuizConfig.sessionStats.total;
    document.getElementById('measurementCorrect').textContent = QuizConfig.sessionStats.correct;
    document.getElementById('measurementIncorrect').textContent = QuizConfig.sessionStats.incorrect;
    document.getElementById('measurementPercentage').textContent = percentage;
    document.getElementById('measurementLevelDisplay').textContent = level.name;
    
    const correctPct = QuizConfig.sessionStats.total > 0 ? Math.round((QuizConfig.sessionStats.correct / QuizConfig.sessionStats.total) * 100) : 0;
    const incorrectPct = QuizConfig.sessionStats.total > 0 ? Math.round((QuizConfig.sessionStats.incorrect / QuizConfig.sessionStats.total) * 100) : 0;
    document.getElementById('correctPercentage').textContent = correctPct + '%';
    document.getElementById('incorrectPercentage').textContent = incorrectPct + '%';
    
    const levelBadge = document.getElementById('levelBadge');
    levelBadge.textContent = level.name;
    // Use inline style for custom colors
    const bgColor = level.bgColor.includes('bg-[#') ? level.bgColor : `bg-[#F46B61] bg-opacity-20`;
    const textColor = level.textColor.includes('text-[#') ? level.textColor : `text-[#F46B61]`;
    levelBadge.className = `inline-block px-8 py-4 rounded-full ${bgColor} ${textColor} font-bold text-xl`;
    
    const progressBar = document.getElementById('progressBarFill');
    // Use solid color instead of gradient
    progressBar.className = `h-full bg-[#F46B61] rounded-full transition-all duration-1000`;
    
    setTimeout(() => {
        animateProgressBar(percentage);
        animateStats();
        animateChart();
    }, 100);
}

function animateProgressBar(percentage) {
    const progressBar = document.getElementById('progressBarFill');
    progressBar.style.width = '0%';
    
    setTimeout(() => {
        progressBar.style.transition = 'width 1.5s ease-out';
        progressBar.style.width = percentage + '%';
    }, 200);
}

function animateStats() {
    const correctEl = document.getElementById('measurementCorrect');
    const incorrectEl = document.getElementById('measurementIncorrect');
    const percentageEl = document.getElementById('measurementPercentage');
    const correctPctEl = document.getElementById('correctPercentage');
    const incorrectPctEl = document.getElementById('incorrectPercentage');
    
    let correctCount = 0;
    let incorrectCount = 0;
    let percentageCount = 0;
    
    const correctTarget = QuizConfig.sessionStats.correct;
    const incorrectTarget = QuizConfig.sessionStats.incorrect;
    const percentageTarget = QuizConfig.sessionStats.total > 0 ? Math.round((QuizConfig.sessionStats.correct / QuizConfig.sessionStats.total) * 100) : 0;
    
    const interval = setInterval(() => {
        if (correctCount < correctTarget) correctCount++;
        if (incorrectCount < incorrectTarget) incorrectCount++;
        if (percentageCount < percentageTarget) percentageCount++;
        
        correctEl.textContent = correctCount;
        incorrectEl.textContent = incorrectCount;
        percentageEl.textContent = percentageCount;
        
        const correctPct = QuizConfig.sessionStats.total > 0 ? Math.round((correctCount / QuizConfig.sessionStats.total) * 100) : 0;
        const incorrectPct = QuizConfig.sessionStats.total > 0 ? Math.round((incorrectCount / QuizConfig.sessionStats.total) * 100) : 0;
        correctPctEl.textContent = correctPct + '%';
        incorrectPctEl.textContent = incorrectPct + '%';
        
        if (correctCount >= correctTarget && incorrectCount >= incorrectTarget && percentageCount >= percentageTarget) {
            clearInterval(interval);
        }
    }, 30);
}

