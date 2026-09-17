# Sudokuco

A sudoku generator and player with four grid sizes and three difficulties.

**Live:** https://sudokuco.vercel.app

## What it does

Grid sizes 4x4 (2x2 boxes), 6x6 (2x3), 8x8 (2x4) and 9x9 (3x3), at easy, medium or hard. Hints, validation, and a passport that tracks finished puzzles.

## How the generator works

Two phases, both backtracking.

**1. Build a full solution.** `fillGrid()` walks the empty cells in order and tries candidate values in shuffled order, recursing on each placement and backing out when `isValid()` rejects every candidate. The shuffle is what makes puzzles differ: without it the search is deterministic and every generated grid is identical.

**2. Remove clues.** `generatePuzzle()` shuffles the cell positions and clears them one at a time. Difficulty sets how many survive: easy keeps 62% of cells, medium 46%, hard 31%.

The part that matters is uniqueness. A sudoku with two valid solutions is not a puzzle, it is a guess. So before a removal is kept, `countSolutions()` re-solves the board and the removal is reverted if more than one solution exists. It short-circuits at 2, because the question is "more than one?" and not "how many?" — counting further is wasted work on an exponential search.

**Known shortcut:** easy mode skips the uniqueness check to generate faster, so easy puzzles can have multiple solutions. Fixing that is next.

## Hints

`getHint()` picks a random unfilled, non-given cell and reveals its value from the stored solution. It is a lookup, not a solver — it does not reason about which cell is next logically deducible. Real hinting would mean implementing the human techniques (naked singles, hidden singles, pointing pairs) and surfacing the easiest one available. Not done yet.

## Stack

React + Vite, no state library, plain CSS.

## Run it

```bash
npm install
npm run dev
```
