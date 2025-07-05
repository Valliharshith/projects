#include <stdio.h>
#include "game.h"

int main() {
    char again;
    int mode;
    int player1Wins = 0, player2Wins = 0, draws = 0;

    do {
        // Game mode selection
        printf("\nWelcome to Tic Tac Toe!\n");
        printf("Select mode:\n");
        printf("1. Single Player (vs AI)\n");
        printf("2. Two Player\n");
        printf("Enter choice (1 or 2): ");
        scanf("%d", &mode);

        while (mode != 1 && mode != 2) {
            printf("Invalid choice. Please enter 1 or 2: ");
            scanf("%d", &mode);
        }

        initBoard();
        int player = 1, row, col, moves = 0;

        while (1) {
            printBoard();

            if (mode == 1) {
                if (moves % 2 == 0) {
                    // Player move
                    int move;
                    printf("Your move (1-9): ");
                    scanf("%d", &move);
                    if (move < 1 || move > 9) {
                        printf("Invalid input! Enter a number between 1 and 9.\n");
                        continue;
                    }

                    row = (move - 1) / 3;
                    col = (move - 1) % 3;

                    if (!makeMove(1, row, col)) {
                        printf("Cell taken! Try again.\n");
                        continue;
                    }
                } else {
                    // AI move
                    printf("AI is thinking...\n");
                    getAIMove(&row, &col);
                    makeMove(2, row, col);
                }
            } else {
                // Two player mode
                int move;
                printf("Player %d (%c), enter your move (1-9): ", player, (player == 1 ? 'X' : 'O'));
                scanf("%d", &move);
                if (move < 1 || move > 9) {
                    printf("Invalid input! Enter a number between 1 and 9.\n");
                    continue;
                }

                row = (move - 1) / 3;
                col = (move - 1) % 3;

                if (!makeMove(player, row, col)) {
                    printf("Cell taken! Try again.\n");
                    continue;
                }
            }

            moves++;

            if (checkWin()) {
                printBoard();

                FILE *fp = fopen("output/history.txt", "a");
                if (mode == 1) {
                    if (moves % 2 == 1) {
                        printf("You win!\n");
                        player1Wins++;
                        if (fp) fprintf(fp, "Player won\n");
                    } else {
                        printf("AI wins!\n");
                        player2Wins++;
                        if (fp) fprintf(fp, "AI won\n");
                    }
                } else {
                    printf("Player %d wins!\n", player);
                    if (player == 1) player1Wins++;
                    else player2Wins++;
                    if (fp) fprintf(fp, "Player %d won\n", player);
                }
                if (fp) fclose(fp);
                break;
            }

            if (moves == 9) {
                printBoard();
                printf("It's a draw!\n");
                draws++;

                FILE *fp = fopen("output/history.txt", "a");
                if (fp) {
                    fprintf(fp, "Draw\n");
                    fclose(fp);
                }
                break;
            }

            if (mode == 2)
                player = 3 - player;  // Switch player for two-player mode
        }

        printf("Play again? (y/n): ");
        scanf(" %c", &again);  // space before %c to skip newline

    } while (again == 'y' || again == 'Y');

    // Final score display
    printf("\nFinal Scores:\n");
    printf("Player 1 Wins: %d\n", player1Wins);
    printf("%s Wins: %d\n", (mode == 1 ? "AI" : "Player 2"), player2Wins);
    printf("Draws: %d\n", draws);
    printf("Thanks for playing!\n");

    return 0;
}
