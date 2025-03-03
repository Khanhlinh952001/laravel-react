<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Memo extends Model
{
    use HasFactory;
    
    /**
     * Các trường có thể gán hàng loạt.
     * 
     * @var array
     */
    protected $fillable = ['title', 'content', 'user_id'];
    
    /**
     * Lấy người dùng sở hữu memo này.
     * Định nghĩa mối quan hệ "thuộc về" với model User.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
