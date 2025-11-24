// 管理员账号信息
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// 模拟数据库存储
let users = JSON.parse(localStorage.getItem('users')) || {};
let files = JSON.parse(localStorage.getItem('files')) || [];
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
    
    // 为菜单项添加点击事件
    document.querySelectorAll('.menu-item:not(#bookmarkFeature)').forEach((item, index) => {
        item.addEventListener('click', function() {
            // 切换展开/收起状态
            this.classList.toggle('expanded');
            
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
function loadFileList() {
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
    
    // 过滤出当前分类的文件
    const categoryFiles = files.filter(file => file.category === currentCategory);
    
    fileList.innerHTML = '';
    
    // 显示当前分类标题
    const categoryTitle = document.createElement('h3');
    categoryTitle.textContent = `${currentCategory} - 文件列表`;
    fileList.appendChild(categoryTitle);
    
    if (categoryFiles.length === 0) {
        fileList.innerHTML += '<p>该分类下暂无文件</p>';
        return;
    }
    
    categoryFiles.forEach(file => {
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
    
    if (!fileInput || !fileInput.files.length) {
        alert('请选择文件！');
        return;
    }
    
    // 检查是否选择了分类
    if (!currentCategory) {
        alert('请先从左侧菜单选择一个分类！');
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
            uploadTime: new Date().getTime(),
            category: currentCategory // 将文件与当前选中的分类关联
        });
    }
    
    localStorage.setItem('files', JSON.stringify(files));
    loadFileList(); // 重新加载文件列表
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
