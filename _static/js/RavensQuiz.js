// ---------------------------------------------------------------------------
// Raven's Matrices Quiz – oTree JavaScript
// ---------------------------------------------------------------------------
// PUZZLES is loaded dynamically from the set's answer_key.js before this
// script runs. Each entry: { puzzle: filename, answers: [...], correct: letter,
//                             explanation: string (optional, shown in tutorial) }
// ---------------------------------------------------------------------------

// TODO: set to false
const DEBUG = true;   // set to false to suppress console logging


const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const TOTAL = Math.min(PUZZLES.length, (window.js_vars && window.js_vars.max_questions) ? window.js_vars.max_questions : PUZZLES.length);

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let currentIndex = 0;
let selectedOption = null;  // letter A/B/C/D
let scoreValue = 0;
let answersMap = {};        // { "0": "C", "3": "A", ... }  (key = puzzle index string)

// localStorage key prefix (participant-scoped to avoid collisions across sessions)
let lsPrefix = 'ravens_';

// DOM references (set after DOMContentLoaded)
let imgBase = '';
let scoreField = null;
let answersField = null;

// Freeze state
let freezeActive = false;

// ---------------------------------------------------------------------------
// Initialise
// ---------------------------------------------------------------------------
function initRavensQuiz() {
    // Read oTree js_vars (injected by oTree into the page as window.js_vars)
    const jv = window.js_vars || {};
    lsPrefix = 'ravens_' + (jv.participant_code || 'x') + '_set' + (jv.puzzle_set || '1') + '_';

    // Derive the image base URL from the sentinel attribute (a real file URL).
    const container = document.getElementById('RavensQuiz-container');
    const sentinel = container ? (container.dataset.imgSentinel || '') : '';
    imgBase = sentinel ? sentinel.replace('puzzle_000.png', '') : '';

    // Hidden oTree form fields
    scoreField   = document.getElementById('id_' + (jv.score_field   || 'RavensQuiz_score'));
    answersField = document.getElementById('id_' + (jv.answers_field || 'RavensQuiz_answers'));

    // Restore state from localStorage
    const savedIndex   = localStorage.getItem(lsPrefix + 'index');
    const savedScore   = localStorage.getItem(lsPrefix + 'score');
    const savedAnswers = localStorage.getItem(lsPrefix + 'answers');

    currentIndex = savedIndex  !== null ? parseInt(savedIndex,  10) : 0;
    scoreValue   = savedScore  !== null ? parseInt(savedScore,  10) : 0;
    answersMap   = savedAnswers !== null ? JSON.parse(savedAnswers)  : {};

    // Clamp in case of bad stored value
    if (isNaN(currentIndex) || currentIndex < 0) currentIndex = 0;
    if (isNaN(scoreValue)   || scoreValue   < 0) scoreValue   = 0;

    syncFields();

    if (currentIndex >= TOTAL) {
        autoSubmit();
        return;
    }

    showPuzzle(currentIndex);
}

// ---------------------------------------------------------------------------
// Per-question freeze countdown
// ---------------------------------------------------------------------------
function startRavensFreeze() {
    const jv = window.js_vars || {};
    const freezeSecs = jv.freeze_seconds || 0;
    if (freezeSecs <= 0) return;

    freezeActive = true;
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = '\u23F3 ' + freezeSecs + 's';
    }

    let remaining = freezeSecs;
    const tick = setInterval(function () {
        remaining--;
        const btn = document.getElementById('confirm-btn');
        if (remaining > 0) {
            if (btn) btn.textContent = '\u23F3 ' + remaining + 's';
        } else {
            clearInterval(tick);
            freezeActive = false;
            if (btn) {
                btn.textContent = 'Confirm';
                if (selectedOption !== null) btn.disabled = false;
            }
        }
    }, 1000);
}

// ---------------------------------------------------------------------------
// Display a puzzle
// ---------------------------------------------------------------------------
function showPuzzle(index) {
    const puzzle = PUZZLES[index];

    // Counter (cleared — no question number shown)
    const counter = document.getElementById('puzzle-counter');
    if (counter) counter.textContent = '';

    // Puzzle image
    const img = document.getElementById('puzzle-img');
    if (img) img.src = imgBase + puzzle.puzzle;

    // Answer choices
    const choicesDiv = document.getElementById('choices');
    if (choicesDiv) {
        choicesDiv.innerHTML = '';
        choicesDiv.style.display = '';
        puzzle.answers.forEach(function (filename, i) {
            const letter = OPTION_LETTERS[i];
            
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'choice-btn';
            btn.dataset.letter = letter;

            const label = document.createElement('span');
            label.className = 'choice-label';
            label.textContent = letter;
            btn.appendChild(label);

            const ansImg = document.createElement('img');
            ansImg.src = imgBase + filename;
            ansImg.alt = 'Option ' + letter;
            btn.appendChild(ansImg);

            btn.addEventListener('click', function () { selectOption(letter); });
            choicesDiv.appendChild(btn);
        });
    }

    // Reset selection
    selectedOption = null;
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Confirm';
        confirmBtn.style.display = '';
    }

    // Hide feedback panel if visible
    const feedback = document.getElementById('raven-feedback');
    if (feedback) feedback.style.display = 'none';

    // Start per-question freeze
    freezeActive = false;
    startRavensFreeze();
}

// ---------------------------------------------------------------------------
// Handle option selection
// ---------------------------------------------------------------------------
function selectOption(letter) {
    selectedOption = letter;

    // Update visual selection state
    document.querySelectorAll('.choice-btn').forEach(function (btn) {
        btn.classList.toggle('selected', btn.dataset.letter === letter);
    });

    // Enable confirm button only if freeze is over
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn && !freezeActive) confirmBtn.disabled = false;
}

// ---------------------------------------------------------------------------
// Confirm the selected answer (called from HTML onclick)
// ---------------------------------------------------------------------------
function confirmAnswer() {
    if (selectedOption === null) return;

    const puzzle = PUZZLES[currentIndex];
    const isCorrect = (selectedOption === puzzle.correct);

    // Score if correct
    if (isCorrect) scoreValue++;

    // Record answer
    answersMap[String(currentIndex)] = selectedOption;

    if (DEBUG) {
        console.log(
            'Q' + (currentIndex + 1),
            '| correct:', puzzle.correct,
            '| given:', selectedOption,
            '| match:', isCorrect,
            '| total correct so far:', scoreValue
        );
    }

    saveState();
    syncFields();

    const jv = window.js_vars || {};
    if (jv.tutorial_mode) {
        showTutorialFeedback(currentIndex, isCorrect, puzzle);
    } else {
        currentIndex++;
        saveState();
        if (currentIndex < TOTAL) showPuzzle(currentIndex);
        else autoSubmit();
    }
}

// ---------------------------------------------------------------------------
// Tutorial feedback panel
// ---------------------------------------------------------------------------
function showTutorialFeedback(idx, isCorrect, puzzle) {
    const feedback = document.getElementById('raven-feedback');
    const choicesDiv = document.getElementById('choices');
    const confirmBtn = document.getElementById('confirm-btn');

    let html = '';
    if (isCorrect) {
        // Correct: lock choices, show success + Next button
        if (choicesDiv) choicesDiv.style.display = 'none';
        if (confirmBtn) confirmBtn.style.display = 'none';

        html += '<div style="color:#2e7d32;font-size:1.25em;font-weight:bold;margin-bottom:8px;">&#10003; Correct!</div>';
        if (puzzle.explanation) {
            html += '<p style="margin:8px 0 0;color:#444;font-size:0.95em;">' + puzzle.explanation + '</p>';
        }
        const isLast = (idx + 1 >= TOTAL);
        const btnLabel = isLast ? 'Finish &rarr;' : 'Next question &rarr;';
        html += '<button type="button" class="btn btn-primary" style="margin-top:14px;" onclick="advanceTutorial()">' + btnLabel + '</button>';
    } else {
        // Incorrect: keep choices visible so participant can retry
        html += '<div style="color:#c62828;font-size:1.25em;font-weight:bold;margin-bottom:8px;">&#10007; Incorrect &mdash; the correct answer was <strong>' + puzzle.correct + '</strong>. Try again.</div>';
        if (puzzle.explanation) {
            html += '<p style="margin:8px 0 0;color:#444;font-size:0.95em;">' + puzzle.explanation + '</p>';
        }
    }

    if (feedback) {
        feedback.innerHTML = html;
        feedback.style.display = 'block';
    } else {
        // Fallback: no feedback div — just advance
        if (isCorrect) advanceTutorial();
    }
}

function advanceTutorial() {
    const feedback = document.getElementById('raven-feedback');
    if (feedback) feedback.style.display = 'none';

    currentIndex++;
    saveState();
    if (currentIndex < TOTAL) {
        showPuzzle(currentIndex);
    } else {
        autoSubmit();
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function syncFields() {
    if (scoreField)   scoreField.value   = scoreValue;
    if (answersField) answersField.value = JSON.stringify(answersMap);
}

function saveState() {
    localStorage.setItem(lsPrefix + 'index',   String(currentIndex));
    localStorage.setItem(lsPrefix + 'score',   String(scoreValue));
    localStorage.setItem(lsPrefix + 'answers', JSON.stringify(answersMap));
}

function autoSubmit() {
    // Clear localStorage so a future participant on the same browser starts fresh
    localStorage.removeItem(lsPrefix + 'index');
    localStorage.removeItem(lsPrefix + 'score');
    localStorage.removeItem(lsPrefix + 'answers');

    // Sync fields one final time then submit
    syncFields();
    const form = document.querySelector('form');
    if (form) form.submit();
}

// ---------------------------------------------------------------------------
// DOM-ready entry point
// ---------------------------------------------------------------------------
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRavensQuiz);
} else {
    initRavensQuiz();
}
