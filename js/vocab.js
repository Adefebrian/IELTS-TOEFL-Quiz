/**
 * Learn Vocabulary Module
 * 
 * Menangani UI dan logic untuk fitur Learn Vocabulary:
 * - Flashcard interaktif dengan animasi flip
 * - Integrasi dengan Free Dictionary API
 * - Integrasi dengan Translation API
 * - Random vocabulary dari kata-kata umum IELTS/TOEFL
 */

// List kata-kata umum IELTS/TOEFL untuk random selection
const COMMON_VOCAB_WORDS = [
    'abundant', 'accomplish', 'accurate', 'achieve', 'acquire', 'adapt', 'adequate', 'adjacent',
    'adjust', 'advantage', 'advocate', 'aesthetic', 'affect', 'aggregate', 'allocate', 'alternative',
    'analyze', 'anticipate', 'apparent', 'appreciate', 'approach', 'appropriate', 'approximate', 'arbitrary',
    'aspect', 'assess', 'assume', 'attain', 'attribute', 'available', 'benefit', 'capacity',
    'category', 'challenge', 'circumstance', 'clarify', 'coherent', 'coincide', 'commence', 'comment',
    'commit', 'communicate', 'compare', 'compete', 'complex', 'component', 'comprehend', 'comprise',
    'concept', 'conclude', 'conduct', 'confer', 'confine', 'confirm', 'conflict', 'conform',
    'confront', 'consequence', 'consider', 'consist', 'constant', 'constitute', 'constrain', 'construct',
    'consult', 'consume', 'contact', 'contemporary', 'context', 'contract', 'contribute', 'controversy',
    'convene', 'conventional', 'convince', 'cooperate', 'coordinate', 'core', 'corporate', 'correspond',
    'criterion', 'crucial', 'culture', 'currency', 'cycle', 'data', 'debate', 'decade',
    'decline', 'deduce', 'define', 'definite', 'demonstrate', 'denote', 'deny', 'depict',
    'derive', 'design', 'despite', 'detect', 'deviate', 'device', 'devote', 'differentiate',
    'dimension', 'diminish', 'discrete', 'discriminate', 'discuss', 'displace', 'display', 'dispose',
    'distinct', 'distort', 'distribute', 'diverse', 'document', 'domain', 'domestic', 'dominate',
    'draft', 'duration', 'dynamic', 'economic', 'edit', 'element', 'eliminate', 'emerge',
    'emphasis', 'enable', 'encounter', 'encourage', 'energy', 'enforce', 'enhance', 'enormous',
    'ensure', 'entity', 'environment', 'equate', 'equipment', 'equivalent', 'erode', 'error',
    'establish', 'estimate', 'ethic', 'ethnic', 'evaluate', 'eventual', 'evident', 'evolve',
    'exceed', 'exclude', 'exhibit', 'expand', 'expert', 'explicit', 'exploit', 'export',
    'expose', 'external', 'extract', 'facilitate', 'factor', 'feature', 'federal', 'fee',
    'file', 'final', 'finance', 'finite', 'flexible', 'fluctuate', 'focus', 'format',
    'formula', 'forthcoming', 'foundation', 'framework', 'function', 'fund', 'fundamental', 'furthermore',
    'gender', 'generate', 'generation', 'globe', 'goal', 'grade', 'grant', 'guarantee',
    'guideline', 'hence', 'hierarchy', 'highlight', 'hypothesis', 'identical', 'identify', 'ideology',
    'ignorance', 'illustrate', 'image', 'immigrate', 'impact', 'implement', 'implicate', 'implicit',
    'imply', 'impose', 'incentive', 'incidence', 'income', 'incorporate', 'index', 'indicate',
    'individual', 'induce', 'inevitable', 'infer', 'infrastructure', 'inherent', 'inhibit', 'initial',
    'initiate', 'injure', 'innovate', 'input', 'insert', 'insight', 'inspect', 'instance',
    'institute', 'instruct', 'integral', 'integrate', 'integrity', 'intelligence', 'intense', 'interact',
    'intermediate', 'internal', 'interpret', 'interval', 'intervene', 'intrinsic', 'invest', 'investigate',
    'invoke', 'involve', 'isolate', 'issue', 'item', 'job', 'journal', 'justify',
    'label', 'labour', 'layer', 'lecture', 'legal', 'legislate', 'levy', 'liberal',
    'license', 'link', 'locate', 'logic', 'maintain', 'major', 'manipulate', 'manual',
    'margin', 'mature', 'maximise', 'mechanism', 'media', 'mediate', 'medical', 'medium',
    'mental', 'method', 'migrate', 'military', 'minimal', 'minimise', 'minimum', 'ministry',
    'minor', 'mode', 'modify', 'monitor', 'motive', 'mutual', 'negate', 'network',
    'neutral', 'nevertheless', 'nevertheless', 'nonetheless', 'norm', 'normal', 'notion', 'notwithstanding',
    'nuclear', 'objective', 'obtain', 'obvious', 'occupy', 'occur', 'odd', 'offset',
    'ongoing', 'option', 'orient', 'outcome', 'output', 'overall', 'overlap', 'overseas',
    'panel', 'paradigm', 'paragraph', 'parallel', 'parameter', 'participate', 'partner', 'passive',
    'perceive', 'percent', 'period', 'persist', 'perspective', 'phase', 'phenomenon', 'philosophy',
    'physical', 'plus', 'policy', 'portion', 'pose', 'positive', 'potential', 'practitioner',
    'precede', 'precise', 'predict', 'predominant', 'preliminary', 'presume', 'previous', 'primary',
    'prime', 'principal', 'principle', 'prior', 'priority', 'proceed', 'process', 'professional',
    'prohibit', 'project', 'promote', 'proportion', 'prospect', 'protocol', 'psychology', 'publish',
    'purchase', 'pursue', 'qualify', 'quality', 'quantify', 'quarter', 'radical', 'random',
    'range', 'ratio', 'rational', 'react', 'recover', 'refine', 'reflect', 'regime',
    'region', 'register', 'regulate', 'reinforce', 'reject', 'relate', 'relax', 'release',
    'relevant', 'reluctant', 'rely', 'remove', 'require', 'research', 'reside', 'resolve',
    'resource', 'respond', 'restore', 'restrain', 'restrict', 'retain', 'reveal', 'revenue',
    'reverse', 'revise', 'revolution', 'rigid', 'role', 'route', 'scenario', 'schedule',
    'scheme', 'scope', 'section', 'sector', 'secure', 'seek', 'select', 'sequence',
    'series', 'sex', 'shift', 'significant', 'similar', 'simulate', 'site', 'so-called',
    'sole', 'somewhat', 'source', 'specific', 'specify', 'sphere', 'stable', 'statistic',
    'status', 'straightforward', 'strategy', 'stress', 'structure', 'style', 'submit', 'subsequent',
    'subsidy', 'substitute', 'succeed', 'sufficient', 'sum', 'summary', 'supplement', 'survey',
    'survive', 'symbol', 'syntax', 'tape', 'target', 'task', 'team', 'technical',
    'technique', 'technology', 'temporary', 'tense', 'terminate', 'text', 'theme', 'theory',
    'thereby', 'thesis', 'topic', 'trace', 'tradition', 'transfer', 'transform', 'transit',
    'transmit', 'transport', 'trend', 'trigger', 'ultimate', 'undergo', 'underlie', 'undertake',
    'uniform', 'unify', 'unique', 'utilise', 'valid', 'vary', 'vehicle', 'version',
    'via', 'violate', 'virtual', 'visible', 'vision', 'visual', 'volume', 'voluntary',
    'welfare', 'whereas', 'whereby', 'widespread', 'witness', 'whereas', 'whereby', 'widespread'
];

/**
 * Tampilkan Learn Vocab screen
 */
function showVocabScreen() {
    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.add('hidden');
    document.getElementById('learnScreen').classList.add('hidden');
    document.getElementById('vocabScreen').classList.remove('hidden');
    
    QuizConfig.currentVocabWord = null;
    QuizConfig.vocabHistory = QuizConfig.vocabHistory || [];
    QuizConfig.vocabLearned = QuizConfig.vocabLearned || new Set();
    
    // Load random vocab langsung
    loadRandomVocab();
}

/**
 * Load random vocabulary yang belum dipelajari
 */
async function loadRandomVocab() {
    // Filter kata yang belum dipelajari
    const availableWords = COMMON_VOCAB_WORDS.filter(word => !QuizConfig.vocabLearned.has(word));
    
    if (availableWords.length === 0) {
        // Jika semua sudah dipelajari, reset atau tampilkan pesan
        alert('Selamat! Kamu sudah mempelajari semua kata. Reset untuk memulai lagi?');
        QuizConfig.vocabLearned.clear();
        loadRandomVocab();
        return;
    }
    
    // Pilih random word
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    await fetchVocabData(randomWord);
}

/**
 * Fetch vocab data dari API
 */
async function fetchVocabData(word) {
    try {
        // Fetch dari Free Dictionary API
        const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!dictResponse.ok) {
            throw new Error('Kata tidak ditemukan di dictionary');
        }
        
        const dictData = await dictResponse.json();
        const wordData = dictData[0];
        
        // Get translation
        let translation = '';
        try {
            const translateResponse = await fetch(`https://api.mymemory.translated.net/get?q=${word}&langpair=en|id`);
            const translateData = await translateResponse.json();
            translation = translateData.responseData?.translatedText || word;
        } catch (e) {
            console.warn('Translation API error:', e);
            translation = word;
        }
        
        // Prepare vocab data
        const vocabData = {
            word: wordData.word,
            phonetic: wordData.phonetic || '',
            meanings: wordData.meanings || [],
            translation: translation,
            audio: wordData.phonetics?.find(p => p.audio)?.audio || ''
        };
        
        QuizConfig.currentVocabWord = vocabData;
        renderFlashcard(vocabData);
        
    } catch (error) {
        console.error('Error fetching vocab:', error);
        // Jika error, coba kata lain
        loadRandomVocab();
    }
}

/**
 * Render flashcard - Elegant Design with Charcoal & Coral
 */
function renderFlashcard(vocabData) {
    const flashcardContainer = document.getElementById('flashcardContainer');
    if (!flashcardContainer) return;
    
    // Reset flip state
    setTimeout(() => {
        const flashcardInner = document.querySelector('.flashcard-inner');
        if (flashcardInner) {
            flashcardInner.style.transform = 'rotateY(0deg)';
        }
    }, 100);
    
    flashcardContainer.innerHTML = `
        <div class="w-full">
            <div class="flashcard-wrapper perspective-1000 mb-8">
                <div id="flashcard" class="flashcard relative w-full cursor-pointer group" style="min-height: 500px; height: 70vh; max-height: 800px;" onclick="flipCard()">
                    <div class="flashcard-inner relative w-full h-full preserve-3d transition-transform duration-700 ease-in-out">
                        <!-- Front of card - Light mode with Dark grey + Coral accents -->
                        <div class="flashcard-front absolute w-full h-full backface-hidden rounded-3xl shadow-2xl overflow-hidden" style="background: linear-gradient(135deg, #363636 0%, #1f2937 100%);">
                            <!-- Decorative elements -->
                            <div class="absolute top-0 right-0 w-64 h-64 bg-[#F46B61] opacity-20 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
                            <div class="absolute bottom-0 left-0 w-48 h-48 bg-[#F46B61] opacity-15 rounded-full blur-2xl transform -translate-x-12 translate-y-12"></div>
                            
                            <div class="relative h-full flex flex-col items-center justify-center p-10 text-white z-10">
                                <!-- Voice Button - Elegant Coral accent -->
                                <div class="mb-8">
                                    ${vocabData.audio ? `
                                        <button 
                                            onclick="playAudio('${vocabData.audio}'); event.stopPropagation();"
                                            class="vocab-audio-btn w-20 h-20 bg-[#F46B61] rounded-full flex items-center justify-center hover:bg-[#e85a50] transition-all duration-300 mx-auto shadow-xl hover:shadow-2xl hover:scale-110 group/audio"
                                        >
                                            <svg class="w-10 h-10 text-white group-hover/audio:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                            </svg>
                                        </button>
                                    ` : `
                                        <div class="w-20 h-20 bg-[#F46B61] bg-opacity-50 rounded-full flex items-center justify-center mx-auto">
                                            <svg class="w-10 h-10 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                            </svg>
                                        </div>
                                    `}
                                </div>
                                
                                <!-- Word - Large, elegant typography -->
                                <div class="text-center mb-6">
                                    <h2 class="text-7xl font-bold mb-2 tracking-tight" style="font-family: 'Inter', sans-serif; letter-spacing: -0.02em;">${vocabData.word}</h2>
                                    
                                    <!-- Phonetic (Cara Baca) - Elegant styling -->
                                    ${vocabData.phonetic ? `
                                        <div class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-full backdrop-blur-sm border border-white border-opacity-30">
                                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                                            </svg>
                                            <p class="text-xl font-medium text-white text-opacity-95">${vocabData.phonetic}</p>
                                        </div>
                                    ` : ''}
                                </div>
                                
                                <!-- Hint text -->
                                <div class="mt-8 flex items-center gap-2 text-white text-opacity-80 text-sm">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    <span>Klik kartu untuk melihat detail</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Back of card - Light mode with Dark grey header + Coral accents -->
                        <div class="flashcard-back absolute w-full h-full backface-hidden rounded-3xl shadow-2xl bg-white overflow-hidden" style="transform: rotateY(180deg); display: flex; flex-direction: column;">
                            <!-- Header -->
                            <div class="bg-gradient-to-r from-[#363636] to-[#1f2937] p-6 text-white flex-shrink-0 border-b border-gray-300">
                                <div class="flex items-center justify-between mb-2">
                                    <h2 class="text-4xl font-bold tracking-tight">${vocabData.word}</h2>
                                    <button 
                                        onclick="flipCard(); event.stopPropagation();"
                                        class="w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all"
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                        </svg>
                                    </button>
                                </div>
                                ${vocabData.phonetic ? `
                                    <p class="text-lg text-white text-opacity-90 font-mono">${vocabData.phonetic}</p>
                                ` : ''}
                            </div>
                            
                            <!-- Scrollable content area - FIXED -->
                            <div class="scrollable-content p-6" style="flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden;">
                                <!-- Translation - Light mode with Coral accent -->
                                <div class="mb-6 p-5 rounded-2xl border-2 border-[#F46B61] bg-white shadow-sm">
                                    <div class="flex items-center gap-2 mb-2">
                                        <div class="w-2 h-2 rounded-full bg-[#F46B61]"></div>
                                        <p class="text-xs font-semibold text-[#F46B61] uppercase tracking-wider">Terjemahan</p>
                                    </div>
                                    <p class="text-3xl font-bold text-gray-800 leading-tight">${vocabData.translation}</p>
                                </div>
                                
                                <!-- Meanings - Clean layout -->
                                <div class="space-y-5">
                                    ${vocabData.meanings.map((meaning, idx) => `
                                        <div class="border-l-4 border-[#F46B61] pl-5 py-3 bg-gray-50 rounded-r-xl shadow-sm">
                                            <div class="flex items-center gap-3 mb-3">
                                                <span class="px-3 py-1 bg-[#F46B61] text-white text-xs font-bold rounded-full uppercase tracking-wide">${meaning.partOfSpeech}</span>
                                            </div>
                                            ${meaning.definitions.slice(0, 2).map((def, defIdx) => `
                                                <div class="mb-4 last:mb-0">
                                                    <p class="text-gray-800 font-semibold mb-2 leading-relaxed">
                                                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F46B61] text-white text-xs font-bold mr-2">${defIdx + 1}</span>
                                                        ${def.definition}
                                                    </p>
                                                    ${def.example ? `
                                                        <div class="ml-8 mt-2 p-3 bg-white rounded-lg border-l-2 border-[#F46B61] border-opacity-50">
                                                            <p class="text-sm text-gray-600 italic leading-relaxed">"${def.example}"</p>
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            `).join('')}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons - Elegant design -->
            <div class="flex justify-center gap-4 mb-6">
                <button 
                    onclick="markAsLearned()" 
                    class="vocab-action-btn bg-[#F46B61] hover:bg-[#e85a50] text-white font-semibold px-10 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3 group/yes"
                >
                    <svg class="w-6 h-6 group-hover/yes:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-lg">Yes</span>
                </button>
                <button 
                    onclick="nextVocab()" 
                    class="vocab-action-btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-10 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3 group/next"
                >
                    <span class="text-lg">Next</span>
                    <svg class="w-6 h-6 group-hover/next:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Stats and List Link -->
            <div class="flex items-center justify-center gap-6">
                <div class="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-[#F46B61] border-opacity-30">
                    <svg class="w-5 h-5 text-[#F46B61]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-sm text-gray-700">
                        Dipelajari: <span class="font-bold text-[#F46B61]">${QuizConfig.vocabLearned.size}</span> kata
                    </p>
                </div>
                <button 
                    onclick="showLearnedVocabList()"
                    class="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#F46B61] transition-colors duration-300 flex items-center gap-2 group/list"
                >
                    <svg class="w-4 h-4 group-hover/list:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    <span>Lihat List</span>
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('vocabFlashcardSection').classList.remove('hidden');
    document.getElementById('vocabMenuSection').classList.add('hidden');
}

/**
 * Mark current vocab as learned and go to next
 */
function markAsLearned() {
    if (!QuizConfig.currentVocabWord) return;
    
    const word = QuizConfig.currentVocabWord.word.toLowerCase();
    const vocabData = QuizConfig.currentVocabWord;
    
    // Add to learned set
    if (!QuizConfig.vocabLearned) {
        QuizConfig.vocabLearned = new Set();
    }
    QuizConfig.vocabLearned.add(word);
    
    // Add full data to learned data array
    if (!QuizConfig.vocabLearnedData) {
        QuizConfig.vocabLearnedData = [];
    }
    
    // Check if word already exists in learned data
    const existingIndex = QuizConfig.vocabLearnedData.findIndex(v => v.word.toLowerCase() === word);
    if (existingIndex === -1) {
        // Add new vocab data
        QuizConfig.vocabLearnedData.push({
            word: vocabData.word,
            phonetic: vocabData.phonetic,
            translation: vocabData.translation,
            meanings: vocabData.meanings,
            audio: vocabData.audio,
            learnedAt: Date.now()
        });
    }
    
    // Add to history
    if (!QuizConfig.vocabHistory) {
        QuizConfig.vocabHistory = [];
    }
    if (!QuizConfig.vocabHistory.includes(word)) {
        QuizConfig.vocabHistory.push(word);
        if (QuizConfig.vocabHistory.length > 50) {
            QuizConfig.vocabHistory = QuizConfig.vocabHistory.slice(-50);
        }
    }
    
    // Save to localStorage
    saveVocabState();
    
    // Load next random vocab
    loadRandomVocab();
}

/**
 * Next vocab (random, tidak mark as learned)
 */
function nextVocab() {
    loadRandomVocab();
}

/**
 * Flip flashcard
 */
function flipCard() {
    const flashcardInner = document.querySelector('.flashcard-inner');
    if (!flashcardInner) return;
    
    const isFlipped = flashcardInner.style.transform === 'rotateY(180deg)';
    flashcardInner.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
}

/**
 * Play audio pronunciation
 */
function playAudio(audioUrl) {
    if (!audioUrl) return;
    
    const audio = new Audio(audioUrl);
    audio.play().catch(e => {
        console.warn('Audio playback failed:', e);
    });
}

/**
 * Save vocab state to localStorage
 */
function saveVocabState() {
    try {
        const vocabState = {
            learned: Array.from(QuizConfig.vocabLearned || []),
            history: QuizConfig.vocabHistory || [],
            learnedData: QuizConfig.vocabLearnedData || []
        };
        localStorage.setItem('vocabState', JSON.stringify(vocabState));
    } catch (e) {
        console.warn('Failed to save vocab state:', e);
    }
}

/**
 * Load vocab state from localStorage
 */
function loadVocabState() {
    try {
        const saved = localStorage.getItem('vocabState');
        if (saved) {
            const vocabState = JSON.parse(saved);
            QuizConfig.vocabLearned = new Set(vocabState.learned || []);
            QuizConfig.vocabHistory = vocabState.history || [];
        }
    } catch (e) {
        console.warn('Failed to load vocab state:', e);
    }
}

/**
 * Reset vocab learned list
 */
function resetVocabLearned() {
    if (confirm('Apakah kamu yakin ingin menghapus semua kata yang sudah dipelajari? Tindakan ini tidak dapat dibatalkan.')) {
        QuizConfig.vocabLearned.clear();
        QuizConfig.vocabLearnedData = [];
        saveVocabState();
        renderLearnedVocabTable();
        // Reload random vocab
        loadRandomVocab();
        showFlashcardView();
    }
}

/**
 * Kembali ke menu utama dari vocab
 */
function backToMenuFromVocab() {
    document.getElementById('vocabScreen').classList.add('hidden');
    document.getElementById('menuScreen').classList.remove('hidden');
    QuizConfig.currentVocabWord = null;
}

/**
 * Show learned vocab list
 */
function showLearnedVocabList() {
    document.getElementById('vocabFlashcardSection').classList.add('hidden');
    document.getElementById('vocabListSection').classList.remove('hidden');
    renderLearnedVocabTable();
}

/**
 * Show flashcard view
 */
function showFlashcardView() {
    document.getElementById('vocabListSection').classList.add('hidden');
    document.getElementById('vocabFlashcardSection').classList.remove('hidden');
}

/**
 * Render learned vocab table
 */
function renderLearnedVocabTable() {
    const listContainer = document.getElementById('vocabListContainer');
    if (!listContainer) return;
    
    const learnedData = QuizConfig.vocabLearnedData || [];
    
    if (learnedData.length === 0) {
        listContainer.innerHTML = `
            <div class="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Belum Ada Kata yang Dipelajari</h3>
                <p class="text-gray-600 mb-6">Mulai belajar dengan flashcard dan klik "Yes" untuk menyimpan kata</p>
                <button 
                    onclick="showFlashcardView()"
                    class="bg-[#F46B61] hover:bg-[#e85a50] text-white font-semibold px-6 py-3 rounded-lg transition"
                >
                    Mulai Belajar
                </button>
            </div>
        `;
        return;
    }
    
    // Sort by word alphabetically
    const sortedData = [...learnedData].sort((a, b) => a.word.localeCompare(b.word));
    
    listContainer.innerHTML = `
        <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Kata yang Sudah Dipelajari</h2>
                    <p class="text-sm text-gray-600 mt-1">Total: <span class="font-semibold text-[#F46B61]">${sortedData.length}</span> kata</p>
                </div>
                <div class="flex gap-3">
                    <button 
                        onclick="resetVocabLearned()"
                        class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Reset List
                    </button>
                    <button 
                        onclick="showFlashcardView()"
                        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                        Kembali ke Flashcard
                    </button>
                </div>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="border-b-2 border-gray-200">
                            <th class="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wider">Word</th>
                            <th class="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wider">Translation</th>
                            <th class="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wider">Phonetic</th>
                            <th class="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wider">Part of Speech</th>
                            <th class="text-left py-4 px-4 font-bold text-gray-700 text-sm uppercase tracking-wider">Definition</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${sortedData.map((vocab, index) => {
                            const firstMeaning = vocab.meanings && vocab.meanings[0];
                            const firstDefinition = firstMeaning?.definitions?.[0];
                            const partOfSpeech = firstMeaning?.partOfSpeech || '-';
                            const definition = firstDefinition?.definition || '-';
                            
                            return `
                                <tr class="hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                                    <td class="py-4 px-4">
                                        <div class="flex items-center gap-2">
                                            ${vocab.audio ? `
                                                <button 
                                                    onclick="playAudio('${vocab.audio}')"
                                                    class="text-[#F46B61] hover:text-[#e85a50] transition"
                                                    title="Play pronunciation"
                                                >
                                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                                    </svg>
                                                </button>
                                            ` : ''}
                                            <span class="font-bold text-gray-800 text-lg">${vocab.word}</span>
                                        </div>
                                    </td>
                                    <td class="py-4 px-4">
                                        <span class="text-[#F46B61] font-semibold">${vocab.translation || '-'}</span>
                                    </td>
                                    <td class="py-4 px-4">
                                        <span class="text-gray-600 font-mono text-sm">${vocab.phonetic || '-'}</span>
                                    </td>
                                    <td class="py-4 px-4">
                                        <span class="px-2 py-1 bg-[#F46B61] text-white text-xs font-bold rounded">${partOfSpeech}</span>
                                    </td>
                                    <td class="py-4 px-4">
                                        <p class="text-gray-700 text-sm line-clamp-2">${definition}</p>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Load vocab state when module loads
(function() {
    if (typeof QuizConfig !== 'undefined') {
        // Load vocab state from localStorage
        try {
            const saved = localStorage.getItem('vocabState');
            if (saved) {
                const vocabState = JSON.parse(saved);
                QuizConfig.vocabLearned = new Set(vocabState.learned || []);
                QuizConfig.vocabHistory = vocabState.history || [];
                QuizConfig.vocabLearnedData = vocabState.learnedData || [];
            }
        } catch (e) {
            console.warn('Failed to load vocab state:', e);
        }
    }
})();
