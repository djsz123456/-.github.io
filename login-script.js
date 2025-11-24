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
        const email = document.getElementById('regEmail').value;
        
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
        
        // 显示邮箱验证界面
        showEmailVerification(username, password, email);
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

// 邮箱验证功能
function showEmailVerification(username, password, email) {
    // 生成6位随机验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 在实际应用中，这里应该调用邮件服务API发送验证码到用户邮箱
    // 为了演示目的，我们将验证码显示在控制台
    console.log(`发送到邮箱 ${email} 的验证码是: ${verificationCode}`);
    
    // 创建邮箱验证界面
    const verificationHTML = `
        <h2>邮箱验证</h2>
        <p>验证码已发送至您的邮箱: ${email}</p>
        <label for="verificationCode">请输入验证码:</label>
        <input type="text" id="verificationCode" required>
        <button id="verifyButton">验证</button>
        <button id="resendCodeButton">重新发送验证码</button>
        <div id="verificationError" class="error-message" style="display: none;"></div>
    `;
    
    // 替换注册表单内容
    const registerTab = document.getElementById('register');
    registerTab.innerHTML = verificationHTML;
    
    // 绑定验证按钮事件
    document.getElementById('verifyButton').addEventListener('click', function() {
        const enteredCode = document.getElementById('verificationCode').value;
        const errorDiv = document.getElementById('verificationError');
        
        if (enteredCode === verificationCode) {
            // 验证成功，保存用户信息
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            alert('注册成功！');
            
            // 注册成功后自动切换到登录标签
            document.querySelector('.tablinks:first-child').click();
        } else {
            errorDiv.textContent = '验证码错误，请重新输入';
            errorDiv.style.display = 'block';
        }
    });
    
    // 绑定重新发送验证码按钮事件
    document.getElementById('resendCodeButton').addEventListener('click', function() {
        // 重新生成验证码并显示提示
        console.log(`重新发送到邮箱 ${email} 的验证码是: ${verificationCode}`);
        alert('验证码已重新发送，请检查您的邮箱');
    });
}
