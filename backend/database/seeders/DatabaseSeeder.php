<?php

namespace Database\Seeders;

use App\Models\BoardColumn;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with a starter board.
     */
    public function run(): void
    {
        $columns = [
            ['title' => 'To Do', 'position' => 0],
            ['title' => 'In Progress', 'position' => 1],
            ['title' => 'Done', 'position' => 2],
        ];

        foreach ($columns as $columnData) {
            $column = BoardColumn::create($columnData);

            if ($column->title === 'To Do') {
                $column->tasks()->createMany([
                    ['title' => 'Set up project repository', 'description' => 'Initialize Git and push the first commit.', 'position' => 0],
                    ['title' => 'Design database schema', 'description' => 'Plan tables for columns and tasks.', 'position' => 1],
                ]);
            }

            if ($column->title === 'In Progress') {
                $column->tasks()->create([
                    'title' => 'Build the Kanban board UI',
                    'description' => 'Implement drag-free create/edit/delete flows in React.',
                    'position' => 0,
                ]);
            }

            if ($column->title === 'Done') {
                $column->tasks()->create([
                    'title' => 'Choose the tech stack',
                    'description' => 'React + Vite frontend, Laravel + SQLite backend.',
                    'position' => 0,
                ]);
            }
        }
    }
}
