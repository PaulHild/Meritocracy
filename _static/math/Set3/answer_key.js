// Math Grid Questions Set 3 — answer key
// grid: row-major array. blank:true cells need user input.
// row_ops[r][i]: operator between col i and col i+1 in row r
// col_ops[c][i]: operator between row i and row i+1 in col c
// answers: {"row_col": value} using 0-based indices
const MATH_QUESTIONS = [
    {
        // Q1. [2x2, 2 blanks]
        //  2 + [?] = 9
        //  ×    +
        // [?] +  7 = 13
        //  =    =
        // 12   13
        rows: 2, cols: 2,
        grid: [
            [{value: 2, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [9, 13],
        col_results: [12, 14],
        answers: {"0_1": 7, "1_0": 6}
    },
    {
        // Q2. [2x2, 2 blanks]
        // [?] - 5 = 8
        //  +    +
        //  9 + [?] = 15
        //  =    =
        // 22   11
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 9, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [8, 15],
        col_results: [22, 11],
        answers: {"0_0": 13, "1_1": 6}
    },
    {
        // Q3. [2x2, 2 blanks]
        //  4 × [?] = 24
        //  +    -
        //  6 × [?] = 18
        //  =    =
        // 10    3
        rows: 2, cols: 2,
        grid: [
            [{value: 4, blank: false}, {value: null, blank: true}],
            [{value: 6, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [24, 18],
        col_results: [10, 3],
        answers: {"0_1": 6, "1_1": 3}
    },
    {
        // Q4. [2x2, 2 blanks]
        // [?] + [?] = 12
        //  -    +
        //  4 +  3 = 7
        //  =    =
        //  3   14
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: null, blank: true}],
            [{value: 4, blank: false}, {value: 3, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['-'], ['+']],
        row_results: [12, 7],
        col_results: [3, 8],
        answers: {"0_0": 7, "0_1": 5}
    },
    {
        // Q5. [2x2, 2 blanks]
        // [?] +  8 = 17
        //  ×    +
        //  3 + [?] = 9
        //  =    =
        // 27   14
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 8, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [17, 9],
        col_results: [27, 14],
        answers: {"0_0": 9, "1_1": 6}
    },
    {
        // Q6. [2x2, 2 blanks]
        // 12 - [?] = 7
        //  +    ×
        // [?] +  2 = 8
        //  =    =
        // 18   10
        rows: 2, cols: 2,
        grid: [
            [{value: 12, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 2, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [7, 8],
        col_results: [18, 10],
        answers: {"0_1": 5, "1_0": 6}
    },
    {
        // Q7. [2x2, 2 blanks]
        // [?] ×  2 = 14
        //  +    -
        //  5 × [?] = 15
        //  =    =
        // 12    1
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 2, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [14, 15],
        col_results: [12, -1],
        answers: {"0_0": 7, "1_1": 3}
    },
    {
        // Q8. [2x2, 2 blanks]
        //  6 + [?] = 14
        //  ×    ×
        // [?] +  3 = 8
        //  =    =
        // 30   40
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [14, 8],
        col_results: [30, 24],
        answers: {"0_1": 8, "1_0": 5}
    },
    {
        // Q9. [2x2, 2 blanks]
        // 11 + [?] = 19
        //  +    +
        // [?] +  7 = 13
        //  =    =
        // 17   15
        rows: 2, cols: 2,
        grid: [
            [{value: 11, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [19, 13],
        col_results: [17, 15],
        answers: {"0_1": 8, "1_0": 6}
    },
    {
        // Q10. [2x2, 2 blanks]
        // [?] + 14 = 21
        //  +    +
        //  5 + [?] = 14
        //  =    =
        // 12   23
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 14, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [21, 14],
        col_results: [12, 23],
        answers: {"0_0": 7, "1_1": 9}
    },
    {
        // Q11. [2x2, 2 blanks]
        // 22 - [?] = 13
        //  +    +
        // [?] +  3 = 11
        //  =    =
        // 30   12
        rows: 2, cols: 2,
        grid: [
            [{value: 22, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [13, 11],
        col_results: [30, 12],
        answers: {"0_1": 9, "1_0": 8}
    },
    {
        // Q12. [2x2, 2 blanks]
        //  8 × [?] = 24
        //  +    +
        // [?] +  6 = 18
        //  =    =
        // 20    9
        rows: 2, cols: 2,
        grid: [
            [{value: 8, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [24, 18],
        col_results: [20, 9],
        answers: {"0_1": 3, "1_0": 12}
    },
    {
        // Q13. [2x2, 2 blanks]
        //  6 × [?] = 42
        //  +    ×
        // [?] +  5 = 9
        //  =    =
        // 10   35
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [42, 9],
        col_results: [10, 35],
        answers: {"0_1": 7, "1_0": 4}
    },
    {
        // Q14. [2x2, 2 blanks]
        // [?] +  5 = 12
        //  ×    +
        //  2 × [?] = 18
        //  =    =
        // 14   14
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 2, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [12, 18],
        col_results: [14, 14],
        answers: {"0_0": 7, "1_1": 9}
    },
    {
        // Q15. [2x2, 2 blanks]
        //  8 × [?] = 48
        //  -    ×
        // [?] +  7 = 11
        //  =    =
        //  4   42
        rows: 2, cols: 2,
        grid: [
            [{value: 8, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [48, 11],
        col_results: [4, 42],
        answers: {"0_1": 6, "1_0": 4}
    },
    {
        // Q16. [2x2, 2 blanks]
        // [?] ×  5 = 45
        //  +    +
        //  6 + [?] = 13
        //  =    =
        // 15   12
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 6, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [45, 13],
        col_results: [15, 12],
        answers: {"0_0": 9, "1_1": 7}
    },
    {
        // Q17. [2x2, 2 blanks]
        //  7 × [?] = 35
        //  +    +
        // [?] ×  3 = 12
        //  =    =
        // 11    8
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [35, 12],
        col_results: [11, 8],
        answers: {"0_1": 5, "1_0": 4}
    },
    {
        // Q18. [2x2, 2 blanks]
        // [?] :  6 =  3
        //  ×    +
        //  2 × [?] = 18
        //  =    =
        // 36   15
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 2, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [3, 18],
        col_results: [36, 15],
        answers: {"0_0": 18, "1_1": 9}
    },
    {
        // Q19. [2x2, 2 blanks]
        //  9 × [?] = 45
        //  ×    ×
        // [?] +  8 = 11
        //  =    =
        // 27   40
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 8, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [45, 11],
        col_results: [27, 40],
        answers: {"0_1": 5, "1_0": 3}
    },
    {
        // Q20. [2x2, 2 blanks]
        // [?] ×  6 = 48
        //  ×    +
        //  4 × [?] = 28
        //  =    =
        // 32   13
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [48, 28],
        col_results: [32, 13],
        answers: {"0_0": 8, "1_1": 7}
    }
];
