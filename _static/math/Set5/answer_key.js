// Math Grid Questions Set 5 — answer key
// grid: row-major array. blank:true cells need user input.
// row_ops[r][i]: operator between col i and col i+1 in row r
// col_ops[c][i]: operator between row i and row i+1 in col c
// answers: {"row_col": value} using 0-based indices
const MATH_QUESTIONS = [
    {
        // Q1. [2x2, 2 blanks]
        //  7 + [?] = 12
        //  ×    +
        // [?] +  4 = 9
        //  =    =
        // 35   13
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [12, 9],
        col_results: [35, 9],
        answers: {"0_1": 5, "1_0": 5}
    },
    {
        // Q2. [2x2, 2 blanks]
        // [?] - 7 = 5
        //  +    +
        //  4 + [?] = 10
        //  =    =
        // 16   11
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 7, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [5, 10],
        col_results: [16, 13],
        answers: {"0_0": 12, "1_1": 6}
    },
    {
        // Q3. [2x2, 2 blanks]
        //  3 × [?] = 18
        //  +    -
        //  9 × [?] = 27
        //  =    =
        // 12    0
        rows: 2, cols: 2,
        grid: [
            [{value: 3, blank: false}, {value: null, blank: true}],
            [{value: 9, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [18, 27],
        col_results: [12, 3],
        answers: {"0_1": 6, "1_1": 3}
    },
    {
        // Q4. [2x2, 2 blanks]
        // [?] + [?] = 11
        //  -    +
        //  5 +  2 = 7
        //  =    =
        //  4   10
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: null, blank: true}],
            [{value: 5, blank: false}, {value: 2, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['-'], ['+']],
        row_results: [11, 7],
        col_results: [4, 4],
        answers: {"0_0": 9, "0_1": 2}
    },
    {
        // Q5. [2x2, 2 blanks]
        // [?] +  5 = 13
        //  ×    +
        //  2 + [?] = 11
        //  =    =
        // 16   14
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 2, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [13, 11],
        col_results: [16, 14],
        answers: {"0_0": 8, "1_1": 9}
    },
    {
        // Q6. [2x2, 2 blanks]
        // 14 - [?] = 8
        //  +    ×
        // [?] +  3 = 9
        //  =    =
        // 20   18
        rows: 2, cols: 2,
        grid: [
            [{value: 14, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [8, 9],
        col_results: [20, 18],
        answers: {"0_1": 6, "1_0": 6}
    },
    {
        // Q7. [2x2, 2 blanks]
        // [?] ×  6 = 24
        //  +    -
        //  5 × [?] = 10
        //  =    =
        //  9    4
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [24, 10],
        col_results: [9, 4],
        answers: {"0_0": 4, "1_1": 2}
    },
    {
        // Q8. [2x2, 2 blanks]
        // 11 + [?] = 18
        //  ×    ×
        // [?] +  4 = 11
        //  =    =
        // 77   77
        rows: 2, cols: 2,
        grid: [
            [{value: 11, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [18, 11],
        col_results: [77, 28],
        answers: {"0_1": 7, "1_0": 7}
    },
    {
        // Q9. [2x2, 2 blanks]
        // 14 + [?] = 22
        //  +    +
        // [?] + 11 = 17
        //  =    =
        // 20   19
        rows: 2, cols: 2,
        grid: [
            [{value: 14, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 11, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [22, 17],
        col_results: [20, 19],
        answers: {"0_1": 8, "1_0": 6}
    },
    {
        // Q10. [2x2, 2 blanks]
        // [?] +  9 = 20
        //  +    +
        //  7 + [?] = 20
        //  =    =
        // 18   22
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 9, blank: false}],
            [{value: 7, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [20, 20],
        col_results: [18, 22],
        answers: {"0_0": 11, "1_1": 13}
    },
    {
        // Q11. [2x2, 2 blanks]
        // 24 - [?] = 14
        //  +    +
        // [?] +  7 = 18
        //  =    =
        // 35   17
        rows: 2, cols: 2,
        grid: [
            [{value: 24, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [14, 18],
        col_results: [35, 17],
        answers: {"0_1": 10, "1_0": 11}
    },
    {
        // Q12. [2x2, 2 blanks]
        //  5 × [?] = 35
        //  +    +
        // [?] +  8 = 23
        //  =    =
        // 20   15
        rows: 2, cols: 2,
        grid: [
            [{value: 5, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 8, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [35, 23],
        col_results: [20, 15],
        answers: {"0_1": 7, "1_0": 15}
    },
    {
        // Q13. [2x2, 2 blanks]
        //  8 × [?] = 40
        //  +    ×
        // [?] +  7 = 11
        //  =    =
        // 12   35
        rows: 2, cols: 2,
        grid: [
            [{value: 8, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [40, 11],
        col_results: [12, 35],
        answers: {"0_1": 5, "1_0": 4}
    },
    {
        // Q14. [2x2, 2 blanks]
        // [?] +  7 = 13
        //  ×    +
        //  3 × [?] = 27
        //  =    =
        // 18   16
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 7, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [13, 27],
        col_results: [18, 16],
        answers: {"0_0": 6, "1_1": 9}
    },
    {
        // Q15. [2x2, 2 blanks]
        //  9 × [?] = 36
        //  -    ×
        // [?] +  5 = 11
        //  =    =
        //  3   20
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [36, 11],
        col_results: [3, 20],
        answers: {"0_1": 4, "1_0": 6}
    },
    {
        // Q16. [2x2, 2 blanks]
        // [?] ×  4 = 44
        //  +    +
        //  7 + [?] = 15
        //  =    =
        // 18   12
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 7, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [44, 15],
        col_results: [18, 12],
        answers: {"0_0": 11, "1_1": 8}
    },
    {
        // Q17. [2x2, 2 blanks]
        //  9 × [?] = 36
        //  +    +
        // [?] ×  3 = 18
        //  =    =
        // 15    7
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [36, 18],
        col_results: [15, 7],
        answers: {"0_1": 4, "1_0": 6}
    },
    {
        // Q18. [2x2, 2 blanks]
        // [?] :  4 =  3
        //  +    ×
        //  6 × [?] = 54
        //  =    =
        // 18   36
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 6, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['+'], ['*']],
        row_results: [3, 54],
        col_results: [18, 36],
        answers: {"0_0": 12, "1_1": 9}
    },
    {
        // Q19. [2x2, 2 blanks]
        // 10 × [?] = 40
        //  ×    ×
        // [?] +  7 = 12
        //  =    =
        // 50   28
        rows: 2, cols: 2,
        grid: [
            [{value: 10, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [40, 12],
        col_results: [50, 28],
        answers: {"0_1": 4, "1_0": 5}
    },
    {
        // Q20. [2x2, 2 blanks]
        // [?] ×  8 = 56
        //  ×    +
        //  4 × [?] = 24
        //  =    =
        // 28   14
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 8, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [56, 24],
        col_results: [28, 14],
        answers: {"0_0": 7, "1_1": 6}
    }
];
