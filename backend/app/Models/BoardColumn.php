<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BoardColumn extends Model
{
    use HasFactory;

    // Table is named "columns" in the database, but the model is
    // called BoardColumn to avoid clashing with the SQL keyword COLUMN.
    protected $table = 'columns';

    protected $fillable = [
        'title',
        'position',
    ];

    protected $casts = [
        'position' => 'integer',
    ];

    /**
     * A column has many tasks, ordered by their position.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'column_id')->orderBy('position');
    }
}
