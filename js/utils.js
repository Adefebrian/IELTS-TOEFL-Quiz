function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getLevel(percentage) {
    if (percentage >= 90) return { name: 'Expert', color: 'from-purple-600 to-indigo-600', bgColor: 'bg-purple-100', textColor: 'text-purple-600' };
    if (percentage >= 75) return { name: 'Advanced', color: 'from-blue-600 to-cyan-600', bgColor: 'bg-blue-100', textColor: 'text-blue-600' };
    if (percentage >= 60) return { name: 'Intermediate', color: 'from-green-600 to-emerald-600', bgColor: 'bg-green-100', textColor: 'text-green-600' };
    if (percentage >= 40) return { name: 'Basic', color: 'from-yellow-600 to-orange-600', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' };
    return { name: 'Beginner', color: 'from-gray-600 to-gray-700', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
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
                    <li>Pastikan file CSV ada di folder data/</li>
                    <li>Cek Console browser (F12) untuk detail error</li>
                </ol>
            </div>
            <button onclick="location.reload()" class="mt-6 bg-white text-purple-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition">
                Muat Ulang
            </button>
        </div>
    `;
}

