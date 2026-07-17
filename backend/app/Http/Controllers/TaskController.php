<?php

namespace App\Http\Controllers;

use App\Models\BoardColumn;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TaskController extends Controller
{
    /**
     * List all tasks (optionally filtered by column).
     */
    public function index(Request $request)
    {
        $query = Task::query()->orderBy('position');

        if ($request->has('column_id')) {
            $query->where('column_id', $request->query('column_id'));
        }

        return response()->json($query->get());
    }

    /**
     * Create a new task inside a column.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'column_id' => ['required', 'integer', 'exists:columns,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $nextPosition = (int) Task::where('column_id', $validated['column_id'])->max('position') + 1;

        $task = Task::create([
            'column_id' => $validated['column_id'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'position' => $nextPosition,
        ]);

        return response()->json($task, Response::HTTP_CREATED);
    }

    /**
     * Show a single task.
     */
    public function show(Task $task)
    {
        return response()->json($task);
    }

    /**
     * Update a task's title/description.
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'position' => ['sometimes', 'integer', 'min:0'],
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    /**
     * Move a task to a different column and/or position
     * (used for drag-and-drop style reordering).
     */
    public function move(Request $request, Task $task)
    {
        $validated = $request->validate([
            'column_id' => ['required', 'integer', 'exists:columns,id'],
            'position' => ['required', 'integer', 'min:0'],
        ]);

        $originalColumnId = $task->column_id;

        $task->update([
            'column_id' => $validated['column_id'],
            'position' => $validated['position'],
        ]);

        // Re-sequence positions in the destination column.
        $this->resequence($validated['column_id']);

        // Re-sequence positions in the original column too, if it changed.
        if ($originalColumnId !== $validated['column_id']) {
            $this->resequence($originalColumnId);
        }

        return response()->json(
            BoardColumn::with('tasks')->orderBy('position')->get()
        );
    }

    /**
     * Delete a task.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * Normalize task positions within a column to 0..n-1, in current order.
     */
    private function resequence(int $columnId): void
    {
        $tasks = Task::where('column_id', $columnId)
            ->orderBy('position')
            ->orderBy('id')
            ->get();

        foreach ($tasks as $index => $task) {
            if ($task->position !== $index) {
                $task->update(['position' => $index]);
            }
        }
    }
}
