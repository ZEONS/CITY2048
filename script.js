/**
 * ZEONS City 2048 - Core Game Logic
 * 10년 차 프론트엔드 개발자의 정석적인 2048 구현
 */

class ZeonsCity2048 {
    constructor() {
        this.boardSize = 4;
        this.grid = [];
        this.score = 0;
        // 베스트 스코어 마이그레이션 (기존 키에서 새 키로 이동)
        const oldKey = 'zeons-best-score';
        const newKey = 'zeons-build2048-best-score';
        const oldScore = localStorage.getItem(oldKey);
        if (oldScore !== null && localStorage.getItem(newKey) === null) {
            localStorage.setItem(newKey, oldScore);
            // localStorage.removeItem(oldKey); // 기존 데이터 보존을 위해 삭제하지 않음
        }
        
        this.bestScore = parseInt(localStorage.getItem(newKey)) || 0;
        this.tileContainer = document.getElementById('tile-container');
        this.scoreDisplay = document.getElementById('score');
        this.bestScoreDisplay = document.getElementById('best-score');
        this.gameMessage = document.getElementById('game-message');
        this.bgm = document.getElementById('bgm');
        this.bgm.volume = 0.25; // 볼륨 낮춤
        this.bgmEnabled = true;
        
        this.milestones = [3, 6, 9, 12, 15, 17];
        this.reachedMilestones = new Set();
        
        this.jokerCount = 0; // 시작 시 0개
        this.nextTileId = 0; 
        
        // 숫자 표시 설정 (로컬 스토리지 유지)
        this.showValues = localStorage.getItem('zeons-show-values') !== 'false';
        
        this.isLocked = false; // 입력 잠금 플래그
        this.introTimeout = null;
        this.weatherTimer = null; // 날씨 타이머 관용
        this.currentTrackIndex = -1; // 현재 재생 중인 트랙 인덱스

        // BGM 트랙 리스트 추가
        this.bgmTracks = [
            { name: "Urban City Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
            { name: "Night Skyline", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
            { name: "Neon Lights", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
            { name: "Midnight City", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
        ];

        this.hasTriggeredBestScoreThisGame = false;
        this.init();
    }

    init() {
        this.setupBoard();
        this.addEventListeners();
        
        // 베스트 스코어 박스 클릭 시 초기화 기능 연결
        const bestBox = this.bestScoreDisplay.parentElement;
        if (bestBox) {
            bestBox.addEventListener('click', () => this.resetBestScore());
        }

        this.syncValueToggleUI();
        this.updateScores();
        this.addRandomTile();
        this.addRandomTile();
    }

    // 4x4 빈 그리드 초기화
    setupBoard() {
        this.grid = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(null));
        this.tileContainer.innerHTML = '';
        this.score = 0;
        this.jokerCount = 0; // 리셋 시 조커 0개로 초기화
        this.currentSeason = this.getRandomSeason();
        this.syncSeasonUI();
        this.updateScores();
        this.updateJokerUI(); // UI 동기화
        this.updateLevelUI(); // 레벨 초기화 추가
        this.gameMessage.style.display = 'none';
        this.hasTriggeredBestScoreThisGame = false;
        this.playRandomBGM(); // 새로운 게임 시작 시 랜덤 BGM 재생
        this.startWeatherCycle(); // 새로운 게임 시작 시 날씨 사이클 시작
    }

    startWeatherCycle() {
        if (this.weatherTimer) {
            clearTimeout(this.weatherTimer);
        }
        // 처음 시작 시에도 바로 나오지 않고 5~10초 후 첫 날씨 이벤트 발생
        const initialDelay = 5000 + Math.random() * 5000;
        this.weatherTimer = setTimeout(() => this.initWeatherEffect(), initialDelay);
    }

    initWeatherEffect() {
        const container = document.getElementById('weather-container');
        if (!container) return;
        
        container.innerHTML = ''; // 기존 배출물 제거
        container.style.opacity = '1';
        
        const season = this.currentSeason;
        let baseCount = 0;
        let type = '';
        
        switch(season) {
            case 'spring': baseCount = 15; type = 'petal'; break;
            case 'summer': baseCount = 20; type = 'dust'; this.addSunRay(container); break;
            case 'autumn': baseCount = 15; type = 'leaf'; break;
            case 'winter': baseCount = 30; type = 'snowflake'; break;
        }
        
        // 양을 무작위로 조절 (간헐적/변동성)
        const count = Math.floor(baseCount * (0.5 + Math.random()));
        
        for (let i = 0; i < count; i++) {
            this.createWeatherParticle(container, type);
        }

        // 10~20초 동안 유지 후 다음 사이클 결정 (날씨가 없는 기간 포함)
        const activeDuration = 10000 + Math.random() * 10000;
        this.weatherTimer = setTimeout(() => {
            // 서서히 사라짐
            container.style.transition = 'opacity 3s';
            container.style.opacity = '0';
            
            // 다음 이벤트까지의 공백기 (10~30초)
            const gapDuration = 10000 + Math.random() * 20000;
            this.weatherTimer = setTimeout(() => {
                this.initWeatherEffect();
            }, gapDuration + 3000); // 페이드 아웃 시간 포함
        }, activeDuration);
    }

    addSunRay(container) {
        const ray = document.createElement('div');
        ray.className = 'sun-ray';
        container.appendChild(ray);
    }

    createWeatherParticle(container, type) {
        const p = document.createElement('div');
        p.className = type;
        
        // 무작위 초기 위치 설정
        const startLeft = Math.random() * 100;
        const startTop = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 5 + Math.random() * 5;
        const size = (type === 'snowflake' || type === 'dust') ? (2 + Math.random() * 4) : (8 + Math.random() * 10);
        
        p.style.left = `${startLeft}%`;
        p.style.top = `-20px`; // 상단 밖에서 시작
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.animationDelay = `-${delay}s`; // 미리 시작된 것처럼 연출
        p.style.animationDuration = `${duration}s`;
        
        if (type === 'petal') {
            p.style.animationName = 'blossomFall';
        } else if (type === 'dust') {
            p.style.top = `${startTop}%`; // 먼지는 화면 전역에서
            p.style.animationName = 'dustFloat';
        } else if (type === 'leaf') {
            const colors = ['#c98b1a', '#f8ab1f', '#8b4513', '#a0522d'];
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.animationName = 'leafFall';
        } else if (type === 'snowflake') {
            p.style.animationName = 'snowFall';
            p.style.opacity = 0.3 + Math.random() * 0.5;
        }
        
        container.appendChild(p);
    }

    playRandomBGM() {
        if (!this.bgmTracks || this.bgmTracks.length === 0) return;
        
        this.currentTrackIndex = Math.floor(Math.random() * this.bgmTracks.length);
        this.playBGM(this.currentTrackIndex);
    }

    playNextBGM() {
        if (!this.bgmTracks || this.bgmTracks.length === 0) return;
        
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.bgmTracks.length;
        this.playBGM(this.currentTrackIndex);
        
        // 시각적 피드백 (반짝임)
        const bgmInfo = document.getElementById('bgm-info');
        if (bgmInfo) {
            bgmInfo.style.borderColor = 'rgba(255, 215, 0, 0.8)';
            setTimeout(() => bgmInfo.style.borderColor = 'rgba(35, 134, 54, 0.2)', 1000);
        }
    }

    playBGM(index) {
        const selectedTrack = this.bgmTracks[index];
        const bgmElement = document.getElementById('bgm');
        const trackNameElement = document.getElementById('bgm-track-name');
        
        if (bgmElement) {
            bgmElement.src = selectedTrack.url;
            bgmElement.load();
            bgmElement.play().catch(e => console.log("BGM 재생 대기: 사용자 조작 필요"));
        }
        
        if (trackNameElement) {
            trackNameElement.textContent = `BGM: ${selectedTrack.name}`;
        }
    }

    syncSeasonUI() {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        seasons.forEach(s => this.tileContainer.classList.remove(`season-${s}`));
        this.tileContainer.classList.add(`season-${this.currentSeason}`);
        this.initWeatherEffect(); // 계절 UI 동기화 시 날씨도 변경
    }

    // 무작위 위치에 타일 추가
    addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                if (!this.grid[r][c]) emptyCells.push({ r, c });
            }
        }

        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            this.grid[r][c] = {
                value: value,
                id: this.nextTileId++
            };
            this.renderGrid();
        }
    }

    getRandomSeason() {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        return seasons[Math.floor(Math.random() * seasons.length)];
    }

    // 타일 DOM 생성 (기존 renderTile 통합 및 보완)
    createTileDOM(r, c, tileObj, isMerged = false) {
        const tile = document.createElement('div');
        const value = tileObj.value;
        const isJoker = (value === 'joker');
        
        tile.className = `tile ${isJoker ? 'tile-joker' : 'tile-' + value} ${isMerged ? 'tile-merged' : ''}`;
        tile.dataset.id = tileObj.id; // ID 저장
        
        tile.style.setProperty('--r', r);
        tile.style.setProperty('--c', c);
        
        const inner = document.createElement('div');
        inner.className = 'tile-inner';
        
        // 빌딩 이미지를 위한 별도 레이어 (역회전용)
        const building = document.createElement('div');
        building.className = 'tile-building';
        inner.appendChild(building);
        
        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'tile-value';
        valueDisplay.textContent = isJoker ? 'J' : value;
        inner.appendChild(valueDisplay);
        
        tile.appendChild(inner);
        
        return tile;
    }

    // 전체 그리드 렌더링 (슬라이딩 애니메이션 핵심)
    renderGrid(mergedIds = []) {
        const currentElements = Array.from(this.tileContainer.querySelectorAll('.tile'));
        const activeIds = [];

        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                const tileObj = this.grid[r][c];
                if (tileObj) {
                    activeIds.push(String(tileObj.id));
                    let element = currentElements.find(el => el.dataset.id === String(tileObj.id));
                    
                    if (element) {
                        // 기존 타일 위치 업데이트 (이동 애니메이션 트리거)
                        element.style.setProperty('--r', r);
                        element.style.setProperty('--c', c);
                        // 값 변경 대응 (병합 시)
                        const isJoker = (tileObj.value === 'joker');
                        element.className = `tile ${isJoker ? 'tile-joker' : 'tile-' + tileObj.value}`;
                        
                        // 숫자 라벨 업데이트 추가
                        const valDisplay = element.querySelector('.tile-value');
                        if (valDisplay) {
                            valDisplay.textContent = isJoker ? 'J' : tileObj.value;
                        }
                        
                        if (mergedIds.includes(tileObj.id)) {
                            element.classList.add('tile-merged');
                            setTimeout(() => element.classList.remove('tile-merged'), 200);
                        }
                    } else {
                        // 새 타일 생성
                        const newTile = this.createTileDOM(r, c, tileObj);
                        newTile.classList.add('tile-new');
                        this.tileContainer.appendChild(newTile);
                        setTimeout(() => newTile.classList.remove('tile-new'), 200);
                    }
                }
            }
        }

        // 존재하지 않는 타일 제거
        currentElements.forEach(el => {
            if (!activeIds.includes(el.dataset.id)) {
                // 병합되어 사라지는 타일도 목적지까지 이동한 후 사라지게 하는 것이 좋지만, 
                // 여기서는 즉시 제거 또는 페이드아웃 처리
                el.remove();
            }
        });
    }

    // 이동 로직 (핵심)
    move(direction) {
        if (this.isLocked) return; // 인트로 중 조작 금지
        let moved = false;
        let scoreEarned = 0;
        let jokerUsedInMove = false; // 조커 사용 여부 추적
        const mergedPositions = [];

        // 방향에 따른 회전 처리 (코드를 단순화하기 위해 좌측 이동 기준으로 변환)
        const rotateGrid = (times) => {
            for (let i = 0; i < times; i++) {
                const newGrid = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(null));
                for (let r = 0; r < this.boardSize; r++) {
                    for (let c = 0; c < this.boardSize; c++) {
                        newGrid[c][this.boardSize - 1 - r] = this.grid[r][c];
                    }
                }
                this.grid = newGrid;
            }
        };

        // 방향 상수: 0: Up, 1: Right, 2: Down, 3: Left
        const rotations = { 'ArrowUp': 3, 'ArrowRight': 2, 'ArrowDown': 1, 'ArrowLeft': 0 };
        const reverseRotations = { 'ArrowUp': 1, 'ArrowRight': 2, 'ArrowDown': 3, 'ArrowLeft': 0 };
        
        if (rotations[direction] === undefined) return;

        // 이동 효과 (Tilt) 적용
        this.applyMoveEffect(direction);

        rotateGrid(rotations[direction]);

        let mergeCount = 0;
        let maxNewValue = 0;
        const mergedIds = [];

        // 좌측으로 밀기 로직 (객체 기반으로 수정)
        for (let r = 0; r < this.boardSize; r++) {
            let row = [...this.grid[r]];
            let newRow = Array(this.boardSize).fill(null);
            let targetIdx = 0;
            
            for (let c = 0; c < this.boardSize; c++) {
                if (row[c] === null) continue;
                
                const currentTile = row[c];

                if (currentTile.value === 'joker') {
                    // 조커 이동 로직
                    if (targetIdx > 0 && newRow[targetIdx-1] && newRow[targetIdx-1].value !== 'joker') {
                        newRow[targetIdx-1].value *= 2;
                        scoreEarned += newRow[targetIdx-1].value;
                        mergeCount++;
                        mergedIds.push(newRow[targetIdx-1].id);
                        moved = true;
                        jokerUsedInMove = true; // 조커 포인트: 기존 타일을 업그레이드함
                    } else {
                        newRow[targetIdx++] = currentTile;
                    }
                    moved = true;
                    continue;
                }

                if (targetIdx > 0 && newRow[targetIdx-1] && newRow[targetIdx-1].value === currentTile.value) {
                    // 병합
                    newRow[targetIdx-1].value *= 2;
                    const val = newRow[targetIdx-1].value;
                    scoreEarned += val;
                    if (val > maxNewValue) maxNewValue = val;
                    mergeCount++;
                    mergedIds.push(newRow[targetIdx-1].id);
                    moved = true;
                } else if (targetIdx > 0 && newRow[targetIdx-1] && newRow[targetIdx-1].value === 'joker') {
                    // 조커 뒤의 타일이 조커와 만나 업그레이드
                    currentTile.value *= 2;
                    newRow[targetIdx-1] = currentTile;
                    scoreEarned += currentTile.value;
                    mergeCount++;
                    mergedIds.push(currentTile.id);
                    moved = true;
                    jokerUsedInMove = true; // 조커 포인트: 조커를 사용하여 자기 자신을 업그레이드함
                } else {
                    newRow[targetIdx++] = currentTile;
                }
            }
            if (JSON.stringify(this.grid[r].map(t => t?.id)) !== JSON.stringify(newRow.map(t => t?.id))) moved = true;
            this.grid[r] = newRow;
        }

        rotateGrid(reverseRotations[direction]);

        if (moved) {
            this.score += scoreEarned;
            this.updateScores();
            this.triggerEffects(mergeCount, maxNewValue);
            
            // 렌더링 호출
            this.renderGrid(mergedIds);
            
            setTimeout(() => {
                if (!jokerUsedInMove) {
                    this.addRandomTile();
                }
                this.checkGameState();
            }, 150);
        }
    }

    applyMoveEffect(direction) {
        const cls = `tile-move-${direction.replace('Arrow', '').toLowerCase()}`;
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(t => {
            t.classList.add(cls);
            setTimeout(() => t.classList.remove(cls), 200);
        });
    }

    updateScores() {
        this.scoreDisplay.textContent = this.score;
        if (this.score > this.bestScore) {
            // 이번 틱에서 처음으로 베스트 스코어를 갱신한 경우 효과 부여
            if (this.score > 0 && this.score > parseInt(localStorage.getItem('zeons-build2048-best-score') || 0)) {
                this.triggerBestScoreEffect();
            }
            this.bestScore = this.score;
            localStorage.setItem('zeons-build2048-best-score', this.bestScore);
        }
        this.bestScoreDisplay.textContent = this.bestScore;
    }

    triggerBestScoreEffect() {
        const bestBox = this.bestScoreDisplay.parentElement;
        if (bestBox && !bestBox.classList.contains('best-score-update')) {
            bestBox.classList.add('best-score-update');
            
            // 효과음은 한 게임 세션 동안 단 한 번만 재생
            if (!this.hasTriggeredBestScoreThisGame) {
                this.playBestScoreSound();
                this.hasTriggeredBestScoreThisGame = true;
            }
            
            setTimeout(() => bestBox.classList.remove('best-score-update'), 800);
        }
    }

    resetBestScore() {
        if (this.bestScore === 0) return;
        
        if (confirm('베스트 스코어를 초기화하시겠습니까?')) {
            this.bestScore = 0;
            localStorage.setItem('zeons-build2048-best-score', '0');
            this.bestScoreDisplay.textContent = '0';
            this.showEventToast("베스트 스코어가 초기화되었습니다.", false);
            
            // 시각적 피드백 (잠시 강조)
            const bestBox = this.bestScoreDisplay.parentElement;
            bestBox.style.transition = 'none';
            bestBox.style.transform = 'scale(0.9)';
            setTimeout(() => {
                bestBox.style.transition = 'all 0.2s ease';
                bestBox.style.transform = 'scale(1)';
            }, 50);
        }
    }

    triggerEffects(mergeCount, maxNewValue) {
        if (mergeCount === 0) return;

        // 콤보 연출 및 조커 보상
        if (mergeCount >= 3) {
            if (this.jokerCount < 3) {
                this.jokerCount++;
                this.updateJokerUI();
                this.showEventToast("COMBO REWARD: JOKER GET!", true);
                this.playUpSound();
            } else {
                this.showEventToast("COMBO! (MAX JOKER)", true);
                this.playComboSound();
            }
        } else if (mergeCount === 2) {
            this.showEventToast("2 COMBO!", true);
            this.playComboSound();
        } else {
            this.playMergeSound(true);
        }

        // 레벨 업데이트 (2=Lv1, 4=Lv2, 8=Lv3...)
        this.updateLevelUI();

        // 빌딩 마일스톤 확인 (2->01, 4->02, 8->03...)
        const level = Math.log2(maxNewValue);
        if (this.milestones.includes(level) && !this.reachedMilestones.has(level)) {
            this.reachedMilestones.add(level);
            this.showEventToast(`BUILDING LEVEL ${level} 달성!`);
            this.playUpSound();
        }
    }

    updateLevelUI() {
        const tiles = this.grid.flat().filter(t => t && typeof t.value === 'number');
        const levelDisplay = document.getElementById('current-level');
        
        if (tiles.length === 0) {
            if (levelDisplay) levelDisplay.textContent = 'LV.1';
            this.currentLevel = 1;
            return;
        }
        
        const maxVal = Math.max(...tiles.map(t => t.value));
        const level = Math.log2(maxVal);
        
        if (levelDisplay) {
            levelDisplay.textContent = `LV.${level}`;
            
            // 레벨업 애니메이션 (강조)
            if (this.currentLevel < level) {
                this.currentLevel = level;
                levelDisplay.classList.add('level-up');
                setTimeout(() => levelDisplay.classList.remove('level-up'), 500);
                
                // 타일 이동(0.15s)이 완료된 후 효과가 나타나도록 딜레이 유지
                setTimeout(() => {
                    const highestTile = tiles.find(t => Math.log2(t.value) === level);
                    if (highestTile) {
                        this.triggerDiscoveryHighlight(highestTile);
                    }
                }, 200);
            }
        }
    }

    triggerDiscoveryHighlight(tile) {
        const tileEl = document.querySelector(`.tile[data-id="${tile.id}"]`);
        if (!tileEl) return;

        // 1. 타일 강조 (Pop)
        tileEl.classList.add('tile-discovery');
        
        // 2. 황금 파티클 폭죽 (Fireworks)
        const rect = tileEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 30; i++) {
            this.createDiscoveryParticle(centerX, centerY);
        }

        setTimeout(() => tileEl.classList.remove('tile-discovery'), 1500);
    }

    createDiscoveryParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'discovery-particle';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 120;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        const size = 3 + Math.random() * 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        const duration = 600 + Math.random() * 800;
        particle.style.animation = `particleBurst ${duration}ms cubic-bezier(0.1, 0.5, 0.3, 1) forwards`;
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), duration);
    }

    showEventToast(text, isCombo = false) {
        const container = document.getElementById('event-message-container');
        const toast = document.createElement('div');
        toast.className = `event-toast ${isCombo ? 'combo-toast' : ''}`;
        toast.textContent = text;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 1000);
    }

    playMergeSound(hasMerged) {
        if (!hasMerged) return; // 효과음은 항상 재생 (BGM 설정과 분리)
        this.synthSound(330, 660, 0.4);
    }

    playComboSound() {
        // 효과음은 항상 재생
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioCtx.currentTime;
        
        const playNote = (freq, start, dur) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'square'; // 칩튠 느낌의 통통 튀는 소리
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.1, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + dur);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(start);
            osc.stop(start + dur);
        };

        playNote(523.25, now, 0.1);    // C5
        playNote(659.25, now + 0.1, 0.1); // E5
        playNote(783.99, now + 0.2, 0.2); // G5
        
        setTimeout(() => audioCtx.close(), 600);
    }

    playUpSound() {
        // ... (existing logic)
    }

    playBestScoreSound() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioCtx.currentTime;
        
        const playTing = (freq, start, dur) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);
            
            // 크리스탈 같은 맑은 소리를 위해 고주파수 감쇠
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.2, start + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(start);
            osc.stop(start + dur);
        };

        // 아주 맑고 높은 소리 (B6, E7)
        playTing(1975.53, now, 0.4);
        playTing(2637.02, now + 0.05, 0.6);
        
        setTimeout(() => audioCtx.close(), 1000);
    }

    synthSound(startFreq, endFreq, duration, type = 'sine') {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.frequency.setTargetAtTime(startFreq, audioCtx.currentTime, 0);
            osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
            setTimeout(() => audioCtx.close(), (duration + 0.1) * 1000);
        } catch (e) {}
    }

    checkGameState() {
        // 승리 확인 (2048 타일 존재 여부)
        if (this.grid.flat().includes(2048)) {
            this.showEndMessage('CONGRATULATIONS!', '제온스 시티의 마천루를 완성하셨습니다!', true);
            return;
        }

        // 게임 오버 확인 (빈 칸 없음 & 병합 가능성 없음)
        if (!this.grid.flat().includes(null)) {
            let canMove = false;
            for (let r = 0; r < this.boardSize; r++) {
                for (let c = 0; c < this.boardSize; c++) {
                    const val = this.grid[r][c];
                    if ((c < 3 && val === this.grid[r][c+1]) || (r < 3 && val === this.grid[r+1][c])) {
                        canMove = true;
                        break;
                    }
                }
            }
            if (!canMove) {
                this.showEndMessage('GAME OVER', '인구가 너무 밀집되어 더 이상 건설할 수 없습니다.', false);
            }
        }
    }

    showEndMessage(title, desc, isWin) {
        document.getElementById('status-title').textContent = title;
        document.getElementById('status-title').style.color = isWin ? '#238636' : '#f85149';
        document.getElementById('status-desc').textContent = desc;
        document.getElementById('final-score-val').textContent = this.score;
        this.gameMessage.style.display = 'flex';
    }

    addEventListeners() {
        // 키보드 입력
        window.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                this.move(e.key);
                
                // BGM 시작 (사용자 설정이 활성화된 경우만)
                if (this.bgmEnabled && this.bgm.paused) {
                    this.bgm.play().catch(() => {});
                }
            }
        });

        // 리스타트 버튼
        document.getElementById('restart-button').addEventListener('click', () => this.restart());
        document.getElementById('retry-button').addEventListener('click', () => this.restart());

        // BGM 토글
        const bgmToggle = document.getElementById('bgm-toggle');
        const soundOn = document.getElementById('sound-on');
        const soundOff = document.getElementById('sound-off');

        bgmToggle.addEventListener('click', () => {
            if (this.bgmEnabled) {
                this.bgm.pause();
                soundOn.classList.add('hidden');
                soundOff.classList.remove('hidden');
            } else {
                this.bgm.play().catch(() => {});
                soundOn.classList.remove('hidden');
                soundOff.classList.add('hidden');
            }
            this.bgmEnabled = !this.bgmEnabled;
        });

        // 조커 버튼
        const jokerBtn = document.getElementById('joker-button');
        const jokerCountSpan = document.getElementById('joker-count');
        
        jokerBtn.addEventListener('click', () => {
            if (this.isLocked) return; // 입력 잠금 시 조작 방지
            if (this.jokerCount <= 0) return;
            
            const emptyCells = [];
            for (let r = 0; r < this.boardSize; r++) {
                for (let c = 0; c < this.boardSize; c++) {
                    if (!this.grid[r][c]) emptyCells.push({ r, c });
                }
            }

            if (emptyCells.length > 0) {
                const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                this.grid[r][c] = {
                    value: 'joker',
                    id: this.nextTileId++
                };
                
                this.jokerCount--;
                this.updateJokerUI();
                
                this.renderGrid();
                this.showEventToast(`조커 빌딩 건설!`, false);
                this.playUpSound();
            } else {
                this.showEventToast("빈 칸이 없습니다!", false);
            }
        });

        // 숫자 표시 토글 버튼
        const valueToggleBtn = document.getElementById('value-toggle');
        valueToggleBtn.addEventListener('click', () => {
            this.showValues = !this.showValues;
            localStorage.setItem('zeons-show-values', this.showValues);
            this.syncValueToggleUI();
            this.showEventToast(this.showValues ? "숫자 표시 ON" : "숫자 표시 OFF", false);
        });

        // 공유 버튼 (스크린샷 포함)
        const shareAction = async () => {
            const container = document.querySelector('.game-container');
            const bgmInfo = document.getElementById('bgm-info');
            const intro = document.querySelector('.game-intro');
            const messageButtons = document.querySelector('.message-buttons');
            
            // 캡처 시 불필요한 UI 숨김
            if (bgmInfo) bgmInfo.style.opacity = '0';
            if (intro) intro.style.opacity = '0';
            if (messageButtons) messageButtons.style.opacity = '0';
            
            try {
                this.showEventToast("이미지 생성 중...", false);
                
                const canvas = await html2canvas(container, {
                    backgroundColor: '#0d1117',
                    scale: 2,
                    logging: false,
                    useCORS: true,
                });

                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                const file = new File([blob], 'zeons-city-2048.png', { type: 'image/png' });

                const text = `🌆 ZEONS CITY 2048\n\n거대 마천루를 세웠습니다! (City Level: LV.${this.currentLevel})\n내 최고 점수: ${this.bestScore}점\n함께 도시를 건설해볼까요?`;
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'ZEONS City 2048',
                        text: text
                    });
                } else {
                    await navigator.share({
                        title: 'ZEONS City 2048',
                        text: text,
                        url: window.location.href
                    });
                }
            } catch (err) {
                console.error("공유 실패:", err);
                const text = `🌆 ZEONS CITY 2048\n최고 점수: ${this.bestScore}점 (City Level: LV.${this.currentLevel})\n${window.location.href}`;
                navigator.clipboard.writeText(text);
                alert('결과가 클립보드에 복사되었습니다!');
            } finally {
                // UI 다시 표시
                if (bgmInfo) bgmInfo.style.opacity = '1';
                if (intro) intro.style.opacity = '1';
                if (messageButtons) messageButtons.style.opacity = '1';
            }
        };

        const shareBtn = document.getElementById('share-button');
        const shareFinalBtn = document.getElementById('share-final-button');
        if (shareBtn) shareBtn.addEventListener('click', shareAction);
        if (shareFinalBtn) shareFinalBtn.addEventListener('click', shareAction);

        const bgmInfoElement = document.getElementById('bgm-info');
        if (bgmInfoElement) {
            bgmInfoElement.addEventListener('click', () => {
                console.log("BGM Info Clicked - Switching track");
                this.playNextBGM();
            });
        }

        // 터치 스와이프 지원
        let touchStartX = 0;
        let touchStartY = 0;
        const board = document.getElementById('game-board');

        board.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        board.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;
            if (this.isLocked) return; // 입력 잠금 시 조작 방지
            
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (Math.max(absDx, absDy) > 20) { // 최소 스와이프 거리
                if (absDx > absDy) {
                    this.move(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
                } else {
                    this.move(dy > 0 ? 'ArrowDown' : 'ArrowUp');
                }
            }
            touchStartX = 0;
            touchStartY = 0;
        }, { passive: true });

        // 마우스 드래그 지원 추가
        let mouseStartX = 0;
        let mouseStartY = 0;
        let isMouseDown = false;

        board.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            mouseStartY = e.clientY;
            isMouseDown = true;
        });

        // 전역mouseup으로 처리하여 보드 밖에서 떼어도 동작하게 함
        window.addEventListener('mouseup', (e) => {
            if (!isMouseDown) return;
            if (this.isLocked) return; // 입력 잠금 시 조작 방지
            
            const dx = e.clientX - mouseStartX;
            const dy = e.clientY - mouseStartY;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (Math.max(absDx, absDy) > 30) { // 최소 드래그 거리 (마우스는 조금 더 길게)
                if (absDx > absDy) {
                    this.move(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
                } else {
                    this.move(dy > 0 ? 'ArrowDown' : 'ArrowUp');
                }
            }
            isMouseDown = false;
        });
    }

    syncValueToggleUI() {
        const toggleBtn = document.getElementById('value-toggle');
        if (this.showValues) {
            this.tileContainer.classList.remove('hide-values');
            toggleBtn.classList.add('active');
        } else {
            this.tileContainer.classList.add('hide-values');
            toggleBtn.classList.remove('active');
        }
    }

    updateJokerUI() {
        const btn = document.getElementById('joker-button');
        const countSpan = document.getElementById('joker-count');
        if (btn && countSpan) {
            countSpan.textContent = this.jokerCount;
            btn.disabled = (this.jokerCount <= 0);
        }
    }

    setupGame() {
        if (this.isLocked) return;
        
        this.grid = Array(4).fill().map(() => Array(4).fill(null));
        this.score = 0;
        this.reachedMilestones.clear();
        this.jokerCount = 0;
        this.currentLevel = 1;
        
        // 새로운 게임 시작 시 계절 무작위 변경
        this.currentSeason = this.getRandomSeason();
        this.syncSeasonUI();
        this.playRandomBGM(); // 재시작 시 BGM 랜덤 변경
        
        document.getElementById('score').textContent = '0';
        this.updateJokerUI();
        this.updateLevelUI();
        
        // 인트로 연출 시작
        this.startIntroAnimation();
    }

    startIntroAnimation() {
        this.isLocked = true;
        const board = document.getElementById('game-board');
        board.classList.add('intro-mode');
        
        // 17종 건물 값 정의 (2^1부터 2^17까지)
        const allValues = [
            2, 4, 8, 16, 
            32, 64, 128, 256, 
            512, 1024, 2048, 4096, 
            8192, 16384, 32768, 65536, 131072
        ];
        
        // 보드판(16칸)에 1단계부터 16단계까지 순서대로 배치
        let idx = 0;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                this.grid[r][c] = {
                    id: this.nextTileId++,
                    value: allValues[idx++]
                };
            }
        }
        
        this.renderGrid();
        this.showEventToast("도시 건설 준비 중...", false);
        
        if (this.introTimeout) clearTimeout(this.introTimeout);
        this.introTimeout = setTimeout(() => {
            board.classList.remove('intro-mode');
            this.grid = Array(4).fill().map(() => Array(4).fill(null));
            this.addRandomTile();
            this.addRandomTile();
            this.renderGrid();
            this.isLocked = false;
        }, 3000);
    }

    restart() {
        this.setupGame(); // setupBoard 대신 setupGame 호출
        this.gameMessage.style.display = 'none'; // 게임 오버/승리 메시지 숨김
    }
}

// 게임 시작
window.addEventListener('DOMContentLoaded', () => {
    new ZeonsCity2048();
});
