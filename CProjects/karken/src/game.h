#ifndef GAME_H
#define GAME_H

// Initializes the game board with empty spaces
void initBoard();

// Displays the current board with colors and position numbers
void printBoard();

// Makes a move for the given player at (row, col)
// Returns 1 if the move is valid and successful, 0 otherwise
int makeMove(int player, int row, int col);

// Checks if the current board state results in a win
// Returns 1 if someone has won, 0 otherwise
int checkWin();

// Calculates the smart AI's best move and sets the row and col values accordingly
void getAIMove(int *row, int *col);

#endif
