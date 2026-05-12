// Math Grid Questions Set 1 — answer key
// grid: row-major array. blank:true cells need user input.
// row_ops[r][i]: operator between col i and col i+1 in row r
// col_ops[c][i]: operator between row i and row i+1 in col c
// answers: {"row_col": value} using 0-based indices
const MATH_QUESTIONS = [
    {
        // Q1. [2x2, 2 blanks]
        //  4 + [?] = 9
        //  *    +
        // [?] +  8 = 11
        //  =    =
        // 12   13
        rows: 2, cols: 2,
        grid: [
            [{value: 4, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 8, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [9, 11],
        col_results: [12, 13],
        answers: {"0_1": 5, "1_0": 3},
        explanation: 'Use the row and column equations together to find the two missing values.'
    },
    {
        // Q2. [2x2, 2 blanks]
        // [?] -  3 = 5
        //  +    +
        //  6 + [?] = 14
        //  =    =
        // 14   11
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 3, blank: false}],
            [{value: 6, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [5, 14],
        col_results: [14, 11],
        answers: {"0_0": 8, "1_1": 8}
    },
    {
        // Q3. [2x2, 2 blanks]
        //  5 × [?] = 15
        //  +    -
        //  7 × [?] = 14
        //  =    =
        // 12    1
        rows: 2, cols: 2,
        grid: [
            [{value: 5, blank: false}, {value: null, blank: true}],
            [{value: 7, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [15, 14],
        col_results: [12, 1],
        answers: {"0_1": 3, "1_1": 2}
    },
    {
        // Q4. [2x2, 2 blanks]
        // [?] + [?] = 10
        //  -    +
        //  2 +  3 = 5
        //  =    =
        //  5   10
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: null, blank: true}],
            [{value: 2, blank: false}, {value: 3, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['-'], ['+']],
        row_results: [10, 5],
        col_results: [5, 6],
        answers: {"0_0": 7, "0_1": 3}
    },
    {
        // Q5. [2x2, 2 blanks]
        // [?] +  6 = 14
        //  ×    +
        //  3 + [?] = 10
        //  =    =
        // 24   13
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [14, 10],
        col_results: [24, 13],
        answers: {"0_0": 8, "1_1": 7}
    },
    {
        // Q6. [2x2, 2 blanks]
        //  9 - [?] = 5
        //  +    ×
        // [?] +  2 = 6
        //  =    =
        // 13    8
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 2, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [5, 6],
        col_results: [13, 8],
        answers: {"0_1": 4, "1_0": 4}
    },
    {
        // Q7. [2x2, 2 blanks]
        // [?] ×  3 = 18
        //  +    -
        //  4 × [?] = 8
        //  =    =
        // 10    1
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 3, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [18, 8],
        col_results: [10, 1],
        answers: {"0_0": 6, "1_1": 2}
    },
    {
        // Q8. [2x2, 2 blanks]
        //  8 + [?] = 13
        //  ×    ×
        // [?] +  4 = 9
        //  =    =
        // 40   20
        rows: 2, cols: 2,
        grid: [
            [{value: 8, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [13, 9],
        col_results: [40, 20],
        answers: {"0_1": 5, "1_0": 5}
    },
    {
        // Q9. [2x2, 2 blanks]
        // 12 + [?] = 19
        //  +    +
        // [?] +  9 = 14
        //  =    =
        // 17   16
        rows: 2, cols: 2,
        grid: [
            [{value: 12, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 9, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [19, 14],
        col_results: [17, 16],
        answers: {"0_1": 7, "1_0": 5}
    },
    {
        // Q10. [2x2, 2 blanks]
        // [?] + 15 = 23
        //  +    +
        //  6 + [?] = 17
        //  =    =
        // 14   26
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 15, blank: false}],
            [{value: 6, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [23, 17],
        col_results: [14, 26],
        answers: {"0_0": 8, "1_1": 11}
    },
    {
        // Q11. [2x2, 2 blanks]
        // 20 - [?] = 13
        //  +    +
        // [?] +  4 = 13
        //  =    =
        // 29   11
        rows: 2, cols: 2,
        grid: [
            [{value: 20, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [13, 13],
        col_results: [29, 11],
        answers: {"0_1": 7, "1_0": 9}
    },
    {
        // Q12. [2x2, 2 blanks]
        //  6 × [?] = 24
        //  +    +
        // [?] +  5 = 19
        //  =    =
        // 20    9
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [24, 19],
        col_results: [20, 9],
        answers: {"0_1": 4, "1_0": 14}
    },
    {
        // Q13. [2x2, 2 blanks]
        //  5 × [?] = 40
        //  +    ×
        // [?] +  6 = 9
        //  =    =
        //  8   48
        rows: 2, cols: 2,
        grid: [
            [{value: 5, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [40, 9],
        col_results: [8, 48],
        answers: {"0_1": 8, "1_0": 3}
    },
    {
        // Q14. [2x2, 2 blanks]
        // [?] +  4 = 13
        //  ×    +
        //  3 × [?] = 18
        //  =    =
        // 27   10
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [13, 18],
        col_results: [27, 10],
        answers: {"0_0": 9, "1_1": 6}
    },
    {
        // Q15. [2x2, 2 blanks]
        //  7 × [?] = 35
        //  -    ×
        // [?] +  8 = 10
        //  =    =
        //  5   40
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 8, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [35, 10],
        col_results: [5, 40],
        answers: {"0_1": 5, "1_0": 2}
    },
    {
        // Q16. [2x2, 2 blanks]
        // [?] ×  3 = 36
        //  +    +
        //  4 + [?] = 13
        //  =    =
        // 16   12
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 3, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [36, 13],
        col_results: [16, 12],
        answers: {"0_0": 12, "1_1": 9}
    },
    {
        // Q17. [2x2, 2 blanks]
        //  6 × [?] = 24
        //  +    +
        // [?] ×  7 = 14
        //  =    =
        //  8   11
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [24, 14],
        col_results: [8, 11],
        answers: {"0_1": 4, "1_0": 2}
    },
    {
        // Q18. [2x2, 2 blanks]
        // [?] :  5 =  3
        //  ×    +
        //  3 × [?] = 30
        //  =    =
        // 45   15
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [3, 30],
        col_results: [45, 15],
        answers: {"0_0": 15, "1_1": 10}
    },
    {
        // Q19. [2x2, 2 blanks]
        //  8 × [?] = 48
        //  ×    ×
        // [?] +  9 = 13
        //  =    =
        // 32   54
        rows: 2, cols: 2,
        grid: [
            [{value: 8, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 9, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [48, 13],
        col_results: [32, 54],
        answers: {"0_1": 6, "1_0": 4}
    },
    {
        // Q20. [2x2, 2 blanks]
        // [?] ×  4 = 48
        //  ×    +
        //  3 × [?] = 24
        //  =    =
        // 36   12
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [48, 24],
        col_results: [36, 12],
        answers: {"0_0": 12, "1_1": 8}
    }
];
