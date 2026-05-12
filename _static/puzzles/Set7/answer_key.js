const PUZZLES = [
    { puzzle: 'puzzle_000.png', answers: ['answers_000A_F.png', 'answers_000B_F.png', 'answers_000C_T.png', 'answers_000D_F.png'], correct: 'C', explanation: 'Look at the pattern of shapes in each row and column. In each row there are one of the three shapes: a circle, a rectangle and a hexagon. In the first row, there are 3 shapes, in the second row, there are 4 shapes and in the last row there is only one shape. Therefore, the correct answer should contain a single rectangle. However, since the size of the rectangle also matters, the correct answer is C.' },
    { puzzle: 'puzzle_001.png', answers: ['answers_001A_F.png', 'answers_001B_F.png', 'answers_001C_T.png', 'answers_001D_F.png'], correct: 'C', explanation: 'In the first two rows each, there are three types of shape arrangements. These are 1) two shapes side by side at the top, 2) two shapes side by side at the bottom, 3) two shapes placed on diagonals. The third row has 2) and 3) but does not have 1). Therefore, the missing piece must contain two shapes side by side placed at the top. This could be B or C. However, B displays two triangles with different sizes, therefore, C is correct.' },
    // TODO: fix the explanation text for 3rd
    { puzzle: 'puzzle_002.png', answers: ['answers_002A_F.png', 'answers_002B_F.png', 'answers_002C_F.png', 'answers_002D_T.png'], correct: 'D', explanation: 'Explanation text (DEBUG WILL BE FIXED)'}, 
    { puzzle: 'puzzle_003.png', answers: ['answers_003A_F.png', 'answers_003B_T.png', 'answers_003C_F.png', 'answers_003D_F.png'], correct: 'B', explanation: 'Explanation text (DEBUG WILL BE FIXED)'}, 
    { puzzle: 'puzzle_004.png', answers: ['answers_004A_F.png', 'answers_004B_F.png', 'answers_004C_T.png', 'answers_004D_F.png'], correct: 'C' },
    { puzzle: 'puzzle_005.png', answers: ['answers_005A_T.png', 'answers_005B_F.png', 'answers_005C_F.png', 'answers_005D_F.png'], correct: 'A' },
    { puzzle: 'puzzle_006.png', answers: ['answers_006A_F.png', 'answers_006B_T.png', 'answers_006C_F.png', 'answers_006D_F.png'], correct: 'B' },
    { puzzle: 'puzzle_007.png', answers: ['answers_007A_F.png', 'answers_007B_T.png', 'answers_007C_F.png', 'answers_007D_F.png'], correct: 'B' },
    { puzzle: 'puzzle_008.png', answers: ['answers_008A_F.png', 'answers_008B_F.png', 'answers_008C_T.png', 'answers_008D_F.png'], correct: 'C' },
    { puzzle: 'puzzle_009.png', answers: ['answers_009A_F.png', 'answers_009B_F.png', 'answers_009C_F.png', 'answers_009D_T.png'], correct: 'D' },
    { puzzle: 'puzzle_010.png', answers: ['answers_010A_F.png', 'answers_010B_F.png', 'answers_010C_F.png', 'answers_010D_T.png'], correct: 'D' },
    { puzzle: 'puzzle_011.png', answers: ['answers_011A_T.png', 'answers_011B_F.png', 'answers_011C_F.png', 'answers_011D_F.png'], correct: 'A' },
    { puzzle: 'puzzle_012.png', answers: ['answers_012A_T.png', 'answers_012B_F.png', 'answers_012C_F.png', 'answers_012D_F.png'], correct: 'A' },
    { puzzle: 'puzzle_013.png', answers: ['answers_013A_F.png', 'answers_013B_F.png', 'answers_013C_T.png', 'answers_013D_F.png'], correct: 'C' },
    { puzzle: 'puzzle_014.png', answers: ['answers_014A_F.png', 'answers_014B_F.png', 'answers_014C_T.png', 'answers_014D_F.png'], correct: 'C' },
    { puzzle: 'puzzle_015.png', answers: ['answers_015A_T.png', 'answers_015B_F.png', 'answers_015C_F.png', 'answers_015D_F.png'], correct: 'A' },
    { puzzle: 'puzzle_016.png', answers: ['answers_016A_T.png', 'answers_016B_F.png', 'answers_016C_F.png', 'answers_016D_F.png'], correct: 'A' },
    { puzzle: 'puzzle_017.png', answers: ['answers_017A_F.png', 'answers_017B_T.png', 'answers_017C_F.png', 'answers_017D_F.png'], correct: 'B' }
];
