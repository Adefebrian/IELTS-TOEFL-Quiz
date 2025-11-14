async function loadQuestions() {
    const files = ['data/quiz_batch1_2000.csv', 'data/quiz_batch2_2000.csv'];
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
                    QuizConfig.allQuestions.push({
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
    
    console.log(`Total questions loaded: ${QuizConfig.allQuestions.length}`);
    
    if (QuizConfig.allQuestions.length === 0) {
        const errorDetails = errors.length > 0 ? '\n\nDetail error:\n' + errors.join('\n') : '';
        throw new Error(`Tidak ada soal yang berhasil dimuat.${errorDetails}\n\nPastikan:\n1. File CSV ada di folder data/\n2. Server HTTP sedang berjalan\n3. Buka melalui http://localhost:8000`);
    }
    
    if (errors.length > 0 && QuizConfig.allQuestions.length > 0) {
        console.warn('Some files failed to load, but continuing with loaded questions:', errors);
    }
}

