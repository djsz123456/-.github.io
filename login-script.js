// 管理员账号信息
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// 模拟数据库存储
let users = JSON.parse(localStorage.getItem('users')) || {};

// 处理登录
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 检查是否为管理员
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const currentUser = { username: ADMIN_USERNAME, isAdmin: true };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'index.html';
        return;
    }
    
    // 检查普通用户
    if (users[username] && users[username] === password) {
        const currentUser = { username, isAdmin: false };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'index.html';
        return;
    }
    
    alert('用户名或密码错误！');
});

// 处理注册
document.getElementById('registerForm').addEventListener('submit', function(e) {
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
    
    // 注册成功后自动切换到登录标签
    document.querySelector('.tablinks:first-child').click();
});