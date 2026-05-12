// Math Grid Questions Set 11 — answer key
// grid: row-major array. blank:true cells need user input.
// row_ops[r][i]: operator between col i and col i+1 in row r
// col_ops[c][i]: operator between row i and row i+1 in col c
// answers: {"row_col": value} using 0-based indices
const MATH_QUESTIONS = [
    {
        // Q1. [2x2, 2 blanks]
        //  6 + [?] = 10
        //  ×    +
        // [?] +  3 = 8
        //  =    =
        // 30   10
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [10, 8],
        col_results: [30, 7],
        answers: {"0_1": 4, "1_0": 5}
    },
    {
        // Q2. [2x2, 2 blanks]
        // [?] - 9 = 5
        //  +    +
        //  7 + [?] = 16
        //  =    =
        // 21   14
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 9, blank: false}],
            [{value: 7, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [5, 16],
        col_results: [21, 18],
        answers: {"0_0": 14, "1_1": 9}
    },
    {
        // Q3. [2x2, 2 blanks]
        //  7 × [?] = 42
        //  +    -
        //  4 × [?] = 12
        //  =    =
        // 11    3
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [42, 12],
        col_results: [11, 3],
        answers: {"0_1": 6, "1_1": 3}
    },
    {
        // Q4. [2x2, 2 blanks]
        // [?] + [?] = 13
        //  -    +
        //  3 +  6 = 9
        //  =    =
        //  4   16
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: null, blank: true}],
            [{value: 3, blank: false}, {value: 6, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['-'], ['+']],
        row_results: [13, 9],
        col_results: [4, 12],
        answers: {"0_0": 7, "0_1": 6}
    },
    {
        // Q5. [2x2, 2 blanks]
        // [?] +  6 = 14
        //  ×    +
        //  4 + [?] = 12
        //  =    =
        // 32   14
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [14, 12],
        col_results: [32, 14],
        answers: {"0_0": 8, "1_1": 8}
    },
    {
        // Q6. [2x2, 2 blanks]
        // 18 - [?] = 11
        //  +    ×
        // [?] +  2 = 6
        //  =    =
        // 22   14
        rows: 2, cols: 2,
        grid: [
            [{value: 18, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 2, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [11, 6],
        col_results: [22, 14],
        answers: {"0_1": 7, "1_0": 4}
    },
    {
        // Q7. [2x2, 2 blanks]
        // [?] ×  3 = 24
        //  +    -
        //  5 × [?] = 20
        //  =    =
        // 13    1
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 3, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [24, 20],
        col_results: [13, -1],
        answers: {"0_0": 8, "1_1": 4}
    },
    {
        // Q8. [2x2, 2 blanks]
        // 10 + [?] = 17
        //  ×    ×
        // [?] +  4 = 10
        //  =    =
        // 60   42
        rows: 2, cols: 2,
        grid: [
            [{value: 10, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [17, 10],
        col_results: [60, 28],
        answers: {"0_1": 7, "1_0": 6}
    },
    {
        // Q9. [2x2, 2 blanks]
        // 15 + [?] = 24
        //  +    +
        // [?] + 11 = 19
        //  =    =
        // 23   20
        rows: 2, cols: 2,
        grid: [
            [{value: 15, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 11, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [24, 19],
        col_results: [23, 20],
        answers: {"0_1": 9, "1_0": 8}
    },
    {
        // Q10. [2x2, 2 blanks]
        // [?] + 17 = 24
        //  +    +
        // 12 + [?] = 18
        //  =    =
        // 19   23
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 17, blank: false}],
            [{value: 12, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [24, 18],
        col_results: [19, 23],
        answers: {"0_0": 7, "1_1": 6}
    },
    {
        // Q11. [2x2, 2 blanks]
        // 28 - [?] = 13
        //  +    +
        // [?] +  7 = 18
        //  =    =
        // 39   22
        rows: 2, cols: 2,
        grid: [
            [{value: 28, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [13, 18],
        col_results: [39, 22],
        answers: {"0_1": 15, "1_0": 11}
    },
    {
        // Q12. [2x2, 2 blanks]
        //  5 × [?] = 40
        //  +    +
        // [?] +  7 = 22
        //  =    =
        // 20   15
        rows: 2, cols: 2,
        grid: [
            [{value: 5, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [40, 22],
        col_results: [20, 15],
        answers: {"0_1": 8, "1_0": 15}
    },
    {
        // Q13. [2x2, 2 blanks]
        //  7 × [?] = 35
        //  +    ×
        // [?] +  6 = 15
        //  =    =
        // 16   30
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [35, 15],
        col_results: [16, 30],
        answers: {"0_1": 5, "1_0": 9}
    },
    {
        // Q14. [2x2, 2 blanks]
        // [?] +  4 = 10
        //  ×    +
        //  7 × [?] = 56
        //  =    =
        // 42   12
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 7, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [10, 56],
        col_results: [42, 12],
        answers: {"0_0": 6, "1_1": 8}
    },
    {
        // Q15. [2x2, 2 blanks]
        //  5 × [?] = 45
        //  -    ×
        // [?] +  7 = 10
        //  =    =
        //  2   63
        rows: 2, cols: 2,
        grid: [
            [{value: 5, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [45, 10],
        col_results: [2, 63],
        answers: {"0_1": 9, "1_0": 3}
    },
    {
        // Q16. [2x2, 2 blanks]
        // [?] × 14 = 28
        //  +    +
        //  8 + [?] = 14
        //  =    =
        // 10   20
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 14, blank: false}],
            [{value: 8, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [28, 14],
        col_results: [10, 20],
        answers: {"0_0": 2, "1_1": 6}
    },
    {
        // Q17. [2x2, 2 blanks]
        //  7 × [?] = 56
        //  +    +
        // [?] ×  3 = 15
        //  =    =
        // 12   11
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [56, 15],
        col_results: [12, 11],
        answers: {"0_1": 8, "1_0": 5}
    },
    {
        // Q18. [2x2, 2 blanks]
        // [?] :  6 =  2
        //  +    ×
        //  4 × [?] = 36
        //  =    =
        // 16   54
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['+'], ['*']],
        row_results: [2, 36],
        col_results: [16, 54],
        answers: {"0_0": 12, "1_1": 9}
    },
    {
        // Q19. [2x2, 2 blanks]
        //  8 × [?] = 24
        //  ×    ×
        // [?] +  9 = 15
        //  =    =
        // 48   27
        rows: 2, cols: 2,
        grid: [
            [{value: 8, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 9, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [24, 15],
        col_results: [48, 27],
        answers: {"0_1": 3, "1_0": 6}
    },
    {
        // Q20. [2x2, 2 blanks]
        // [?] ×  8 = 48
        //  ×    +
        //  9 × [?] = 45
        //  =    =
        // 54   13
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 8, blank: false}],
            [{value: 9, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [48, 45],
        col_results: [54, 13],
        answers: {"0_0": 6, "1_1": 5}
    }
];
