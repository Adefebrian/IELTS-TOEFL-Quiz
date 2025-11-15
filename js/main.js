async function init() {
    try {
        if (typeof Papa === 'undefined') {
            throw new Error('Library PapaParse tidak terload. Pastikan koneksi internet aktif.');
        }
        
        updateLoadingMessage('Memuat soal dari file CSV...');
        
        await loadQuestions();
        
        updateLoadingMessage('Memuat data grammar...');
        
        await loadGrammarData();
        
        await loadFormulaData();
        
        await loadModalData();
        
        loadState();
        
        updateProgress();
        
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        setTimeout(() => {
            updateMenuChart();
        }, 1000);
    } catch (error) {
        console.error('Error initializing app:', error);
        showError(error.message);
    }
}

init();

