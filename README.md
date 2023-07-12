# minesweeper
## JavaScript Console Based Minesweeper Game

### Installation Instructions
- [ ] Install node.js
- [ ] Execute game

### Game Play
* There is an n by m grid that contains a random number of mines, ranging from 10% to 20% of the total number of tiles. (Note: Older implementations may use a range of 20% to 60% instead.)
* Positions in the grid are identified using coordinates, with the first coordinate representing the horizontal position and the second coordinate representing the vertical position. The top-left corner of the grid is position 1,1, and the bottom-right corner is at n,m.
* The total number of mines to be found is displayed at the beginning of the game.
* Each mine occupies a single grid point, and its position is initially unknown to the player.
* The grid is initially displayed with all cells obscured, represented by a single dot '.'.
* You can mark a cell with a question mark '?' to indicate your suspicion of a mine.
* You can mark a cell as free by entering its coordinates.
  *	If the selected cell is free space, it is cleared, along with any adjacent free cells. This process is repeated recursively for subsequent adjacent free cells, unless a cell is marked as a mine or contains a mine.
  *	Cells marked as mines are displayed as '?'.
  *	Other free cells show the count of adjacent true mines in their immediate neighborhood. If a free cell is not adjacent to any true mines, it is displayed as a single space ' '.
* If you attempt to clear a space that contains a hidden mine, you lose the game.
* You win the game when you have correctly identified all mines.
