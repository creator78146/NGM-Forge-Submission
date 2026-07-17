<?php

use App\Http\Controllers\ColumnController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes here are automatically prefixed with /api by Laravel.
|
*/

Route::get('/board', [ColumnController::class, 'board']);

Route::apiResource('columns', ColumnController::class);
Route::patch('/columns/{column}/reorder', [ColumnController::class, 'reorder']);

Route::apiResource('tasks', TaskController::class);
Route::patch('/tasks/{task}/move', [TaskController::class, 'move']);
