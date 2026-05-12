// Math Grid Questions Set 8 — answer key
// grid: row-major array. blank:true cells need user input.
// row_ops[r][i]: operator between col i and col i+1 in row r
// col_ops[c][i]: operator between row i and row i+1 in col c
// answers: {"row_col": value} using 0-based indices
const MATH_QUESTIONS = [
    {
        // Q1. [2x2, 2 blanks]
        //  8 -  6 = 2
        //  :    ×
        // [?] + [?] = 10
        //  =    =
        //  1   12
        rows: 2, cols: 2,
        grid: [
            [{value: 8, blank: false}, {value: 6, blank: false}],
            [{value: null, blank: true}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['/'], ['*']],
        row_results: [2, 10],
        col_results: [1, 12],
        answers: {"1_0": 8, "1_1": 2}
    },
    {
        // Q2. [2x2, 2 blanks]
        // 14 + [?] = 19
        //  +    +
        // [?] +  2 = 3
        //  =    =
        // 15    7
        rows: 2, cols: 2,
        grid: [
            [{value: 14, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 2, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [19, 3],
        col_results: [15, 7],
        answers: {"0_1": 5, "1_0": 1}
    },
    {
        // Q3. [2x2, 2 blanks]
        // 20 : [?] = 10
        //  +    +
        // 20 : [?] = 4
        //  =    =
        // 40    7
        rows: 2, cols: 2,
        grid: [
            [{value: 20, blank: false}, {value: null, blank: true}],
            [{value: 20, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['/']],
        col_ops: [['+'], ['+']],
        row_results: [10, 4],
        col_results: [40, 7],
        answers: {"0_1": 2, "1_1": 5}
    },
    {
        // Q4. [2x2, 2 blanks]
        //  0 + [?] = 11
        //  :    -
        // [?] -  2 = 12
        //  =    =
        //  0    9
        rows: 2, cols: 2,
        grid: [
            [{value: 0, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 2, blank: false}]
        ],
        row_ops: [['+'], ['-']],
        col_ops: [['/'], ['-']],
        row_results: [11, 12],
        col_results: [0, 9],
        answers: {"0_1": 11, "1_0": 14}
    },
    {
        // Q5. [2x2, 2 blanks]
        // [?] +  3 = 21
        //  +    ×
        //  4 × [?] = 40
        //  =    =
        // 22   30
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 3, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['+'], ['*']],
        row_results: [21, 40],
        col_results: [22, 30],
        answers: {"0_0": 18, "1_1": 10}
    },
    {
        // Q6. [2x2, 2 blanks]
        //  6 + 19 = 25
        //  -    +
        // [?] + [?] = 5
        //  =    =
        //  5   23
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: 19, blank: false}],
            [{value: null, blank: true}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['-'], ['+']],
        row_results: [25, 5],
        col_results: [5, 23],
        answers: {"1_0": 1, "1_1": 4}
    },
    {
        // Q7. [2x2, 2 blanks]
        // [?] ×  6 = 42
        //  +    :
        // [?] ×  1 = 9
        //  =    =
        // 16    6
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: null, blank: true}, {value: 1, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['/']],
        row_results: [42, 9],
        col_results: [16, 6],
        answers: {"0_0": 7, "1_0": 9}
    },
    {
        // Q8. [2x2, 2 blanks]
        // [?] × 15 = 30
        //  +    :
        // [?] -  1 = 12
        //  =    =
        // 15   15
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 15, blank: false}],
            [{value: null, blank: true}, {value: 1, blank: false}]
        ],
        row_ops: [['*'], ['-']],
        col_ops: [['+'], ['/']],
        row_results: [30, 12],
        col_results: [15, 15],
        answers: {"0_0": 2, "1_0": 13}
    },
    {
        // Q9. [2x2, 2 blanks]
        //  7 + [?] = 20
        //  +    +
        // [?] +  4 = 12
        //  =    =
        // 15   17
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [20, 12],
        col_results: [15, 17],
        answers: {"0_1": 13, "1_0": 8}
    },
    {
        // Q10. [2x2, 2 blanks]
        // [?] +  7 = 17
        //  +    +
        //  9 + [?] = 24
        //  =    =
        // 19   22
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 7, blank: false}],
            [{value: 9, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [17, 24],
        col_results: [19, 22],
        answers: {"0_0": 10, "1_1": 15}
    },
    {
        // Q11. [2x2, 2 blanks]
        // 23 - [?] = 9
        //  +    +
        // [?] +  5 = 14
        //  =    =
        // 32   19
        rows: 2, cols: 2,
        grid: [
            [{value: 23, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [9, 14],
        col_results: [32, 19],
        answers: {"0_1": 14, "1_0": 9}
    },
    {
        // Q12. [2x2, 2 blanks]
        //  6 × [?] = 30
        //  +    +
        // [?] +  8 = 20
        //  =    =
        // 18   13
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 8, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [30, 20],
        col_results: [18, 13],
        answers: {"0_1": 5, "1_0": 12}
    },
    {
        // Q13. [2x2, 2 blanks]
        // 10 × [?] = 30
        //  +    ×
        // [?] +  5 = 13
        //  =    =
        // 18   15
        rows: 2, cols: 2,
        grid: [
            [{value: 10, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [30, 13],
        col_results: [18, 15],
        answers: {"0_1": 3, "1_0": 8}
    },
    {
        // Q14. [2x2, 2 blanks]
        // [?] +  6 = 13
        //  ×    +
        //  5 × [?] = 45
        //  =    =
        // 35   15
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [13, 45],
        col_results: [35, 15],
        answers: {"0_0": 7, "1_1": 9}
    },
    {
        // Q15. [2x2, 2 blanks]
        // 12 × [?] = 48
        //  -    ×
        // [?] +  6 = 15
        //  =    =
        //  3   24
        rows: 2, cols: 2,
        grid: [
            [{value: 12, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [48, 15],
        col_results: [3, 24],
        answers: {"0_1": 4, "1_0": 9}
    },
    {
        // Q16. [2x2, 2 blanks]
        // [?] × 11 = 55
        //  +    +
        //  3 + [?] = 10
        //  =    =
        //  8   18
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 11, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [55, 10],
        col_results: [8, 18],
        answers: {"0_0": 5, "1_1": 7}
    },
    {
        // Q17. [2x2, 2 blanks]
        // 12 × [?] = 24
        //  +    +
        // [?] ×  5 = 30
        //  =    =
        // 18    7
        rows: 2, cols: 2,
        grid: [
            [{value: 12, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [24, 30],
        col_results: [18, 7],
        answers: {"0_1": 2, "1_0": 6}
    },
    {
        // Q18. [2x2, 2 blanks]
        // [?] :  3 =  2
        //  +    ×
        //  5 × [?] = 40
        //  =    =
        // 11   24
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 3, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['+'], ['*']],
        row_results: [2, 40],
        col_results: [11, 24],
        answers: {"0_0": 6, "1_1": 8}
    },
    {
        // Q19. [2x2, 2 blanks]
        //  6 × [?] = 48
        //  ×    ×
        // [?] +  4 = 9
        //  =    =
        // 30   32
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [48, 9],
        col_results: [30, 32],
        answers: {"0_1": 8, "1_0": 5}
    },
    {
        // Q20. [2x2, 2 blanks]
        // [?] ×  6 = 42
        //  ×    +
        //  3 × [?] = 27
        //  =    =
        // 21   15
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [42, 27],
        col_results: [21, 15],
        answers: {"0_0": 7, "1_1": 9}
    }
];
