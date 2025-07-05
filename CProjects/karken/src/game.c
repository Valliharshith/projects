#include <stdio.h>
#include <stdlib.h>
#include "game.h"

char board[3][3];

void initBoard() {
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            board[i][j] = ' ';
}

void printBoard() {
    printf("\n");
    for (int i = 0, cell = 1; i < 3; i++) {
        for (int j = 0; j < 3; j++, cell++) {
            if (board[i][j] == 'X')
                printf(" \x1b[31mX\x1b[0m ");  // Red
            else if (board[i][j] == 'O')
                printf(" \x1b[32mO\x1b[0m ");  // Green
            else
                printf(" %d ", cell);
            if (j < 2) printf("|");
        }
        printf("\n");
        if (i < 2) printf("---|---|---\n");
    }
    printf("\n");
}

int makeMove(int player, int row, int col) {
    if (row < 0 || row >= 3 || col < 0 || col >= 3 || board[row][col] != ' ')
        return 0;

    board[row][col] = (player == 1) ? 'X' : 'O';
    return 1;
}

int checkWin() {
    for (int i = 0; i < 3; i++) {
        if (board[i][0] != ' ' &&
            board[i][0] == board[i][1] &&
            board[i][1] == board[i][2]) return 1;
        if (board[0][i] != ' ' &&
            board[0][i] == board[1][i] &&
            board[1][i] == board[2][i]) return 1;
    }

    if (board[0][0] != ' ' &&
        board[0][0] == board[1][1] &&
        board[1][1] == board[2][2]) return 1;

    if (board[0][2] != ' ' &&
        board[0][2] == board[1][1] &&
        board[1][1] == board[2][0]) return 1;

    return 0;
}

// ------------------ SMART AI ------------------

static int isWinningMove(char symbol, int row, int col) {
    char original = board[row][col];
    board[row][col] = symbol;
    int win = checkWin();
    board[row][col] = original;
    return win;
}

void getAIMove(int *row, int *col) {
    // Try to win
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (board[i][j] == ' ' && isWinningMove('O', i, j)) {
                *row = i;
                *col = j;
                return;
            }

    // Block player
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (board[i][j] == ' ' && isWinningMove('X', i, j)) {
                *row = i;
                *col = j;
                return;
            }

    // Center
    if (board[1][1] == ' ') {
        *row = 1;
        *col = 1;
        return;
    }

    // Corners
    int corners[4][2] = {{0, 0}, {0, 2}, {2, 0}, {2, 2}};
    for (int i = 0; i < 4; i++)
        if (board[corners[i][0]][corners[i][1]] == ' ') {
            *row = corners[i][0];
            *col = corners[i][1];
            return;
        }

    // Any open cell
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (board[i][j] == ' ') {
                *row = i;
                *col = j;
                return;
            }
}
