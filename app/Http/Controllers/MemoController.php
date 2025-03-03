<?php

namespace App\Http\Controllers;

use App\Models\Memo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * MemoController xử lý tất cả các thao tác CRUD liên quan đến Memo
 * CRUD: Create, Read, Update, Delete
 */
class MemoController extends Controller
{
    /**
     * Hiển thị danh sách tất cả các memo của người dùng hiện tại
     * GET /memo
     * 
     * Phương thức này:
     * 1. Lấy tất cả memo của người dùng đã đăng nhập
     * 2. Sắp xếp theo thời gian tạo mới nhất
     * 3. Truyền dữ liệu cho component React để hiển thị
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Lấy tất cả memo của người dùng hiện tại, sắp xếp theo thời gian tạo giảm dần (mới nhất lên đầu)
        $memos = Auth::user()->memos()->orderBy('created_at', 'desc')->get();
        
        // Render component React 'Memo/View' với dữ liệu memos
        return Inertia::render('Memo/View', [
            'memos' => $memos // Truyền dữ liệu memos cho component React
        ]);
    }

    /**
     * Hiển thị form tạo memo mới
     * GET /memo/create
     * 
     * Phương thức này hiển thị giao diện để người dùng tạo memo mới
     * Trong ứng dụng Inertia, thường không cần phương thức này vì form được xử lý ở phía client
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        // Render component React 'Memo/Create'
        return Inertia::render('Memo/Create');
    }

    /**
     * Lưu memo mới vào database
     * POST /memo
     * 
     * Phương thức này:
     * 1. Xác thực dữ liệu đầu vào
     * 2. Tạo memo mới cho người dùng hiện tại
     * 3. Trả về response JSON với memo vừa tạo
     *
     * @param  \Illuminate\Http\Request  $request - Chứa dữ liệu từ form
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Xác thực dữ liệu đầu vào
        $validated = $request->validate([
            'title' => 'required|string|max:255', // Tiêu đề: bắt buộc, là chuỗi, tối đa 255 ký tự
            'content' => 'required|string', // Nội dung: bắt buộc, là chuỗi
        ]);
        
        // Tạo memo mới cho người dùng hiện tại
        // Sử dụng relationship memos() từ model User để tự động gán user_id
        $memo = Auth::user()->memos()->create($validated);
        
        // Trả về response JSON với memo vừa tạo
        // Dùng cho AJAX request từ frontend
        return response()->json(['memo' => $memo]);
    }

    /**
     * Hiển thị chi tiết một memo cụ thể
     * GET /memo/{memo}
     * 
     * Phương thức này:
     * 1. Kiểm tra quyền truy cập
     * 2. Hiển thị chi tiết memo
     *
     * @param  \App\Models\Memo  $memo - Model Memo được tự động resolve từ route parameter
     * @return \Inertia\Response
     */
    public function show(Memo $memo)
    {
        // Kiểm tra quyền: chỉ cho phép xem memo của chính người dùng
        if ($memo->user_id !== Auth::id()) {
            abort(403); // Forbidden - Không có quyền truy cập
        }
        
        // Render component React 'Memo/Show' với dữ liệu memo
        return Inertia::render('Memo/Show', [
            'memo' => $memo
        ]);
    }

    /**
     * Hiển thị form chỉnh sửa memo
     * GET /memo/{memo}/edit
     * 
     * Phương thức này:
     * 1. Kiểm tra quyền truy cập
     * 2. Hiển thị form chỉnh sửa với dữ liệu memo hiện tại
     *
     * @param  \App\Models\Memo  $memo - Model Memo được tự động resolve từ route parameter
     * @return \Inertia\Response
     */
    public function edit(Memo $memo)
    {
        // Kiểm tra quyền: chỉ cho phép chỉnh sửa memo của chính người dùng
        if ($memo->user_id !== Auth::id()) {
            abort(403); // Forbidden - Không có quyền truy cập
        }
        
        // Render component React 'Memo/Edit' với dữ liệu memo
        return Inertia::render('Memo/Edit', [
            'memo' => $memo
        ]);
    }

    /**
     * Cập nhật memo trong database
     * PUT/PATCH /memo/{memo}
     * 
     * Phương thức này:
     * 1. Kiểm tra quyền truy cập
     * 2. Xác thực dữ liệu đầu vào
     * 3. Cập nhật memo
     * 4. Trả về response JSON với memo đã cập nhật
     *
     * @param  \Illuminate\Http\Request  $request - Chứa dữ liệu từ form
     * @param  \App\Models\Memo  $memo - Model Memo được tự động resolve từ route parameter
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Memo $memo)
    {
        // Kiểm tra quyền: chỉ cho phép cập nhật memo của chính người dùng
        if ($memo->user_id !== Auth::id()) {
            abort(403); // Forbidden - Không có quyền truy cập
        }
        
        // Xác thực dữ liệu đầu vào
        $validated = $request->validate([
            'title' => 'required|string|max:255', // Tiêu đề: bắt buộc, là chuỗi, tối đa 255 ký tự
            'content' => 'required|string', // Nội dung: bắt buộc, là chuỗi
        ]);
        
        // Cập nhật memo với dữ liệu đã xác thực
        $memo->update($validated);
        
        // Trả về response JSON với memo đã cập nhật
        // Dùng cho AJAX request từ frontend
        return response()->json(['memo' => $memo]);
    }

    /**
     * Xóa memo khỏi database
     * DELETE /memo/{memo}
     * 
     * Phương thức này:
     * 1. Kiểm tra quyền truy cập
     * 2. Xóa memo
     * 3. Trả về response JSON xác nhận thành công
     *
     * @param  \App\Models\Memo  $memo - Model Memo được tự động resolve từ route parameter
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Memo $memo)
    {
        // Kiểm tra quyền: chỉ cho phép xóa memo của chính người dùng
        if ($memo->user_id !== Auth::id()) {
            abort(403); // Forbidden - Không có quyền truy cập
        }
        
        // Xóa memo khỏi database
        $memo->delete();
        
        // Trả về JSON response xác nhận thành công
        // Dùng cho AJAX request từ frontend
        return response()->json(['success' => true]);
    }
}
