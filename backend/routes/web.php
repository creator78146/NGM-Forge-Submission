<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Kanban Board API. See /api/board for the JSON API.',
    ]);
});
