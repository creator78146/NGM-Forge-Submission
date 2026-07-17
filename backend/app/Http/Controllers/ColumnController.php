<?php

namespace App\Http\Controllers;

use App\Models\BoardColumn;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ColumnController extends Controller
{
    /**
     * Return the entire board: all columns with their tasks, in order.
     * This is the endpoint the frontend uses to render the board.
     */
    public function board()
    {
        $columns = BoardColumn::with('tasks')->orderBy('position')->get();

        return response()->json($columns);
    }

    /**
     * List all columns (without tasks).
     */
    public function index()
    {
        return response()->json(
            BoardColumn::orderBy('position')->get()
        );
    }

    /**
     * Create a new column. New columns are appended to the end.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $nextPosition = (int) BoardColumn::max('position') + 1;

        $column = BoardColumn::create([
            'title' => $validated['title'],
            'position' => $nextPosition,
        ]);

        return response()->json($column->load('tasks'), Response::HTTP_CREATED);
    }

    /**
     * Show a single column with its tasks.
     */
    public function show(BoardColumn $column)
    {
        return response()->json($column->load('tasks'));
    }

    /**
     * Update a column's title (and/or position).
     */
    public function update(Request $request, BoardColumn $column)
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'position' => ['sometimes', 'integer', 'min:0'],
        ]);

        $column->update($validated);

        return response()->json($column->load('tasks'));
    }

    /**
     * Move a column to a new position, shifting the others accordingly.
     */
    public function reorder(Request $request, BoardColumn $column)
    {
        $validated = $request->validate([
            'position' => ['required', 'integer', 'min:0'],
        ]);

        $column->update(['position' => $validated['position']]);

        $columns = BoardColumn::orderBy('position')->orderBy('id')->get();
        foreach ($columns as $index => $col) {
            if ($col->position !== $index) {
                $col->update(['position' => $index]);
            }
        }

        return response()->json(BoardColumn::with('tasks')->orderBy('position')->get());
    }

    /**
     * Delete a column and all of its tasks (cascade via FK).
     */
    public function destroy(BoardColumn $column)
    {
        $column->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
