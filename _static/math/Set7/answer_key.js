// Math Grid Questions Set 7 — answer key
// grid: row-major array. blank:true cells need user input.
// row_ops[r][i]: operator between col i and col i+1 in row r
// col_ops[c][i]: operator between row i and row i+1 in col c
// answers: {"row_col": value} using 0-based indices
const MATH_QUESTIONS = [
    {
        // Q1. [2x2, 2 blanks]
        //  0 × 11 = 0
        //  ×    +
        // [?] - [?] = 1
        //  =    =
        //  0   20
        rows: 2, cols: 2,
        grid: [
            [{value: 0, blank: false}, {value: 11, blank: false}],
            [{value: null, blank: true}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['-']],
        col_ops: [['*'], ['+']],
        row_results: [0, 1],
        col_results: [0, 20],
        answers: {"1_0": 10, "1_1": 9},
        explanation: 'Look at the second column. Here, 11 + 9 equals 20. Therefore, only 9 is fitting here as any other number would not solve the equation on the second column. Once we have a 9 inputted here, let us turn to the second row ( [?] - 9 = 1). Here, the correct answer must be 10 because 10 - 9 = 1. Also note that on the first column, 0 x 10 = 0 is correct. So the correct answer is: 10 and 9.'
    },
    {
        // Q2. [2x2, 2 blanks]
        // [?] - 10 = 0
        //  :    +
        //  2 × [?] = 12
        //  =    =
        //  5   16
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 10, blank: false}],
            [{value: 2, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['*']],
        col_ops: [['/'], ['+']],
        row_results: [0, 12],
        col_results: [5, 16],
        answers: {"0_0": 10, "1_1": 6}
    },
    {
        // Q3. [2x2, 2 blanks]
        // 20 - [?] = 0
        //  +    +
        // 13 × [?] = 39
        //  =    =
        // 33   23
        rows: 2, cols: 2,
        grid: [
            [{value: 20, blank: false}, {value: null, blank: true}],
            [{value: 13, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [0, 39],
        col_results: [33, 23],
        answers: {"0_1": 20, "1_1": 3}
    },
    {
        // Q4. [2x2, 2 blanks]
        // [?] + 10 = 13
        //  +    +
        // 20 + [?] = 36
        //  =    =
        // 23   26
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 10, blank: false}],
            [{value: 20, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [13, 36],
        col_results: [23, 26],
        answers: {"0_0": 3, "1_1": 16}
    },
    {
        // Q5. [2x2, 2 blanks]
        // [?] +  5 = 15
        //  +    +
        //  8 + [?] = 23
        //  =    =
        // 18   20
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 8, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [15, 23],
        col_results: [18, 20],
        answers: {"0_0": 10, "1_1": 15}
    },
    {
        // Q6. [2x2, 2 blanks]
        // [?] + [?] = 23
        //  -    ×
        // 12 +  6 = 18
        //  =    =
        //  4   42
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: null, blank: true}],
            [{value: 12, blank: false}, {value: 6, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [23, 18],
        col_results: [4, 42],
        answers: {"0_0": 16, "0_1": 7}
    },
    {
        // Q7. [2x2, 2 blanks]
        // [?] :  1 = 11
        //  ×    +
        //  1 + [?] = 5
        //  =    =
        // 11    5
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 1, blank: false}],
            [{value: 1, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [11, 5],
        col_results: [11, 5],
        answers: {"0_0": 11, "1_1": 4}
    },
    {
        // Q8. [2x2, 2 blanks]
        // [?] + 17 = 21
        //  ×    ×
        //  9 × [?] = 9
        //  =    =
        // 36   17
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 17, blank: false}],
            [{value: 9, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['*']],
        row_results: [21, 9],
        col_results: [36, 17],
        answers: {"0_0": 4, "1_1": 1}
    },
    {
        // Q9. [2x2, 2 blanks]
        // 16 + [?] = 23
        //  +    +
        // [?] +  5 = 14
        //  =    =
        // 25   12
        rows: 2, cols: 2,
        grid: [
            [{value: 16, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [23, 14],
        col_results: [25, 12],
        answers: {"0_1": 7, "1_0": 9}
    },
    {
        // Q10. [2x2, 2 blanks]
        // [?] +  8 = 20
        //  +    +
        //  5 + [?] = 19
        //  =    =
        // 17   22
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 8, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [20, 19],
        col_results: [17, 22],
        answers: {"0_0": 12, "1_1": 14}
    },
    {
        // Q11. [2x2, 2 blanks]
        // 21 - [?] = 15
        //  +    +
        // [?] +  4 = 17
        //  =    =
        // 34   10
        rows: 2, cols: 2,
        grid: [
            [{value: 21, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [15, 17],
        col_results: [34, 10],
        answers: {"0_1": 6, "1_0": 13}
    },
    {
        // Q12. [2x2, 2 blanks]
        //  3 × [?] = 27
        //  +    +
        // [?] +  6 = 23
        //  =    =
        // 20   15
        rows: 2, cols: 2,
        grid: [
            [{value: 3, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [27, 23],
        col_results: [20, 15],
        answers: {"0_1": 9, "1_0": 17}
    },
    {
        // Q13. [2x2, 2 blanks]
        //  3 × [?] = 21
        //  +    ×
        // [?] +  4 = 9
        //  =    =
        //  8   28
        rows: 2, cols: 2,
        grid: [
            [{value: 3, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [21, 9],
        col_results: [8, 28],
        answers: {"0_1": 7, "1_0": 5}
    },
    {
        // Q14. [2x2, 2 blanks]
        // [?] +  8 = 13
        //  ×    +
        //  4 × [?] = 24
        //  =    =
        // 20   14
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 8, blank: false}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [13, 24],
        col_results: [20, 14],
        answers: {"0_0": 5, "1_1": 6}
    },
    {
        // Q15. [2x2, 2 blanks]
        // 11 × [?] = 55
        //  -    ×
        // [?] +  3 = 11
        //  =    =
        //  3   15
        rows: 2, cols: 2,
        grid: [
            [{value: 11, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [55, 11],
        col_results: [3, 15],
        answers: {"0_1": 5, "1_0": 8}
    },
    {
        // Q16. [2x2, 2 blanks]
        // [?] ×  8 = 48
        //  +    +
        //  9 + [?] = 14
        //  =    =
        // 15   13
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 8, blank: false}],
            [{value: 9, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [48, 14],
        col_results: [15, 13],
        answers: {"0_0": 6, "1_1": 5}
    },
    {
        // Q17. [2x2, 2 blanks]
        // 10 × [?] = 30
        //  +    +
        // [?] ×  4 = 20
        //  =    =
        // 15    7
        rows: 2, cols: 2,
        grid: [
            [{value: 10, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [30, 20],
        col_results: [15, 7],
        answers: {"0_1": 3, "1_0": 5}
    },
    {
        // Q18. [2x2, 2 blanks]
        // [?] :  4 =  2
        //  +    ×
        //  6 × [?] = 54
        //  =    =
        // 14   36
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 6, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['+'], ['*']],
        row_results: [2, 54],
        col_results: [14, 36],
        answers: {"0_0": 8, "1_1": 9}
    },
    {
        // Q19. [2x2, 2 blanks]
        //  5 × [?] = 55
        //  ×    ×
        // [?] +  7 = 10
        //  =    =
        // 15   77
        rows: 2, cols: 2,
        grid: [
            [{value: 5, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [55, 10],
        col_results: [15, 77],
        answers: {"0_1": 11, "1_0": 3}
    },
    {
        // Q20. [2x2, 2 blanks]
        // [?] ×  3 = 33
        //  ×    +
        //  5 × [?] = 45
        //  =    =
        // 55   12
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 3, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [33, 45],
        col_results: [55, 12],
        answers: {"0_0": 11, "1_1": 9}
    }
];
