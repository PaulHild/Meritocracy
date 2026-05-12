// Math Grid Questions Set 2 — answer key
// grid: row-major array. blank:true cells need user input.
// row_ops[r][i]: operator between col i and col i+1 in row r
// col_ops[c][i]: operator between row i and row i+1 in col c
// answers: {"row_col": value} using 0-based indices
const MATH_QUESTIONS = [
    {
        // Q1. [2x2, 2 blanks]
        //  3 + [?] = 8
        //  ×    +
        // [?] +  5 = 12
        //  =    =
        // 15   12
        rows: 2, cols: 2,
        grid: [
            [{value: 3, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [8, 10],
        col_results: [15, 10],
        answers: {"0_1": 5, "1_0": 5}
    },
    {
        // Q2. [2x2, 2 blanks]
        // [?] - 4 = 7
        //  +    +
        //  8 + [?] = 13
        //  =    =
        // 19   11
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 8, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [7, 13],
        col_results: [19, 9],
        answers: {"0_0": 11, "1_1": 5}
    },
    {
        // Q3. [2x2, 2 blanks]
        //  6 × [?] = 12
        //  +    +
        //  4 × [?] = 16
        //  =    =
        // 10    7
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [12, 16],
        col_results: [10, 6],
        answers: {"0_1": 2, "1_1": 4}
    },
    {
        // Q4. [2x2, 2 blanks]
        // [?] + [?] = 15
        //  -    ×
        //  3 +  4 = 7
        //  =    =
        //  6   32
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: null, blank: true}],
            [{value: 3, blank: false}, {value: 4, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [15, 7],
        col_results: [6, 24],
        answers: {"0_0": 9, "0_1": 6}
    },
    {
        // Q5. [2x2, 2 blanks]
        // [?] +  7 = 15
        //  ×    +
        //  2 + [?] = 6
        //  =    =
        // 16   11
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 7, blank: false}],
            [{value: 2, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [15, 6],
        col_results: [16, 11],
        answers: {"0_0": 8, "1_1": 4}
    },
    {
        // Q6. [2x2, 2 blanks]
        // 10 - [?] = 6
        //  +    ×
        // [?] +  3 = 7
        //  =    =
        // 14   12
        rows: 2, cols: 2,
        grid: [
            [{value: 10, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [6, 7],
        col_results: [14, 12],
        answers: {"0_1": 4, "1_0": 4}
    },
    {
        // Q7. [2x2, 2 blanks]
        // [?] ×  4 = 20
        //  +    -
        //  3 × [?] = 9
        //  =    =
        //  8    1
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [20, 9],
        col_results: [8, 1],
        answers: {"0_0": 5, "1_1": 3}
    },
    {
        // Q8. [2x2, 2 blanks]
        //  7 + [?] = 14
        //  ×    ×
        // [?] +  6 = 11
        //  =    =
        // 35   42
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [14, 11],
        col_results: [35, 42],
        answers: {"0_1": 7, "1_0": 5}
    },
    {
        // Q9. [2x2, 2 blanks]
        // 10 + [?] = 16
        //  +    +
        // [?] +  8 = 12
        //  =    =
        // 14   14
        rows: 2, cols: 2,
        grid: [
            [{value: 10, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 8, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [16, 12],
        col_results: [14, 14],
        answers: {"0_1": 6, "1_0": 4}
    },
    {
        // Q10. [2x2, 2 blanks]
        // [?] + 13 = 22
        //  +    +
        //  7 + [?] = 18
        //  =    =
        // 16   24
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 13, blank: false}],
            [{value: 7, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [22, 18],
        col_results: [16, 24],
        answers: {"0_0": 9, "1_1": 11}
    },
    {
        // Q11. [2x2, 2 blanks]
        // 18 - [?] = 10
        //  +    +
        // [?] +  5 = 12
        //  =    =
        // 25   13
        rows: 2, cols: 2,
        grid: [
            [{value: 18, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [10, 12],
        col_results: [25, 13],
        answers: {"0_1": 8, "1_0": 7}
    },
    {
        // Q12. [2x2, 2 blanks]
        //  7 × [?] = 35
        //  +    +
        // [?] +  4 = 17
        //  =    =
        // 20    9
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [35, 17],
        col_results: [20, 9],
        answers: {"0_1": 5, "1_0": 13}
    },
    {
        // Q13. [2x2, 2 blanks]
        //  4 × [?] = 36
        //  +    ×
        // [?] +  5 = 11
        //  =    =
        // 10   45
        rows: 2, cols: 2,
        grid: [
            [{value: 4, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [36, 11],
        col_results: [10, 45],
        answers: {"0_1": 9, "1_0": 6}
    },
    {
        // Q14. [2x2, 2 blanks]
        // [?] +  3 = 11
        //  ×    +
        //  4 × [?] = 28
        //  =    =
        // 32   10
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 3, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [11, 28],
        col_results: [32, 10],
        answers: {"0_0": 8, "1_1": 7}
    },
    {
        // Q15. [2x2, 2 blanks]
        //  9 × [?] = 36
        //  -    ×
        // [?] +  6 = 9
        //  =    =
        //  6   24
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [36, 9],
        col_results: [6, 24],
        answers: {"0_1": 4, "1_0": 3}
    },
    {
        // Q16. [2x2, 2 blanks]
        // [?] ×  4 = 40
        //  +    +
        //  5 + [?] = 13
        //  =    =
        // 15   12
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [40, 13],
        col_results: [15, 12],
        answers: {"0_0": 10, "1_1": 8}
    },
    {
        // Q17. [2x2, 2 blanks]
        //  5 × [?] = 30
        //  +    +
        // [?] ×  4 = 12
        //  =    =
        //  8   10
        rows: 2, cols: 2,
        grid: [
            [{value: 5, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [30, 12],
        col_results: [8, 10],
        answers: {"0_1": 6, "1_0": 3}
    },
    {
        // Q18. [2x2, 2 blanks]
        // [?] :  4 =  3
        //  ×    +
        //  3 × [?] = 24
        //  =    =
        // 36   12
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [3, 24],
        col_results: [36, 12],
        answers: {"0_0": 12, "1_1": 8}
    },
    {
        // Q19. [2x2, 2 blanks]
        //  6 × [?] = 42
        //  ×    ×
        // [?] +  8 = 11
        //  =    =
        // 18   56
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 8, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [42, 11],
        col_results: [18, 56],
        answers: {"0_1": 7, "1_0": 3}
    },
    {
        // Q20. [2x2, 2 blanks]
        // [?] ×  5 = 50
        //  ×    +
        //  2 × [?] = 12
        //  =    =
        // 20   11
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 2, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [50, 12],
        col_results: [20, 11],
        answers: {"0_0": 10, "1_1": 6}
    }
];
