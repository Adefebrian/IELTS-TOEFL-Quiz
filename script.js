let allQuestions = [];
let answeredIds = new Set();
let currentQuestion = null;
let currentMode = null;
let selectedAnswer = null;

async function init() {
    try {
        if (typeof Papa === 'undefined') {
            throw new Error('Library PapaParse tidak terload. Pastikan koneksi internet aktif.');
        }
        
        updateLoadingMessage('Memuat soal dari file CSV...');
        
        await loadQuestions();
        
        loadState();
        
        updateProgress();
        
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
    } catch (error) {
        console.error('Error initializing app:', error);
        showError(error.message);
    }
}

function updateLoadingMessage(message) {
    const loadingText = document.querySelector('#loadingScreen p');
    if (loadingText) {
        loadingText.textContent = message;
    }
}

function showError(message) {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.innerHTML = `
        <div class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>
            <h2 class="text-white text-2xl font-bold mb-2">Error Memuat Data</h2>
            <p class="text-white text-lg mb-4">${message}</p>
            <div class="bg-white bg-opacity-20 rounded-lg p-4 text-left max-w-md mx-auto">
                <p class="text-white text-sm mb-2"><strong>Cara mengatasi:</strong></p>
                <ol class="text-white text-sm list-decimal list-inside space-y-1">
                    <li>Pastikan server HTTP sedang berjalan (python3 server.py)</li>
                    <li>Buka browser ke: http://localhost:8000/index.html</li>
                    <li>Pastikan file CSV ada di folder yang sama</li>
                    <li>Cek Console browser (F12) untuk detail error</li>
                </ol>
            </div>
            <button onclick="location.reload()" class="mt-6 bg-white text-purple-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition">
                Muat Ulang
            </button>
        </div>
    `;
}

async function loadQuestions() {
    const files = ['quiz_batch1_2000.csv', 'quiz_batch2_2000.csv'];
    let loadedCount = 0;
    const errors = [];
    
    for (const filename of files) {
        try {
            updateLoadingMessage(`Memuat ${filename}...`);
            console.log(`Loading ${filename}...`);
            
            const response = await fetch(filename);
            console.log(`Response status for ${filename}:`, response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const csvText = await response.text();
            console.log(`Loaded ${filename}, size: ${csvText.length} characters`);
            
            if (!csvText || csvText.trim().length === 0) {
                throw new Error('File kosong atau tidak valid');
            }
            
            const result = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true
            });
            
            console.log(`Parsed ${filename}, found ${result.data.length} rows`);
            
            let rowCount = 0;
            result.data.forEach(row => {
                if (row.id) {
                    allQuestions.push({
                        id: parseInt(row.id),
                        category: row.category || '',
                        question: row.question || '',
                        options: {
                            A: row.option_a || '',
                            B: row.option_b || '',
                            C: row.option_c || '',
                            D: row.option_d || ''
                        },
                        correct_letter: row.correct_letter || '',
                        correct_answer: row.correct_answer || '',
                        explanation: row.explanation_id || ''
                    });
                    rowCount++;
                }
            });
            
            console.log(`Successfully loaded ${rowCount} questions from ${filename}`);
            loadedCount += rowCount;
        } catch (error) {
            const errorMsg = `Error loading ${filename}: ${error.message}`;
            console.error(errorMsg, error);
            errors.push(errorMsg);
        }
    }
    
    console.log(`Total questions loaded: ${allQuestions.length}`);
    
    if (allQuestions.length === 0) {
        const errorDetails = errors.length > 0 ? '\n\nDetail error:\n' + errors.join('\n') : '';
        throw new Error(`Tidak ada soal yang berhasil dimuat.${errorDetails}\n\nPastikan:\n1. File CSV ada di folder yang sama\n2. Server HTTP sedang berjalan\n3. Buka melalui http://localhost:8000`);
    }
    
    if (errors.length > 0 && allQuestions.length > 0) {
        console.warn('Some files failed to load, but continuing with loaded questions:', errors);
    }
}

function loadState() {
    const saved = sessionStorage.getItem('quizState');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            answeredIds = new Set(data.answered_ids || []);
        } catch (e) {
            answeredIds = new Set();
        }
    }
}

function saveState() {
    const data = {
        answered_ids: Array.from(answeredIds)
    };
    sessionStorage.setItem('quizState', JSON.stringify(data));
}

function updateProgress() {
    const total = allQuestions.length;
    const answered = answeredIds.size;
    const unanswered = total - answered;
    
    document.getElementById('progressText').textContent = `${answered}/${total}`;
    document.getElementById('unansweredCount').textContent = unanswered;
    document.getElementById('answeredCount').textContent = answered;
    
    const percentage = total > 0 ? (answered / total) * 100 : 0;
    document.getElementById('progressBar').style.width = percentage + '%';
}

function startUnansweredMode() {
    const unanswered = allQuestions.filter(q => !answeredIds.has(q.id));
    
    if (unanswered.length === 0) {
        alert('🎉 Selamat! Kamu sudah mengerjakan semua soal!\n\nKamu bisa:\n- Latihan ulang soal yang sudah dikerjakan\n- Reset untuk mulai dari awal');
        return;
    }
    
    currentMode = 'unanswered';
    showRandomQuestion(unanswered);
}

function startAnsweredMode() {
    const answered = allQuestions.filter(q => answeredIds.has(q.id));
    
    if (answered.length === 0) {
        alert('⚠️ Belum ada soal yang dikerjakan.\n\nSilakan pilih "Mulai Latihan" untuk mengerjakan soal.');
        return;
    }
    
    currentMode = 'answered';
    showRandomQuestion(answered);
}

function showRandomQuestion(pool) {
    if (pool.length === 0) return;
    
    currentQuestion = pool[Math.floor(Math.random() * pool.length)];
    selectedAnswer = null;
    
    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.remove('hidden');
    document.getElementById('resultCard').classList.add('hidden');
    
    displayQuestion(currentQuestion);
}

function displayQuestion(question) {
    const categoryBadge = document.getElementById('categoryBadge');
    categoryBadge.textContent = question.category.replace(/_/g, ' ');
    
    document.getElementById('questionId').textContent = question.id;
    
    document.getElementById('questionText').textContent = question.question;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    ['A', 'B', 'C', 'D'].forEach(letter => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-card border-2 border-gray-200 rounded-xl p-4';
        optionDiv.onclick = () => selectOption(letter);
        optionDiv.innerHTML = `
            <div class="flex items-start">
                <span class="font-bold text-lg mr-3">${letter}.</span>
                <span class="flex-1">${question.options[letter]}</span>
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
    
    selectedAnswer = letter;
    document.getElementById('submitBtn').disabled = false;
}

function submitAnswer() {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correct_letter;
    
    if (currentMode === 'unanswered') {
        answeredIds.add(currentQuestion.id);
        saveState();
        updateProgress();
    }
    
    document.querySelectorAll('.option-card').forEach(card => {
        card.onclick = null;
        const letter = card.dataset.letter;
        
        if (letter === currentQuestion.correct_letter) {
            card.classList.add('correct');
        } else if (letter === selectedAnswer) {
            card.classList.add('incorrect');
        }
    });
    
    document.getElementById('actionButtons').classList.add('hidden');
    
    showResult(isCorrect);
}

function showResult(isCorrect) {
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
        resultTitle.textContent = '✅ BENAR!';
        resultTitle.className = 'text-3xl font-bold mb-2 text-green-600';
    } else {
        resultIcon.innerHTML = `
            <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>
        `;
        resultTitle.textContent = '❌ SALAH!';
        resultTitle.className = 'text-3xl font-bold mb-2 text-red-600';
    }
    
    document.getElementById('userAnswerText').textContent = 
        `${selectedAnswer}. ${currentQuestion.options[selectedAnswer]}`;
    document.getElementById('correctAnswerText').textContent = 
        `${currentQuestion.correct_letter}. ${currentQuestion.correct_answer}`;
    document.getElementById('explanationText').textContent = currentQuestion.explanation;
    
    resultCard.classList.remove('hidden');
    
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function nextQuestion() {
    if (currentMode === 'unanswered') {
        const unanswered = allQuestions.filter(q => !answeredIds.has(q.id));
        if (unanswered.length === 0) {
            alert('🎉 Kamu sudah menyelesaikan semua soal!');
            backToMenu();
            return;
        }
        showRandomQuestion(unanswered);
    } else {
        const answered = allQuestions.filter(q => answeredIds.has(q.id));
        showRandomQuestion(answered);
    }
    
    document.getElementById('actionButtons').classList.remove('hidden');
}

function backToMenu() {
    document.getElementById('quizScreen').classList.add('hidden');
    document.getElementById('menuScreen').classList.remove('hidden');
    currentQuestion = null;
    selectedAnswer = null;
}

function showResetModal() {
    document.getElementById('resetModal').classList.remove('hidden');
}

function closeResetModal() {
    document.getElementById('resetModal').classList.add('hidden');
}

function confirmReset() {
    answeredIds.clear();
    saveState();
    updateProgress();
    closeResetModal();
    alert('✅ Status semua soal berhasil direset!\n\nKamu bisa mulai latihan dari awal lagi.');
}

init();

