// 后端API基础URL
const API_BASE_URL = 'http://localhost:8081/api';

// 处理登录
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            console.log('正在尝试登录到:', `${API_BASE_URL}/auth/login`);
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                const userData = await response.json();
                const currentUser = { 
                    username: userData.username, 
                    isAdmin: userData.admin || false,
                    id: userData.id
                };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                window.location.href = 'index.html';
            } else {
                const errorMsg = await response.text();
                alert(errorMsg || '用户名或密码错误！');
            }
        } catch (error) {
            console.error('登录请求失败:', error);
            // 添加更多调试信息
            alert('登录失败，请检查后端服务是否运行以及网络连接。\n错误详情: ' + error.message);
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
        
        try {
            console.log('正在尝试注册到:', `${API_BASE_URL}/auth/register`);
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email })
            });
            
            if (response.ok) {
                alert('注册成功！');
                // 注册成功后自动切换到登录标签
                document.querySelector('.tablinks:first-child').click();
            } else {
                const errorMsg = await response.text();
                alert(errorMsg || '注册失败');
            }
        } catch (error) {
            console.error('注册请求失败:', error);
            // 添加更多调试信息
            alert('注册失败，请检查后端服务是否运行以及网络连接。\n错误详情: ' + error.message);
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
