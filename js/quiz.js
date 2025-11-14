function startUnansweredMode() {
    const unanswered = QuizConfig.allQuestions.filter(q => !QuizConfig.answeredIds.has(q.id));
    
    if (unanswered.length === 0) {
        alert('Selamat! Kamu sudah mengerjakan semua soal!\n\nKamu bisa:\n- Latihan ulang soal yang sudah dikerjakan\n- Reset untuk mulai dari awal');
        return;
    }
    
    QuizConfig.sessionStats = { total: 0, correct: 0, incorrect: 0 };
    QuizConfig.currentMode = 'unanswered';
    showRandomQuestion(unanswered);
}

function startAnsweredMode() {
    const answered = QuizConfig.allQuestions.filter(q => QuizConfig.answeredIds.has(q.id));
    
    if (answered.length === 0) {
        alert('Belum ada soal yang dikerjakan.\n\nSilakan pilih "Mulai Latihan" untuk mengerjakan soal.');
        return;
    }
    
    QuizConfig.sessionStats = { total: 0, correct: 0, incorrect: 0 };
    QuizConfig.currentMode = 'answered';
    showRandomQuestion(answered);
}

function showRandomQuestion(pool) {
    if (pool.length === 0) return;
    
    QuizConfig.currentQuestion = pool[Math.floor(Math.random() * pool.length)];
    QuizConfig.selectedAnswer = null;
    
    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.remove('hidden');
    document.getElementById('resultCard').classList.add('hidden');
    document.getElementById('measurementModal').classList.add('hidden');
    
    displayQuestion(QuizConfig.currentQuestion);
}

function displayQuestion(question) {
    const categoryBadge = document.getElementById('categoryBadge');
    categoryBadge.textContent = question.category.replace(/_/g, ' ');
    
    document.getElementById('questionId').textContent = question.id;
    document.getElementById('questionText').textContent = question.question;
    
    const originalOptions = [
        question.options.A,
        question.options.B,
        question.options.C,
        question.options.D
    ];
    
    const correctAnswerText = question.correct_answer;
    
    QuizConfig.shuffledOptionsContent = shuffleArray(originalOptions);
    
    const letters = ['A', 'B', 'C', 'D'];
    QuizConfig.shuffledCorrectLetter = null;
    
    QuizConfig.shuffledOptionsContent.forEach((optionText, index) => {
        if (optionText === correctAnswerText) {
            QuizConfig.shuffledCorrectLetter = letters[index];
        }
    });
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    letters.forEach((letter, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-card border-2 border-gray-200 rounded-xl p-4';
        optionDiv.onclick = () => selectOption(letter);
        optionDiv.innerHTML = `
            <div class="flex items-start">
                <span class="font-bold text-lg mr-3">${letter}.</span>
                <span class="flex-1">${QuizConfig.shuffledOptionsContent[index]}</span>
            </div>
        `;
        optionDiv.dataset.letter = letter;
        optionsContainer.appendChild(optionDiv);
    });
    
    document.getElementById('submitBtn').disabled = true;
}

function selectOption(letter) {
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selected = document.querySelector(`[data-letter="${letter}"]`);
    selected.classList.add('selected');
    
    QuizConfig.selectedAnswer = letter;
    document.getElementById('submitBtn').disabled = false;
}

function submitAnswer() {
    if (!QuizConfig.selectedAnswer) return;
    
    const isCorrect = QuizConfig.selectedAnswer === QuizConfig.shuffledCorrectLetter;
    
    if (QuizConfig.currentMode === 'unanswered') {
        QuizConfig.answeredIds.add(QuizConfig.currentQuestion.id);
        if (!QuizConfig.questionStats[QuizConfig.currentQuestion.id]) {
            QuizConfig.questionStats[QuizConfig.currentQuestion.id] = { correct: 0, incorrect: 0 };
        }
        if (isCorrect) {
            QuizConfig.questionStats[QuizConfig.currentQuestion.id].correct++;
        } else {
            QuizConfig.questionStats[QuizConfig.currentQuestion.id].incorrect++;
        }
        saveState();
        updateProgress();
    }
    
    document.querySelectorAll('.option-card').forEach(card => {
        card.onclick = null;
        const letter = card.dataset.letter;
        
        if (letter === QuizConfig.shuffledCorrectLetter) {
            card.classList.add('correct');
        } else if (letter === QuizConfig.selectedAnswer) {
            card.classList.add('incorrect');
        }
    });
    
    document.getElementById('actionButtons').classList.add('hidden');
    
    showResult(isCorrect);
}

function showResult(isCorrect) {
    QuizConfig.sessionStats.total++;
    if (isCorrect) {
        QuizConfig.sessionStats.correct++;
    } else {
        QuizConfig.sessionStats.incorrect++;
    }
    
    const resultCard = document.getElementById('resultCard');
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    
    if (isCorrect) {
        resultIcon.innerHTML = `
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
        `;
        resultTitle.textContent = 'BENAR';
        resultTitle.className = 'text-3xl font-bold mb-2 text-green-600';
    } else {
        resultIcon.innerHTML = `
            <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>
        `;
        resultTitle.textContent = 'SALAH';
        resultTitle.className = 'text-3xl font-bold mb-2 text-red-600';
    }
    
    const userAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(QuizConfig.selectedAnswer);
    const userAnswerText = QuizConfig.shuffledOptionsContent[userAnswerIndex];
    document.getElementById('userAnswerText').textContent = 
        `${QuizConfig.selectedAnswer}. ${userAnswerText}`;
    document.getElementById('correctAnswerText').textContent = 
        `${QuizConfig.shuffledCorrectLetter}. ${QuizConfig.currentQuestion.correct_answer}`;
    document.getElementById('explanationText').textContent = QuizConfig.currentQuestion.explanation;
    
    resultCard.classList.remove('hidden');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function nextQuestion() {
    if (QuizConfig.currentMode === 'unanswered') {
        const unanswered = QuizConfig.allQuestions.filter(q => !QuizConfig.answeredIds.has(q.id));
        if (unanswered.length === 0) {
            if (QuizConfig.sessionStats.total > 0) {
                showMeasurement();
            } else {
                backToMenu();
            }
            return;
        }
        showRandomQuestion(unanswered);
    } else {
        const answered = QuizConfig.allQuestions.filter(q => QuizConfig.answeredIds.has(q.id));
        showRandomQuestion(answered);
    }
    
    document.getElementById('actionButtons').classList.remove('hidden');
}

function backToMenu() {
    document.getElementById('quizScreen').classList.add('hidden');
    document.getElementById('menuScreen').classList.remove('hidden');
    document.getElementById('measurementModal').classList.add('hidden');
    QuizConfig.currentQuestion = null;
    QuizConfig.selectedAnswer = null;
    QuizConfig.sessionStats = { total: 0, correct: 0, incorrect: 0 };
    QuizConfig.shuffledOptionsContent = [];
    QuizConfig.shuffledCorrectLetter = null;
    if (QuizConfig.chartInstance) {
        QuizConfig.chartInstance.destroy();
        QuizConfig.chartInstance = null;
    }
    updateMenuChart();
}

function finishSession() {
    if (QuizConfig.sessionStats.total === 0) {
        backToMenu();
        return;
    }
    showMeasurement();
}

function showResetModal() {
    document.getElementById('resetModal').classList.remove('hidden');
}

function closeResetModal() {
    document.getElementById('resetModal').classList.add('hidden');
}

function confirmReset() {
    QuizConfig.answeredIds.clear();
    QuizConfig.questionStats = {};
    saveState();
    updateProgress();
    closeResetModal();
    QuizConfig.sessionStats = { total: 0, correct: 0, incorrect: 0 };
    QuizConfig.shuffledOptionsContent = [];
    QuizConfig.shuffledCorrectLetter = null;
    if (QuizConfig.chartInstance) {
        QuizConfig.chartInstance.destroy();
        QuizConfig.chartInstance = null;
    }
    if (QuizConfig.menuChartInstance) {
        QuizConfig.menuChartInstance.destroy();
        QuizConfig.menuChartInstance = null;
    }
    alert('Status semua soal berhasil direset!\n\nKamu bisa mulai latihan dari awal lagi.');
}

