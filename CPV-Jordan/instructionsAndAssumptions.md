# Instructions
Hey team! I have implemented the cost-per-view solution via node.js. In order to execute the program,
please follow the instructions below:

1. Make sure node is installed, see `https://nodejs.org/` for further details.
2. Install the two dependencies used in the program (`moment` and `csv-parser`) by running these commands in the terminal:
          `npm i moment`
          `npm i csv-parser`
3. Make sure both files are named appropriately (`spots.csv` and `rotations.csv`) and are located within the directory you are running the program from.
4. Run command `node CPV.js` in terminal

## Expected output
When ran correctly, the result will be printed to the terminal in the following format:

------------ Cost per view by Creative ------------------------
┌──────────┬───────┬───────┬────────────────────┐
│ (index)  │ Spend │ Views │        Cpv         │
├──────────┼───────┼───────┼────────────────────┤
│ TEST001H │ 1461  │  520  │ 10.527727272727272 │
│ TEST002H │ 1600  │  470  │ 13.027777777777779 │
└──────────┴───────┴───────┴────────────────────┘


------------ Cost per view by Rotation by Day -----------------
Day:  01/02/2016
┌───────────┬───────┬───────┬────────────────────┐
│  (index)  │ Spend │ Views │        Cpv         │
├───────────┼───────┼───────┼────────────────────┤
│  Morning  │  361  │  210  │ 3.3913636363636366 │
│ Afternoon │ 1300  │  280  │ 14.330808080808081 │
│   Prime   │ 1300  │  280  │ 14.330808080808081 │
└───────────┴───────┴───────┴────────────────────┘


Day:  02/02/2016
┌─────────┬───────┬───────┬────────────────────┐
│ (index) │ Spend │ Views │        Cpv         │
├─────────┼───────┼───────┼────────────────────┤
│ Morning │  700  │  200  │        3.5         │
│  Prime  │  700  │  300  │ 2.3333333333333335 │
└─────────┴───────┴───────┴────────────────────┘

## Assumptions
Listing the few assumptions I made while coding this solution:

1. If a spot's time belongs to two rotations, include that spot's data in both rotations when calculating `Cost per view by Rotation by Day`.
2. All input files are formatted according to the originally updated csv files and will always be named `spots.csv` and `rotations.csv`.

