// 后端API基础URL
const API_BASE_URL = 'http://localhost:8081/api';

// 处理登录
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        
        // 简单的本地验证，用于演示目的
        // 特殊的管理员账户
        if (username === 'duojiesangzhou' && password === 'djsz823638gab') {
            const currentUser = { 
                username: username, 
                isAdmin: true,
                id: 1
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.href = 'index.html';
        } else if (username && password) {
            // 普通用户账户
            const currentUser = { 
                username: username, 
                isAdmin: false,
                id: Date.now() // 简单生成唯一ID
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.href = 'index.html';
        } else {
            alert('用户名或密码错误！');
        }
    });
}

// 处理注册
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('regEmail').value;
        
        // 检查密码一致性
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致！');
            return;
        }
        
        // 检查密码长度
        if (password.length < 6) {
            alert('密码长度不能少于 6 位');
            return;
        }
        
        
        // 本地注册逻辑，用于演示目的
        if (username && password && email) {
            alert('注册成功！');
            // 注册成功后自动切换到登录标签
            document.querySelector('.tablinks:first-child').click();
        } else {
            alert('请填写完整的注册信息');
        }
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
