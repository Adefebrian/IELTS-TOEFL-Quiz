/**
 * Learn Grammar Module
 * 
 * Menangani UI dan logic untuk fitur Learn Grammar:
 * - Level grid (3x2: A1, A2, B1, B2, C1, C2)
 * - Topic list berdasarkan level
 * - Detail view untuk setiap topic
 */

const LEVEL_INFO = {
    'A1': { name: 'A1', description: 'Beginner', bgColor: 'bg-[#F46B61]', textColor: 'text-white' },
    'A2': { name: 'A2', description: 'Elementary', bgColor: 'bg-[#F46B61]', textColor: 'text-white' },
    'B1': { name: 'B1', description: 'Intermediate', bgColor: 'bg-[#F46B61]', textColor: 'text-white' },
    'B2': { name: 'B2', description: 'Upper-Intermediate', bgColor: 'bg-[#F46B61]', textColor: 'text-white' },
    'C1': { name: 'C1', description: 'Advanced', bgColor: 'bg-[#F46B61]', textColor: 'text-white' },
    'C2': { name: 'C2', description: 'Proficient', bgColor: 'bg-[#F46B61]', textColor: 'text-white' }
};

/**
 * Tampilkan Learn Grammar screen
 */
function showLearnScreen() {
    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.add('hidden');
    document.getElementById('learnScreen').classList.remove('hidden');
    
    QuizConfig.selectedLevel = null;
    QuizConfig.selectedTopic = null;
    
    renderLevelGrid();
    renderFormulaSection();
    renderModalSection();
    clearTopicList();
    clearTopicDetail();
}

/**
 * Render grid level 3x2 (A1, A2, B1, B2, C1, C2)
 */
function renderLevelGrid() {
    const gridContainer = document.getElementById('levelGrid');
    if (!gridContainer) return;
    
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    
    gridContainer.innerHTML = '';
    
    levels.forEach(level => {
        const levelInfo = LEVEL_INFO[level];
        const levelCard = document.createElement('div');
        levelCard.className = 'bg-white rounded-xl shadow-lg p-6 card-hover border-2 border-transparent hover:border-[#F46B61] cursor-pointer transition-all';
        levelCard.onclick = () => selectLevel(level);
        
        levelCard.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 ${levelInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-3">
                    <span class="${levelInfo.textColor} font-bold text-xl">${levelInfo.name}</span>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-1">${levelInfo.name}</h3>
                <p class="text-xs text-gray-600">${levelInfo.description}</p>
            </div>
        `;
        
        gridContainer.appendChild(levelCard);
    });
}

/**
 * Handle level selection
 */
function selectLevel(level) {
    QuizConfig.selectedLevel = level;
    QuizConfig.selectedTopic = null;
    
    const topics = getTopicsByLevel(level);
    renderTopicList(topics);
    clearTopicDetail();
    
    // Update selected level display
    const levelDisplay = document.getElementById('selectedLevelDisplay');
    if (levelDisplay) {
        levelDisplay.textContent = level;
    }
    
    // Scroll ke topic list
    document.getElementById('topicListSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Render list topic untuk level yang dipilih
 */
function renderTopicList(topics) {
    const topicListContainer = document.getElementById('topicList');
    if (!topicListContainer) return;
    
    topicListContainer.innerHTML = '';
    
    if (topics.length === 0) {
        topicListContainer.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p class="text-sm">Tidak ada topik tersedia untuk level ini</p>
            </div>
        `;
        return;
    }
    
    // Group by category
    const topicsByCategory = {};
    topics.forEach(topic => {
        const category = topic.category || 'Uncategorized';
        if (!topicsByCategory[category]) {
            topicsByCategory[category] = [];
        }
        topicsByCategory[category].push(topic);
    });
    
    // Render topics grouped by category
    Object.keys(topicsByCategory).sort().forEach((category, catIndex) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'mb-8';
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'mb-4 pb-3 border-b-2 border-gray-200';
        categoryHeader.innerHTML = `
            <h3 class="text-xl font-bold text-gray-800 inline-flex items-center">
                <span class="w-2 h-2 rounded-full bg-[#F46B61] mr-3"></span>
                ${category}
            </h3>
            <span class="ml-3 text-sm text-gray-600">${topicsByCategory[category].length} topik</span>
        `;
        categoryDiv.appendChild(categoryHeader);
        
        const topicsGrid = document.createElement('div');
        topicsGrid.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-4';
        
        topicsByCategory[category].forEach((topic, index) => {
            const topicCard = document.createElement('div');
            topicCard.className = 'group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-[#F46B61] cursor-pointer transition-all duration-300 overflow-hidden';
            topicCard.onclick = () => selectTopic(topic);
            
            const previewText = topic.cheatsheet_line || topic.explanation_id || '';
            const shortPreview = previewText.length > 120 ? previewText.substring(0, 120) + '...' : previewText;
            
            topicCard.innerHTML = `
                <div class="p-5">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-800 mb-2 group-hover:text-[#F46B61] transition-colors line-clamp-2 leading-tight">${topic.topic}</h4>
                        </div>
                        <svg class="w-5 h-5 text-gray-400 group-hover:text-[#F46B61] transition-colors flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed line-clamp-3">${shortPreview}</p>
                </div>
                <div class="h-1 bg-[#F46B61] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            `;
            
            topicsGrid.appendChild(topicCard);
        });
        
        categoryDiv.appendChild(topicsGrid);
        topicListContainer.appendChild(categoryDiv);
    });
    
    document.getElementById('topicListSection').classList.remove('hidden');
}

/**
 * Handle topic selection dan tampilkan detail
 */
function selectTopic(topic) {
    QuizConfig.selectedTopic = topic;
    renderTopicDetail(topic);
    
    // Scroll ke detail
    document.getElementById('topicDetailSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Render detail topic grammar
 */
function renderTopicDetail(topic) {
    const detailContainer = document.getElementById('topicDetail');
    if (!detailContainer) return;
    
    const levelInfo = LEVEL_INFO[topic.level] || LEVEL_INFO['A1'];
    
    detailContainer.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-gradient-to-r from-[#363636] to-[#1f2937] p-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="inline-block px-4 py-2 rounded-full bg-[#F46B61] text-white text-sm font-bold">
                            ${topic.level}
                        </span>
                        <span class="text-white text-sm font-medium">${topic.category}</span>
                    </div>
                    <button onclick="clearTopicDetail()" class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <h2 class="text-2xl font-bold text-white mt-4">${topic.topic}</h2>
            </div>
            
            <div class="p-8 space-y-6">
                ${topic.formula ? `
                    <div class="bg-gray-50 rounded-xl p-6 border-l-4 border-[#F46B61]">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-8 h-8 rounded-lg bg-[#F46B61] flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h3 class="font-bold text-gray-800 text-lg">Formula / Pola</h3>
                        </div>
                        <div class="bg-white rounded-lg p-4 mt-3">
                            <pre class="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">${topic.formula}</pre>
                        </div>
                    </div>
                ` : ''}
                
                ${topic.explanation_id ? `
                    <div class="bg-gray-50 rounded-xl p-6">
                        <h3 class="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-[#F46B61]"></div>
                            Penjelasan
                        </h3>
                        <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">${topic.explanation_id}</p>
                    </div>
                ` : ''}
                
                ${topic.example_en ? `
                    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 class="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-[#F46B61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10m-7 4h7M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"></path>
                            </svg>
                            Contoh
                        </h3>
                        <div class="bg-white rounded-lg p-5 space-y-3">
                            <p class="text-gray-900 font-medium text-base italic leading-relaxed">${topic.example_en}</p>
                            ${topic.example_id ? `
                                <div class="pt-3 border-t border-gray-200">
                                    <p class="text-gray-600 text-sm leading-relaxed">${topic.example_id}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
                
                ${topic.tips_id ? `
                    <div class="bg-gray-50 rounded-xl p-6 border-l-4 border-[#F46B61]">
                        <h3 class="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-[#F46B61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            Tips
                        </h3>
                        <p class="text-gray-700 leading-relaxed">${topic.tips_id}</p>
                    </div>
                ` : ''}
                
                ${topic.common_mistakes_id ? `
                    <div class="bg-gray-50 rounded-xl p-6 border-l-4 border-red-500">
                        <h3 class="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            Kesalahan Umum
                        </h3>
                        <p class="text-gray-700 leading-relaxed">${topic.common_mistakes_id}</p>
                    </div>
                ` : ''}
                
                ${topic.cheatsheet_line ? `
                    <div class="bg-gray-50 rounded-xl p-6 border-2 border-gray-300">
                        <h3 class="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Cheatsheet
                        </h3>
                        <p class="text-gray-800 font-semibold text-base leading-relaxed">${topic.cheatsheet_line}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('topicDetailSection').classList.remove('hidden');
}

/**
 * Clear topic list
 */
function clearTopicList() {
    const topicListContainer = document.getElementById('topicList');
    if (topicListContainer) {
        topicListContainer.innerHTML = '';
    }
    document.getElementById('topicListSection').classList.add('hidden');
}

/**
 * Clear topic detail
 */
function clearTopicDetail() {
    const detailContainer = document.getElementById('topicDetail');
    if (detailContainer) {
        detailContainer.innerHTML = '';
    }
    document.getElementById('topicDetailSection').classList.add('hidden');
    QuizConfig.selectedTopic = null;
}

/**
 * Render Basic Formula section
 */
function renderFormulaSection() {
    const formulaContainer = document.getElementById('formulaSection');
    if (!formulaContainer) return;
    
    if (QuizConfig.formulaData.length === 0) {
        formulaContainer.innerHTML = '';
        return;
    }
    
    formulaContainer.innerHTML = `
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-[#F46B61] flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    Basic Formula - Tenses
                </h2>
                <button onclick="toggleFormulaSection()" class="text-sm text-gray-600 hover:text-[#F46B61] font-medium">
                    <span id="formulaToggleText">Tampilkan</span>
                </button>
            </div>
            <div id="formulaContent" class="hidden">
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${QuizConfig.formulaData.map((formula, index) => `
                        <div class="formula-card bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-[#F46B61] cursor-pointer transition-all duration-300 overflow-hidden group" onclick="showFormulaDetail(${index})" style="animation: slideInUp 0.5s ease-out ${index * 0.05}s forwards; opacity: 0;">
                            <div class="p-5">
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-2">
                                            <span class="text-xs font-bold text-[#F46B61] bg-[#F46B61] bg-opacity-10 px-2 py-1 rounded">${formula.no}</span>
                                            <h3 class="font-bold text-gray-800 group-hover:text-[#F46B61] transition-colors text-sm leading-tight">${formula.tense}</h3>
                                        </div>
                                        <p class="text-xs text-gray-600 mb-2 line-clamp-2">${formula.deskripsi}</p>
                                        <div class="bg-gray-50 rounded p-2 mt-2">
                                            <p class="text-xs font-mono text-gray-700 font-semibold">${formula.rumus}</p>
                                        </div>
                                    </div>
                                    <svg class="w-5 h-5 text-gray-400 group-hover:text-[#F46B61] transition-colors flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="h-1 bg-[#F46B61] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Toggle formula section visibility
 */
function toggleFormulaSection() {
    const formulaContent = document.getElementById('formulaContent');
    const toggleText = document.getElementById('formulaToggleText');
    
    if (formulaContent.classList.contains('hidden')) {
        formulaContent.classList.remove('hidden');
        formulaContent.classList.add('fade-in');
        toggleText.textContent = 'Sembunyikan';
    } else {
        formulaContent.classList.add('hidden');
        toggleText.textContent = 'Tampilkan';
    }
}

/**
 * Show formula detail modal
 */
function showFormulaDetail(index) {
    const formula = QuizConfig.formulaData[index];
    if (!formula) return;
    
    const modal = document.getElementById('formulaModal');
    const modalContent = document.getElementById('formulaModalContent');
    
    modalContent.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-gradient-to-r from-[#363636] to-[#1f2937] p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <span class="inline-block px-3 py-1 rounded-full bg-[#F46B61] text-white text-xs font-bold mb-2">Formula #${formula.no}</span>
                        <h2 class="text-2xl font-bold text-white mt-2">${formula.tense}</h2>
                    </div>
                    <button onclick="closeFormulaModal()" class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="p-8 space-y-6">
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-[#F46B61]"></div>
                        Deskripsi
                    </h3>
                    <p class="text-gray-700 leading-relaxed">${formula.deskripsi}</p>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-6 border-l-4 border-[#F46B61]">
                    <div class="flex items-center gap-2 mb-3">
                        <div class="w-8 h-8 rounded-lg bg-[#F46B61] flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <h3 class="font-bold text-gray-800 text-lg">Rumus</h3>
                    </div>
                    <div class="bg-white rounded-lg p-4 mt-3">
                        <p class="text-base font-mono text-gray-800 font-bold text-center">${formula.rumus}</p>
                    </div>
                </div>
                
                ${formula.contoh_sederhana ? `
                    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 class="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-[#F46B61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10m-7 4h7M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"></path>
                            </svg>
                            Contoh Kalimat Sederhana
                        </h3>
                        <div class="bg-white rounded-lg p-5">
                            <p class="text-gray-900 font-medium text-base italic leading-relaxed">${formula.contoh_sederhana}</p>
                        </div>
                    </div>
                ` : ''}
                
                ${formula.contoh_kompleks ? `
                    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 class="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-[#F46B61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10m-7 4h7M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"></path>
                            </svg>
                            Contoh Kalimat Kompleks
                        </h3>
                        <div class="bg-white rounded-lg p-5">
                            <p class="text-gray-900 font-medium text-base italic leading-relaxed">${formula.contoh_kompleks}</p>
                        </div>
                    </div>
                ` : ''}
                
                ${formula.tips ? `
                    <div class="bg-gray-50 rounded-xl p-6 border-l-4 border-[#F46B61]">
                        <h3 class="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-[#F46B61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            Tips Penggunaan
                        </h3>
                        <p class="text-gray-700 leading-relaxed">${formula.tips}</p>
                    </div>
                ` : ''}
                
                ${formula.kesalahan_umum ? `
                    <div class="bg-gray-50 rounded-xl p-6 border-l-4 border-red-500">
                        <h3 class="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            Kesalahan Umum
                        </h3>
                        <p class="text-gray-700 leading-relaxed">${formula.kesalahan_umum}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    modal.classList.add('fade-in');
}

/**
 * Close formula modal
 */
function closeFormulaModal() {
    const modal = document.getElementById('formulaModal');
    modal.classList.add('hidden');
}

/**
 * Render Modal Verbs section
 */
function renderModalSection() {
    const modalContainer = document.getElementById('modalSection');
    if (!modalContainer) return;
    
    if (QuizConfig.modalData.length === 0) {
        modalContainer.innerHTML = '';
        return;
    }
    
    modalContainer.innerHTML = `
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-[#F46B61] flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    Modal Verbs
                </h2>
                <button onclick="toggleModalSection()" class="text-sm text-gray-600 hover:text-[#F46B61] font-medium">
                    <span id="modalToggleText">Tampilkan</span>
                </button>
            </div>
            <div id="modalContent" class="hidden">
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${QuizConfig.modalData.map((modal, index) => `
                        <div class="modal-card bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-[#F46B61] cursor-pointer transition-all duration-300 overflow-hidden group" onclick="showModalDetail(${index})" style="animation: slideInUp 0.5s ease-out ${index * 0.05}s forwards; opacity: 0;">
                            <div class="p-5">
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-2">
                                            <span class="text-xs font-bold text-[#F46B61] bg-[#F46B61] bg-opacity-10 px-2 py-1 rounded">${modal.no}</span>
                                            <h3 class="font-bold text-gray-800 group-hover:text-[#F46B61] transition-colors text-base">${modal.modal_verb}</h3>
                                        </div>
                                        <p class="text-xs text-gray-600 mb-2 line-clamp-2">${modal.deskripsi}</p>
                                        <div class="bg-gray-50 rounded p-2 mt-2">
                                            <p class="text-xs text-gray-700 font-semibold">${modal.fungsi_utama}</p>
                                        </div>
                                    </div>
                                    <svg class="w-5 h-5 text-gray-400 group-hover:text-[#F46B61] transition-colors flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="h-1 bg-[#F46B61] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

/**
 * Toggle modal section visibility
 */
function toggleModalSection() {
    const modalContent = document.getElementById('modalContent');
    const toggleText = document.getElementById('modalToggleText');
    
    if (modalContent.classList.contains('hidden')) {
        modalContent.classList.remove('hidden');
        modalContent.classList.add('fade-in');
        toggleText.textContent = 'Sembunyikan';
    } else {
        modalContent.classList.add('hidden');
        toggleText.textContent = 'Tampilkan';
    }
}

/**
 * Show modal detail
 */
function showModalDetail(index) {
    const modal = QuizConfig.modalData[index];
    if (!modal) return;
    
    const modalElement = document.getElementById('modalDetailModal');
    const modalContent = document.getElementById('modalDetailContent');
    
    modalContent.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-gradient-to-r from-[#363636] to-[#1f2937] p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <span class="inline-block px-3 py-1 rounded-full bg-[#F46B61] text-white text-xs font-bold mb-2">Modal #${modal.no}</span>
                        <h2 class="text-2xl font-bold text-white mt-2">${modal.modal_verb}</h2>
                    </div>
                    <button onclick="closeModalDetail()" class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="p-8 space-y-6">
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-[#F46B61]"></div>
                        Deskripsi
                    </h3>
                    <p class="text-gray-700 leading-relaxed">${modal.deskripsi}</p>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-6 border-l-4 border-[#F46B61]">
                    <div class="flex items-center gap-2 mb-3">
                        <div class="w-8 h-8 rounded-lg bg-[#F46B61] flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 class="font-bold text-gray-800 text-lg">Fungsi Utama</h3>
                    </div>
                    <div class="bg-white rounded-lg p-4 mt-3">
                        <p class="text-base text-gray-800 font-semibold">${modal.fungsi_utama}</p>
                    </div>
                </div>
                
                ${modal.contoh_sederhana ? `
                    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 class="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-[#F46B61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10m-7 4h7M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"></path>
                            </svg>
                            Contoh Kalimat Sederhana
                        </h3>
                        <div class="bg-white rounded-lg p-5">
                            <p class="text-gray-900 font-medium text-base italic leading-relaxed">${modal.contoh_sederhana}</p>
                        </div>
                    </div>
                ` : ''}
                
                ${modal.contoh_kompleks ? `
                    <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 class="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-[#F46B61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10m-7 4h7M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"></path>
                            </svg>
                            Contoh Kalimat Kompleks
                        </h3>
                        <div class="bg-white rounded-lg p-5">
                            <p class="text-gray-900 font-medium text-base italic leading-relaxed">${modal.contoh_kompleks}</p>
                        </div>
                    </div>
                ` : ''}
                
                ${modal.tips_penggunaan ? `
                    <div class="bg-gray-50 rounded-xl p-6 border-l-4 border-[#F46B61]">
                        <h3 class="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-[#F46B61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            Tips Penggunaan
                        </h3>
                        <p class="text-gray-700 leading-relaxed">${modal.tips_penggunaan}</p>
                    </div>
                ` : ''}
                
                ${modal.kesalahan_umum ? `
                    <div class="bg-gray-50 rounded-xl p-6 border-l-4 border-red-500">
                        <h3 class="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            Kesalahan Umum
                        </h3>
                        <p class="text-gray-700 leading-relaxed">${modal.kesalahan_umum}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    modalElement.classList.remove('hidden');
    modalElement.classList.add('fade-in');
}

/**
 * Close modal detail
 */
function closeModalDetail() {
    const modal = document.getElementById('modalDetailModal');
    modal.classList.add('hidden');
}

/**
 * Kembali ke menu utama
 */
function backToMenuFromLearn() {
    document.getElementById('learnScreen').classList.add('hidden');
    document.getElementById('menuScreen').classList.remove('hidden');
    QuizConfig.selectedLevel = null;
    QuizConfig.selectedTopic = null;
    clearTopicList();
    clearTopicDetail();
}

