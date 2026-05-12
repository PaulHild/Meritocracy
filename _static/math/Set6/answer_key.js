// Math Grid Questions Set 6 — answer key
// grid: row-major array. blank:true cells need user input.
// row_ops[r][i]: operator between col i and col i+1 in row r
// col_ops[c][i]: operator between row i and row i+1 in col c
// answers: {"row_col": value} using 0-based indices
const MATH_QUESTIONS = [
    {
        // Q1. [2x2, 2 blanks]
        //  8 + [?] = 14
        //  ×    +
        // [?] +  5 = 11
        //  =    =
        // 48   11
        rows: 2, cols: 2,
        grid: [
            [{value: 8, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [14, 11],
        col_results: [48, 11],
        answers: {"0_1": 6, "1_0": 6}
    },
    {
        // Q2. [2x2, 2 blanks]
        // [?] - 8 = 4
        //  +    +
        //  5 + [?] = 14
        //  =    =
        // 17   13
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 8, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [4, 14],
        col_results: [17, 17],
        answers: {"0_0": 12, "1_1": 9}
    },
    {
        // Q3. [2x2, 2 blanks]
        //  5 × [?] = 30
        //  +    -
        //  7 × [?] = 21
        //  =    =
        // 12    3
        rows: 2, cols: 2,
        grid: [
            [{value: 5, blank: false}, {value: null, blank: true}],
            [{value: 7, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [30, 21],
        col_results: [12, 3],
        answers: {"0_1": 6, "1_1": 3}
    },
    {
        // Q4. [2x2, 2 blanks]
        // [?] + [?] = 14
        //  -    +
        //  6 +  3 = 9
        //  =    =
        //  5   16
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: null, blank: true}],
            [{value: 6, blank: false}, {value: 3, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['-'], ['+']],
        row_results: [14, 9],
        col_results: [5, 6],
        answers: {"0_0": 11, "0_1": 3}
    },
    {
        // Q5. [2x2, 2 blanks]
        // [?] +  4 = 13
        //  ×    +
        //  3 + [?] = 10
        //  =    =
        // 27   11
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [13, 10],
        col_results: [27, 11],
        answers: {"0_0": 9, "1_1": 7}
    },
    {
        // Q6. [2x2, 2 blanks]
        // 16 - [?] = 9
        //  +    ×
        // [?] +  2 = 9
        //  =    =
        // 23   14
        rows: 2, cols: 2,
        grid: [
            [{value: 16, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 2, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [9, 9],
        col_results: [23, 14],
        answers: {"0_1": 7, "1_0": 7}
    },
    {
        // Q7. [2x2, 2 blanks]
        // [?] ×  4 = 32
        //  +    -
        //  6 × [?] = 18
        //  =    =
        // 14    6
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 6, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [32, 18],
        col_results: [14, 1],
        answers: {"0_0": 8, "1_1": 3}
    },
    {
        // Q8. [2x2, 2 blanks]
        // 12 + [?] = 20
        //  ×    ×
        // [?] +  5 = 11
        //  =    =
        // 72   48
        rows: 2, cols: 2,
        grid: [
            [{value: 12, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [20, 11],
        col_results: [72, 40],
        answers: {"0_1": 8, "1_0": 6}
    },
    {
        // Q9. [2x2, 2 blanks]
        //  9 + [?] = 20
        //  +    +
        // [?] +  6 = 13
        //  =    =
        // 16   17
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [20, 13],
        col_results: [16, 17],
        answers: {"0_1": 11, "1_0": 7}
    },
    {
        // Q10. [2x2, 2 blanks]
        // [?] + 16 = 21
        //  +    +
        //  9 + [?] = 21
        //  =    =
        // 14   28
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 16, blank: false}],
            [{value: 9, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [21, 21],
        col_results: [14, 28],
        answers: {"0_0": 5, "1_1": 12}
    },
    {
        // Q11. [2x2, 2 blanks]
        // 19 - [?] = 7
        //  +    +
        // [?] +  6 = 14
        //  =    =
        // 27   18
        rows: 2, cols: 2,
        grid: [
            [{value: 19, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [7, 14],
        col_results: [27, 18],
        answers: {"0_1": 12, "1_0": 8}
    },
    {
        // Q12. [2x2, 2 blanks]
        //  4 × [?] = 32
        //  +    +
        // [?] +  7 = 23
        //  =    =
        // 20   15
        rows: 2, cols: 2,
        grid: [
            [{value: 4, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [32, 23],
        col_results: [20, 15],
        answers: {"0_1": 8, "1_0": 16}
    },
    {
        // Q13. [2x2, 2 blanks]
        //  9 × [?] = 36
        //  +    ×
        // [?] +  6 = 13
        //  =    =
        // 16   24
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [36, 13],
        col_results: [16, 24],
        answers: {"0_1": 4, "1_0": 7}
    },
    {
        // Q14. [2x2, 2 blanks]
        // [?] +  5 = 16
        //  ×    +
        //  3 × [?] = 24
        //  =    =
        // 33   13
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [16, 24],
        col_results: [33, 13],
        answers: {"0_0": 11, "1_1": 8}
    },
    {
        // Q15. [2x2, 2 blanks]
        // 10 × [?] = 30
        //  -    ×
        // [?] +  4 = 11
        //  =    =
        //  3   12
        rows: 2, cols: 2,
        grid: [
            [{value: 10, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [30, 11],
        col_results: [3, 12],
        answers: {"0_1": 3, "1_0": 7}
    },
    {
        // Q16. [2x2, 2 blanks]
        // [?] ×  9 = 63
        //  +    +
        //  4 + [?] = 15
        //  =    =
        // 11   20
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 9, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [63, 15],
        col_results: [11, 20],
        answers: {"0_0": 7, "1_1": 11}
    },
    {
        // Q17. [2x2, 2 blanks]
        //  4 × [?] = 36
        //  +    +
        // [?] ×  6 = 12
        //  =    =
        //  6   15
        rows: 2, cols: 2,
        grid: [
            [{value: 4, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [36, 12],
        col_results: [6, 15],
        answers: {"0_1": 9, "1_0": 2}
    },
    {
        // Q18. [2x2, 2 blanks]
        // [?] :  5 =  2
        //  +    ×
        //  4 × [?] = 24
        //  =    =
        // 14   30
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['+'], ['*']],
        row_results: [2, 24],
        col_results: [14, 30],
        answers: {"0_0": 10, "1_1": 6}
    },
    {
        // Q19. [2x2, 2 blanks]
        //  7 × [?] = 63
        //  ×    ×
        // [?] +  5 = 9
        //  =    =
        // 28   45
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [63, 9],
        col_results: [28, 45],
        answers: {"0_1": 9, "1_0": 4}
    },
    {
        // Q20. [2x2, 2 blanks]
        // [?] ×  9 = 54
        //  ×    +
        //  2 × [?] = 16
        //  =    =
        // 12   17
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 9, blank: false}],
            [{value: 2, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [54, 16],
        col_results: [12, 17],
        answers: {"0_0": 6, "1_1": 8}
    }
];
