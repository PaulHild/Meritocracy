// ---------------------------------------------------------------------------
// Math Grid Quiz (Gleichungen) – oTree JavaScript
// ---------------------------------------------------------------------------
// MATH_QUESTIONS is loaded dynamically from the set's answer_key.js before
// this script runs.
//
// Each entry:
// {
//   rows: number,        // 1, 2 or 3
//   cols: number,        // 2 or 3
//   grid: [...],         // row-major
//   row_ops: [...],
//   col_ops: [...],      // not used for rows:1
//   row_results: [...],
//   col_results: [...],  // not shown for rows:1 (would reveal answers)
//   answers: { "row_col": val },
//   explanation: string  // optional, shown in tutorial mode for first question
// }
// ---------------------------------------------------------------------------

const DEBUG_MATH = false;

const MATH_TOTAL = Math.min(MATH_QUESTIONS.length, (window.js_vars && window.js_vars.max_questions) ? window.js_vars.max_questions : MATH_QUESTIONS.length);

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let mCurrentIndex = 0;
let mScoreValue = 0;
let mAnswersMap = {};  // { "0": {"0_1":3,"1_0":4}, "1": {...}, ... }

let mLsPrefix = 'math_';

// DOM references
let mScoreField = null;
let mAnswersField = null;

// Freeze state
let mFreezeActive = false;

// ---------------------------------------------------------------------------
// Initialise
// ---------------------------------------------------------------------------
function initMathQuiz() {
    const jv = window.js_vars || {};
    mLsPrefix = 'math_' + (jv.participant_code || 'x') + '_set' + (jv.math_set || '1') + '_';

    mScoreField   = document.getElementById('id_' + (jv.math_score_field   || 'MathQuiz_score'));
    mAnswersField = document.getElementById('id_' + (jv.math_answers_field || 'MathQuiz_answers'));

    const savedIndex   = localStorage.getItem(mLsPrefix + 'index');
    const savedScore   = localStorage.getItem(mLsPrefix + 'score');
    const savedAnswers = localStorage.getItem(mLsPrefix + 'answers');

    mCurrentIndex = savedIndex  !== null ? parseInt(savedIndex,  10) : 0;
    mScoreValue   = savedScore  !== null ? parseInt(savedScore,  10) : 0;
    mAnswersMap   = savedAnswers !== null ? JSON.parse(savedAnswers)  : {};

    if (isNaN(mCurrentIndex) || mCurrentIndex < 0) mCurrentIndex = 0;
    if (isNaN(mScoreValue)   || mScoreValue   < 0) mScoreValue   = 0;

    mSyncFields();

    if (mCurrentIndex >= MATH_TOTAL) {
        mAutoSubmit();
        return;
    }

    mShowQuestion(mCurrentIndex);
}

// ---------------------------------------------------------------------------
// Per-question freeze countdown
// ---------------------------------------------------------------------------
function startMathFreeze() {
    const jv = window.js_vars || {};
    const freezeSecs = jv.freeze_seconds || 0;
    if (freezeSecs <= 0) return;

    mFreezeActive = true;
    const confirmBtn = document.getElementById('math-confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = '\u23F3 ' + freezeSecs + 's';
    }

    let remaining = freezeSecs;
    const tick = setInterval(function () {
        remaining--;
        const btn = document.getElementById('math-confirm-btn');
        if (remaining > 0) {
            if (btn) btn.textContent = '\u23F3 ' + remaining + 's';
        } else {
            clearInterval(tick);
            mFreezeActive = false;
            if (btn) {
                btn.textContent = 'Confirm';
                mCheckAllFilled();
            }
        }
    }, 1000);
}

// ---------------------------------------------------------------------------
// Display a question
// ---------------------------------------------------------------------------
function mShowQuestion(index) {
    const q = MATH_QUESTIONS[index];

    // Build grid
    const gridDiv = document.getElementById('math-grid');
    if (!gridDiv) return;
    gridDiv.innerHTML = '';
    gridDiv.style.cssText = '';   // clear all inline styles from previous question

    if (q.rows === 1 && q.cols === 2) {
        mRenderSimpleEquation(q, gridDiv);
    } else {
        mRenderGrid(q, gridDiv);
    }

    // Reset confirm button
    var confirmBtn = document.getElementById('math-confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Confirm';
        confirmBtn.style.display = '';
    }

    // Hide feedback panel if visible
    var feedback = document.getElementById('math-feedback');
    if (feedback) feedback.style.display = 'none';

    // Focus first input
    var firstInput = gridDiv.querySelector('.math-input');
    if (firstInput) firstInput.focus();

    // Start per-question freeze
    mFreezeActive = false;
    startMathFreeze();
}

// ---------------------------------------------------------------------------
// Render a simple 1×2 equation: A op B = result  (one cell is blank)
// ---------------------------------------------------------------------------
function mRenderSimpleEquation(q, gridDiv) {
    gridDiv.style.display = 'flex';
    gridDiv.style.alignItems = 'center';
    gridDiv.style.justifyContent = 'center';
    gridDiv.style.gap = '16px';
    gridDiv.style.padding = '28px 16px';
    gridDiv.style.fontSize = '1.6em';
    gridDiv.style.fontWeight = 'bold';

    function makeValueCell(cellData, r, c) {
        var wrapper = document.createElement('div');
        wrapper.className = 'math-cell';
        if (cellData.blank) {
            var input = document.createElement('input');
            input.type = 'number';
            input.className = 'math-input';
            input.dataset.row = r;
            input.dataset.col = c;
            input.id = 'math-input-' + r + '-' + c;
            input.style.width = '72px';
            input.style.fontSize = '1em';
            input.addEventListener('input', mCheckAllFilled);
            wrapper.appendChild(input);
            wrapper.classList.add('math-blank-cell');
        } else {
            wrapper.textContent = cellData.value;
            wrapper.classList.add('math-number');
        }
        return wrapper;
    }

    function makeTextCell(text, cls) {
        var el = document.createElement('div');
        el.className = 'math-cell ' + cls;
        el.textContent = text;
        return el;
    }

    // A  op  B  =  result
    gridDiv.appendChild(makeValueCell(q.grid[0][0], 0, 0));
    gridDiv.appendChild(makeTextCell(mDisplayOp(q.row_ops[0][0]), 'math-op'));
    gridDiv.appendChild(makeValueCell(q.grid[0][1], 0, 1));
    gridDiv.appendChild(makeTextCell('=', 'math-op'));
    gridDiv.appendChild(makeTextCell(q.row_results[0], 'math-number'));
}

// ---------------------------------------------------------------------------
// Render a standard 2×2, 2×3, or 3×3 grid
// ---------------------------------------------------------------------------
function mRenderGrid(q, gridDiv) {
    gridDiv.style.display = 'grid';

    var visCols = 2 * q.cols + 1;
    var visRows = 2 * q.rows + 1;

    gridDiv.style.gridTemplateColumns = 'repeat(' + visCols + ', auto)';
    gridDiv.style.gridTemplateRows = 'repeat(' + visRows + ', auto)';

    for (var vr = 0; vr < visRows; vr++) {
        for (var vc = 0; vc < visCols; vc++) {
            var cell = document.createElement('div');
            cell.className = 'math-cell';

            var isLastRow = (vr === visRows - 1);
            var isSecondLastRow = (vr === visRows - 2);
            var isLastCol = (vc === visCols - 1);
            var isSecondLastCol = (vc === visCols - 2);

            var evenRow = (vr % 2 === 0);
            var evenCol = (vc % 2 === 0);

            if (isLastRow && evenCol) {
                var colIdx = vc / 2;
                if (colIdx < q.cols) {
                    cell.textContent = q.col_results[colIdx];
                    cell.classList.add('math-number');
                }
            } else if (isSecondLastRow && evenCol) {
                var colIdx2 = vc / 2;
                if (colIdx2 < q.cols) {
                    cell.textContent = '=';
                    cell.classList.add('math-op');
                }
            } else if (isLastRow || isSecondLastRow) {
                cell.classList.add('math-empty');
            } else if (evenRow && isLastCol) {
                var rowIdx = vr / 2;
                if (rowIdx < q.rows) {
                    cell.textContent = q.row_results[rowIdx];
                    cell.classList.add('math-number');
                }
            } else if (evenRow && isSecondLastCol) {
                cell.textContent = '=';
                cell.classList.add('math-op');
            } else if (evenRow && evenCol) {
                var r = vr / 2;
                var c = vc / 2;
                var cellData = q.grid[r][c];
                if (cellData.blank) {
                    var input = document.createElement('input');
                    input.type = 'number';
                    input.className = 'math-input';
                    input.dataset.row = r;
                    input.dataset.col = c;
                    input.id = 'math-input-' + r + '-' + c;
                    input.addEventListener('input', mCheckAllFilled);
                    cell.appendChild(input);
                    cell.classList.add('math-blank-cell');
                } else {
                    cell.textContent = cellData.value;
                    cell.classList.add('math-number');
                }
            } else if (evenRow && !evenCol && !isSecondLastCol && !isLastCol) {
                var rowIdx2 = vr / 2;
                var opIdx = (vc - 1) / 2;
                if (rowIdx2 < q.rows && opIdx < q.row_ops[rowIdx2].length) {
                    cell.textContent = mDisplayOp(q.row_ops[rowIdx2][opIdx]);
                    cell.classList.add('math-op');
                }
            } else if (!evenRow && evenCol) {
                var colIdx3 = vc / 2;
                var opRowIdx = (vr - 1) / 2;
                if (colIdx3 < q.cols && opRowIdx < q.col_ops[colIdx3].length) {
                    cell.textContent = mDisplayOp(q.col_ops[colIdx3][opRowIdx]);
                    cell.classList.add('math-op');
                }
            } else {
                cell.classList.add('math-empty');
            }

            gridDiv.appendChild(cell);
        }
    }
}

// ---------------------------------------------------------------------------
// Display operator symbol
// ---------------------------------------------------------------------------
function mDisplayOp(op) {
    switch (op) {
        case '+': return '+';
        case '-': return '\u2212';
        case '*': return '\u00D7';
        case '/': return ':';
        default:  return op;
    }
}

// ---------------------------------------------------------------------------
// Check if all blank fields are filled
// ---------------------------------------------------------------------------
function mCheckAllFilled() {
    var inputs = document.querySelectorAll('.math-input');
    var allFilled = true;
    inputs.forEach(function (inp) {
        if (inp.value === '') allFilled = false;
    });
    var confirmBtn = document.getElementById('math-confirm-btn');
    // Only enable if freeze is also over
    if (confirmBtn) confirmBtn.disabled = !(allFilled && !mFreezeActive);
}

// ---------------------------------------------------------------------------
// Confirm the answer
// ---------------------------------------------------------------------------
function mConfirmAnswer() {
    var q = MATH_QUESTIONS[mCurrentIndex];
    var inputs = document.querySelectorAll('.math-input');
    var playerAnswers = {};
    var allCorrect = true;

    inputs.forEach(function (inp) {
        var key = inp.dataset.row + '_' + inp.dataset.col;
        var val = parseInt(inp.value, 10);
        playerAnswers[key] = val;
        var correctVal = q.answers[key];
        if (val !== correctVal) allCorrect = false;
    });

    if (allCorrect) mScoreValue++;

    mAnswersMap[String(mCurrentIndex)] = playerAnswers;

    if (DEBUG_MATH) {
        console.log(
            'Math Q' + (mCurrentIndex + 1),
            '| correct:', allCorrect,
            '| answers:', JSON.stringify(playerAnswers),
            '| expected:', JSON.stringify(q.answers),
            '| total correct so far:', mScoreValue
        );
    }

    mSaveState();
    mSyncFields();

    var jv = window.js_vars || {};
    if (jv.tutorial_mode) {
        mShowTutorialFeedback(mCurrentIndex, allCorrect, q, playerAnswers);
    } else {
        mCurrentIndex++;
        mSaveState();
        if (mCurrentIndex < MATH_TOTAL) mShowQuestion(mCurrentIndex);
        else mAutoSubmit();
    }
}

// ---------------------------------------------------------------------------
// Tutorial feedback panel
// ---------------------------------------------------------------------------
function mShowTutorialFeedback(idx, allCorrect, q, playerAnswers) {
    var feedback = document.getElementById('math-feedback');
    var gridDiv = document.getElementById('math-grid');
    var confirmBtn = document.getElementById('math-confirm-btn');

    var html = '';
    if (allCorrect) {
        // Correct: keep grid visible, hide only the confirm button
        if (confirmBtn) confirmBtn.style.display = 'none';

        html += '<div style="color:#2e7d32;font-size:1.25em;font-weight:bold;margin-bottom:8px;">&#10003; Correct!</div>';
        if (q.explanation) {
            html += '<p style="margin:8px 0 0;color:#444;font-size:0.95em;">' + q.explanation + '</p>';
        }
        var isLast = (idx + 1 >= MATH_TOTAL);
        var btnLabel = isLast ? 'Finish &rarr;' : 'Next question &rarr;';
        html += '<button type="button" class="btn btn-primary" style="margin-top:14px;" onclick="mAdvanceTutorial()">' + btnLabel + '</button>';
    } else {
        // Incorrect: keep grid visible so participant can retry
        var correctParts = [];
        for (var key in q.answers) {
            if (q.answers.hasOwnProperty(key)) {
                correctParts.push(q.answers[key]);
            }
        }
        html += '<div style="color:#c62828;font-size:1.25em;font-weight:bold;margin-bottom:8px;">&#10007; Incorrect. Try again.</div>';
        html += '<div style="font-size:0.92em;color:#444;margin-bottom:6px;">Correct answer: ' + correctParts.join(', ') + '.</div>';
        if (q.explanation) {
            html += '<p style="margin:8px 0 0;color:#444;font-size:0.95em;">' + q.explanation + '</p>';
        }
    }

    if (feedback) {
        feedback.innerHTML = html;
        feedback.style.display = 'block';
    } else {
        if (allCorrect) mAdvanceTutorial();
    }
}

function mAdvanceTutorial() {
    var feedback = document.getElementById('math-feedback');
    if (feedback) feedback.style.display = 'none';

    mCurrentIndex++;
    mSaveState();
    if (mCurrentIndex < MATH_TOTAL) mShowQuestion(mCurrentIndex);
    else mAutoSubmit();
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function mSyncFields() {
    if (mScoreField)   mScoreField.value   = mScoreValue;
    if (mAnswersField) mAnswersField.value = JSON.stringify(mAnswersMap);
}

function mSaveState() {
    localStorage.setItem(mLsPrefix + 'index',   String(mCurrentIndex));
    localStorage.setItem(mLsPrefix + 'score',   String(mScoreValue));
    localStorage.setItem(mLsPrefix + 'answers', JSON.stringify(mAnswersMap));
}

function mAutoSubmit() {
    localStorage.removeItem(mLsPrefix + 'index');
    localStorage.removeItem(mLsPrefix + 'score');
    localStorage.removeItem(mLsPrefix + 'answers');

    mSyncFields();
    var form = document.querySelector('form');
    if (form) form.submit();
}

// ---------------------------------------------------------------------------
// DOM-ready entry point
// ---------------------------------------------------------------------------
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMathQuiz);
} else {
    initMathQuiz();
}
