/* ============================================
   Audio Library (Mantras & Wanwun) Page
   ============================================ */

const AudioPage = (() => {
    
    // Placeholder audio data
    const audioData = [
        {
            id: 'm1',
            title: 'Maha Mrityunjaya Mantra',
            category: 'mantras',
            description: 'The great death-conquering mantra dedicated to Lord Shiva.',
            duration: '0:30',
            // Placeholder base64 for a simple chime (a valid MP3 should replace this later)
            src: 'data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq' 
        },
        {
            id: 'm2',
            title: 'Gayatri Mantra',
            category: 'mantras',
            description: 'Universal prayer for enlightenment and wisdom.',
            duration: '0:45',
            src: 'data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'
        },
        {
            id: 'w1',
            title: 'Devgon Wanwun',
            category: 'wanwun',
            description: 'Traditional folk singing during the Devgon ceremony of a Kashmiri wedding.',
            duration: '1:15',
            src: 'data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'
        },
        {
            id: 'w2',
            title: 'Maenziraat Wanwun',
            category: 'wanwun',
            description: 'Joyous songs sung during the Mehndi/Maenziraat night.',
            duration: '2:00',
            src: 'data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'
        }
    ];

    let currentAudio = null;
    let currentPlayingId = null;

    function render() {
        return `
            <div class="page-enter">
                ${Components.breadcrumb([
                    { label: 'Home', href: '#home' },
                    { label: 'Sacred Sounds & Wanwun' }
                ])}

                ${Components.sectionHeader(
                    'Sacred Sounds & Wanwun',
                    'Listen to traditional Kashmiri Pandit mantras, bhajans, and wedding songs (Wanwun).',
                    { h1: true }
                )}

                <div class="grid-2">
                    <!-- Mantras Section -->
                    <div>
                        <h3 style="margin-bottom: var(--space-4); display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.5rem">🕉️</span> Mantras & Stotras
                        </h3>
                        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                            ${audioData.filter(a => a.category === 'mantras').map(renderAudioCard).join('')}
                        </div>
                    </div>

                    <!-- Wanwun Section -->
                    <div>
                        <h3 style="margin-bottom: var(--space-4); display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.5rem">🎵</span> Traditional Wanwun
                        </h3>
                        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                            ${audioData.filter(a => a.category === 'wanwun').map(renderAudioCard).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="mt-8">
                    ${Components.card(`
                        <div class="flex items-center gap-3">
                            <span style="font-size: 1.5rem">💡</span>
                            <p style="font-size: var(--text-sm); color: var(--text-muted); margin: 0">
                                <strong>Note:</strong> Currently playing placeholder chimes. You can replace the audio source files in the local directory with actual MP3 recordings of your choice.
                            </p>
                        </div>
                    `, { compact: true })}
                </div>
            </div>
        `;
    }

    function renderAudioCard(track) {
        return `
            <div class="card card-glass" style="padding: var(--space-4); display: flex; align-items: center; gap: var(--space-4);">
                <button 
                    id="play-btn-${track.id}"
                    onclick="AudioPage.togglePlay('${track.id}')"
                    class="btn btn-primary" 
                    style="width: 48px; height: 48px; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    ▶
                </button>
                <div style="flex: 1;">
                    <h4 style="margin: 0; color: var(--text-heading); font-size: var(--text-base);">${track.title}</h4>
                    <p style="margin: 2px 0 0 0; color: var(--text-muted); font-size: var(--text-xs); line-height: 1.4;">${track.description}</p>
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;">
                    ${track.duration}
                </div>
            </div>
        `;
    }

    function togglePlay(id) {
        const track = audioData.find(a => a.id === id);
        if (!track) return;

        const btn = document.getElementById(`play-btn-${id}`);

        // If clicking the currently playing track
        if (currentPlayingId === id && currentAudio) {
            if (currentAudio.paused) {
                currentAudio.play();
                btn.textContent = '⏸';
            } else {
                currentAudio.pause();
                btn.textContent = '▶';
            }
            return;
        }

        // Stop previous track if any
        if (currentAudio) {
            currentAudio.pause();
            if (currentPlayingId) {
                const prevBtn = document.getElementById(`play-btn-${currentPlayingId}`);
                if (prevBtn) prevBtn.textContent = '▶';
            }
        }

        // Create and play new track
        currentAudio = new Audio(track.src);
        currentAudio.play().catch(e => {
            console.error("Audio playback failed", e);
            Components.showToast("Failed to play audio. Check file format.", "error");
        });
        
        currentPlayingId = id;
        btn.textContent = '⏸';

        currentAudio.addEventListener('ended', () => {
            btn.textContent = '▶';
            currentPlayingId = null;
        });
    }

    function afterRender() {
        // Cleanup audio if navigating away
        const originalNavigate = Router.navigate;
        Router.navigate = function(page) {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
                currentPlayingId = null;
            }
            originalNavigate.call(Router, page);
        };
    }

    return { render, afterRender, togglePlay };
})();
