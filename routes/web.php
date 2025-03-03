<?php

// Import các Controllers và Classes cần thiết
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MemoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Trang chủ (Homepage)
 * URL: /
 * Hiển thị trang Welcome với các thông tin:
 * - Trạng thái đăng nhập/đăng ký
 * - Phiên bản Laravel và PHP
 */
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),        // Kiểm tra route login tồn tại
        'canRegister' => Route::has('register'),  // Kiểm tra route register tồn tại
        'laravelVersion' => Application::VERSION,  // Lấy version Laravel
        'phpVersion' => PHP_VERSION,              // Lấy version PHP
    ]);
});

/**
 * Trang home
 * URL: /home
 * - Yêu cầu đăng nhập (auth)
 * - Yêu cầu xác thực email (verified)
 */
Route::get('/home', function () {
    return Inertia::render('Home');
})->middleware(['auth', 'verified'])->name('home');

/**
 * Nhóm các routes quản lý Profile
 * - Tất cả các routes trong nhóm này đều yêu cầu đăng nhập (auth)
 */
Route::middleware('auth')->group(function () {
    /**
     * Routes quản lý Profile
     * URL prefix: /profile
     */
    Route::prefix('profile')->group(function () {
        // Route xem và chỉnh sửa profile - GET /profile
        Route::get('/', [ProfileController::class, 'edit'])
            ->name('profile.edit');

        // Route cập nhật thông tin profile - PATCH /profile
        Route::patch('/', [ProfileController::class, 'update'])
            ->name('profile.update');

        // Route xóa profile - DELETE /profile
        Route::delete('/', [ProfileController::class, 'destroy'])
            ->name('profile.destroy');
    });

    /**
     * Routes quản lý Memo
     * URL prefix: /memo
     */
    Route::prefix('memo')->group(function () {
        // Hiển thị danh sách memo
        Route::get('/', [MemoController::class, 'index'])
            ->name('memo.view');

        // Tạo memo mới
        Route::get('/create', [MemoController::class, 'create'])
            ->name('memo.create');

        Route::post('/', [MemoController::class, 'store'])
            ->name('memo.store');

        // Hiển thị chi tiết memo
        Route::get('/{memo}', [MemoController::class, 'show'])
            ->name('memo.show');

        // Cập nhật memo
        Route::get('/{memo}/edit', [MemoController::class, 'edit'])
            ->name('memo.edit');

        Route::put('/{memo}', [MemoController::class, 'update'])
            ->name('memo.update');

        // Xóa memo
        Route::delete('/{memo}', [MemoController::class, 'destroy'])
            ->name('memo.destroy');
    });
});

/**
 * Import các routes xác thực (authentication)
 * Bao gồm: login, register, forgot password, reset password,...
 */
require __DIR__.'/auth.php';
