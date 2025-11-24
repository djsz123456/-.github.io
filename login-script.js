// 管理员账号信息
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// 模拟数据库存储
let users = JSON.parse(localStorage.getItem('users')) || {};

// 处理登录
if (document.getElementById('loginForm')) {
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
}

// 处理注册
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // 检查密码一致性
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致！');
            return;
        }
        
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
}

// Tab切换功能
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.className += " active";
}

// 密码验证逻辑
if (document.getElementById('regPassword')) {
    document.getElementById('regPassword').addEventListener('input', validatePassword);
}
if (document.getElementById('confirmPassword')) {
    document.getElementById('confirmPassword').addEventListener('input', validatePassword);
}

function validatePassword() {
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('passwordError');
    
    // 检查密码长度
    if (password.length < 6) {
        errorDiv.textContent = '密码长度不能少于 6 位';
        errorDiv.style.display = 'block';
        return false;
    }
    
    // 检查密码一致性
    if (confirmPassword && password !== confirmPassword) {
        errorDiv.textContent = '两次输入的密码不一致';
        errorDiv.style.display = 'block';
        return false;
    }
    
    // 隐藏错误信息
    errorDiv.style.display = 'none';
    return true;
}
