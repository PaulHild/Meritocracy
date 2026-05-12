// ---------------------------------------------------------------------------
// Analogies Quiz – oTree JavaScript
// ---------------------------------------------------------------------------
// QUESTIONS is loaded dynamically from the set's answer_key.js before this
// script runs. Each entry: { question: string, options: [5 strings], correct: index (0-4),
//                             explanation: string (optional, shown in tutorial) }
// ---------------------------------------------------------------------------
// TODO: turn off debugging
const DEBUG_ANALOGY = true;  // set true during development to log scoring

const ANALOGY_LETTERS = ['A', 'B', 'C', 'D', 'E'];
const ANALOGY_TOTAL = Math.min(QUESTIONS.length, (window.js_vars && window.js_vars.max_questions) ? window.js_vars.max_questions : QUESTIONS.length);

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let aCurrentIndex = 0;
let aSelectedOption = null;  // index 0-4
let aScoreValue = 0;
let aAnswersMap = {};        // { "0": "B", "3": "A", ... }

let aLsPrefix = 'analogy_';

// DOM references
let aScoreField = null;
let aAnswersField = null;

// Freeze state
let aFreezeActive = false;

// ---------------------------------------------------------------------------
// Initialise
// ---------------------------------------------------------------------------
function initAnalogyQuiz() {
    const jv = window.js_vars || {};
    aLsPrefix = 'analogy_' + (jv.participant_code || 'x') + '_set' + (jv.analogy_set || '1') + '_';

    // Hidden oTree form fields
    aScoreField   = document.getElementById('id_' + (jv.analogy_score_field   || 'AnalogyQuiz_score'));
    aAnswersField = document.getElementById('id_' + (jv.analogy_answers_field || 'AnalogyQuiz_answers'));

    // Restore state from localStorage
    const savedIndex   = localStorage.getItem(aLsPrefix + 'index');
    const savedScore   = localStorage.getItem(aLsPrefix + 'score');
    const savedAnswers = localStorage.getItem(aLsPrefix + 'answers');

    aCurrentIndex = savedIndex  !== null ? parseInt(savedIndex,  10) : 0;
    aScoreValue   = savedScore  !== null ? parseInt(savedScore,  10) : 0;
    aAnswersMap   = savedAnswers !== null ? JSON.parse(savedAnswers)  : {};

    if (isNaN(aCurrentIndex) || aCurrentIndex < 0) aCurrentIndex = 0;
    if (isNaN(aScoreValue)   || aScoreValue   < 0) aScoreValue   = 0;

    aSyncFields();

    if (aCurrentIndex >= ANALOGY_TOTAL) {
        aAutoSubmit();
        return;
    }

    aShowQuestion(aCurrentIndex);
}

// ---------------------------------------------------------------------------
// Per-question freeze countdown
// ---------------------------------------------------------------------------
function startAnalogyFreeze() {
    const jv = window.js_vars || {};
    const freezeSecs = jv.freeze_seconds || 0;
    if (freezeSecs <= 0) return;

    aFreezeActive = true;
    const confirmBtn = document.getElementById('analogy-confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = '\u23F3 ' + freezeSecs + 's';
    }

    let remaining = freezeSecs;
    const tick = setInterval(function () {
        remaining--;
        const btn = document.getElementById('analogy-confirm-btn');
        if (remaining > 0) {
            if (btn) btn.textContent = '\u23F3 ' + remaining + 's';
        } else {
            clearInterval(tick);
            aFreezeActive = false;
            if (btn) {
                btn.textContent = 'Confirm';
                if (aSelectedOption !== null) btn.disabled = false;
            }
        }
    }, 1000);
}

// ---------------------------------------------------------------------------
// Display a question
// ---------------------------------------------------------------------------
function aShowQuestion(index) {
    const q = QUESTIONS[index];

    // Counter (cleared — no question number shown)
    const counter = document.getElementById('analogy-counter');
    if (counter) counter.textContent = '';

    // Question text
    const qText = document.getElementById('analogy-question');
    if (qText) qText.textContent = q.question;

    // Answer choices
    const choicesDiv = document.getElementById('analogy-choices');
    if (choicesDiv) {
        choicesDiv.innerHTML = '';
        choicesDiv.style.display = '';
        q.options.forEach(function (optionText, i) {
            const letter = ANALOGY_LETTERS[i];
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'analogy-choice-btn';
            btn.dataset.index = i;

            const letterSpan = document.createElement('span');
            letterSpan.className = 'analogy-letter';
            letterSpan.textContent = letter;

            const textSpan = document.createElement('span');
            textSpan.className = 'analogy-text';
            textSpan.textContent = optionText;

            btn.appendChild(letterSpan);
            btn.appendChild(textSpan);

            btn.addEventListener('click', function () { aSelectOption(i); });
            choicesDiv.appendChild(btn);
        });
    }

    // Reset selection
    aSelectedOption = null;
    const confirmBtn = document.getElementById('analogy-confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Confirm';
        confirmBtn.style.display = '';
    }

    // Hide feedback panel if visible
    const feedback = document.getElementById('analogy-feedback');
    if (feedback) feedback.style.display = 'none';

    // Start per-question freeze
    aFreezeActive = false;
    startAnalogyFreeze();
}

// ---------------------------------------------------------------------------
// Handle option selection
// ---------------------------------------------------------------------------
function aSelectOption(index) {
    aSelectedOption = index;

    document.querySelectorAll('.analogy-choice-btn').forEach(function (btn) {
        btn.classList.toggle('selected', parseInt(btn.dataset.index) === index);
    });

    const confirmBtn = document.getElementById('analogy-confirm-btn');
    if (confirmBtn && !aFreezeActive) confirmBtn.disabled = false;
}

// ---------------------------------------------------------------------------
// Confirm the selected answer
// ---------------------------------------------------------------------------
function aConfirmAnswer() {
    if (aSelectedOption === null) return;

    const q = QUESTIONS[aCurrentIndex];
    const letter = ANALOGY_LETTERS[aSelectedOption];
    const isCorrect = (aSelectedOption === q.correct);

    // Score if correct
    if (isCorrect) aScoreValue++;

    // Record answer
    aAnswersMap[String(aCurrentIndex)] = letter;

    if (DEBUG_ANALOGY) {
        console.log(
            'Analogy Q' + (aCurrentIndex + 1),
            '| correct:', ANALOGY_LETTERS[q.correct],
            '| given:', letter,
            '| match:', isCorrect,
            '| total correct so far:', aScoreValue
        );
    }

    aSaveState();
    aSyncFields();

    const jv = window.js_vars || {};
    if (jv.tutorial_mode) {
        aShowTutorialFeedback(aCurrentIndex, isCorrect, q);
    } else {
        aCurrentIndex++;
        aSaveState();
        if (aCurrentIndex < ANALOGY_TOTAL) aShowQuestion(aCurrentIndex);
        else aAutoSubmit();
    }
}

// ---------------------------------------------------------------------------
// Tutorial feedback panel
// ---------------------------------------------------------------------------
function aShowTutorialFeedback(idx, isCorrect, q) {
    const feedback = document.getElementById('analogy-feedback');
    const choicesDiv = document.getElementById('analogy-choices');
    const confirmBtn = document.getElementById('analogy-confirm-btn');

    let html = '';
    if (isCorrect) {
        // Correct: lock choices, show success + Next button
        if (choicesDiv) choicesDiv.style.display = 'none';
        if (confirmBtn) confirmBtn.style.display = 'none';

        html += '<div style="color:#2e7d32;font-size:1.25em;font-weight:bold;margin-bottom:8px;">&#10003; Correct!</div>';
        if (q.explanation) {
            html += '<p style="margin:8px 0 0;color:#444;font-size:0.95em;">' + q.explanation + '</p>';
        }
        const isLast = (idx + 1 >= ANALOGY_TOTAL);
        const btnLabel = isLast ? 'Finish &rarr;' : 'Next question &rarr;';
        html += '<button type="button" class="btn btn-primary" style="margin-top:14px;" onclick="aAdvanceTutorial()">' + btnLabel + '</button>';
    } else {
        // Incorrect: keep choices visible so participant can retry
        html += '<div style="color:#c62828;font-size:1.25em;font-weight:bold;margin-bottom:8px;">&#10007; Incorrect &mdash; the correct answer was <strong>' + ANALOGY_LETTERS[q.correct] + ' (' + q.options[q.correct] + ')</strong>. Try again.</div>';
        if (q.explanation) {
            html += '<p style="margin:8px 0 0;color:#444;font-size:0.95em;">' + q.explanation + '</p>';
        }
    }

    if (feedback) {
        feedback.innerHTML = html;
        feedback.style.display = 'block';
    } else {
        if (isCorrect) aAdvanceTutorial();
    }
}

function aAdvanceTutorial() {
    const feedback = document.getElementById('analogy-feedback');
    if (feedback) feedback.style.display = 'none';

    aCurrentIndex++;
    aSaveState();
    if (aCurrentIndex < ANALOGY_TOTAL) aShowQuestion(aCurrentIndex);
    else aAutoSubmit();
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function aSyncFields() {
    if (aScoreField)   aScoreField.value   = aScoreValue;
    if (aAnswersField) aAnswersField.value = JSON.stringify(aAnswersMap);
}

function aSaveState() {
    localStorage.setItem(aLsPrefix + 'index',   String(aCurrentIndex));
    localStorage.setItem(aLsPrefix + 'score',   String(aScoreValue));
    localStorage.setItem(aLsPrefix + 'answers', JSON.stringify(aAnswersMap));
}

function aAutoSubmit() {
    localStorage.removeItem(aLsPrefix + 'index');
    localStorage.removeItem(aLsPrefix + 'score');
    localStorage.removeItem(aLsPrefix + 'answers');

    aSyncFields();
    const form = document.querySelector('form');
    if (form) form.submit();
}

// ---------------------------------------------------------------------------
// DOM-ready entry point
// ---------------------------------------------------------------------------
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalogyQuiz);
} else {
    initAnalogyQuiz();
}
