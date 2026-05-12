// Math Grid Questions Set 9 — answer key
// grid: row-major array. blank:true cells need user input.
// row_ops[r][i]: operator between col i and col i+1 in row r
// col_ops[c][i]: operator between row i and row i+1 in col c
// answers: {"row_col": value} using 0-based indices
const MATH_QUESTIONS = [
    {
        // Q1. [2x2, 2 blanks]
        //  5 + [?] = 14
        //  ×    +
        //  3 + [?] = 9
        //  =    =
        // 15   15
        rows: 2, cols: 2,
        grid: [
            [{value: 5, blank: false}, {value: null, blank: true}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [14, 9],
        col_results: [15, 15],
        answers: {"0_1": 9, "1_1": 6}
    },
    {
        // Q2. [2x2, 2 blanks]
        // [?] - 4 = 6
        //  +   +
        //  8 - [?] = 1
        //  =   =
        // 18   11
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 8, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['-']],
        col_ops: [['+'], ['+']],
        row_results: [6, 1],
        col_results: [18, 11],
        answers: {"0_0": 10, "1_1": 7}
    },
    {
        // Q3. [2x2, 2 blanks]
        // [?] × 3 = 18
        //  :   +
        //  2 + [?] = 7
        //  =   =
        //  3   8
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 3, blank: false}],
            [{value: 2, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['/'], ['+']],
        row_results: [18, 7],
        col_results: [3, 8],
        answers: {"0_0": 6, "1_1": 5}
    },
    {
        // Q4. [2x2, 2 blanks]
        // 12 + [?] = 20
        //  -   ×
        // [?] +  4 = 8
        //  =   =
        //  8  32
        rows: 2, cols: 2,
        grid: [
            [{value: 12, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [20, 8],
        col_results: [8, 32],
        answers: {"0_1": 8, "1_0": 4}
    },
    {
        // Q5. [2x2, 2 blanks]
        // [?] × 4 = 28
        //  +   +
        //  3 × [?] = 18
        //  =   =
        // 10  10
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [28, 18],
        col_results: [10, 10],
        answers: {"0_0": 7, "1_1": 6}
    },
    {
        // Q6. [2x2, 2 blanks]
        // 16 : [?] = 8
        //  +   ×
        //  4 × [?] = 8
        //  =   =
        // 20   4
        rows: 2, cols: 2,
        grid: [
            [{value: 16, blank: false}, {value: null, blank: true}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['+'], ['*']],
        row_results: [8, 8],
        col_results: [20, 4],
        answers: {"0_1": 2, "1_1": 2}
    },
    {
        // Q7. [2x2, 2 blanks]
        // [?] + 11 = 20
        //  ×    -
        //  2 +  [?] = 8
        //  =    =
        // 18    9
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 11, blank: false}],
            [{value: 2, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['-']],
        row_results: [20, 8],
        col_results: [18, 5],
        answers: {"0_0": 9, "1_1": 6}
    },
    {
        // Q8. [2x2, 2 blanks]
        //  6 × [?] = 24
        //  +   :
        // [?] +  1 = 5
        //  =   =
        // 10   5
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 1, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['/']],
        row_results: [24, 5],
        col_results: [10, 4],
        answers: {"0_1": 4, "1_0": 4}
    },
    {
        // Q9. [2x2, 2 blanks]
        // 17 + [?] = 22
        //  +    +
        // [?] +  8 = 17
        //  =    =
        // 26   13
        rows: 2, cols: 2,
        grid: [
            [{value: 17, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 8, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [22, 17],
        col_results: [26, 13],
        answers: {"0_1": 5, "1_0": 9}
    },
    {
        // Q10. [2x2, 2 blanks]
        // [?] +  6 = 19
        //  +    +
        // 11 + [?] = 20
        //  =    =
        // 24   15
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 11, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [19, 20],
        col_results: [24, 15],
        answers: {"0_0": 13, "1_1": 9}
    },
    {
        // Q11. [2x2, 2 blanks]
        // 26 - [?] = 13
        //  +    +
        // [?] +  4 = 16
        //  =    =
        // 38   17
        rows: 2, cols: 2,
        grid: [
            [{value: 26, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [13, 16],
        col_results: [38, 17],
        answers: {"0_1": 13, "1_0": 12}
    },
    {
        // Q12. [2x2, 2 blanks]
        //  7 × [?] = 28
        //  +    +
        // [?] +  9 = 22
        //  =    =
        // 20   13
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 9, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [28, 22],
        col_results: [20, 13],
        answers: {"0_1": 4, "1_0": 13}
    },
    {
        // Q13. [2x2, 2 blanks]
        //  6 × [?] = 48
        //  +    ×
        // [?] +  7 = 11
        //  =    =
        // 10   56
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [48, 11],
        col_results: [10, 56],
        answers: {"0_1": 8, "1_0": 4}
    },
    {
        // Q14. [2x2, 2 blanks]
        // [?] +  9 = 17
        //  ×    +
        //  4 × [?] = 20
        //  =    =
        // 32   14
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 9, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [17, 20],
        col_results: [32, 14],
        answers: {"0_0": 8, "1_1": 5}
    },
    {
        // Q15. [2x2, 2 blanks]
        //  8 × [?] = 56
        //  -    ×
        // [?] +  3 = 8
        //  =    =
        //  3   21
        rows: 2, cols: 2,
        grid: [
            [{value: 8, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [56, 8],
        col_results: [3, 21],
        answers: {"0_1": 7, "1_0": 5}
    },
    {
        // Q16. [2x2, 2 blanks]
        // [?] × 12 = 48
        //  +    +
        //  6 + [?] = 11
        //  =    =
        // 10   17
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 12, blank: false}],
            [{value: 6, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [48, 11],
        col_results: [10, 17],
        answers: {"0_0": 4, "1_1": 5}
    },
    {
        // Q17. [2x2, 2 blanks]
        // 11 × [?] = 44
        //  +    +
        // [?] ×  3 = 21
        //  =    =
        // 18    7
        rows: 2, cols: 2,
        grid: [
            [{value: 11, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [44, 21],
        col_results: [18, 7],
        answers: {"0_1": 4, "1_0": 7}
    },
    {
        // Q18. [2x2, 2 blanks]
        // [?] :  3 =  3
        //  +    ×
        //  7 × [?] = 35
        //  =    =
        // 16   15
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 3, blank: false}],
            [{value: 7, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['+'], ['*']],
        row_results: [3, 35],
        col_results: [16, 15],
        answers: {"0_0": 9, "1_1": 5}
    },
    {
        // Q19. [2x2, 2 blanks]
        //  4 × [?] = 36
        //  ×    ×
        // [?] +  7 = 10
        //  =    =
        // 12   63
        rows: 2, cols: 2,
        grid: [
            [{value: 4, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [36, 10],
        col_results: [12, 63],
        answers: {"0_1": 9, "1_0": 3}
    },
    {
        // Q20. [2x2, 2 blanks]
        // [?] ×  7 = 35
        //  ×    +
        //  4 × [?] = 32
        //  =    =
        // 20   15
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 7, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [35, 32],
        col_results: [20, 15],
        answers: {"0_0": 5, "1_1": 8}
    }
];
