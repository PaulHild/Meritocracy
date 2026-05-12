// Math Grid Questions Set 10 — answer key
// grid: row-major array. blank:true cells need user input.
// row_ops[r][i]: operator between col i and col i+1 in row r
// col_ops[c][i]: operator between row i and row i+1 in col c
// answers: {"row_col": value} using 0-based indices
const MATH_QUESTIONS = [
    {
        // Q1. [2x2, 2 blanks]
        //  9 + [?] = 17
        //  ×    +
        //  2 + [?] = 6
        //  =    =
        // 18   12
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: 2, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['+']],
        row_results: [17, 6],
        col_results: [18, 12],
        answers: {"0_1": 8, "1_1": 4}
    },
    {
        // Q2. [2x2, 2 blanks]
        // [?] - 7 = 4
        //  ×   +
        //  5 - [?] = 2
        //  =   =
        // 55   10
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 7, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['-']],
        col_ops: [['*'], ['+']],
        row_results: [4, 2],
        col_results: [55, 10],
        answers: {"0_0": 11, "1_1": 3}
    },
    {
        // Q3. [2x2, 2 blanks]
        // 18 : [?] = 6
        //  +   ×
        // [?] +  2 = 5
        //  =   =
        // 21  14
        rows: 2, cols: 2,
        grid: [
            [{value: 18, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 2, blank: false}]
        ],
        row_ops: [['/'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [6, 5],
        col_results: [21, 6],
        answers: {"0_1": 3, "1_0": 3}
    },
    {
        // Q4. [2x2, 2 blanks]
        // [?] × 4 = 24
        //  +   -
        //  7 × [?] = 21
        //  =   =
        // 13    1
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 4, blank: false}],
            [{value: 7, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['-']],
        row_results: [24, 21],
        col_results: [13, 1],
        answers: {"0_0": 6, "1_1": 3}
    },
    {
        // Q5. [2x2, 2 blanks]
        // 20 - [?] = 8
        //  :   +
        //  4 + [?] = 9
        //  =   =
        //  5  17
        rows: 2, cols: 2,
        grid: [
            [{value: 20, blank: false}, {value: null, blank: true}],
            [{value: 4, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['/'], ['+']],
        row_results: [8, 9],
        col_results: [5, 17],
        answers: {"0_1": 12, "1_1": 5}
    },
    {
        // Q6. [2x2, 2 blanks]
        // [?] + 6 = 13
        //  ×   ×
        //  3 + [?] = 10
        //  =   =
        // 21  42
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 3, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [13, 10],
        col_results: [21, 42],
        answers: {"0_0": 7, "1_1": 7}
    },
    {
        // Q7. [2x2, 2 blanks]
        // [?] - 5 = 7
        //  +   +
        // 10 - [?] = 4
        //  =   =
        // 22   8
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 10, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['-'], ['-']],
        col_ops: [['+'], ['+']],
        row_results: [7, 4],
        col_results: [22, 11],
        answers: {"0_0": 12, "1_1": 6}
    },
    {
        // Q8. [2x2, 2 blanks]
        //  5 × [?] = 15
        //  +   :
        // [?] ×  1 = 7
        //  =   =
        // 12    3
        rows: 2, cols: 2,
        grid: [
            [{value: 5, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 1, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['/']],
        row_results: [15, 7],
        col_results: [12, 3],
        answers: {"0_1": 3, "1_0": 7}
    },
    {
        // Q9. [2x2, 2 blanks]
        // 18 + [?] = 24
        //  +    +
        // [?] +  7 = 17
        //  =    =
        // 28   13
        rows: 2, cols: 2,
        grid: [
            [{value: 18, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 7, blank: false}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [24, 17],
        col_results: [28, 13],
        answers: {"0_1": 6, "1_0": 10}
    },
    {
        // Q10. [2x2, 2 blanks]
        // [?] +  5 = 19
        //  +    +
        //  8 + [?] = 20
        //  =    =
        // 22   17
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 5, blank: false}],
            [{value: 8, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [19, 20],
        col_results: [22, 17],
        answers: {"0_0": 14, "1_1": 12}
    },
    {
        // Q11. [2x2, 2 blanks]
        // 17 - [?] = 6
        //  +    +
        // [?] +  6 = 20
        //  =    =
        // 31   17
        rows: 2, cols: 2,
        grid: [
            [{value: 17, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['-'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [6, 20],
        col_results: [31, 17],
        answers: {"0_1": 11, "1_0": 14}
    },
    {
        // Q12. [2x2, 2 blanks]
        // [?] ×  6 = 48
        //  +    +
        // 10 + [?] = 19
        //  =    =
        // 18   15
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 6, blank: false}],
            [{value: 10, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [48, 19],
        col_results: [18, 15],
        answers: {"0_0": 8, "1_1": 9}
    },
    {
        // Q13. [2x2, 2 blanks]
        //  5 × [?] = 45
        //  +    ×
        // [?] +  3 = 10
        //  =    =
        // 12   27
        rows: 2, cols: 2,
        grid: [
            [{value: 5, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 3, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['*']],
        row_results: [45, 10],
        col_results: [12, 27],
        answers: {"0_1": 9, "1_0": 7}
    },
    {
        // Q14. [2x2, 2 blanks]
        // [?] +  7 = 16
        //  ×    +
        //  6 × [?] = 24
        //  =    =
        // 54   11
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 7, blank: false}],
            [{value: 6, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['+'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [16, 24],
        col_results: [54, 11],
        answers: {"0_0": 9, "1_1": 4}
    },
    {
        // Q15. [2x2, 2 blanks]
        //  7 × [?] = 42
        //  -    ×
        // [?] +  5 = 9
        //  =    =
        //  3   30
        rows: 2, cols: 2,
        grid: [
            [{value: 7, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 5, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['-'], ['*']],
        row_results: [42, 9],
        col_results: [3, 30],
        answers: {"0_1": 6, "1_0": 4}
    },
    {
        // Q16. [2x2, 2 blanks]
        // [?] × 13 = 39
        //  +    +
        //  7 + [?] = 13
        //  =    =
        // 10   19
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 13, blank: false}],
            [{value: 7, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['+'], ['+']],
        row_results: [39, 13],
        col_results: [10, 19],
        answers: {"0_0": 3, "1_1": 6}
    },
    {
        // Q17. [2x2, 2 blanks]
        //  8 × [?] = 40
        //  +    +
        // [?] ×  6 = 24
        //  =    =
        // 12   11
        rows: 2, cols: 2,
        grid: [
            [{value: 8, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 6, blank: false}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['+'], ['+']],
        row_results: [40, 24],
        col_results: [12, 11],
        answers: {"0_1": 5, "1_0": 4}
    },
    {
        // Q18. [2x2, 2 blanks]
        // [?] :  3 =  5
        //  +    ×
        //  8 × [?] = 48
        //  =    =
        // 23   18
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 3, blank: false}],
            [{value: 8, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['/'], ['*']],
        col_ops: [['+'], ['*']],
        row_results: [5, 48],
        col_results: [23, 18],
        answers: {"0_0": 15, "1_1": 6}
    },
    {
        // Q19. [2x2, 2 blanks]
        //  9 × [?] = 63
        //  ×    ×
        // [?] +  4 = 10
        //  =    =
        // 54   28
        rows: 2, cols: 2,
        grid: [
            [{value: 9, blank: false}, {value: null, blank: true}],
            [{value: null, blank: true}, {value: 4, blank: false}]
        ],
        row_ops: [['*'], ['+']],
        col_ops: [['*'], ['*']],
        row_results: [63, 10],
        col_results: [54, 28],
        answers: {"0_1": 7, "1_0": 6}
    },
    {
        // Q20. [2x2, 2 blanks]
        // [?] ×  7 = 56
        //  ×    +
        //  5 × [?] = 45
        //  =    =
        // 40   16
        rows: 2, cols: 2,
        grid: [
            [{value: null, blank: true}, {value: 7, blank: false}],
            [{value: 5, blank: false}, {value: null, blank: true}]
        ],
        row_ops: [['*'], ['*']],
        col_ops: [['*'], ['+']],
        row_results: [56, 45],
        col_results: [40, 16],
        answers: {"0_0": 8, "1_1": 9}
    }
];
