(function () {
  if (!window.quizAttempts) window.quizAttempts = {};
})();

var OFFENSIVE_MODULES = [
  {
    id: 'penetration-testing-intro',
    title: 'Intro to Pentesting',
    icon: '⚔️',
    sections: [
      {
        type: 'content',
        heading: 'Penetration Testing คืออะไร?',
        text: 'Penetration Testing (Pen Test) หรือการทดสอบเจาะระบบ คือการจำลองการโจมตีทางไซเบอร์ไปยังระบบคอมพิวเตอร์ เครือข่าย หรือแอปพลิเคชัน เพื่อค้นหาช่องโหว่ (Vulnerability) และประเมินความเสี่ยงที่แฮกเกอร์อาจสามารถใช้ประโยชน์ได้',
      },
      {
        type: 'content',
        heading: 'ขั้นตอนการทำ Penetration Testing',
        text: '1. **Reconnaissance (การรวบรวมข้อมูล)**: หาข้อมูลเป้าหมายให้มากที่สุด\n2. **Scanning & Enumeration**: สแกนหาพอร์ต บริการ หรือระบบปฏิบัติการที่เป้าหมายใช้งาน\n3. **Vulnerability Assessment**: ประเมินและค้นหาช่องโหว่จากข้อมูลที่ได้\n4. **Exploitation (การเจาะระบบ)**: นำช่องโหว่ที่พบมาโจมตีเพื่อเข้าถึงระบบ\n5. **Post-Exploitation**: รักษาการเข้าถึง หรือพยายามยกระดับสิทธิ์ (Privilege Escalation)\n6. **Reporting (การทำรายงาน)**: สรุปผลช่องโหว่และเสนอแนวทางแก้ไข',
      },
      {
        type: 'quiz',
        question:
          'ขั้นตอนการจำลองการโจมตีเพื่อค้นหาช่องโหว่ระบบอย่างถูกกฎหมาย เรียกว่าอะไร?',
        answer: 'penetration testing',
        hint: 'ภาษาไทยแปลว่า การทดสอบเจาะระบบ',
      },
    ],
  },
  {
    id: 'owasp-sqli',
    title: 'SQL Injection (SQLi)',
    icon: '💉',
    sections: [
      {
        type: 'content',
        heading: 'SQL Injection คืออะไร?',
        text: 'SQL Injection คือการโจมตีที่ใส่คำสั่ง SQL อันตรายเข้าไปในช่อง Input ของแอปพลิเคชัน ทำให้สามารถข้ามการตรวจสอบรหัสผ่าน อ่านข้อมูลลับ ปรับปรุงข้อมูล หรือแม้แต่ลบฐานข้อมูลทิ้งได้',
      },
      {
        type: 'content',
        heading: 'ตัวอย่างการโจมตี',
        text: "ถ้าช่องกรอก Username ส่งค่าตรงไปยังฐานข้อมูลแบบนี้:\n`SELECT * FROM users WHERE username = '$user' AND password = '$password'`\nหากผู้โจมตีป้อน `admin' OR 1=1 --` ในช่อง username คำสั่ง SQL จะกลายเป็น:\n`SELECT * FROM users WHERE username = 'admin' OR 1=1 --' AND password = '...'`\nเงื่อนไข `1=1` ทำให้เป็นจริงเสมอ และ `--` จะคอมเมนต์คำสั่งตรวจสอบพาสเวิร์ดทิ้ง ทำให้ล็อกอินสำเร็จโดยไม่ต้องใช้รหัสผ่าน",
      },
      {
        type: 'sql_simulator',
        question:
          'นำ Flag ที่ได้จากการโจมตี SQL Injection ในแบบจำลองมาตอบเพื่อผ่านด่าน',
        answer: 'FLAG_SQL1_M4ST3R',
        hint: "ลองใส่ไข่ปลา (Single Quote) และเงื่อนไขที่ให้ค่าเป็นตัวมันเองเสมอ เช่น `a' OR 1=1 --`",
      },
    ],
  },
  {
    id: 'owasp-idor',
    title: 'Broken Access Control (IDOR)',
    icon: '🔑',
    sections: [
      {
        type: 'content',
        heading: 'IDOR (Insecure Direct Object Reference) คืออะไร?',
        text: 'IDOR เป็นส่วนหนึ่งของ Broken Access Control เกิดจากการที่แอปพลิเคชันเปิดให้เข้าถึงไฟล์หรือข้อมูลในฐานข้อมูลทางตรงได้โดยไม่มีการตรวจสอบสิทธิ์ว่าผู้ใช้นั้นมีสิทธิ์เข้าถึงข้อมูลของคนอื่นได้หรือไม่',
      },
      {
        type: 'content',
        heading: 'ตัวอย่างสถานการณ์',
        text: 'คุณล็อกอินเข้าระบบดูโปรไฟล์ตัวเอง และสังเกตเห็น URL เป็น `https://example.com/profile?id=1050`\nหากคุณลองเปลี่ยนเลข id เป็น `1051` แล้วระบบแสดงข้อมูลของคนอื่นแทนที่จะแจ้งเตือน แสดงว่าระบบมีช่องโหว่ IDOR',
      },
      {
        type: 'idor_simulator',
        question: 'นำ Flag ที่ได้จากการโจมตี IDOR ในแบบจำลองมาตอบเพื่อผ่านด่าน',
        answer: 'FLAG_1D0R_H4CK3R',
        hint: 'ลองเปลี่ยน User ID เป็นเลข 1 (มักจะเป็น Admin) เพื่อดูข้อมูลลับ',
      },
    ],
  },
  {
    id: 'owasp-cmd',
    title: 'Command Injection',
    icon: '[*]',
    sections: [
      {
        type: 'content',
        heading: 'Command Injection คืออะไร?',
        text: 'ช่องโหว่นี้เกิดขึ้นเมื่อแอปพลิเคชันนำข้อมูล Input จากผู้ใช้ส่งตรงไปทำงานในระดับ Shell (Command Line) ของระบบปฏิบัติการโดยไม่มีการกรอง ทำให้ผู้โจมตีสามารถแทรกคำสั่งอันตรายเข้าไปทำงานบนเซิร์ฟเวอร์ได้',
      },
      {
        type: 'content',
        heading: 'เทคนิคการแทรกคำสั่ง',
        text: 'ในระบบ Linux สามารถใช้เครื่องหมายเพื่อต่อคำสั่งได้ เช่น\n- `;` (รันคำสั่งแรกเสร็จ แล้วรันคำสั่งสองตามรวดเดียว)\n- `&&` (รันคำสั่งที่สอง เฉพาะเมื่อคำสั่งแรกทำงานสำเร็จ)\n- `|` (นำ Output ของคำสั่งแรก ไปเป็น Input ของคำสั่งสอง)\n\nตัวอย่าง: โจมตีหน้าเว็บ Ping Server ด้วยการป้อน IP เป็น `127.0.0.1; whoami`',
      },
      {
        type: 'cmd_simulator',
        question:
          'นำ Flag ที่ได้จากการแทรกคำสั่งเพื่อดูไฟล์ flag.txt (cat flag.txt) มาตอบเพื่อผ่านด่าน',
        answer: 'FLAG_CMD_1NJ3CT10N',
        hint: 'ลองป้อน `127.0.0.1; cat flag.txt` ตรงช่อง Ping!',
      },
    ],
  },
  {
    id: 'owasp-sde',
    title: 'Sensitive Data Exposure',
    icon: '👁️',
    sections: [
      {
        type: 'content',
        heading: 'Sensitive Data Exposure คืออะไร?',
        text: 'ปัจจุบัน OWASP ให้ความสำคัญกับการเปิดเผยข้อมูลสำคัญ ไม่ว่าจะเป็นการไม่เข้ารหัสข้อมูลพาสเวิร์ด ทิ้ง API Key ไว้บน Github หรือแม้แต่คอมเมนต์ของนักพัฒนา (Developer Comments) ที่หลงลืมไว้ใน Source Code ซึ่งมีข้อมูลระบบ ข้อมูลผู้ใช้ หรือความลับทางธุรกิจ',
      },
      {
        type: 'source_simulator',
        question: 'ค้นหาความลับที่ถูกซ่อนไว้โดยนักพัฒนา แล้วนำ Flag มาตอบ',
        answer: 'FLAG_S0URC3_C0D3',
        hint: 'ในโลกความเป็นจริงคุณจะต้องกด คลิกขวา -> ถอดรหัส Source Code แต่ในแล็บนี้ เรามีปุ่มกดให้ลอง',
      },
    ],
  },
  {
    id: 'owasp-xss',
    title: 'Cross-Site Scripting (XSS)',
    icon: '📝',
    sections: [
      {
        type: 'content',
        heading: 'Cross-Site Scripting (XSS) คืออะไร?',
        text: 'XSS คือช่องโหว่ที่ผู้โจมตีสามารถฝังโค้ด JavaScript อันตรายเข้าไปในหน้าเว็บ เพื่อให้เบราว์เซอร์ของผู้ใช้คนอื่นประมวลผลโค้ดนั้น สามารถใช้ขโมย Session Cookie หรือหลอกให้โอนเงินได้',
      },
      {
        type: 'content',
        heading: 'Reflected XSS',
        text: 'ประเภทนี้ ข้อมูลจาก Input ของผู้ใช้ (เช่น ช่องค้นหา) จะสะท้อนกลับมาแสดงบนหน้าเว็บทันที หากลองพิมพ์ `<script>alert(1)</script>` ลงไปในช่อง Search หากเว็บแจ้งเตือนเลข 1 ขึ้นมา แสดงว่ามีช่องโหว่',
      },
      {
        type: 'xss_simulator',
        question:
          'ลองใช้ Script เพื่อกระตุ้นช่องโหว่ XSS (alert) ดู แล้วเอา Flag ที่ปรากฏหลังจากโดนแฮกมาตอบ',
        answer: 'FLAG_XSS_P0PUP',
        hint: "ป้อน `<script>alert(\\'test\\')</script>` เข้าระบบเลย!",
      },
    ],
  },
  {
    id: 'ghost-gateway',
    title: 'Ghost Gateway: API Exploitation',
    icon: '👻',
    sections: [
      {
        type: 'content',
        heading: 'สถานการณ์: The Internal Leak',
        text: 'เราพบว่า SecureCorp มี API Gateway ภายในที่หลุดออกมาสู่เครือข่ายภายนอก (10.0.12.50) โดยมีการรันบริการทับซ้อนกันอยู่หลายเวอร์ชัน โดยเฉพาะระบบ Secure Gateway v1.4 ที่มักจะรันอยู่ที่พอร์ต 8443 นอกจากนี้ระบบยังมีช่องโหว่ Path Traversal ที่สามารถอ่านไฟล์นอกไดเรกทอรีเว็บได้ หากเข้าถึงด้วยสิทธิ์ที่ถูกต้อง\n\nภารกิจของคุณคือการสำรวจหาพอร์ตที่ซ้อนเร้น และใช้เทคนิค JWT Algorithm "none" เพื่อปลอมแปลงสิทธิ์เข้าถึงไฟล์ /etc/secret.conf',
      },
      {
        type: 'ghost_simulator',
        question: 'ค้นหาและถอดรหัสเพื่อนำ Flag จากไฟล์ secret.conf มาตอบ',
        answer: 'FLAG_GHOST_JWT_TRAVERSAL',
        hint: 'Level 1: วิเคราะห์ Log เพื่อหา Port/Endpoint ลับที่ระบบแจ้งเตือน\nLevel 2: ลองใช้พอร์ต 8443 และเปลี่ยน JWT Header ให้ "alg": "none" เพื่อข้ามการตรวจสอบ\nLevel 3: ส่ง Request ไปที่พอร์ต 8443 โดยใช้ Endpoint ที่เข้าถึงไฟล์ตรงๆ เช่น /api/v2/admin/view?file=../../../etc/secret.conf พร้อมกับ JWT Token ที่ม็อคค่า alg เป็น none',
      },
    ],
  },
];

var sidebarList = document.getElementById('sidebarList');
var contentArea = document.getElementById('contentArea');
var contentTitle = document.getElementById('contentTitle');
var currentModIndex = 0;

function buildSidebar() {
  var html = '';
  OFFENSIVE_MODULES.forEach(function (mod, i) {
    // Calculate completion for this specific submodule
    let totalQ = 0;
    let compQ = 0;
    mod.sections.forEach((s, idx) => {
      if (
        s.answer ||
        s.flag ||
        s.type === 'inbox_simulator' ||
        s.type === 'ghost_simulator'
      ) {
        totalQ++;
        const sectionId = mod.id + '-' + idx;
        if (
          window.currentModuleCompletedIds &&
          window.currentModuleCompletedIds.includes(sectionId)
        ) {
          compQ++;
        }
      }
    });
    const isCompleted = totalQ > 0 && compQ === totalQ;

    html +=
      '<li class="' +
      (i === currentModIndex ? 'active' : '') +
      (isCompleted ? ' completed' : '') +
      '" onclick="loadModule(' +
      i +
      ')">';
    html += '<span class="mod-dash">-</span>';
    html += '<span class="mod-emoji">' + (mod.icon || '🛡️') + '</span>';
    html +=
      '<span><span class="mod-num">' +
      String(i + 1).padStart(2, '0') +
      '.</span> ' +
      mod.title +
      '</span>';
    if (isCompleted) {
      html += '<span class="mod-ok">[OK]</span>';
    }
    html += '</li>';
  });
  sidebarList.innerHTML = html;
}

function loadModule(index) {
  currentModIndex = index;
  buildSidebar();
  var mod = OFFENSIVE_MODULES[index];
  contentTitle.innerHTML =
    '<span style="color:#ff4444">' + mod.icon + ' ' + mod.title + '</span>';
  window.CURRENT_LAB_ID = mod.id;
  window.CURRENT_LAB_TITLE = mod.title;

  var quizzes = [];
  mod.sections.forEach(function (s) {
    if (s.type === 'quiz' || s.answer) quizzes.push(s.question);
  });
  window.CURRENT_LAB_QUIZZES = quizzes;

  let pageTextForBot = 'Module: ' + mod.title + '\\n';
  var html = '';

  mod.sections.forEach(function (section, si) {
    html += '<div class="lesson-section">';

    if (section.type === 'content') {
      html += '<h2>' + section.heading + '</h2>';
      html +=
        '<div class="lesson-text">' +
        escapeHtml(section.text).replace(/\\n/g, '<br>') +
        '</div>';
      pageTextForBot +=
        '[เนื้อหา] ' + section.heading + '\\n' + section.text + '\\n';
    } else if (section.type === 'sql_simulator') {
      html += renderSimHeader(
        'Vulnerable Login Page',
        'Target: www.vulnerable-bank.com/login',
      );
      html += '<div class="vuln-demo">';
      html +=
        '<div>Username:</div><input type="text" id="sqli-user" placeholder="Enter username..." style="width:100%; max-width:300px;">';
      html +=
        '<div>Password:</div><input type="password" id="sqli-pass" placeholder="Enter password..." style="width:100%; max-width:300px;"><br>';
      html += '<button onclick="runSQLi()">ACCESS SYSTEM</button>';
      html += '<div id="sqli-res" class="vuln-result">Ready...</div>';
      html += '</div>';
      html += renderQuizBlock(index, si, section);
      pageTextForBot +=
        '[ระบบจำลอง SQLi] ผู้เล่นกำลังถูกท้าทายให้เจาะล็อกอินช่องโหว่ SQL Injection\\n';
    } else if (section.type === 'idor_simulator') {
      html += renderSimHeader(
        'User Profile Dashboard',
        'Logged in as User ID: 1050',
      );
      html += '<div class="vuln-demo">';
      html += '<div>Browser Address Bar:</div>';
      html +=
        '<div style="display:flex; margin-top:5px;"><span style="background:#333; padding:8px 10px; color:#aaa; border:1px solid #444; border-right:none; border-radius:4px 0 0 4px;">https://vulnerable-site.com/profile?id=</span><input type="number" id="idor-id" value="1050" style="width:100px; margin-top:0; border-radius:0 4px 4px 0; border-left:none;"></div>';
      html +=
        '<button onclick="runIDOR()" style="margin-top:10px;">RELOAD PAGE</button>';
      html +=
        '<div id="idor-res" class="vuln-result">Name: John Doe\\nRole: Standard User</div>';
      html += '</div>';
      html += renderQuizBlock(index, si, section);
      pageTextForBot +=
        '[ระบบจำลอง IDOR] ผู้เล่นต้องเปลี่ยน User ID ใน URL (Browser Address Bar) ไปดูข้อมูลคนอื่น\\n';
    } else if (section.type === 'cmd_simulator') {
      html += renderSimHeader('Network Diagnostics Tool', 'Server OS: Linux');
      html += '<div class="vuln-demo">';
      html += '<div>Ping Target IP:</div>';
      html +=
        '<input type="text" id="cmd-ip" placeholder="e.g., 8.8.8.8" style="width:100%; max-width:300px;">';
      html += '<button onclick="runCmdInj()">PING</button>';
      html +=
        '<div id="cmd-res" class="vuln-result">Waiting for IP address...</div>';
      html += '</div>';
      html += renderQuizBlock(index, si, section);
      pageTextForBot +=
        '[ระบบจำลอง Command Injection] ผู้เล่นต้องหลอกรันคำสั่ง cat flag.txt ผ่านช่อง ping\\n';
    } else if (section.type === 'source_simulator') {
      html += renderSimHeader(
        'Mysterious Webpage',
        'Looking for hidden secrets',
      );
      html += '<div class="vuln-demo">';
      html +=
        '<h3>Welcome to Admin Portal</h3><p>Only authorized users may proceed.</p>';
      html +=
        '<!-- Developer Note (To Self): Test account flag is ' +
        section.answer +
        '. DO NOT deploy this to production! -->';
      html +=
        '<button onclick="runViewSource()">Inspect Page Source / View HTML</button>';
      html +=
        '<div id="src-res" class="vuln-result" style="display:none;"></div>';
      html += '</div>';
      html += renderQuizBlock(index, si, section);
      pageTextForBot +=
        '[ระบบจำลอง Sensitive Data Exposure] ผู้เล่นต้องดู Source Code หน้าเว็บเพื่อหา Flag\\n';
    } else if (section.type === 'xss_simulator') {
      html += renderSimHeader(
        'Product Search',
        'Target: shopping-site.com/search',
      );
      html += '<div class="vuln-demo">';
      html += '<div>Search Item:</div>';
      html +=
        '<input type="text" id="xss-q" placeholder="Search for products..." style="width:100%; max-width:300px;">';
      html += '<button onclick="runXSS()">SEARCH</button>';
      html += '<div id="xss-res" class="vuln-result">No recent searches.</div>';
      html += '</div>';
      html += renderQuizBlock(index, si, section);
      pageTextForBot +=
        '[ระบบจำลอง XSS] ผู้เล่นต้องป้อน <script>alert(1)</script> เพื่อเจาะช่องโหว่ XSS\\n';
    } else if (section.type === 'ghost_simulator') {
      html += renderSimHeader(
        'Ghost Gateway v1.4',
        'Host: api-gateway.internal',
      );
      html +=
        '<div class="vuln-demo" style="background:#050510; border:1px solid #1a1a3a;">';

      // Control Panel
      html +=
        '<div style="display:flex; gap:10px; margin-bottom:15px; border-bottom:1px solid #222; padding-bottom:10px;">';
      html +=
        '<button onclick="ghostAction(\'nmap\')" style="font-size:10px; padding:5px 10px; background:#111; color:#0f0;">RUN NMAP</button>';
      html +=
        '<button onclick="ghostAction(\'logs\')" style="font-size:10px; padding:5px 10px; background:#111; color:#ffbd2e;">VIEW LOGS</button>';
      html +=
        '<button onclick="ghostAction(\'source\')" style="font-size:10px; padding:5px 10px; background:#111; color:#cyan;">SRC CODE</button>';
      html += '</div>';

      // Terminal Display
      html +=
        '<div id="ghost-display" style="font-family:\'Courier New\', monospace; font-size:12px; height:200px; overflow-y:auto; background:#000; padding:10px; border:1px solid #333; color:#0f0; line-height:1.4;">[SYSTEM] Terminal ready. Select an action above.</div>';

      // Attack Console
      html +=
        '<div style="margin-top:15px; border-top:1px solid #222; padding-top:10px;">';
      html +=
        '<div style="color:#888; font-size:11px; margin-bottom:5px;">CRAFTED REQUEST:</div>';
      html +=
        '<div style="display:grid; grid-template-columns: 80px 1fr; gap:5px; margin-bottom:5px;">';
      html +=
        '<span style="color:#aaa; font-size:12px;">Endpoint:</span><input type="text" id="ghost-url" placeholder="/api/v1/..." style="font-size:12px;">';
      html +=
        '<span style="color:#aaa; font-size:12px;">JWT Alg:</span><input type="text" id="ghost-alg" value="HS256" style="font-size:12px;">';
      html +=
        '<span style="color:#aaa; font-size:12px;">File Path:</span><input type="text" id="ghost-path" placeholder="profile.json" style="font-size:12px;">';
      html += '</div>';
      html +=
        '<button onclick="runGhostAttack()" style="width:100%; background:#ff4444; margin-top:5px; font-weight:bold;">SEND EXPLOIT REQUEST</button>';
      html += '</div>';

      html += '</div>';
      html += renderQuizBlock(index, si, section);
      pageTextForBot +=
        '[ระบบจำลอง Ghost Gateway] แล็บความซับซ้อนสูง (Multi-step):\\n' +
        '1. Nmap port 8443\\n' +
        '2. Logs พบ /api/v2/admin และ Mock Mode\\n' +
        '3. Source code ยอมรับ JWT alg "none"\\n' +
        '4. ต้องส่งไปที่ v2 endpoint พร้อม alg none และใช้ path traversal ../../secret.conf\\n';
    } else if (section.type === 'quiz') {
      html += renderQuizBlock(index, si, section);
      pageTextForBot +=
        '[คำถาม Quiz ให้ผู้เรียนตอบ] ' +
        section.question +
        '\\n[เฉลยที่ถูกต้อง] ' +
        section.answer +
        '\\n';
    }

    html += '</div>';
  });

  contentArea.innerHTML = html;

  if (window.Chatbot) {
    window.Chatbot.setCurrentLab(mod.id);
    window.Chatbot.setPageContext(pageTextForBot);
  }

  // ID-based completion logic.
  if (
    window.currentModProgressData &&
    window.currentModProgressData.completed_ids
  ) {
    const completedIds = window.currentModProgressData.completed_ids;
    window.currentModuleCompletedIds = completedIds; // Keep globally for saveProgress

    OFFENSIVE_MODULES[currentModIndex].sections.forEach((s, idx) => {
      const sectionId = mod.id + '-' + idx;
      if (completedIds.includes(sectionId)) {
        // Auto-complete it
        var input = document.getElementById(
          'quiz-' + currentModIndex + '-' + idx,
        );
        if (input) {
          input.value = s.answer || s.flag || '1';
          input.disabled = true;
          input.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          input.style.color = '#fff';
          var btn = input.nextElementSibling;
          if (btn && btn.tagName === 'BUTTON') {
            btn.textContent = 'SUBMITTED';
            btn.style.backgroundColor = '#00e676';
            btn.style.color = '#000';
            btn.disabled = true;
            btn.style.cursor = 'default';
          }
          var fb = document.getElementById('fb-' + currentModIndex + '-' + idx);
          if (fb) {
            fb.textContent = '[OK] ALREADY COMPLETED';
            fb.className = 'quiz-feedback success';
          }
        }
      }
    });
  }

  window.scrollTo(0, 0);

  var sidebar = document.querySelector('.module-sidebar');
  if (sidebar) {
    sidebar.classList.remove('open');
  }
}

// ── Helpers ──
function renderSimHeader(title, subtitle) {
  return (
    '<div style="margin-top:20px; padding:10px 15px; background:#1a1a1a; border-top:1px solid #ff4444; border-bottom:1px solid #333;"><span style="color:#ff4444; font-family:\'Press Start 2P\', monospace; font-size:10px;">🔴 ' +
    title +
    '</span><span style="color:#888; font-size:12px; float:right;">' +
    subtitle +
    '</span></div>'
  );
}

function renderQuizBlock(modIndex, sectionIndex, section) {
  let h = '<div class="quiz-block" style="border-color:#ff4444;">';
  h +=
    '<span class="quiz-label" style="background:#ff4444; color:#fff;">SUBMIT FLAG / ANSWER</span>';
  h += '<p class="quiz-question">' + section.question + '</p>';
  h += '<div class="quiz-answer-row">';
  h +=
    '<input class="quiz-input" id="quiz-' +
    modIndex +
    '-' +
    sectionIndex +
    '" type="text" placeholder="พิมพ์คำตอบหรือ Flag ที่ได้มา..." onkeydown="if(event.key===\'Enter\')checkQuiz(' +
    modIndex +
    ',' +
    sectionIndex +
    ')">';
  h +=
    '<button class="quiz-submit" style="background:#ff4444;" onclick="checkQuiz(' +
    modIndex +
    ',' +
    sectionIndex +
    ')">SUBMIT</button>';
  h += '</div>';
  h +=
    '<div class="quiz-feedback" id="fb-' +
    modIndex +
    '-' +
    sectionIndex +
    '"></div>';
  h += '</div>';
  return h;
}

// ── Interactive Logic ──

function runSQLi() {
  var user = document.getElementById('sqli-user').value;
  var res = document.getElementById('sqli-res');
  if (
    user.includes("' OR 1=1") ||
    user.includes("' or 1=1") ||
    user.includes('" OR 1=1')
  ) {
    res.innerHTML =
      '<span style="color:#0f0;">[+] Authenticated Successfully as ADMIN!</span>\\n<span style="color:#0ff;">Flag: FLAG_SQL1_M4ST3R</span>';
  } else {
    res.innerHTML =
      '<span style="color:#f00;">[-] Authentication Failed. Invalid username or password.</span>';
  }
}

function runIDOR() {
  var id = document.getElementById('idor-id').value;
  var res = document.getElementById('idor-res');
  if (id === '1' || id === '0' || id === '1051') {
    res.innerHTML =
      '<span style="color:#0f0;">[+] Profile Data Fetched!</span>\\nName: SuperAdmin\\nRole: System Administrator\\n<span style="color:#0ff;">Flag: FLAG_1D0R_H4CK3R</span>';
  } else if (id === '1050') {
    res.innerHTML = 'Name: John Doe\\nRole: Standard User';
  } else {
    res.innerHTML =
      '<span style="color:#aaa;">User profile not found or empty.</span>';
  }
}

function runCmdInj() {
  var ip = document.getElementById('cmd-ip').value;
  var res = document.getElementById('cmd-res');
  if (
    ip.includes('cat flag.txt') &&
    (ip.includes(';') || ip.includes('&&') || ip.includes('|'))
  ) {
    res.innerHTML =
      'PING ' +
      ip.split(';')[0] +
      ' (127.0.0.1) 56(84) bytes of data.\\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.034 ms\\n...\\n<span style="color:#0f0;">[+] Executing command: cat flag.txt</span>\\n<span style="color:#0ff;">FLAG_CMD_1NJ3CT10N</span>';
  } else if (ip) {
    res.innerHTML =
      'PING ' +
      ip +
      ' 56(84) bytes of data.\\n64 bytes from ' +
      ip +
      ': icmp_seq=1 ttl=64 time=10.2 ms\\n...';
  } else {
    res.innerHTML =
      '<span style="color:#f00;">Error: IP address required.</span>';
  }
}

function runViewSource() {
  var res = document.getElementById('src-res');
  res.style.display = 'block';
  res.innerHTML =
    '&lt;h3&gt;Welcome to Admin Portal&lt;/h3&gt;\\n&lt;p&gt;Only authorized users may proceed.&lt;/p&gt;\\n<span style="color:#0f0;">&lt;!-- Developer Note (To Self): Test account flag is FLAG_S0URC3_C0D3. DO NOT deploy this to production! --&gt;</span>';
}

function runXSS() {
  var q = document.getElementById('xss-q').value;
  var res = document.getElementById('xss-res');
  if (q.includes('<script>') && q.includes('</script>')) {
    alert('XSS Payload Executed! Your session has been hijacked.');
    res.innerHTML =
      'You searched for: ' +
      escapeHtml(q) +
      '<br><br><span style="color:#0f0;">[+] XSS Triggered successfully! P0wned.</span>\\n<span style="color:#0ff;">Flag: FLAG_XSS_P0PUP</span>';
  } else {
    res.innerHTML =
      'You searched for: ' + escapeHtml(q) + '<br>0 results found.';
  }
}

function ghostAction(type) {
  const display = document.getElementById('ghost-display');
  if (type === 'nmap') {
    display.innerHTML =
      '<span style="color:#888;"># nmap -sV 10.0.12.50</span>\\n' +
      'Nmap scan report for api-gateway.internal (10.0.12.50)\\n' +
      'PORT     STATE SERVICE\\n' +
      '80/tcp   OPEN  http (Nginx 1.18.0)\\n' +
      '443/tcp  OPEN  https (Nginx 1.18.0)\\n' +
      '<span style="color:#ffbd2e;">8443/tcp OPEN  https-alt (Secure Gateway v1.4)</span>';
  } else if (type === 'logs') {
    display.innerHTML =
      '<span style="color:#444;">[REDACTED SYSTEM LOGS]</span>\\n' +
      'DEBUG [21:00] [API-V1] Request from 192.168.1.5: GET /api/v1/status - 200 OK\\n' +
      '<span style="color:#ff4444;">WARN  [21:05] [AUTH] Failed login on /api/v2/admin - 401 Unauthorized (Missing JWT)</span>\\n' +
      '<span style="color:#0ff;">DEBUG [21:10] [SYSTEM] Gateway is running in MOCK_MODE=True for testing v2 endpoints.</span>';
  } else if (type === 'source') {
    display.innerHTML =
      '<span style="color:#888;">// JWT Validation Snippet from secure_auth.py</span>\\n' +
      'def validate_jwt(token):\\n' +
      "    header, payload, sig = token.split('.')\\n" +
      '    decoded_header = base64.urlsafe_b64decode(header)\\n' +
      "    <span style=\"color:#0ff;\">if decoded_header['alg'] == 'none':</span>\\n" +
      '        <span style="color:#ffbd2e;"># In MOCK_MODE we trust unsigned tokens</span>\\n' +
      '        return decode_payload(payload)\\n' +
      '    return verify_with_secret(token, SECRET_KEY)';
  }
  display.innerHTML = display.innerHTML.replace(/\\n/g, '<br>');
  display.scrollTop = display.scrollHeight;
}

function runGhostAttack() {
  const url = document.getElementById('ghost-url').value.trim();
  const alg = document.getElementById('ghost-alg').value.trim().toLowerCase();
  const path = document.getElementById('ghost-path').value.trim();
  const display = document.getElementById('ghost-display');

  display.innerHTML =
    '<span style="color:#888;">Sending request to ' +
    escapeHtml(url) +
    '...</span>\\n';

  if (!url.includes('8443')) {
    display.innerHTML +=
      '<span style="color:#f00;">Error: Connection refused (Try port 8443? No response).</span>';
  } else if (!url.includes('/api/v2/admin')) {
    display.innerHTML +=
      '<span style="color:#ffbd2e;">HTTP/1.1 404 Not Found (Endpoint /api/v2/admin is required).</span>';
  } else if (alg !== 'none') {
    display.innerHTML +=
      '<span style="color:#f00;">HTTP/1.1 401 Unauthorized (JWT alg "none" is required).</span>';
  } else if (!path.includes('etc/secret.conf')) {
    display.innerHTML +=
      '<span style="color:#ffbd2e;">HTTP/1.1 403 Forbidden (File access denied). Try accessing /etc/secret.conf</span>';
  } else {
    // Correct!
    display.innerHTML +=
      '<span style="color:#0f0;">HTTP/1.1 200 OK</span>\\n' +
      '<span style="color:#0ff;">[SUCCESS] Path Traversal successful! Reading /etc/secret.conf...</span>\\n' +
      '----------------------------------------\\n' +
      'CONF_LEVEL: TOP_SECRET\\n' +
      'FLAG: FLAG_GHOST_JWT_TRAVERSAL\\n' +
      '----------------------------------------\\n' +
      '<span style="color:#0f0;">คัดลอก FLAG ด้านบนไปใส่ในช่องตอบด้านล่างเพื่อผ่านด่าน!</span>';
  }

  display.innerHTML = display.innerHTML.replace(/\\n/g, '<br>');
  display.scrollTop = display.scrollHeight;
}

async function checkQuiz(modIndex, sectionIndex) {
  var input = document.getElementById('quiz-' + modIndex + '-' + sectionIndex);
  var fb = document.getElementById('fb-' + modIndex + '-' + sectionIndex);
  var section = OFFENSIVE_MODULES[modIndex].sections[sectionIndex];

  if (!input.value.trim()) {
    var qId = modIndex + '-' + sectionIndex;
    window.quizAttempts[qId] = window.quizAttempts[qId] || 0;
    fb.textContent = '[i] Hint: ' + section.hint;
    fb.className = 'quiz-feedback hint';
    return;
  }

  var userAnswer = input.value.trim();
  var correctAnswer = section.answer;

  // Case insensitive check
  if (
    userAnswer.toLowerCase().replace(/\s+/g, '') ===
    correctAnswer.toLowerCase().replace(/\s+/g, '')
  ) {
    fb.innerHTML = '[OK] SUCCESS! CORRECT FLAG / ANSWER.';
    fb.className = 'quiz-feedback success';
    input.disabled = true;
    input.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    input.style.color = '#fff';

    var btn = input.nextElementSibling;
    if (btn && btn.tagName === 'BUTTON') {
      btn.textContent = 'SUBMITTED';
      btn.style.backgroundColor = '#00e676';
      btn.style.color = '#000';
      btn.disabled = true;
      btn.style.cursor = 'default';
    }

    // Save granular progress to backend
    if (window.Auth && typeof window.Auth.submitTask === 'function') {
      const sectionId = OFFENSIVE_MODULES[modIndex].id + '-' + sectionIndex;
      const res = await window.Auth.submitTask('offensive', sectionId);
      if (res.success) {
        if (res.completed_ids)
          window.currentModuleCompletedIds = res.completed_ids;
      }
    }

    let moduleCompleted = true;
    for (let i = 0; i < OFFENSIVE_MODULES[modIndex].sections.length; i++) {
      let s = OFFENSIVE_MODULES[modIndex].sections[i];
      if (s.answer || s.flag || s.type === 'inbox_simulator') {
        let reqId = OFFENSIVE_MODULES[modIndex].id + '-' + i;
        if (!window.currentModuleCompletedIds || !window.currentModuleCompletedIds.includes(reqId)) {
          moduleCompleted = false;
          break;
        }
      }
    }
    if (moduleCompleted) {
      setTimeout(() => showModuleCompletePopup(modIndex, OFFENSIVE_MODULES.length), 500);
    }
  } else {
    fb.textContent = '❌ ผิด! ลองตรวจสอบอีกครั้ง';
    fb.className = 'quiz-feedback error';
    setTimeout(function () {
      fb.textContent =
        '[i] Hint: ' + (section.hint || 'ลุยเจาะระบบจากด้านบนให้ได้ Flag');
      fb.className = 'quiz-feedback hint';
    }, 2000);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setupTerminal() {
  const btn = document.getElementById('terminalPageBtn');
  if (btn && window.SimTerminal) {
    btn.onclick = () => {
      window.SimTerminal.toggle();
    };
  }
}

var sidebarToggle = document.querySelector('.sidebar-toggle');
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', function () {
    document.querySelector('.module-sidebar').classList.toggle('open');
  });
}

async function initModule() {
  let startIndex = 0;
  window.currentModuleCompletedIds = [];
  if (window.Auth && typeof window.Auth.getProgressData === 'function') {
    let progData = await window.Auth.getProgressData('offensive');
    window.currentModProgressData = progData;
    window.currentModuleCompletedIds = progData.completed_ids || [];

    // Calculate overall progress to fix ghost progress
    let totalAllQ = 0;
    let compAllQ = 0;
    let doneMods = 0;
    OFFENSIVE_MODULES.forEach((m) => {
      let mTotal = 0;
      let mDone = 0;
      m.sections.forEach((s, idx) => {
        if (
          s.answer ||
          s.flag ||
          s.type === 'inbox_simulator' ||
          s.type === 'ghost_simulator'
        ) {
          totalAllQ++;
          mTotal++;
          if (window.currentModuleCompletedIds.includes(m.id + '-' + idx)) {
            compAllQ++;
            mDone++;
          }
        }
      });
      if (mTotal > 0 && mDone === mTotal) doneMods++;
    });

    startIndex = Math.min(doneMods, OFFENSIVE_MODULES.length - 1);
  }
  loadModule(startIndex);
  if (typeof setupTerminal === 'function') setupTerminal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModule);
} else {
  initModule();
}

async function showModuleCompletePopup(currentModIndex, totalModules) {
  let popup = document.getElementById('congrats-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'congrats-popup';
    popup.style.cssText =
      'position:fixed; top:0; left:0; width:100%; height:100%; background:var(--surface-2); z-index:9999; display:flex; justify-content:center; align-items:center; opacity:0; transition:opacity 0.3s ease; pointer-events:none; font-family:"Chakra Petch", sans-serif;';
  }

  let nextBtnHtml = '';
  if (currentModIndex < totalModules - 1) {
    nextBtnHtml = `<button onclick="document.getElementById('congrats-popup').remove(); loadModule(${currentModIndex + 1});" style="background:var(--surface-2); color:var(--cyan); border:2px solid var(--cyan); padding:12px 20px; border-radius:4px; font-family:'Press Start 2P', monospace; font-size:10px; cursor:pointer; flex:1; transition:all 0.2s; text-shadow:0 0 8px var(--cyan-glow);" onmouseover="this.style.background='var(--cyan-dim)'; this.style.boxShadow='4px 4px 0 rgba(32, 212, 221, 0.3)';" onmouseout="this.style.background='rgba(6, 0, 14, 0.88)'; this.style.boxShadow='none';">PROCEED TO NEXT</button>`;
  }

  popup.innerHTML = `
    <div style="background:var(--surface-2); border:2px solid var(--pink); border-radius:4px; padding:40px; text-align:center; max-width:480px; transform:scale(0.8); transition:transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow:0 0 20px var(--pink-glow), 4px 4px 0 rgba(139, 68, 204, 0.6); backdrop-filter:blur(6px);">
      <div class="glitch" data-text="SUCCESS" style="font-family:'Press Start 2P', monospace; font-size:32px; color:var(--pink); margin-bottom:20px; animation: glow-pulse-simple 3s infinite;">SUCCESS</div>
      <h2 style="color:var(--text); font-family:'Press Start 2P', monospace; font-size:12px; margin-bottom:16px; letter-spacing:2px; text-shadow:0 0 6px var(--pink-glow);">MISSION CLEAR!</h2>
      <p style="color:var(--text-dim); font-family:'Noto Sans Thai', sans-serif; font-size:16px; margin-bottom:34px; line-height:1.6;">ยอดเยี่ยมมาก! คุณผ่านบทเรียนนี้สำเร็จแล้ว</p>
      <div style="display:flex; gap:14px; justify-content:center;">
        <button onclick="window.location.href='../index.html'" style="background:transparent; color:var(--text-dim); border:2px solid var(--border-dim); padding:12px 20px; border-radius:4px; font-family:'Press Start 2P', monospace; font-size:10px; cursor:pointer; flex:1; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--pink)'; this.style.color='var(--pink)'; this.style.boxShadow='2px 2px 0 rgba(233, 30, 140, 0.4)';" onmouseout="this.style.borderColor='var(--border-dim)'; this.style.color='var(--text-dim)'; this.style.boxShadow='none';">RETURN TO BASE</button>
        ${nextBtnHtml}
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  if (!document.getElementById('popup-animations')) {
    let style = document.createElement('style');
    style.id = 'popup-animations';
    style.innerHTML =
      '@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }';
    document.head.appendChild(style);
  }

  // Calculate overall mission progress across all OFFENSIVE_MODULES to fix ghost progress
  let totalAllQ = 0;
  let compAllQ = 0;
  OFFENSIVE_MODULES.forEach((m) => {
    m.sections.forEach((s, idx) => {
      if (
        s.answer ||
        s.flag ||
        s.type === 'inbox_simulator' ||
        s.type === 'ghost_simulator'
      ) {
        totalAllQ++;
        if (window.currentModuleCompletedIds.includes(m.id + '-' + idx))
          compAllQ++;
      }
    });
  });
  let percent = totalAllQ > 0 ? Math.round((compAllQ / totalAllQ) * 100) : 0;

  if (window.Auth && typeof window.Auth.getMe === 'function') {
    const profile = await window.Auth.getMe();
    const percent =
      profile && profile.progress && profile.progress['offensive']
        ? profile.progress['offensive'].percent
        : 0;
    if (percent >= 100 && window.Auth.unlockBadge) {
      window.Auth.unlockBadge('badge-off');
    }
  }
  void popup.offsetWidth; // force reflow
  popup.style.opacity = '1';
  popup.style.pointerEvents = 'auto';
  popup.children[0].style.transform = 'scale(1)';

  // Build sidebar again to update [OK] markers
  buildSidebar();
}
