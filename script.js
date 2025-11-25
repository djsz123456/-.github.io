// 管理员账号信息
const ADMIN_USERNAME = "duojiesangzhou";
const ADMIN_PASSWORD = "djsz823638gab";

// 后端API基础URL
const API_BASE_URL = 'http://localhost:8081/api';

// 模拟数据库存储
let users = JSON.parse(localStorage.getItem('users')) || {};
let files = [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// 添加菜单项与文件分类的映射
let menuCategories = [
    "数据结构",
    "四级英语试卷",
    "六级英语试卷",
    "Java基础知识",
    "Python基础知识",
    "高考数学",
    "高考物理",
    "高考化学",
    "高考语文",
    "高考生物",
    "高考英语",
    "C++基础知识",
    "C语言经典题型"
];

// 评论数据存储
let comments = JSON.parse(localStorage.getItem('comments')) || {};

// DOM元素
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const fileList = document.getElementById('fileList');
const fileListSection = document.getElementById('fileListSection');
const fileUploadSection = document.getElementById('fileUploadSection');

// 当前选中的菜单项
let currentCategory = "";

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    updateUI();
    loadFileList();
    
    // 绑定事件
    if (document.getElementById('uploadForm')) {
        document.getElementById('uploadForm').addEventListener('submit', handleFileUpload);
    }
    
    if (loginBtn) loginBtn.addEventListener('click', () => {
        if (loginModal) loginModal.style.display = 'block';
    });
    if (registerBtn) registerBtn.addEventListener('click', () => {
        if (registerModal) registerModal.style.display = 'block';
    });
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    
    // 关闭模态框
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) registerModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (loginModal && event.target === loginModal) loginModal.style.display = 'none';
        if (registerModal && event.target === registerModal) registerModal.style.display = 'none';
    });
    
    // 为菜单项添加点击事件 - 修复点击事件
    document.querySelectorAll('.menu-item:not(#bookmarkFeature)').forEach((item, index) => {
        item.addEventListener('click', function(e) {
            // 移除所有菜单项的活动状态
            document.querySelectorAll('.menu-item').forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            
            // 为当前点击的菜单项添加活动状态
            this.classList.add('active');
            
            // 设置当前选中的分类
            if (index < menuCategories.length) {
                currentCategory = menuCategories[index];
                loadFileList(); // 重新加载文件列表
            }
        });
    });
});

// 更新界面状态
function updateUI() {
    if (currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (userInfo) userInfo.textContent = `欢迎, ${currentUser.username}`;
        
        // 如果是管理员，显示上传区域
        if (currentUser.isAdmin && fileUploadSection) {
            fileUploadSection.style.display = 'block';
        }
        
        // 显示管理员控制按钮
        if (currentUser.isAdmin) {
            const adminControls = document.getElementById('adminControls');
            if (adminControls) adminControls.style.display = 'block';
        }
        
        // 显示文件列表区域
        if (fileListSection) fileListSection.style.display = 'block';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userInfo) userInfo.textContent = '';
        if (fileUploadSection) fileUploadSection.style.display = 'none';
        
        // 隐藏文件列表区域，显示登录提示
        if (fileListSection) fileListSection.style.display = 'none';
    }
}

// 加载文件列表
async function loadFileList() {
    // 只有登录用户才能查看文件列表
    if (!currentUser) {
        if (fileList) fileList.innerHTML = '<p>请登录后查看文件资料</p>';
        return;
    }
    
    if (!fileList) return;
    
    // 如果没有选中任何分类，显示提示信息
    if (!currentCategory) {
        fileList.innerHTML = '<p>请从左侧菜单选择一个分类查看文件</p>';
        return;
    }
    
    try {
        // 从后端获取指定分类的文件
        const response = await fetch(`${API_BASE_URL}/files/category/${encodeURIComponent(currentCategory)}`);
        if (response.ok) {
            files = await response.json();
        } else {
            files = [];
        }
    } catch (error) {
        console.error('获取文件列表失败:', error);
        files = [];
    }
    
    fileList.innerHTML = '';
    
    // 显示当前分类标题
    const categoryTitle = document.createElement('h3');
    categoryTitle.textContent = `${currentCategory} - 文件列表`;
    fileList.appendChild(categoryTitle);
    
    if (files.length === 0) {
        fileList.innerHTML += '<p>该分类下暂无文件</p>';
    } else {
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <h3>${file.name}</h3>
                    <p>大小: ${formatFileSize(file.size)} | 上传时间: ${new Date(file.uploadTime).toLocaleString()}</p>
                </div>
                <button class="download-btn" onclick="downloadFile(${file.id})">下载</button>
            `;
            fileList.appendChild(fileItem);
        });
    }
    
    // 添加评论区
    addCommentSection();
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 处理登出
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
    loadFileList();
    // 登出后跳转到登录页面
    window.location.href = 'login.html';
}

// 处理文件上传
async function handleFileUpload(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    
    if (!fileInput || !fileInput.files.length) {
        alert('请选择文件！');
        return;
    }
    
    // 检查是否选择了分类
    if (!currentCategory) {
        alert('请先从左侧菜单选择一个分类！');
        // 添加视觉提示，闪烁未选择的分类提示
        const fileListTitle = document.querySelector('#fileList h3');
        if (fileListTitle) {
            fileListTitle.style.color = 'red';
            fileListTitle.style.fontWeight = 'bold';
            setTimeout(() => {
                fileListTitle.style.color = '';
                fileListTitle.style.fontWeight = '';
            }, 2000);
        }
        return;
    }
    
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', currentCategory);
    
    try {
        const response = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('文件上传成功！');
            fileInput.value = ''; // 清空文件输入
            loadFileList(); // 重新加载文件列表
        } else {
            const errorMsg = await response.text();
            alert(`文件上传失败: ${errorMsg}`);
        }
    } catch (error) {
        console.error('上传文件失败:', error);
        alert('文件上传失败，请稍后重试');
    }
}

// 下载文件
async function downloadFile(fileId) {
    // 确保用户已登录才能下载文件
    if (!currentUser) {
        alert('请先登录再下载文件');
        return;
    }
    
    try {
        // 创建下载链接
        const downloadUrl = `${API_BASE_URL}/files/download/${fileId}`;
        window.open(downloadUrl, '_blank');
    } catch (error) {
        console.error('下载文件失败:', error);
        alert('文件下载失败，请稍后重试');
    }
}

// 添加评论区功能
function addCommentSection() {
    if (!currentCategory || !fileList) return;
    
    // 创建评论区容器
    const commentSection = document.createElement('div');
    commentSection.className = 'comment-section';
    commentSection.innerHTML = `
        <h3>评论区</h3>
        <div class="comment-form">
            <textarea id="commentContent" placeholder="请输入您的评论..." rows="3"></textarea>
            <button id="submitComment">发表评论</button>
        </div>
        <div id="commentsList"></div>
    `;
    
    fileList.appendChild(commentSection);
    
    // 绑定发表评论事件
    document.getElementById('submitComment').addEventListener('click', submitComment);
    
    // 加载并显示评论
    loadComments();
}

// 提交评论
function submitComment() {
    if (!currentUser) {
        alert('请先登录后再发表评论');
        return;
    }
    
    const commentContent = document.getElementById('commentContent').value.trim();
    if (!commentContent) {
        alert('评论内容不能为空');
        return;
    }
    
    // 初始化该分类的评论数组
    if (!comments[currentCategory]) {
        comments[currentCategory] = [];
    }
    
    // 添加新评论
    const newComment = {
        id: Date.now(),
        username: currentUser.username,
        content: commentContent,
        timestamp: new Date().toLocaleString()
    };
    
    comments[currentCategory].push(newComment);
    
    // 保存到本地存储
    localStorage.setItem('comments', JSON.stringify(comments));
    
    // 清空输入框
    document.getElementById('commentContent').value = '';
    
    // 重新加载评论
    loadComments();
}

// 加载并显示评论
function loadComments() {
    if (!currentCategory) return;
    
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    // 获取当前分类的评论
    const categoryComments = comments[currentCategory] || [];
    
    // 清空现有评论
    commentsList.innerHTML = '';
    
    // 如果没有评论，显示提示信息
    if (categoryComments.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">暂无评论，快来发表第一条评论吧！</p>';
        return;
    }
    
    // 按时间倒序排列评论
    const sortedComments = [...categoryComments].sort((a, b) => b.id - a.id);
    
    // 显示评论
    sortedComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        commentElement.innerHTML = `
            <div class="comment-header">
                <span class="comment-user">${comment.username}</span>
                <span class="comment-time">${comment.timestamp}</span>
            </div>
            <div class="comment-content">${comment.content}</div>
        `;
        commentsList.appendChild(commentElement);
    });
}
