// Math Grid Questions Set 12 — answer key
// grid: row-major array. blank:true cells need user input.
// row_ops[r][i]: operator between col i and col i+1 in row r
// col_ops[c][i]: operator between row i and row i+1 in col c
// answers: {"row_col": value} using 0-based indices
const MATH_QUESTIONS = [
    {
        // Q1. [2x2, 2 blanks]
        // [?] + 8 = 15
        //  ×   +
        //  3 + [?] = 6
        //  =   =
        // 21  11
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 8, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [15, 6],
        col_results: [21, 11],
        answers: {"0_0": 7, "1_1": 3}
    },
    {
        // Q2. [2x2, 2 blanks]
        // 16 - [?] = 9
        //  +   ×
        //  4 × [?] = 12
        //  =   =
        // 20   21
        rows: 2, cols: 2,
        grid: [
            [{value: 16, blank: false}, {value: null, blank: true}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['*']],
        col_ops: [['+'], ['*']],
        row_results: [9, 12],
        col_results: [20, 21],
        answers: {"0_1": 7, "1_1": 3}
    },
    {
        // Q3. [2x2, 2 blanks]
        // [?] × 4 = 36
        //  +   -
        //  6 × [?] = 54
        //  =   =
        // 15    5
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 6, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [36, 54],
        col_results: [15, -5],
        answers: {"0_0": 9, "1_1": 9}
    },
    {
        // Q4. [2x2, 2 blanks]
        //  8 + [?] = 19
        //  :   +
        // [?] +  5 = 6
        //  =   =
        //  4   16
        rows: 2, cols: 2,
        grid: [
            [{value: 8, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['/'], ['+']],
        row_results: [19, 6],
        col_results: [8, 16],
        answers: {"0_1": 11, "1_0": 1}
    },
    {
        // Q5. [2x2, 2 blanks]
        // [?] - 3 = 10
        //  ×   +
        //  2 + [?] = 4
        //  =   =
        // 26    5
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 3, blank: false}],
            [{value: 2, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [10, 4],
        col_results: [26, 5],
        answers: {"0_0": 13, "1_1": 2}
    },
    {
        // Q6. [2x2, 2 blanks]
        // 21 : [?] = 7
        //  +   ×
        // [?] +  4 = 9
        //  =   =
        // 26   16
        rows: 2, cols: 2,
        grid: [
            [{value: 21, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['/'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [7, 9],
        col_results: [26, 12],
        answers: {"0_1": 3, "1_0": 5}
    },
    {
        // Q7. [2x2, 2 blanks]
        // [?] + 6 = 10
        //  -   ×
        //  2 + [?] = 7
        //  =   =
        //  2   30
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 2, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [10, 7],
        col_results: [2, 30],
        answers: {"0_0": 4, "1_1": 5}
    },
    {
        // Q8. [2x2, 2 blanks]
        //  9 × [?] = 27
        //  +   :
        // [?] ×  2 = 18
        //  =   =
        // 18    3
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 2, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['/']],
        row_results: [27, 18],
        col_results: [18, 1.5],
        answers: {"0_1": 3, "1_0": 9}
    },
    {
        // Q9. [2x2, 2 blanks]
        // 11 + [?] = 25
        //  +    +
        // [?] +  9 = 16
        //  =    =
        // 18   23
        rows: 2, cols: 2,
        grid: [
            [{value: 11, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 9, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [25, 16],
        col_results: [18, 23],
        answers: {"0_1": 14, "1_0": 7}
    },
    {
        // Q10. [2x2, 2 blanks]
        // [?] +  4 = 20
        //  +    +
        // 13 + [?] = 21
        //  =    =
        // 29   12
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 13, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [20, 21],
        col_results: [29, 12],
        answers: {"0_0": 16, "1_1": 8}
    },
    {
        // Q11. [2x2, 2 blanks]
        // 30 - [?] = 18
        //  +    +
        // [?] +  8 = 22
        //  =    =
        // 44   20
        rows: 2, cols: 2,
        grid: [
            [{value: 30, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 8, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [18, 22],
        col_results: [44, 20],
        answers: {"0_1": 12, "1_0": 14}
    },
    {
        // Q12. [2x2, 2 blanks]
        //  9 × [?] = 63
        //  +    +
        // [?] +  8 = 19
        //  =    =
        // 20   15
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 8, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [63, 19],
        col_results: [20, 15],
        answers: {"0_1": 7, "1_0": 11}
    },
    {
        // Q13. [2x2, 2 blanks]
        // 11 × [?] = 33
        //  +    ×
        // [?] +  4 = 13
        //  =    =
        // 20   12
        rows: 2, cols: 2,
        grid: [
            [{value: 11, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [33, 13],
        col_results: [20, 12],
        answers: {"0_1": 3, "1_0": 9}
    },
    {
        // Q14. [2x2, 2 blanks]
        // [?] + 11 = 15
        //  ×    +
        //  5 × [?] = 35
        //  =    =
        // 20   18
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 11, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [15, 35],
        col_results: [20, 18],
        answers: {"0_0": 4, "1_1": 7}
    },
    {
        // Q15. [2x2, 2 blanks]
        //  6 × [?] = 48
        //  -    ×
        // [?] +  5 = 9
        //  =    =
        //  2   40
        rows: 2, cols: 2,
        grid: [
            [{value: 6, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [48, 9],
        col_results: [2, 40],
        answers: {"0_1": 8, "1_0": 4}
    },
    {
        // Q16. [2x2, 2 blanks]
        // [?] ×  6 = 48
        //  +    +
        // 12 + [?] = 16
        //  =    =
        // 20   10
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 12, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [48, 16],
        col_results: [20, 10],
        answers: {"0_0": 8, "1_1": 4}
    },
    {
        // Q17. [2x2, 2 blanks]
        // 13 × [?] = 39
        //  +    +
        // [?] ×  4 = 28
        //  =    =
        // 20    7
        rows: 2, cols: 2,
        grid: [
            [{value: 13, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [39, 28],
        col_results: [20, 7],
        answers: {"0_1": 3, "1_0": 7}
    },
    {
        // Q18. [2x2, 2 blanks]
        // [?] :  6 =  3
        //  +    ×
        //  4 × [?] = 28
        //  =    =
        // 22   42
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['+'], ['*']],
        row_results: [3, 28],
        col_results: [22, 42],
        answers: {"0_0": 18, "1_1": 7}
    },
    {
        // Q19. [2x2, 2 blanks]
        //  7 × [?] = 42
        //  ×    ×
        // [?] +  5 = 13
        //  =    =
        // 56   30
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [42, 13],
        col_results: [56, 30],
        answers: {"0_1": 6, "1_0": 8}
    },
    {
        // Q20. [2x2, 2 blanks]
        // [?] ×  4 = 36
        //  ×    +
        //  6 × [?] = 42
        //  =    =
        // 54   11
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 6, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [36, 42],
        col_results: [54, 11],
        answers: {"0_0": 9, "1_1": 7}
    }
];
