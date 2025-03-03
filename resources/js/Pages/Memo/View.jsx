import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function View({ memos = [] }) {
    const { auth } = usePage().props;
    const [memoList, setMemoList] = useState(memos);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const modalRef = useRef(null);
    
    // Thêm state để quản lý thông báo
    const [notification, setNotification] = useState({
        show: false,
        type: '', // 'success', 'error', 'warning'
        message: ''
    });
    
    // Khởi tạo form với useForm hook từ Inertia
    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: '',
        title: '',
        content: '',
    });
    
    // Xử lý click bên ngoài modal để đóng modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };
        
        if (showModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showModal]);
    
    // Hàm đóng modal và reset form
    const closeModal = () => {
        setShowModal(false);
        // Thêm timeout để tạo hiệu ứng đóng mượt mà
        setTimeout(() => {
            reset();
            setIsEditing(false);
        }, 300);
    };
    
    // Hàm hiển thị thông báo
    const showNotification = (type, message) => {
        // Hiển thị thông báo
        setNotification({
            show: true,
            type,
            message
        });
        
        // Tự động ẩn thông báo sau 3 giây
        setTimeout(() => {
            setNotification(prev => ({...prev, show: false}));
        }, 1000);
    };
    
    // Xử lý khi submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            // Cập nhật memo bằng axios thay vì Inertia để tránh chuyển hướng
            axios.put(route('memo.update', data.id), {
                title: data.title,
                content: data.content
            })
            .then(response => {
                // Cập nhật danh sách memo sau khi sửa
                const updatedList = memoList.map(memo => 
                    memo.id === data.id ? { ...memo, title: data.title, content: data.content } : memo
                );
                setMemoList(updatedList);
                
                // Đóng modal và reset form
                closeModal();
                
                // Hiển thị thông báo thành công
                showNotification('success', '메모가 성공적으로 업데이트되었습니다!');
            })
            .catch(error => {
                console.error('Error updating memo:', error);
                showNotification('error', '메모 업데이트 중 오류가 발생했습니다.');
                
                // Xử lý lỗi validation nếu có
                if (error.response && error.response.data && error.response.data.errors) {
                    const responseErrors = {};
                    Object.keys(error.response.data.errors).forEach(key => {
                        responseErrors[key] = error.response.data.errors[key][0];
                    });
                    // Cập nhật state errors nếu bạn có
                    // setErrors(responseErrors);
                }
            });
        } else {
            // Thêm memo mới bằng axios thay vì Inertia để tránh chuyển hướng
            axios.post(route('memo.store'), {
                title: data.title,
                content: data.content
            }, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                // Thêm memo mới vào danh sách
                setMemoList([...memoList, response.data.memo]);
                
                // Đóng modal và reset form
                closeModal();
                
                // Hiển thị thông báo thành công
                showNotification('success', '새 메모가 성공적으로 생성되었습니다!');
            })
            .catch(error => {
                console.error('Error creating memo:', error);
                showNotification('error', '메모 생성 중 오류가 발생했습니다.');
                
                // Xử lý lỗi validation nếu có
                if (error.response && error.response.data && error.response.data.errors) {
                    const responseErrors = {};
                    Object.keys(error.response.data.errors).forEach(key => {
                        responseErrors[key] = error.response.data.errors[key][0];
                    });
                    // Cập nhật state errors nếu bạn có
                    // setErrors(responseErrors);
                }
            });
        }
    };
    
    // Xử lý khi click vào nút sửa
    const handleEdit = (memo) => {
        // Điền dữ liệu memo vào form
        setData({
            id: memo.id,
            title: memo.title,
            content: memo.content,
        });
        // Đặt trạng thái đang sửa và hiển thị modal
        setIsEditing(true);
        setShowModal(true);
    };
    
    // Xử lý khi click vào nút xóa
    const handleDelete = (id) => {
        // Hiển thị hộp thoại xác nhận trước khi xóa
        if (confirm('메모를 삭제하시겠습니까?')) {
            // Gửi request DELETE đến server
            axios.delete(route('memo.destroy', id), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                // Xóa memo khỏi danh sách sau khi xóa thành công
                const filteredList = memoList.filter(memo => memo.id !== id);
                setMemoList(filteredList);
                
                // Hiển thị thông báo thành công
                showNotification('success', '메모가 성공적으로 삭제되었습니다!');
            })
            .catch(error => {
                console.error('Error deleting memo:', error);
                showNotification('error', '메모 삭제 중 오류가 발생했습니다.');
            });
        }
    };
    
    return (
        <AuthenticatedLayout>
            <Head title="서울대학교병원-메모" />

            <div className="p-4">
                {/* Hiển thị thông báo */}
                {notification.show && (
                    <div className={`mb-4 p-4  rounded-lg shadow-lg transition-all duration-500 transform translate-y-0 opacity-100 ${
                        notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
                        notification.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
                        notification.type === 'warning' ? 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700' :
                        'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
                    }`}>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {notification.type === 'success' && (
                                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {notification.type === 'error' && (
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {notification.type === 'warning' && (
                                    <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">{notification.message}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <div className="-mx-1.5 -my-1.5">
                                    <button
                                        onClick={() => setNotification(prev => ({...prev, show: false}))}
                                        className={`inline-flex rounded-md p-1.5 ${
                                            notification.type === 'success' ? 'text-green-500 hover:bg-green-200' :
                                            notification.type === 'error' ? 'text-red-500 hover:bg-red-200' :
                                            notification.type === 'warning' ? 'text-yellow-500 hover:bg-yellow-200' :
                                            'text-blue-500 hover:bg-blue-200'
                                        } focus:outline-none`}
                                    >
                                        <span className="sr-only">닫기</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tiêu đề và nút thêm mới */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">메모</h1>
                    <button 
                        onClick={() => {
                            reset();
                            setIsEditing(false);
                            setShowModal(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-md flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        새 메모 작성
                    </button>
                </div>
                
                {/* Modal thêm/sửa memo */}
                {showModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            {/* Overlay */}
                            <div 
                                className="fixed inset-0 transition-opacity" 
                                aria-hidden="true"
                            >
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>

                            {/* Modal */}
                            <div 
                                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                                ref={modalRef}
                            >
                                {/* Modal header */}
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {isEditing ? '메모 수정' : '새 메모 작성'}
                                    </h3>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                                
                                {/* Modal body */}
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-medium mb-2">제목</label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={e => setData('title', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                                required
                                                placeholder="메모 제목을 입력하세요"
                                            />
                                            {errors.title && <div className="text-red-500 mt-1 text-sm">{errors.title}</div>}
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-medium mb-2">내용</label>
                                            <textarea
                                                value={data.content}
                                                onChange={e => setData('content', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                                required
                                                placeholder="메모 내용을 입력하세요"
                                            ></textarea>
                                            {errors.content && <div className="text-red-500 mt-1 text-sm">{errors.content}</div>}
                                        </div>
                                    </form>
                                </div>
                                
                                {/* Modal footer */}
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                                            isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'
                                        } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                            isEditing ? 'focus:ring-yellow-500' : 'focus:ring-blue-500'
                                        } sm:ml-3 sm:w-auto sm:text-sm transition duration-200`}
                                    >
                                        {isEditing ? '수정하기' : '저장하기'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition duration-200"
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Danh sách memo */}
                <div className="space-y-4">
                    {memoList.length > 0 ? (
                        memoList.map(memo => (
                            <div key={memo.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-lg font-semibold text-gray-800">{memo.title}</h2>
                                    <div className="flex space-x-3">
                                        <button 
                                            onClick={() => handleEdit(memo)}
                                            className="text-blue-500 hover:text-blue-700 transition duration-200"
                                            title="메모 수정"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(memo.id)}
                                            className="text-red-500 hover:text-red-700 transition duration-200"
                                            title="메모 삭제"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-3 text-gray-700 whitespace-pre-line">{memo.content}</p>
                                <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                                    <p>
                                        작성일: {new Date(memo.created_at).toLocaleString('ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    {memo.updated_at !== memo.created_at && (
                                        <p>
                                            수정일: {new Date(memo.updated_at).toLocaleString('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">메모가 없습니다</h3>
                            <p className="mt-1 text-sm text-gray-500">새 메모를 작성해보세요.</p>
                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        reset();
                                        setIsEditing(false);
                                        setShowModal(true);
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    새 메모 작성
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}