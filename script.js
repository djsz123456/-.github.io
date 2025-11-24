// 管理员账号信息
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// 模拟数据库存储
let users = JSON.parse(localStorage.getItem('users')) || {};
let files = JSON.parse(localStorage.getItem('files')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

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

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 检查用户是否已经登录，如果没有则跳转到登录页面
    if (!currentUser && window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
        return;
    }
    
    updateUI();
    loadFileList();
    
    // 绑定事件
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
    }
    document.getElementById('uploadForm').addEventListener('submit', handleFileUpload);
    
    if (loginBtn) loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
    if (registerBtn) registerBtn.addEventListener('click', () => registerModal.style.display = 'block');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    
    // 关闭模态框
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) loginModal.style.display = 'none';
        if (event.target === registerModal) registerModal.style.display = 'none';
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
        if (currentUser.username === ADMIN_USERNAME) {
            fileUploadSection.style.display = 'block';
        }
        
        // 显示文件列表区域
        fileListSection.style.display = 'block';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userInfo) userInfo.textContent = '';
        fileUploadSection.style.display = 'none';
        
        // 隐藏文件列表区域，显示登录提示
        fileListSection.style.display = 'none';
    }
}

// 加载文件列表
function loadFileList() {
    // 只有登录用户才能查看文件列表
    if (!currentUser) {
        if (fileList) fileList.innerHTML = '<p>请登录后查看文件资料</p>';
        return;
    }
    
    if (!fileList) return;
    
    fileList.innerHTML = '';
    
    if (files.length === 0) {
        fileList.innerHTML = '<p>暂无文件</p>';
        return;
    }
    
    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <h3>${file.name}</h3>
                <p>大小: ${formatFileSize(file.size)} | 上传时间: ${new Date(file.uploadTime).toLocaleString()}</p>
            </div>
            <button class="download-btn" onclick="downloadFile('${file.id}')">下载</button>
        `;
        fileList.appendChild(fileItem);
    });
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 检查是否为管理员
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        currentUser = { username: ADMIN_USERNAME, isAdmin: true };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loginModal.style.display = 'none';
        updateUI();
        loadFileList();
        return;
    }
    
    // 检查普通用户
    if (users[username] && users[username] === password) {
        currentUser = { username, isAdmin: false };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        loginModal.style.display = 'none';
        updateUI();
        loadFileList();
        return;
    }
    
    alert('用户名或密码错误！');
}

// 处理注册
function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    
    if (username === ADMIN_USERNAME) {
        alert('该用户名已被占用！');
        return;
    }
    
    if (users[username]) {
        alert('用户名已存在！');
        return;
    }
    
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    alert('注册成功！');
    registerModal.style.display = 'none';
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
function handleFileUpload(e) {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    
    if (!fileInput.files.length) {
        alert('请选择文件！');
        return;
    }
    
    // 模拟文件上传
    for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        const fileId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        files.push({
            id: fileId,
            name: file.name,
            size: file.size,
            uploadTime: new Date().getTime()
        });
    }
    
    localStorage.setItem('files', JSON.stringify(files));
    loadFileList();
    alert('文件上传成功！');
    fileInput.value = ''; // 清空文件输入
}

// 模拟文件下载
function downloadFile(fileId) {
    // 确保用户已登录才能下载文件
    if (!currentUser) {
        alert('请先登录再下载文件');
        return;
    }
    
    const file = files.find(f => f.id === fileId);
    if (file) {
        // 创建一个虚拟链接用于下载
        const link = document.createElement('a');
        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`这是${file.name}的内容示例`);
        link.download = file.name;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}