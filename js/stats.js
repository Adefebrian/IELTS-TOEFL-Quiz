function updateMenuChart() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js belum terload, akan dicoba lagi nanti');
        setTimeout(updateMenuChart, 500);
        return;
    }
    
    const stats = getOverallStats();
    const container = document.getElementById('menuChartContainer');
    
    if (!container) {
        console.warn('Chart container tidak ditemukan');
        return;
    }
    
    if (QuizConfig.menuChartInstance) {
        QuizConfig.menuChartInstance.destroy();
        QuizConfig.menuChartInstance = null;
    }
    
    if (stats.total === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p class="text-sm">Belum ada statistik</p>
                <p class="text-xs mt-1">Mulai latihan untuk melihat statistik kamu</p>
            </div>
        `;
        
        const levelBadgeEl = document.getElementById('menuOverallLevel');
        if (levelBadgeEl) {
            levelBadgeEl.textContent = 'Beginner';
            const levelBadgeContainer = levelBadgeEl.parentElement;
            if (levelBadgeContainer) {
                levelBadgeContainer.className = 'inline-block px-6 py-3 rounded-full bg-gray-100 text-gray-600 font-semibold text-lg mb-3';
            }
        }
        
        const percentageEl = document.getElementById('menuOverallPercentage');
        if (percentageEl) percentageEl.textContent = '0';
        
        const totalEl = document.getElementById('menuTotalAnswered');
        if (totalEl) totalEl.textContent = '0';
        
        const correctEl = document.getElementById('menuTotalCorrect');
        if (correctEl) correctEl.textContent = '0';
        
        const incorrectEl = document.getElementById('menuTotalIncorrect');
        if (incorrectEl) incorrectEl.textContent = '0';
        
        return;
    }
    
    if (!container.querySelector('canvas')) {
        container.innerHTML = '<canvas id="menuStatsChart"></canvas>';
    }
    
    const ctx = document.getElementById('menuStatsChart');
    if (!ctx) {
        console.error('Canvas tidak bisa dibuat');
        return;
    }
    
    console.log('Creating menu chart with stats:', stats);
    
    const level = getLevel(stats.percentage);
    
    try {
        QuizConfig.menuChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Benar', 'Salah'],
                datasets: [{
                    data: [stats.correct, stats.incorrect],
                    backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                        'rgba(34, 197, 94, 1)',
                        'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 13,
                                weight: 'bold'
                            },
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                        const value = data.datasets[0].data[i];
                                        const percentage = stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
                                        return {
                                            text: `${label}: ${value} (${percentage}%)`,
                                            fillStyle: data.datasets[0].backgroundColor[i],
                                            strokeStyle: data.datasets[0].borderColor[i],
                                            lineWidth: data.datasets[0].borderWidth,
                                            hidden: false,
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const percentage = stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
                                return `${label}: ${value} soal (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500
                }
            }
        });
        
        const levelBadgeEl = document.getElementById('menuOverallLevel');
        if (levelBadgeEl) {
            levelBadgeEl.textContent = level.name;
            const levelBadgeContainer = levelBadgeEl.parentElement;
            if (levelBadgeContainer) {
                levelBadgeContainer.className = `inline-block px-6 py-3 rounded-full ${level.bgColor} ${level.textColor} font-semibold text-lg mb-3`;
            }
        }
        
        const percentageEl = document.getElementById('menuOverallPercentage');
        if (percentageEl) percentageEl.textContent = stats.percentage + '%';
        
        const totalEl = document.getElementById('menuTotalAnswered');
        if (totalEl) totalEl.textContent = stats.total;
        
        const correctEl = document.getElementById('menuTotalCorrect');
        if (correctEl) correctEl.textContent = stats.correct;
        
        const incorrectEl = document.getElementById('menuTotalIncorrect');
        if (incorrectEl) incorrectEl.textContent = stats.incorrect;
        
        console.log('Menu chart updated successfully:', stats);
    } catch (error) {
        console.error('Error creating menu chart:', error);
        console.error('Error details:', error.stack);
    }
}

function animateChart() {
    const total = QuizConfig.sessionStats.total;
    const correct = QuizConfig.sessionStats.correct;
    const incorrect = QuizConfig.sessionStats.incorrect;
    
    const ctx = document.getElementById('answerChart');
    if (!ctx) return;
    
    if (QuizConfig.chartInstance) {
        QuizConfig.chartInstance.destroy();
    }
    
    QuizConfig.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Benar', 'Salah'],
            datasets: [{
                label: 'Jumlah Jawaban',
                data: [correct, incorrect],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(total, 10),
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

