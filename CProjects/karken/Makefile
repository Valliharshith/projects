# Makefile for C project in karken

CC = x86_64-w64-mingw32-gcc.exe
SRC = src/main.c src/game.c 
OUT = build/program.exe

.PHONY: all run clean

all: $(OUT)

$(OUT): $(SRC)
	$(CC) $(SRC) -o $(OUT)

run: all
	./$(OUT)

clean:
	rm -f build/*.exe
