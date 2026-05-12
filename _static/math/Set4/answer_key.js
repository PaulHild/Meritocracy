// Math Grid Questions Set 4 — answer key
// grid: row-major array. blank:true cells need user input.
// row_ops[r][i]: operator between col i and col i+1 in row r
// col_ops[c][i]: operator between row i and row i+1 in col c
// answers: {"row_col": value} using 0-based indices
const MATH_QUESTIONS = [
    {
        // Q1. [2x2, 2 blanks]
        //  5 + [?] = 11
        //  ×    +
        // [?] +  6 = 14
        //  =    =
        // 30   14
        rows: 2, cols: 2,
        grid: [
            [{value: 5, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [11, 12],
        col_results: [30, 12],
        answers: {"0_1": 6, "1_0": 6}
    },
    {
        // Q2. [2x2, 2 blanks]
        // [?] - 6 = 9
        //  +    +
        //  7 + [?] = 11
        //  =    =
        // 22   13
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 7, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [9, 11],
        col_results: [22, 10],
        answers: {"0_0": 15, "1_1": 4}
    },
    {
        // Q3. [2x2, 2 blanks]
        //  3 × [?] = 21
        //  +    -
        //  8 × [?] = 16
        //  =    =
        // 11    5
        rows: 2, cols: 2,
        grid: [
            [{value: 3, blank: false}, {value: null, blank: true}],
            [{value: 8, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [21, 16],
        col_results: [11, 5],
        answers: {"0_1": 7, "1_1": 2}
    },
    {
        // Q4. [2x2, 2 blanks]
        // [?] + [?] = 9
        //  -    +
        //  2 +  5 = 7
        //  =    =
        //  2   12
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: null, blank: true}],
            [{value: 2, blank: false}, {value: 5, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['-'], ['+']],
        row_results: [9, 7],
        col_results: [2, 10],
        answers: {"0_0": 4, "0_1": 5}
    },
    {
        // Q5. [2x2, 2 blanks]
        // [?] +  9 = 16
        //  ×    +
        //  4 + [?] = 13
        //  =    =
        // 28   22
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 9, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [16, 13],
        col_results: [28, 18],
        answers: {"0_0": 7, "1_1": 9}
    },
    {
        // Q6. [2x2, 2 blanks]
        // 15 - [?] = 9
        //  +    ×
        // [?] +  4 = 10
        //  =    =
        // 21   24
        rows: 2, cols: 2,
        grid: [
            [{value: 15, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [9, 10],
        col_results: [21, 24],
        answers: {"0_1": 6, "1_0": 6}
    },
    {
        // Q7. [2x2, 2 blanks]
        // [?] ×  5 = 25
        //  +    -
        //  6 × [?] = 12
        //  =    =
        // 11    3
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 6, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [25, 12],
        col_results: [11, 3],
        answers: {"0_0": 5, "1_1": 2}
    },
    {
        // Q8. [2x2, 2 blanks]
        //  9 + [?] = 18
        //  ×    ×
        // [?] +  3 = 8
        //  =    =
        // 45   45
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [18, 8],
        col_results: [45, 27],
        answers: {"0_1": 9, "1_0": 5}
    },
    {
        // Q9. [2x2, 2 blanks]
        // 13 + [?] = 22
        //  +    +
        // [?] +  6 = 13
        //  =    =
        // 20   15
        rows: 2, cols: 2,
        grid: [
            [{value: 13, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [22, 13],
        col_results: [20, 15],
        answers: {"0_1": 9, "1_0": 7}
    },
    {
        // Q10. [2x2, 2 blanks]
        // [?] + 12 = 18
        //  +    +
        //  8 + [?] = 18
        //  =    =
        // 14   22
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 12, blank: false}],
            [{value: 8, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [18, 18],
        col_results: [14, 22],
        answers: {"0_0": 6, "1_1": 10}
    },
    {
        // Q11. [2x2, 2 blanks]
        // 25 - [?] = 14
        //  +    +
        // [?] +  6 = 16
        //  =    =
        // 35   17
        rows: 2, cols: 2,
        grid: [
            [{value: 25, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [14, 16],
        col_results: [35, 17],
        answers: {"0_1": 11, "1_0": 10}
    },
    {
        // Q12. [2x2, 2 blanks]
        //  9 × [?] = 54
        //  +    +
        // [?] +  7 = 18
        //  =    =
        // 20   13
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [54, 18],
        col_results: [20, 13],
        answers: {"0_1": 6, "1_0": 11}
    },
    {
        // Q13. [2x2, 2 blanks]
        //  7 × [?] = 42
        //  +    ×
        // [?] +  4 = 9
        //  =    =
        // 12   24
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [42, 9],
        col_results: [12, 24],
        answers: {"0_1": 6, "1_0": 5}
    },
    {
        // Q14. [2x2, 2 blanks]
        // [?] +  6 = 16
        //  ×    +
        //  4 × [?] = 32
        //  =    =
        // 40   14
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [16, 32],
        col_results: [40, 14],
        answers: {"0_0": 10, "1_1": 8}
    },
    {
        // Q15. [2x2, 2 blanks]
        //  6 × [?] = 42
        //  -    ×
        // [?] +  9 = 12
        //  =    =
        //  3   63
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 9, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [42, 12],
        col_results: [3, 63],
        answers: {"0_1": 7, "1_0": 3}
    },
    {
        // Q16. [2x2, 2 blanks]
        // [?] ×  7 = 56
        //  +    +
        //  5 + [?] = 14
        //  =    =
        // 13   16
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 7, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [56, 14],
        col_results: [13, 16],
        answers: {"0_0": 8, "1_1": 9}
    },
    {
        // Q17. [2x2, 2 blanks]
        //  8 × [?] = 56
        //  +    +
        // [?] ×  5 = 15
        //  =    =
        // 11   12
        rows: 2, cols: 2,
        grid: [
            [{value: 8, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [56, 15],
        col_results: [11, 12],
        answers: {"0_1": 7, "1_0": 3}
    },
    {
        // Q18. [2x2, 2 blanks]
        // [?] :  4 =  4
        //  +    +
        //  4 × [?] = 28
        //  =    =
        // 20   11
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [4, 28],
        col_results: [20, 11],
        answers: {"0_0": 16, "1_1": 7}
    },
    {
        // Q19. [2x2, 2 blanks]
        //  7 × [?] = 56
        //  ×    ×
        // [?] +  6 = 11
        //  =    =
        // 35   48
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [56, 11],
        col_results: [35, 48],
        answers: {"0_1": 8, "1_0": 5}
    },
    {
        // Q20. [2x2, 2 blanks]
        // [?] ×  5 = 45
        //  ×    +
        //  3 × [?] = 21
        //  =    =
        // 27   12
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [45, 21],
        col_results: [27, 12],
        answers: {"0_0": 9, "1_1": 7}
    }
];
