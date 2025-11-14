/**
 * Grammar Data Loader
 * 
 * Fungsi untuk memuat data grammar dari file CSV berdasarkan level.
 * Struktur data grammar:
 * - id, level, category, topic, formula, explanation_id, example_en, 
 *   example_id, tips_id, common_mistakes_id, cheatsheet_line
 */

async function loadGrammarData() {
    const files = [
        'data/grammar_batch_A1.csv',
        'data/grammar_batch_A2.csv',
        'data/grammar_batch_B1.csv',
        'data/grammar_batch_B2.csv',
        'data/grammar_batch_C1.csv',
        'data/grammar_batch_C2.csv'
    ];
    
    let loadedCount = 0;
    const errors = [];
    
    for (const filename of files) {
        try {
            updateLoadingMessage(`Memuat ${filename}...`);
            console.log(`Loading grammar file: ${filename}...`);
            
            const response = await fetch(filename);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const csvText = await response.text();
            
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
                    QuizConfig.allGrammarTopics.push({
                        id: parseInt(row.id),
                        level: (row.level || '').trim(),
                        category: (row.category || '').trim(),
                        topic: (row.topic || '').trim(),
                        formula: (row.formula || '').trim(),
                        explanation_id: (row.explanation_id || '').trim(),
                        example_en: (row.example_en || '').trim(),
                        example_id: (row.example_id || '').trim(),
                        tips_id: (row.tips_id || '').trim(),
                        common_mistakes_id: (row.common_mistakes_id || '').trim(),
                        cheatsheet_line: (row.cheatsheet_line || '').trim()
                    });
                    rowCount++;
                }
            });
            
            console.log(`Successfully loaded ${rowCount} grammar topics from ${filename}`);
            loadedCount += rowCount;
        } catch (error) {
            const errorMsg = `Error loading ${filename}: ${error.message}`;
            console.error(errorMsg, error);
            errors.push(errorMsg);
        }
    }
    
    console.log(`Total grammar topics loaded: ${QuizConfig.allGrammarTopics.length}`);
    
    if (errors.length > 0 && QuizConfig.allGrammarTopics.length > 0) {
        console.warn('Some grammar files failed to load, but continuing with loaded topics:', errors);
    }
}

/**
 * Filter grammar topics berdasarkan level
 * @param {string} level - Level grammar (A1, A2, B1, B2, C1, C2)
 * @returns {Array} Array of grammar topics untuk level tersebut
 */
function getTopicsByLevel(level) {
    if (!level) return [];
    return QuizConfig.allGrammarTopics.filter(topic => 
        topic.level && topic.level.toUpperCase() === level.toUpperCase()
    );
}

/**
 * Filter grammar topics berdasarkan level dan category (opsional)
 * @param {string} level - Level grammar
 * @param {string|null} category - Category grammar (opsional)
 * @returns {Array} Array of grammar topics yang sesuai filter
 */
function getTopicsByLevelAndCategory(level, category = null) {
    let topics = getTopicsByLevel(level);
    
    if (category) {
        topics = topics.filter(topic => 
            topic.category && topic.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    return topics;
}

/**
 * Get unique categories untuk level tertentu
 * @param {string} level - Level grammar
 * @returns {Array} Array of unique category names
 */
function getCategoriesByLevel(level) {
    const topics = getTopicsByLevel(level);
    const categories = new Set();
    
    topics.forEach(topic => {
        if (topic.category) {
            categories.add(topic.category);
        }
    });
    
    return Array.from(categories).sort();
}

