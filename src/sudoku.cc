#include <emscripten/bind.h>
#include "ortools/base/logging.h"
#include "ortools/constraint_solver/constraint_solver.h"
#include <sstream>
#include <string>

using namespace emscripten;

namespace operations_research
{
    void solve(int sudoku_flat[81])
    {
        // 0 marks an unknown value
        /*const int initial_grid[9][9] = {
            {0, 0, 6, 2, 0, 9, 3, 0, 0},
            {7, 1, 0, 0, 0, 0, 8, 0, 0},
            {0, 4, 0, 0, 0, 0, 0, 0, 7},
            {5, 0, 0, 0, 0, 1, 0, 0, 0},
            {0, 2, 0, 6, 0, 4, 0, 3, 0},
            {0, 0, 0, 3, 0, 0, 0, 0, 5},
            {4, 0, 0, 0, 0, 0, 0, 6, 0},
            {0, 0, 1, 0, 0, 0, 0, 5, 3},
            {0, 0, 9, 5, 0, 8, 2, 0, 0}};*/

        // Instantiate the solver.
        Solver solver("Sudoku");
        const int cell_size = 3;
        const int n = cell_size * cell_size;

        std::vector<std::vector<IntVar *>> grid = {
            {}, {}, {}, {}, {}, {}, {}, {}, {}};
        std::vector<IntVar *> grid_flat;

        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                std::ostringstream varname;
                varname << "grid[ " << i << "," << j << "]";
                IntVar *nr = solver.MakeIntVar(1, 9, varname.str());
                grid[i].push_back(nr);
                grid_flat.push_back(nr);
            }
        }

        //
        // constraints
        //

        // init and rows
        for (int i = 0; i < n; i++)
        {
            std::vector<IntVar *> row;
            for (int j = 0; j < n; j++)
            {
                if (sudoku_flat[i * n + j] > 0)
                {
                    solver.AddConstraint(solver.MakeEquality(grid[i][j], sudoku_flat[i * n + j]));
                }
                row.push_back(grid[i][j]);
            }
            solver.AddConstraint(solver.MakeAllDifferent(row));
        }

        // columns
        for (int j = 0; j < n; j++)
        {
            std::vector<IntVar *> col;
            for (int i = 0; i < n; i++)
            {
                col.push_back(grid[i][j]);
            }
            solver.AddConstraint(solver.MakeAllDifferent(col));
        }

        // cells
        for (int i = 0; i < cell_size; i++)
        {
            for (int j = 0; j < cell_size; j++)
            {
                std::vector<IntVar *> cell;
                for (int di = 0; di < cell_size; di++)
                {
                    for (int dj = 0; dj < cell_size; dj++)
                    {
                        cell.push_back(grid[i * cell_size + di][j * cell_size + dj]);
                    }
                }
                solver.AddConstraint(solver.MakeAllDifferent(cell));
            }
        }

        //
        // Search
        //
        
        DecisionBuilder *db = solver.MakePhase(grid_flat, solver.INT_VAR_SIMPLE, solver.INT_VALUE_SIMPLE);
        solver.NewSearch(db);
        while (solver.NextSolution())
        {
            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < n; j++)
                {
                    sudoku_flat[i * n + j] = (int)grid[i][j]->Value();
                }
            }
        }
        solver.EndSearch();
    }
} // namespace operations_research

int solve(int sudoko_ptr)
{
    FLAGS_logtostderr = 0;
    int *sudoku_flat = (int *)sudoko_ptr;
    operations_research::solve(sudoku_flat);
    return EXIT_SUCCESS;
}

EMSCRIPTEN_BINDINGS(module)
{
    function("solve", &solve);
}