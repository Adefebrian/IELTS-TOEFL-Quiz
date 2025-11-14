/**
 * Learn Grammar Module
 * 
 * Menangani UI dan logic untuk fitur Learn Grammar:
 * - Level grid (3x2: A1, A2, B1, B2, C1, C2)
 * - Topic list berdasarkan level
 * - Detail view untuk setiap topic
 */

const LEVEL_INFO = {
    'A1': { name: 'A1', description: 'Beginner', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    'A2': { name: 'A2', description: 'Elementary', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', textColor: 'text-green-600' },
    'B1': { name: 'B1', description: 'Intermediate', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
    'B2': { name: 'B2', description: 'Upper-Intermediate', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    'C1': { name: 'C1', description: 'Advanced', color: 'from-red-500 to-rose-500', bgColor: 'bg-red-50', textColor: 'text-red-600' },
    'C2': { name: 'C2', description: 'Proficient', color: 'from-indigo-500 to-violet-500', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600' }
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
        levelCard.className = 'bg-white rounded-xl shadow-lg p-6 card-hover border-2 border-transparent hover:shadow-xl cursor-pointer transition-all';
        levelCard.onclick = () => selectLevel(level);
        
        // Add hover effect dengan style
        levelCard.onmouseenter = () => {
            const colorClass = levelInfo.color.split('-')[1];
            if (colorClass === 'blue') levelCard.classList.add('hover:border-blue-500');
            else if (colorClass === 'green') levelCard.classList.add('hover:border-green-500');
            else if (colorClass === 'yellow') levelCard.classList.add('hover:border-yellow-500');
            else if (colorClass === 'purple') levelCard.classList.add('hover:border-purple-500');
            else if (colorClass === 'red') levelCard.classList.add('hover:border-red-500');
            else if (colorClass === 'indigo') levelCard.classList.add('hover:border-indigo-500');
        };
        
        levelCard.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 bg-gradient-to-br ${levelInfo.color} rounded-full flex items-center justify-center mx-auto mb-3">
                    <span class="text-white font-bold text-xl">${levelInfo.name}</span>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-1">${levelInfo.name}</h3>
                <p class="text-xs text-gray-500">${levelInfo.description}</p>
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
                <span class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 mr-3"></span>
                ${category}
            </h3>
            <span class="ml-3 text-sm text-gray-500">${topicsByCategory[category].length} topik</span>
        `;
        categoryDiv.appendChild(categoryHeader);
        
        const topicsGrid = document.createElement('div');
        topicsGrid.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-4';
        
        topicsByCategory[category].forEach((topic, index) => {
            const topicCard = document.createElement('div');
            topicCard.className = 'group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-purple-300 cursor-pointer transition-all duration-300 overflow-hidden';
            topicCard.onclick = () => selectTopic(topic);
            
            const previewText = topic.cheatsheet_line || topic.explanation_id || '';
            const shortPreview = previewText.length > 120 ? previewText.substring(0, 120) + '...' : previewText;
            
            topicCard.innerHTML = `
                <div class="p-5">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">${topic.topic}</h4>
                        </div>
                        <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>
                    <p class="text-sm text-gray-600 leading-relaxed line-clamp-3">${shortPreview}</p>
                </div>
                <div class="h-1 bg-gradient-to-r from-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
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
            <div class="bg-gradient-to-r ${levelInfo.color} p-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <span class="inline-block px-4 py-2 rounded-full bg-white ${levelInfo.textColor} text-sm font-bold">
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
                    <div class="bg-gradient-to-br ${levelInfo.color} bg-opacity-5 rounded-xl p-6 border-l-4 ${levelInfo.textColor.replace('text-', 'border-')}">
                        <div class="flex items-center gap-2 mb-3">
                            <div class="w-8 h-8 rounded-lg bg-gradient-to-br ${levelInfo.color} flex items-center justify-center">
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
                            <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                            Penjelasan
                        </h3>
                        <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">${topic.explanation_id}</p>
                    </div>
                ` : ''}
                
                ${topic.example_en ? `
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <h3 class="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-l-4 border-yellow-400">
                        <h3 class="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            Tips
                        </h3>
                        <p class="text-gray-700 leading-relaxed">${topic.tips_id}</p>
                    </div>
                ` : ''}
                
                ${topic.common_mistakes_id ? `
                    <div class="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-l-4 border-red-400">
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
                    <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 border-2 border-gray-300">
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

