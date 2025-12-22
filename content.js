(function() {
    'use strict';

    // === 1. CONFIG & STATE ===
    const CONFIG = { baseUrl: window.location.origin, loginPath: '/Account/Login', homePath: '/' };
    const STORAGE_KEY = 'husc_tool_state_v1-0-0'; 
    const UI_ID = 'husc-tool-v1-0-0';

    const loadStateSync = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e) { return null; } };
    const savedData = loadStateSync();
    const initialMinimized = savedData ? savedData.minimized : true;

    if (document.getElementById(UI_ID)) document.getElementById(UI_ID).remove();

    // Load FontAwesome
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const el = document.createElement('link');
        el.rel = 'stylesheet';
        el.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(el);
    }

    // === 2. CSS ===
    const STYLES = `
        #${UI_ID} {
            position: fixed; top: 10px; right: 10px;
            width: 850px; max-width: 95vw; height: 550px; max-height: 90vh;
            background: #fff; border: 1px solid #337ab7;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            border-radius: 4px; z-index: 2147483647;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px;
            display: flex; flex-direction: column; overflow: hidden;
        }
        #${UI_ID}.minimized {
            width: 50px !important; height: 50px !important; border-radius: 50%;
            top: auto; bottom: 30px; right: 30px;
            border: 2px solid #fff; background: #337ab7;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            cursor: pointer; justify-content: center; align-items: center;
            overflow: visible !important;
        }
        #${UI_ID}.minimized * { display: none !important; }
        #${UI_ID}.minimized .h-bubble, #${UI_ID}.minimized .h-bubble * { display: flex !important; }
        #${UI_ID}.minimized.has-alert { background: #d9534f; border-color: #d9534f; }

        .h-bubble { display: none; color: white; font-size: 24px; width: 100%; height: 100%; justify-content: center; align-items: center; position: relative; }
        .h-bubble-badge {
            position: absolute; top: -8px; right: -8px;
            background: #d9534f; color: white; font-size: 11px; font-weight: bold;
            padding: 3px 7px; border-radius: 12px; border: 2px solid #fff; 
            display: none; box-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 9999;
        }

        .h-head { background: #337ab7; color: white; padding: 8px 12px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        .h-win-ctrl i { cursor: pointer; margin-left: 10px; opacity: 0.8; font-size: 14px; } .h-win-ctrl i:hover { opacity: 1; }

        .h-tabs-bar { display: flex; background: #f5f5f5; border-bottom: 1px solid #ddd; padding: 4px 4px 0 4px; overflow-x: auto; flex-shrink: 0; }
        .h-tabs-bar::-webkit-scrollbar { height: 2px; }
        .h-tab { display: flex; align-items: center; padding: 6px 12px; cursor: pointer; background: #e9e9e9; border: 1px solid #ddd; border-bottom: none; margin-right: 2px; border-radius: 3px 3px 0 0; color: #555; min-width: 80px; max-width: 150px; font-weight: 500; }
        .h-tab.active { background: #fff; color: #337ab7; border-top: 2px solid #337ab7; padding-bottom: 7px; margin-bottom: -1px; z-index: 2; font-weight: 700; }
        .h-tab.ready { border-top: 2px solid #5cb85c !important; color: #5cb85c; }
        .h-tab-txt { flex-grow: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin-right: 5px; }
        .h-tab-close:hover { color: #d9534f; }

        .h-content { flex-grow: 1; overflow-y: auto; padding: 15px; position: relative; }
        .h-pane { display: none; } .h-pane.active { display: block; }

        .h-add-btn { padding: 4px 8px; cursor: pointer; color: #777; font-size: 14px; } .h-add-btn:hover { color: #337ab7; }
        .h-ctrl-grp { display: flex; margin-bottom: 15px; }
        .h-ctrl-input { flex-grow: 1; padding: 6px 10px; border: 1px solid #ccc; border-right: none; border-radius: 3px 0 0 3px; font-weight: bold; color: #333; }
        .h-ctrl-btn { padding: 6px 15px; background: #337ab7; color: white; border: 1px solid #2e6da4; border-radius: 0 3px 3px 0; cursor: pointer; font-weight: bold; }
        .h-ctrl-btn:hover { background: #286090; }

        .h-info-box { background: #d9edf7; color: #31708f; border: 1px solid #bce8f1; padding: 10px; border-radius: 3px; margin-bottom: 15px; font-size: 13px; }
        .h-row { display: flex; flex-direction: column; margin-bottom: 5px; }
        .h-row.head { font-weight: bold; border-bottom: 1px dashed #a5d0e2; padding-bottom: 5px; margin-bottom: 5px; color: #245269; flex-direction: row; }
        .h-lbl { font-weight: 600; font-size: 11px; color: #5bc0de; text-transform: uppercase; }
        .h-val { font-weight: 600; color: #333; }
        .text-red { color: #d9534f; font-weight: bold; font-size: 14px; }

        .h-input-cap { width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ccc; border-radius: 3px; text-align: center; font-size: 18px; font-weight: bold; outline: none; }
        .h-input-cap:focus { border-color: #337ab7; box-shadow: 0 0 3px rgba(51,122,183,0.5); }
        .h-btn-sub { width: 100%; padding: 10px; background: #5cb85c; color: white; border: 1px solid #4cae4c; border-radius: 3px; font-weight: bold; cursor: pointer; }
        .h-btn-sub:hover { background: #449d44; } .h-btn-sub:disabled { background: #ccc; border-color: #bbb; cursor: not-allowed; }
        .h-empty { text-align: center; color: #999; margin-top: 50px; }
        
        /* LOGIN FORM STYLES */
        .h-login-box { text-align: center; max-width: 300px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; background: #f9f9f9; border-radius: 5px; }
        .h-login-title { font-weight: bold; color: #d9534f; margin-bottom: 15px; }
        .h-input-login { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 3px; box-sizing: border-box; }
        .h-btn-login { width: 100%; padding: 8px; background: #337ab7; color: white; border: none; border-radius: 3px; font-weight: bold; cursor: pointer; }
        .h-btn-login:hover { background: #286090; }

        .hidden { display: none !important; }
    `;
    const style = document.createElement("style"); style.innerText = STYLES; document.head.appendChild(style);

    // === 3. HTML CORE ===
    const box = document.createElement('div');
    box.id = UI_ID;
    if (initialMinimized) box.className = 'minimized';
    
    box.innerHTML = `
        <div class="h-bubble" id="h-bubble-trigger">
            <i class="fa-solid fa-graduation-cap"></i>
            <div id="h-bubble-alert" class="h-bubble-badge">0</div>
        </div>
        <div class="h-head">
            <span><i class="fa-solid fa-list-check"></i> HUSC - Hỗ Trợ Đăng Ký Tín Chỉ </span>
            <div class="h-win-ctrl">
                <i class="fa-solid fa-minus" id="h-btn-minimize" title="Thu nhỏ"></i>
                <i class="fa-solid fa-xmark" id="h-btn-close" title="Tắt Tool"></i>
            </div>
        </div>
        <div class="h-tabs-bar" id="tabs-bar">
            <div class="h-add-btn" id="btn-add"><i class="fa-solid fa-plus"></i></div>
        </div>
        <div class="h-content" id="tabs-content"></div>
    `;
    document.body.appendChild(box);
    ['mousedown','click','keydown'].forEach(e => box.addEventListener(e, x => x.stopPropagation()));

    // === 4. EVENTS & STATE ===
    let TAB_COUNTER = 0, TAB_STATE = {}, MEMORY = { user: '', pass: '', loginToken: '', userFieldName: 'UserName' };

    const saveState = () => {
        const box = document.getElementById(UI_ID);
        if(!box) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            tabs: TAB_STATE,
            counter: TAB_COUNTER,
            minimized: box.classList.contains('minimized')
        }));
    };

    const setMinimize = (isMin) => {
        const box = document.getElementById(UI_ID);
        if(!box) return;
        if(isMin) box.classList.add('minimized'); else box.classList.remove('minimized');
        saveState();
    };
    const hardClose = () => { if(confirm("Xóa dữ liệu?")) { localStorage.removeItem(STORAGE_KEY); document.getElementById(UI_ID).remove(); } };

    document.getElementById('h-bubble-trigger').addEventListener('click', () => setMinimize(false));
    document.getElementById('h-btn-minimize').addEventListener('click', () => setMinimize(true));
    document.getElementById('h-btn-close').addEventListener('click', hardClose);
    document.getElementById('btn-add').addEventListener('click', () => createTab(null));

    const log = (id, msg, icon='fa-info-circle', color='#777') => {
        const el = document.getElementById(`log-${id}`);
        if(el) el.innerHTML = `<span style="color:${color}"><i class="fa-solid ${icon}"></i> ${msg}</span>`;
    };

    const updateGlobalAlert = () => {
        const count = document.querySelectorAll('.h-tab.ready').length;
        const ui = document.getElementById(UI_ID);
        const badge = document.getElementById('h-bubble-alert');
        if (count > 0) { ui.classList.add('has-alert'); badge.style.display='block'; badge.innerText=count; }
        else { ui.classList.remove('has-alert'); badge.style.display='none'; }
    };

    // === 5. AUTH LOGIC (FIXED) ===
    const detectUserField = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return {
            token: doc.querySelector('input[name="__RequestVerificationToken"]')?.value,
            field: Array.from(doc.querySelectorAll('input[type="text"]')).find(i => i.name?.match(/loginid|username/i))?.name || 'UserName'
        };
    };

    // Hàm login chủ động (trả về Promise true/false)
    const executeLogin = async (u, p) => {
        try {
            // Step 1: Get Token
            const res1 = await fetch(CONFIG.loginPath);
            const info = detectUserField(await res1.text());
            if (!info.token) return false;

            // Step 2: Post Login
            const params = new URLSearchParams();
            params.append('__RequestVerificationToken', info.token);
            params.append(info.field, u);
            params.append('Password', p);
            params.append('RememberMe', 'false');

            const res2 = await fetch(CONFIG.loginPath, { method:'POST', body:params, headers:{'Content-Type':'application/x-www-form-urlencoded'} });
            
            // Check redirect
            if (!res2.url.includes('Account/Login')) {
                // Thành công: Update MEMORY
                MEMORY.user = u;
                MEMORY.pass = p;
                MEMORY.loginToken = info.token;
                MEMORY.userFieldName = info.field;
                return true;
            }
            return false;
        } catch(e) { return false; }
    };

    // Render Login Form inside a Tab
    const showLoginUI = (id, tabWorkerCallback) => {
        const area = document.getElementById(`area-${id}`);
        area.innerHTML = `
            <div class="h-login-box">
                <div class="h-login-title"><i class="fa-solid fa-lock"></i> HẾT PHIÊN ĐĂNG NHẬP</div>
                <div style="font-size:12px;margin-bottom:10px;color:#555;">Vui lòng đăng nhập lại để tiếp tục</div>
                <input type="text" id="login-u-${id}" class="h-input-login" placeholder="Mã Sinh Viên" value="${MEMORY.user||''}">
                <input type="password" id="login-p-${id}" class="h-input-login" placeholder="Mật Khẩu" value="${MEMORY.pass||''}">
                <button id="btn-login-${id}" class="h-btn-login">ĐĂNG NHẬP</button>
            </div>
        `;
        
        const btn = document.getElementById(`btn-login-${id}`);
        const handleLogin = async () => {
            const u = document.getElementById(`login-u-${id}`).value.trim();
            const p = document.getElementById(`login-p-${id}`).value.trim();
            if(!u || !p) return alert("Vui lòng nhập đủ thông tin!");
            
            btn.disabled = true; btn.innerText = "Đang kết nối...";
            
            if (await executeLogin(u, p)) {
                // Login thành công -> Restart Worker
                area.innerHTML = `<div class="h-empty"><i class="fa-solid fa-check"></i> Đăng nhập thành công!</div>`;
                tabWorkerCallback(); // Gọi lại worker
            } else {
                btn.disabled = false; btn.innerText = "ĐĂNG NHẬP LẠI";
                alert("Đăng nhập thất bại! Kiểm tra lại Mã SV/Mật khẩu.");
            }
        };
        
        btn.addEventListener('click', handleLogin);
        document.getElementById(`login-p-${id}`).addEventListener('keydown', (e)=>{if(e.key==='Enter') handleLogin();});
    };

    // --- WORKER ---
    const extractDetails = (doc) => {
        let info = { name: '...', gv: '?', tkb: '?', current: '0', min: '0', max: '0' };
        doc.querySelectorAll('.row.form-group').forEach(r => {
            const t = r.innerText||"";
            if(t.includes("Tên lớp") || t.includes("Lớp học phần")) info.name = r.querySelector('.form-control-static')?.innerText.trim() || info.name;
            if(t.includes("Giảng viên")) info.gv = r.querySelector('.form-control-static')?.innerText.trim()||"?";
            if(t.includes("Thời khóa biểu")) info.tkb = r.querySelector('.form-control-static')?.innerText.trim()||"?";
            if(t.includes("Số SV")||t.includes("Đã đăng ký")) {
                const n = r.querySelectorAll('.form-control-static');
                if(n.length>=3) { info.min=n[0].innerText.trim(); info.max=n[1].innerText.trim(); info.current=n[2].innerText.trim(); }
            }
        });
        return info;
    };

    const startTabWorker = async (id) => {
        const tabBtn = document.getElementById(`tab-btn-${id}`);
        
        // Loop chính
        while (true) {
            if(TAB_STATE[id].killed) break;
            const code = TAB_STATE[id].code;
            if(!code) { await new Promise(r=>setTimeout(r,500)); continue; }

            let success = false, html = null;
            
            try {
                log(id, 'Đang tìm...', 'fa-spinner fa-spin', '#f0ad4e');
                
                // Fetch form
                const res = await fetch(`/Studying/CourseRegistration/${code}/`, { headers:{'X-Requested-With':'XMLHttpRequest'} });
                
                // CHECK LOGIN REDIRECT
                if (res.url.includes('Account/Login')) {
                    log(id, 'Yêu cầu đăng nhập', 'fa-lock', '#d9534f');
                    // Nếu có user/pass trong RAM, thử auto-login 1 lần
                    if (MEMORY.user && MEMORY.pass) {
                        log(id, 'Đang tự đăng nhập lại...', 'fa-rotate', '#337ab7');
                        const relogin = await executeLogin(MEMORY.user, MEMORY.pass);
                        if (relogin) continue; // Retry fetch immediately
                    }
                    
                    // Nếu không auto được -> Hiện form Login UI
                    showLoginUI(id, () => startTabWorker(id)); 
                    return; // Thoát worker hiện tại, chờ callback từ UI login
                }

                const txt = await res.text();
                if(TAB_STATE[id].killed || TAB_STATE[id].code !== code) continue;
                
                if(new DOMParser().parseFromString(txt,'text/html').querySelector('input[name="__RequestVerificationToken"]')) {
                    success = true; html = txt;
                } else throw new Error();

            } catch(e) { await new Promise(r=>setTimeout(r,2000+Math.random()*1000)); }

            if(success && html && !TAB_STATE[id].killed) {
                tabBtn.classList.add('ready'); updateGlobalAlert();
                log(id, 'Đã có form!', 'fa-check', '#5cb85c');

                const doc = new DOMParser().parseFromString(html, 'text/html');
                const info = extractDetails(doc);
                const token = doc.querySelector('input[name="__RequestVerificationToken"]').value;
                const area = document.getElementById(`area-${id}`);

                area.innerHTML = `
                    <div class="h-info-box">
                        <div class="h-row head"><div><i class="fa-solid fa-book"></i> ${info.name}</div></div>
                        <div class="h-row"><span class="h-lbl">Giảng viên:</span> <span class="h-val">${info.gv}</span></div>
                        <div class="h-row"><span class="h-lbl">Thời khóa biểu (tuần đầu tiên):</span> <span class="h-val">${info.tkb}</span></div>
                        <div class="h-row"><span class="h-lbl">Số SV (ĐK/TT/TĐ):</span> <span class="h-val text-red">${info.current} / ${info.min} / ${info.max}</span></div>
                    </div>
                    <div style="text-align:center; position:relative;">
                        <img id="img-${id}" src="/Captcha?t=${Date.now()}" style="height:60px; border-radius:3px; cursor:pointer; border:1px solid #ccc;" title="Đổi ảnh">
                    </div>
                    <input type="text" id="inp-${id}" class="h-input-cap" placeholder="CAPTCHA">
                    <button id="sub-${id}" class="h-btn-sub"><i class="fa-solid fa-check"></i> XÁC NHẬN</button>
                `;
                const img = document.getElementById(`img-${id}`), inp = document.getElementById(`inp-${id}`), sub = document.getElementById(`sub-${id}`);
                img.addEventListener('click', ()=>{img.src=`/Captcha?t=${Date.now()}`;inp.focus();});
                
                const doSubmit = async () => {
                    const c = inp.value.trim(); if(!c) return inp.focus();
                    sub.disabled=true; sub.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
                    try {
                        const p = new URLSearchParams(); p.append('__RequestVerificationToken',token); p.append('courseId',code); p.append('captcha',c);
                        const r = await fetch('/Studying/CourseRegistration', {method:'POST',body:p,headers:{'Content-Type':'application/x-www-form-urlencoded','X-Requested-With':'XMLHttpRequest'}});
                        // Check login redirect again
                        if (r.url.includes('Account/Login')) {
                             showLoginUI(id, () => startTabWorker(id)); return;
                        }
                        const d = await r.json();
                        if(d.Code===1) {
                            tabBtn.classList.remove('ready'); updateGlobalAlert();
                            area.innerHTML=`<div style="text-align:center;color:#5cb85c;margin-top:50px;"><i class="fa-solid fa-check-circle" style="font-size:50px;"></i><br><br><b>ĐĂNG KÝ THÀNH CÔNG!</b></div>`;
                            log(id, 'Hoàn tất.', 'fa-flag', '#5cb85c');
                        } else { sub.disabled=false; sub.innerHTML='THỬ LẠI'; alert(d.Msg); img.click(); inp.value=''; }
                    } catch { sub.disabled=false; sub.innerHTML='THỬ LẠI'; alert('Lỗi mạng'); }
                };
                sub.addEventListener('click', doSubmit);
                inp.addEventListener('keydown', (e)=>{if(e.key==='Enter')doSubmit();});
                setTimeout(()=>inp.focus(),200);

                while(TAB_STATE[id].code===code && !TAB_STATE[id].killed) {
                    await new Promise(r=>setTimeout(r,500));
                    if(!document.getElementById(`sub-${id}`)) break;
                }
            }
        }
    };

    // --- TAB MANAGER ---
    const switchTab = (id) => {
        document.querySelectorAll('.h-tab').forEach(t=>t.classList.remove('active'));
        document.querySelectorAll('.h-pane').forEach(p=>p.classList.remove('active'));
        const b=document.getElementById(`tab-btn-${id}`), p=document.getElementById(`pane-${id}`);
        if(b && p) { b.classList.add('active'); p.classList.add('active'); const i=document.getElementById(`inp-${id}`)||document.getElementById(`ctrl-inp-${id}`); if(i) i.focus(); }
    };
    const updateTab = (id) => {
        const v = document.getElementById(`ctrl-inp-${id}`).value.trim();
        if(v) {
            TAB_STATE[id].code = v; document.getElementById(`tab-title-${id}`).innerText = v.split('.').pop() || v;
            document.getElementById(`tab-btn-${id}`).classList.remove('ready'); updateGlobalAlert();
            document.getElementById(`area-${id}`).innerHTML = `<div class="h-empty"><i class="fa-solid fa-wifi"></i><div>Đang kết nối...</div></div>`;
            log(id, 'Bắt đầu.', 'fa-play', '#337ab7'); saveState();
        }
    };
    const closeTab = (id, e) => {
        e.stopPropagation(); if(TAB_STATE[id]) TAB_STATE[id].killed=true; delete TAB_STATE[id];
        const b=document.getElementById(`tab-btn-${id}`), p=document.getElementById(`pane-${id}`);
        if(b) b.remove(); if(p) p.remove(); updateGlobalAlert();
        const r=document.querySelectorAll('.h-tab'); if(r.length>0) switchTab(r[0].id.replace('tab-btn-',''));
        saveState();
    };
    const createTab = (initData) => {
        if(document.querySelectorAll('.h-tab').length>=10) return alert('Max 10 Tabs!');
        let id; if(initData){id=initData.id;}else{TAB_COUNTER++;id=TAB_COUNTER;}
        const initialCode = initData ? initData.code : '';
        TAB_STATE[id] = { code: initialCode, killed: false };

        const b = document.createElement('div'); b.className='h-tab'; b.id=`tab-btn-${id}`;
        b.innerHTML=`<span class="h-tab-txt" id="tab-title-${id}">${initialCode.split('.').pop()||'Mới'}</span><i class="fa-solid fa-xmark h-tab-close" id="close-${id}"></i>`;
        b.addEventListener('click', () => switchTab(id));
        document.getElementById('tabs-bar').insertBefore(b,document.getElementById('btn-add'));
        document.getElementById(`close-${id}`).addEventListener('click', (e) => closeTab(id, e));

        const p = document.createElement('div'); p.className='h-pane'; p.id=`pane-${id}`;
        p.innerHTML=`
            <div class="h-ctrl-grp"><input id="ctrl-inp-${id}" class="h-ctrl-input" placeholder="Nhập mã lớp học phần - Ví dụ: 2025-2026.2.TIN4083.001" value="${initialCode}"><button class="h-ctrl-btn" id="go-${id}"><i class="fa-solid fa-play"></i></button></div>
            <div id="log-${id}" style="font-size:11px;margin-bottom:10px;padding-left:5px;"></div>
            <div id="area-${id}"><div class="h-empty"><i class="fa-solid fa-layer-group"></i><div>${initialCode?'Đang tải...':'Nhập mã lớp học phần để bắt đầu. Lưu ý chọn học kỳ tác nghiệp trước khi thực hiện lấy form đăng ký'}</div></div></div>
        `;
        document.getElementById('tabs-content').appendChild(p);
        document.getElementById(`go-${id}`).addEventListener('click', ()=>updateTab(id));
        document.getElementById(`ctrl-inp-${id}`).addEventListener('keydown', (e)=>{if(e.key==='Enter')updateTab(id);});

        startTabWorker(id); switchTab(id); if(!initData) saveState();
    };

    document.getElementById('btn-add').addEventListener('click', ()=>createTab(null));

    // === START ===
    (async()=>{
        if(savedData){TAB_COUNTER=savedData.counter||0;const k=Object.keys(savedData.tabs||{});if(k.length>0)k.forEach(i=>createTab({id:i,code:savedData.tabs[i].code}));else createTab(null);}
        else createTab(null);
    })();

})();