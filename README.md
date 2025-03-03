# Laravel Breeze - React Edition 🏝️

## Introduction

This repository is an implementation of the [Laravel Breeze](https://laravel.com/docs/starter-kits) application / authentication starter kit frontend in [React](https://reactjs.org/). All of the authentication boilerplate is already written for you - powered by [Laravel Sanctum](https://laravel.com/docs/sanctum), allowing you to quickly begin pairing your beautiful React frontend with a powerful Laravel backend.

## Official Documentation

### Installation

First, create a Laravel application configured for using React and Inertia:

```bash
laravel new my-app

cd my-app

composer require laravel/breeze --dev

php artisan breeze:install react
```

This will install Laravel Breeze and configure your application to use React and Inertia for the frontend. Next, you should migrate your database and start the development server:

```bash
php artisan migrate

npm install
npm run dev
```

Visit http://localhost:8000 in your browser to view the application.

## Hướng dẫn tạo bài thuyết trình PowerPoint về CRUD trong Laravel với Inertia.js

Dưới đây là cấu trúc và nội dung chi tiết cho bài thuyết trình PowerPoint về cách xây dựng chức năng CRUD (Create, Read, Update, Delete) trong Laravel với Inertia.js và React.

### Slide 1: Trang bìa
- Tiêu đề: "Xây dựng chức năng CRUD với Laravel và Inertia.js"
- Phụ đề: "Hướng dẫn từng bước tạo ứng dụng Memo"
- Tên người thuyết trình
- Ngày thuyết trình

### Slide 2: Nội dung
- Giới thiệu về CRUD
- Công nghệ sử dụng
- Chuẩn bị cơ sở dữ liệu
- Xây dựng Backend
- Xây dựng Frontend
- Demo và kết luận

### Slide 3: Giới thiệu về CRUD
- **C**reate: Tạo mới dữ liệu
- **R**ead: Đọc/Hiển thị dữ liệu
- **U**pdate: Cập nhật dữ liệu
- **D**elete: Xóa dữ liệu
- Tầm quan trọng của CRUD trong phát triển ứng dụng web

### Slide 4: Công nghệ sử dụng
- **Laravel**: PHP Framework
  - Routing, Controller, Model, Migration
- **Inertia.js**: Kết nối Laravel với React
  - Không cần API riêng biệt
- **React**: Frontend library
  - Components, Hooks, State Management
- **TailwindCSS**: Styling

### Slide 5: Tổng quan về ứng dụng Memo
- Chức năng:
  - Xem danh sách memo
  - Thêm memo mới
  - Chỉnh sửa memo
  - Xóa memo
- Hình ảnh minh họa giao diện

### Slide 6: Chuẩn bị cơ sở dữ liệu - Model
```php
// app/Models/Memo.php
class Memo extends Model
{
    use HasFactory;
    
    protected $fillable = ['title', 'content', 'user_id', 'image_path'];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

// app/Models/User.php
public function memos()
{
    return $this->hasMany(Memo::class);
}
```

### Slide 7: Chuẩn bị cơ sở dữ liệu - Migration
```php
// database/migrations/xxxx_create_memos_table.php
public function up()
{
    Schema::create('memos', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->text('content');
        $table->string('image_path')->nullable();
        $table->timestamps();
    });
}
```

### Slide 8: Xây dựng Backend - Routes
```php
// routes/web.php
Route::middleware('auth')->group(function () {
    Route::get('/memo', [MemoController::class, 'index'])->name('memo.view');
    Route::post('/memo', [MemoController::class, 'store'])->name('memo.store');
    Route::put('/memo/{memo}', [MemoController::class, 'update'])->name('memo.update');
    Route::delete('/memo/{memo}', [MemoController::class, 'destroy'])->name('memo.destroy');
    Route::post('/memo/upload-image', [MemoController::class, 'uploadImage'])->name('memo.upload-image');
});
```

### Slide 9: Xây dựng Backend - Controller (Phần 1)
```php
// app/Http/Controllers/MemoController.php
public function index()
{
    $memos = Auth::user()->memos()->orderBy('created_at', 'desc')->get();
    
    return Inertia::render('Memo/View', [
        'memos' => $memos
    ]);
}

public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);
    
    $memo = new Memo([
        'title' => $validated['title'],
        'content' => $validated['content'],
    ]);
    
    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $imageName = time() . '.' . $image->getClientOriginalExtension();
        $image->storeAs('public/memo_images', $imageName);
        $memo->image_path = 'memo_images/' . $imageName;
    }
    
    Auth::user()->memos()->save($memo);
    
    return response()->json(['memo' => $memo]);
}
```

### Slide 10: Xây dựng Backend - Controller (Phần 2)
```php
// app/Http/Controllers/MemoController.php
public function update(Request $request, Memo $memo)
{
    // Kiểm tra quyền
    if ($memo->user_id !== Auth::id()) {
        abort(403);
    }
    
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);
    
    $memo->title = $validated['title'];
    $memo->content = $validated['content'];
    
    if ($request->hasFile('image')) {
        // Xóa ảnh cũ nếu có
        if ($memo->image_path) {
            Storage::delete('public/' . $memo->image_path);
        }
        
        // Lưu ảnh mới
        $image = $request->file('image');
        $imageName = time() . '.' . $image->getClientOriginalExtension();
        $image->storeAs('public/memo_images', $imageName);
        $memo->image_path = 'memo_images/' . $imageName;
    } else if ($request->input('remove_image')) {
        // Xóa ảnh nếu người dùng chọn xóa
        if ($memo->image_path) {
            Storage::delete('public/' . $memo->image_path);
            $memo->image_path = null;
        }
    }
    
    $memo->save();
    
    return response()->json(['memo' => $memo]);
}

public function destroy(Memo $memo)
{
    // Kiểm tra quyền
    if ($memo->user_id !== Auth::id()) {
        abort(403);
    }
    
    // Xóa ảnh nếu có
    if ($memo->image_path) {
        Storage::delete('public/' . $memo->image_path);
    }
    
    $memo->delete();
    
    return response()->json(['success' => true]);
}

public function uploadImage(Request $request)
{
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);
    
    $image = $request->file('image');
    $imageName = time() . '.' . $image->getClientOriginalExtension();
    $image->storeAs('public/memo_images', $imageName);
    
    return response()->json([
        'url' => asset('storage/memo_images/' . $imageName),
        'path' => 'memo_images/' . $imageName
    ]);
}
```

### Slide 11: Xây dựng Frontend - Cấu trúc Component
```javascript
// resources/js/Pages/Memo/View.jsx
export default function View({ memos = [] }) {
    // States
    const [memoList, setMemoList] = useState(memos);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    
    // Form handling with useForm
    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: '',
        title: '',
        content: '',
        image: null,
        remove_image: false
    });
    
    // Event handlers
    const handleSubmit = (e) => { /* ... */ };
    const handleEdit = (memo) => { /* ... */ };
    const handleDelete = (id) => { /* ... */ };
    const handleImageChange = (e) => { /* ... */ };
    const handleRemoveImage = () => { /* ... */ };
    
    // Render UI
    return ( /* ... */ );
}
```

### Slide 12: Xây dựng Frontend - Xử lý Upload Hình Ảnh
```javascript
// Xử lý khi chọn hình ảnh
const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        // Cập nhật state data với file hình ảnh
        setData('image', file);
        
        // Tạo URL preview cho hình ảnh
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }
};

// Xử lý khi xóa hình ảnh
const handleRemoveImage = () => {
    setData('image', null);
    setData('remove_image', true);
    setImagePreview(null);
    
    // Reset file input
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
};
```

### Slide 13: Xây dựng Frontend - Form với Upload Hình Ảnh
```jsx
<div className="mb-4">
    <label className="block text-gray-700 font-medium mb-2">이미지</label>
    <div className="flex items-center space-x-4">
        <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200"
        >
            이미지 선택
        </button>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
        />
        {(imagePreview || (isEditing && data.image_path && !data.remove_image)) && (
            <button
                type="button"
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
                이미지 삭제
            </button>
        )}
    </div>
    
    {errors.image && <div className="text-red-500 mt-1 text-sm">{errors.image}</div>}
    
    {/* Hiển thị preview hình ảnh */}
    {imagePreview && (
        <div className="mt-4">
            <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-w-xs rounded-lg shadow-md" 
            />
        </div>
    )}
    
    {/* Hiển thị hình ảnh hiện tại khi đang edit */}
    {isEditing && data.image_path && !imagePreview && !data.remove_image && (
        <div className="mt-4">
            <img 
                src={`/storage/${data.image_path}`} 
                alt="Current" 
                className="max-w-xs rounded-lg shadow-md" 
            />
        </div>
    )}
</div>
```

### Slide 14: Xây dựng Frontend - Cập nhật Form Submit
```javascript
const handleSubmit = (e) => {
    e.preventDefault();
    
    // Tạo FormData để gửi file
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    
    if (data.image) {
        formData.append('image', data.image);
    }
    
    if (data.remove_image) {
        formData.append('remove_image', true);
    }
    
    if (isEditing) {
        // Cập nhật memo với hình ảnh
        axios.post(`${route('memo.update', data.id)}?_method=PUT`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            // Cập nhật UI và hiển thị thông báo
            const updatedList = memoList.map(memo => 
                memo.id === data.id ? response.data.memo : memo
            );
            setMemoList(updatedList);
            closeModal();
            showNotification('success', '메모가 성공적으로 업데이트되었습니다!');
        })
        .catch(error => {
            console.error('Error updating memo:', error);
            showNotification('error', '메모 업데이트 중 오류가 발생했습니다.');
        });
    } else {
        // Thêm memo mới với hình ảnh
        axios.post(route('memo.store'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            // Cập nhật UI và hiển thị thông báo
            setMemoList([...memoList, response.data.memo]);
            closeModal();
            showNotification('success', '새 메모가 성공적으로 생성되었습니다!');
        })
        .catch(error => {
            console.error('Error creating memo:', error);
            showNotification('error', '메모 생성 중 오류가 발생했습니다.');
        });
    }
};
```

### Slide 15: Xây dựng Frontend - Hiển thị Hình Ảnh trong Danh Sách
```jsx
<div key={memo.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
    <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-gray-800">{memo.title}</h2>
        <div className="flex space-x-3">
            <button 
                onClick={() => handleEdit(memo)}
                className="text-blue-500 hover:text-blue-700 transition duration-200"
                title="메모 수정"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
            <button 
                onClick={() => handleDelete(memo.id)}
                className="text-red-500 hover:text-red-700 transition duration-200"
                title="메모 삭제"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    </div>
    
    {/* Hiển thị hình ảnh nếu có */}
    {memo.image_path && (
        <div className="mt-3">
            <img 
                src={`/storage/${memo.image_path}`} 
                alt={memo.title} 
                className="rounded-lg max-h-64 object-cover"
                onClick={() => window.open(`/storage/${memo.image_path}`, '_blank')}
                style={{ cursor: 'pointer' }}
            />
        </div>
    )}
    
    <p className="mt-3 text-gray-700 whitespace-pre-line">{memo.content}</p>
    <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
        <p>
            작성일: {new Date(memo.created_at).toLocaleString('ko-KR')}
        </p>
        {memo.updated_at !== memo.created_at && (
            <p>
                수정일: {new Date(memo.updated_at).toLocaleString('ko-KR')}
            </p>
        )}
    </div>
</div>
```

### Slide 16: Cấu hình Storage Link

```bash
# Tạo symbolic link từ public/storage đến storage/app/public
php artisan storage:link
```

```php
// config/filesystems.php
'disks' => [
    // ...
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
    ],
    // ...
],
```

## Tài liệu tham khảo

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
