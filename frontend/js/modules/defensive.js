(function () {
  if (!window.quizAttempts) window.quizAttempts = {};
})();

var DEFENSIVE_MODULES = [
  {
    id: 'siem-intro',
    title: 'Introduction to SIEM',
    icon: '🛡️',
    sections: [
      {
        type: 'content',
        heading: 'SIEM คืออะไร?',
        text: 'SIEM (Security Information and Event Management) เป็นระบบที่รวบรวม Log จากอุปกรณ์ต่างๆ เช่น Firewall, Server, Router นำมาวิเคราะห์หาความผิดปกติ (Anomaly) แบบ Real-time และใช้เก็บ Log ไว้ตรวจสอบย้อนหลัง (Investigation)',
      },
      {
        type: 'content',
        heading: 'ความสำคัญของ SIEM ใน Blue Team',
        text: 'ในมุมมองของ Defensive Security ทีมจะใช้หน้าจอ SIEM เป็นตาในการตรวจจับภัยคุกคาม หากมีการพยายาม Login รหัสผ่านผิดซ้ำๆ (Brute Force) หรือมี Traffic แปลกๆ หลุดเข้ามา SIEM จะสร้าง Alert แจ้งเตือนเพื่อให้ SOC Analyst เข้าไปตรวจสอบ',
      },
      {
        type: 'quiz',
        question:
          'แพลตฟอร์มที่ทำหน้าที่รวบรวม Log จากหลายแหล่งมาวิเคราะห์ความปลอดภัย ย่อมาจากอะไร?',
        answer: 'siem',
        hint: 'แพลตฟอร์มนี้ชื่อย่อ 4 ตัวอักษร',
      },
    ],
  },
  {
    id: 'log-analysis',
    title: 'Log Analysis 101',
    icon: '📜',
    sections: [
      {
        type: 'content',
        heading: 'การวิเคราะห์ Log เบื้องต้น',
        text: 'Log คือบันทึกการทำงานของระบบ การจะดูว่าระบบถูกเจาะหรือไม่ มักต้องดูจาก Log ตัวอย่างเช่น เครื่อง Linux จะเก็บ Web Server log ไว้ที่ `/var/log/apache2/access.log` หรือ `/var/log/nginx/access.log` และบันทึกการ Login ไว้ที่ `/var/log/auth.log`',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# ตัวอย่าง Log เลียนแบบการพยายามเดารหัสผ่านใน /var/log/auth.log\nAug 28 10:14:52 server sshd[1204]: Failed password for root from 192.168.1.100 port 38290 ssh2\nAug 28 10:14:55 server sshd[1207]: Failed password for root from 192.168.1.100 port 38294 ssh2\nAug 28 10:14:58 server sshd[1210]: Failed password for admin from 192.168.1.100 port 38298 ssh2\nAug 28 10:15:02 server sshd[1213]: Accepted password for admin from 192.168.1.100 port 38302 ssh2',
      },
      {
        type: 'quiz',
        question: 'จาก Log ตัวอย่าง ผู้โจมตีมาจาก IP Address หมายเลขใด?',
        answer: '192.168.1.100',
        hint: 'IP ของคนที่พยายาม Connect เข้ามา (from ...)',
      },
      {
        type: 'quiz',
        question:
          'การโจมตีที่พยายามส่งรหัสผ่านผิดหลายๆ ครั้งเพื่อเดารหัส เรียกว่าเทคนิคใด?',
        answer: 'brute force',
        hint: "ภาษาอังกฤษแปลตรงตัวแปลว่า 'การใช้กำลัง' (สองพยางค์)",
      },
    ],
  },
  {
    id: 'incident-response',
    title: 'Incident Response',
    icon: '🚨',
    sections: [
      {
        type: 'content',
        heading: 'วงจร Incident Response (IR)',
        text: 'เมื่อเกิดเหตุการณ์ถูกโจมตี ทีมรับมือเหตุการณ์ (IR) จะมี 6 ขั้นตอนหลัก (NIST Framework):\n1. Preparation (เตรียมพร้อม)\n2. Identification (ระบุเหตุการณ์)\n3. Containment (จำกัดความเสียหาย)\n4. Eradication (กำจัดต้นตอ)\n5. Recovery (กู้คืนระบบ)\n6. Lessons Learned (ถอดบทเรียน)',
      },
      {
        type: 'content',
        heading: 'กรณีศึกษา: Web Server ขุดเหมือง',
        text: "หากเราพบว่าเซิร์ฟเวอร์ของเรา CPU ทำงาน 100% ตลอดเวลา และพบ Process แปลกๆ ทำงานอยู่ การดึงปลั๊กหรือล้างเครื่องทันทีอาจทำให้หลักฐานหายไป ควรเริ่มจากการ 'Containment' เช่น ตัด Network ของเครื่องนั้นออกจากวง LAN เพื่อไม่ให้ลามไปเครื่องอื่น แล้วจึงทำการวิเคราะห์ (Identification) และกำจัดมัลแวร์ (Eradication)",
      },
      {
        type: 'quiz',
        question:
          "ขั้นตอนการ 'จำกัดพื้นที่ความเสียหาย' ไม่ให้ลุกลามไปยังระบบอื่น คือข้อใด (ใช้ภาษาอังกฤษ)",
        answer: 'containment',
        hint: 'ขึ้นต้นด้วย C (นึกถึงคำว่ากักกันโรค)',
      },
    ],
  },
  {
    id: 'siem-sim',
    title: 'SIEM Simulator',
    icon: '🕹️',
    sections: [
      {
        type: 'content',
        heading: 'จำลองระบบ SIEM',
        text: 'วิเคราะห์ Log แจ้งเตือนจากหน้าจอ SIEM ด้านล่าง เพื่อหาความผิดปกติ (Anomaly) ที่เกิดขึ้นในระบบ เมื่อพบ IP ที่น่าสงสัย ให้ทำการ Report Incident เพื่อรับ Flag',
      },
      {
        type: 'siem_simulator',
        logs: [
          {
            time: '22:10:01',
            source: '192.168.1.55',
            dest: '10.0.0.80',
            event: 'TCP connection accepted',
            severity: 'low',
          },
          {
            time: '22:11:15',
            source: '192.168.1.12',
            dest: '10.0.0.80',
            event: 'HTTP GET /index.html',
            severity: 'info',
          },
          {
            time: '22:15:22',
            source: '203.0.113.42',
            dest: '10.0.0.80',
            event: 'HTTP GET /admin?page=../../../../etc/passwd',
            severity: 'high',
          },
          {
            time: '22:15:23',
            source: '203.0.113.42',
            dest: '10.0.0.80',
            event: 'HTTP 200 OK (Response: 2048 bytes)',
            severity: 'high',
          },
          {
            time: '22:16:05',
            source: '203.0.113.42',
            dest: '10.0.0.80',
            event: 'HTTP POST /upload.php',
            severity: 'critical',
          },
          {
            time: '22:16:08',
            source: '203.0.113.42',
            dest: '10.0.0.80',
            event: 'HTTP GET /uploads/shell.php?cmd=whoami',
            severity: 'critical',
          },
          {
            time: '22:16:15',
            source: '10.0.0.80',
            dest: '203.0.113.42',
            event: 'Outbound TCP connection to port 4444',
            severity: 'critical',
          },
          {
            time: '22:17:00',
            source: '192.168.1.88',
            dest: '10.0.0.80',
            event: 'HTTP GET /contact.php',
            severity: 'info',
          },
        ],
        question:
          'จากเหตุการณ์ที่เกิดขึ้น มีการพยายามโจมตีแบบซับซ้อน (LFI -> RCE -> Reverse Shell) ตรวจสอบจาก Log ด้านบน IP Address ของแฮกเกอร์คืออะไร?',
        answer: '203.0.113.42',
        flag: 'FLAG_B0K1_LNWZ4',
        hint: 'สังเกต IP ที่มีการเรียกอ่านไฟล์ /etc/passwd และมีการเชื่อมต่อกลับไปหาที่พอร์ตแปลกๆ เช่น 4444',
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
  DEFENSIVE_MODULES.forEach(function (mod, i) {
    // Exact completion check
    let totalQ = 0;
    let compQ = 0;
    mod.sections.forEach((s, idx) => {
      if (s.answer || s.flag || s.type === 'inbox_simulator') {
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
  var mod = DEFENSIVE_MODULES[index];
  contentTitle.textContent = mod.icon + ' ' + mod.title;
  window.CURRENT_LAB_ID = mod.id;
  window.CURRENT_LAB_TITLE = mod.title;

  var quizzes = [];
  mod.sections.forEach(function (s) {
    if (s.type === 'quiz') quizzes.push(s.question);
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
    } else if (section.type === 'code') {
      html +=
        '<div class="code-block" style="background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:12px;margin:15px 0;overflow-x:auto;">';
      html +=
        '<pre style="margin:0;color:var(--green);font-family:\'Fira Code\',monospace;font-size:13px;line-height:1.6;"><code>' +
        escapeHtml(section.code) +
        '</code></pre>';
      html += '</div>';

      pageTextForBot +=
        '[ตัวอย่างโค้ด] ' +
        (section.language || 'code') +
        '\\n' +
        section.code +
        '\\n';
    } else if (section.type === 'quiz') {
      html += '<div class="quiz-block">';
      html += '<span class="quiz-label">QUIZ</span>';
      html += '<p class="quiz-question">' + section.question + '</p>';
      html += '<div class="quiz-answer-row">';
      html +=
        '<input class="quiz-input" id="quiz-' +
        index +
        '-' +
        si +
        '" type="text" placeholder="พิมพ์คำตอบที่นี่..." onkeydown="if(event.key===\'Enter\')checkQuiz(' +
        index +
        ',' +
        si +
        ')">';
      html +=
        '<button class="quiz-submit" onclick="checkQuiz(' +
        index +
        ',' +
        si +
        ')">SUBMIT</button>';
      html += '</div>';
      html +=
        '<div class="quiz-feedback" id="fb-' + index + '-' + si + '"></div>';
      html += '</div>';

      pageTextForBot +=
        '[คำถาม Quiz ให้ผู้เรียนตอบ] ' +
        section.question +
        '\\n[เฉลยที่ถูกต้องของ Quiz นี้] ' +
        section.answer +
        '\\n';
    } else if (section.type === 'siem_simulator') {
      html +=
        '<div class="siem-sim-app" style="background:#050505; border:1px solid #333; border-radius:10px; overflow:hidden; margin: 30px 0; font-family:\'Chakra Petch\', sans-serif; box-shadow: 0 0 30px var(--cyan-glow);">';

      html +=
        '<div class="siem-topbar" style="background: linear-gradient(90deg, #111, #1a1a1a); padding: 12px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #222;">';
      html += '  <div style="display:flex; align-items:center; gap:12px;">';
      html +=
        '    <div style="width:12px; height:12px; background:#f44336; border-radius:50%; box-shadow: 0 0 8px #f44336; animation: blink 2s infinite;"></div>';
      html +=
        '    <span style="color:#00e676; font-family:\'Press Start 2P\', monospace; font-size:12px; letter-spacing:1px;">DEFENSE-X <span style="color:#fff;">[SIEM ENG. v4.2]</span></span>';
      html += '  </div>';
      html +=
        '  <div style="display:flex; gap:16px; font-size:12px; color:#aaa;">';
      html +=
        '    <span><span>UPTIME: </span><span style="color:#00e676;">99.9%</span></span>';
      html +=
        '    <span><span>ACTIVE SENSORS: </span><span style="color:#00e676;">24/24</span></span>';
      html += '  </div>';
      html += '</div>';

      html +=
        '<div class="siem-main-layout" style="display:flex; height: 500px; max-height: 550px;">';

      html +=
        '  <div class="siem-alerts-panel" style="width: 250px; background:#0d0d0d; border-right:1px solid #222; padding:20px 15px; overflow-y:auto; display:flex; flex-direction:column; gap:12px;">';
      html +=
        '    <div style="font-size:11px; color:#888; letter-spacing:2px; font-family:\'Press Start 2P\', monospace; margin-bottom:8px;">NOTIFICATIONS</div>';

      let criticalCount = 0;
      let highCount = 0;
      section.logs.forEach(function (l) {
        if (l.severity === 'critical') criticalCount++;
        if (l.severity === 'high') highCount++;
      });

      if (criticalCount > 0) {
        html +=
          '<div style="background:var(--surface-2); border-left:3px solid #f44336; padding:12px; border-radius:4px;">';
        html +=
          '<div style="color:#f44336; font-size:12px; font-weight:bold; margin-bottom:6px;">🚨 CRITICAL ALERT</div>';
        html +=
          '<div style="color:#ccc; font-size:11px; line-height:1.4;">Unusual activity detected (' +
          criticalCount +
          ' events). Immediate analysis required.</div>';
        html += '</div>';
      }
      if (highCount > 0) {
        html +=
          '<div style="background:var(--surface-2); border-left:3px solid #ff9800; padding:12px; border-radius:4px;">';
        html +=
          '<div style="color:#ff9800; font-size:12px; font-weight:bold; margin-bottom:6px;">⚠️ HIGH SEVERITY</div>';
        html +=
          '<div style="color:#ccc; font-size:11px; line-height:1.4;">Suspicious requests monitored (' +
          highCount +
          ' events).</div>';
        html += '</div>';
      }

      html +=
        '<div style="background:var(--surface-2); border-left:3px solid #4caf50; padding:12px; border-radius:4px;">';
      html +=
        '<div style="color:#4caf50; font-size:12px; font-weight:bold; margin-bottom:6px;">[OK] SYSTEM OK</div>';
      html +=
        '<div style="color:#888; font-size:11px; line-height:1.4;">Normal traffic patterns observed within boundaries.</div>';
      html += '</div>';

      html += '  </div>';

      html +=
        '  <div class="siem-content-area" style="flex:1; display:flex; flex-direction:column; background:#111; overflow-x: auto;">';

      html +=
        '    <div class="siem-logs-window" style="flex:1; padding:0; overflow:hidden; display:flex; flex-direction:column;">';
      html +=
        '      <div style="background:#1a1a1a; padding:12px 20px; border-bottom:1px solid #222; font-size:13px; color:#fff; font-weight:600; display:flex; justify-content:space-between;">';
      html += '        <span>LIVE TRAFFIC LOGS</span>';
      html +=
        '        <span style="color:#888; font-family:\'Fira Code\', monospace; font-size:11px;">Total Events: ' +
        section.logs.length +
        '</span>';
      html += '      </div>';
      html += '      <div style="flex:1; overflow-y:auto; padding:0;">';
      html +=
        '        <table style="width:100%; text-align:left; border-collapse:collapse; font-family:\'Fira Code\', monospace; font-size:12px; line-height:1.5;">';
      html +=
        '          <tr style="color:#666; background:#151515; position:sticky; top:0;">';
      html +=
        '            <th style="padding:12px 20px; font-weight:normal;">TIME</th>';
      html +=
        '            <th style="padding:12px 20px; font-weight:normal;">SOURCE IP</th>';
      html +=
        '            <th style="padding:12px 20px; font-weight:normal;">DEST IP</th>';
      html +=
        '            <th style="padding:12px 20px; font-weight:normal;">EVENT DETAIL</th>';
      html += '          </tr>';

      section.logs.forEach(function (log) {
        let color = '#ccc';
        let bg = 'transparent';
        if (log.severity === 'high') {
          color = '#ffb74d';
          bg = 'rgba(255, 152, 0, 0.03)';
        }
        if (log.severity === 'critical') {
          color = '#ef5350';
          bg = 'rgba(244, 67, 54, 0.05)';
        }
        if (log.severity === 'info') {
          color = '#81c784';
        }

        html +=
          '          <tr style="color:' +
          color +
          '; background:' +
          bg +
          '; border-bottom:1px solid #222; transition:background 0.2s;">';
        html +=
          '            <td style="padding:12px 20px; white-space:nowrap;">[' +
          log.time +
          ']</td>';
        html +=
          '            <td style="padding:12px 20px;">' + log.source + '</td>';
        html +=
          '            <td style="padding:12px 20px;">' + log.dest + '</td>';
        html +=
          '            <td style="padding:12px 20px; word-break:break-word;">' +
          log.event +
          '</td>';
        html += '          </tr>';
      });

      html += '        </table>';
      html += '      </div>';
      html += '    </div>';

      html +=
        '    <div class="siem-report-window" style="background:#0a0a0a; border-top:1px solid #333; padding:24px;">';
      html +=
        '      <div style="display:flex; align-items:flex-start; gap:20px;">';
      html += '        <div style="font-size:36px;">📝</div>';
      html += '        <div style="flex:1;">';
      html +=
        '          <div style="color:#fff; font-size:16px; font-weight:700; margin-bottom:8px;">CREATE INCIDENT REPORT</div>';
      html +=
        '          <div style="color:#aaa; font-size:14px; line-height:1.6; margin-bottom:16px;">' +
        section.question +
        '</div>';
      html += '          <div style="display:flex; gap:12px;">';
      html +=
        '            <input id="siem-' +
        index +
        '-' +
        si +
        '" type="text" placeholder="ระบุ IP Address ต้นทาง..." style="flex:1; background:#111; border:1px solid #444; color:#fff; padding:14px 18px; font-family:\'Chakra Petch\', sans-serif; font-size:15px; border-radius:4px; outline:none; transition:border 0.2s;" onfocus="this.style.borderColor=\'#ff5f57\'" onblur="this.style.borderColor=\'#444\'" onkeydown="if(event.key===\'Enter\')checkSiem(' +
        index +
        ',' +
        si +
        ')">';
      html +=
        '            <button onclick="checkSiem(' +
        index +
        ',' +
        si +
        ')" style="background:#d84315; color:#fff; border:none; padding:0 32px; font-family:\'Chakra Petch\', sans-serif; font-size:15px; font-weight:700; border-radius:4px; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background=\'#bf360c\'" onmouseout="this.style.background=\'#d84315\'">SUBMIT REPORT</button>';
      html += '          </div>';
      html +=
        '          <div id="siem-fb-' +
        index +
        '-' +
        si +
        '" style="margin-top:16px; font-family:\'Fira Code\', monospace; font-size:14px; font-weight:bold;"></div>';

      html +=
        '          <div id="siem-flag-section-' +
        index +
        '-' +
        si +
        '" style="display:none; margin-top:24px; padding-top:24px; border-top:1px dashed #333; animation: fadeIn 0.5s ease;">';
      html +=
        '            <div style="color:#00e676; font-size:14px; font-weight:700; margin-bottom:12px;">🚩 MISSION REWARD OBTAINED. SUBMIT FLAG TO PASS:</div>';
      html += '            <div style="display:flex; gap:12px;">';
      html +=
        '              <input id="siem-flag-input-' +
        index +
        '-' +
        si +
        '" type="text" placeholder="Enter FLAG_XXXXX..." style="flex:1; background:#0a0a0a; border:1px solid #00e676; color:#00e676; padding:14px 18px; font-family:\'Fira Code\', monospace; font-size:15px; border-radius:4px; outline:none;" onkeydown="if(event.key===\'Enter\')submitSiemFlag(' +
        index +
        ',' +
        si +
        ')">';
      html +=
        '              <button onclick="submitSiemFlag(' +
        index +
        ',' +
        si +
        ')" style="background:#00e676; color:#000; border:none; padding:0 32px; font-family:\'Chakra Petch\', sans-serif; font-size:15px; font-weight:700; border-radius:4px; cursor:pointer; transition:transform 0.2s;" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'">VERIFY FLAG</button>';
      html += '            </div>';
      html += '          </div>';

      html += '        </div>';
      html += '      </div>';
      html += '    </div>';

      html += '  </div>';
      html += '</div>';
      html += '</div>';

      pageTextForBot +=
        '[ระบบจำลอง SIEM] ให้ผู้ใช้วิเคราะห์ Log แล้วตอบ IP ที่โจมตี คำตอบคือ ' +
        section.answer +
        '\\n';
    }

    html += '</div>';
  });

  contentArea.innerHTML = html;

  // Auto-fill completed sections
  if (window.currentModuleCompletedIds) {
    const completedIds = window.currentModuleCompletedIds;
    mod.sections.forEach((s, idx) => {
      const sectionId = mod.id + '-' + idx;
      if (completedIds.includes(sectionId)) {
        var input =
          document.getElementById('quiz-' + currentModIndex + '-' + idx) ||
          document.getElementById(
            'siem-flag-input-' + currentModIndex + '-' + idx,
          );
        if (input) {
          input.value = s.answer || s.flag || '';
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

  if (window.Chatbot) {
    window.Chatbot.setCurrentLab(mod.id);
    window.Chatbot.setPageContext(pageTextForBot);
  }

  // Auto-solve logic for previously persisted progress.
  if (window.completedModsPercent !== undefined) {
    let totalQuestions = 0;
    DEFENSIVE_MODULES[currentModIndex].sections.forEach((s) => {
      if (s.answer || s.flag || s.type === 'inbox_simulator') totalQuestions++;
    });

    let previouslySolved = Math.floor(
      (window.completedModsPercent / 100) * totalQuestions,
    );

    let solvedCount = 0;
    DEFENSIVE_MODULES[currentModIndex].sections.forEach((s, idx) => {
      if (s.answer || s.flag || s.type === 'inbox_simulator') {
        if (solvedCount < previouslySolved) {
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
            var fb = document.getElementById(
              'fb-' + currentModIndex + '-' + idx,
            );
            if (fb) {
              fb.textContent = '[OK] ALREADY COMPLETED';
              fb.className = 'quiz-feedback success';
            }
          }
          solvedCount++;
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

async function checkQuiz(modIndex, sectionIndex) {
  var input = document.getElementById('quiz-' + modIndex + '-' + sectionIndex);
  var fb = document.getElementById('fb-' + modIndex + '-' + sectionIndex);
  var section = DEFENSIVE_MODULES[modIndex].sections[sectionIndex];

  if (!input.value.trim()) {
    var qId = modIndex + '-' + sectionIndex;
    window.quizAttempts[qId] = window.quizAttempts[qId] || 0;
    fb.textContent = '[i] Hint: ' + section.hint;
    fb.className = 'quiz-feedback hint';
    return;
  }

  var userAnswer = input.value.trim().toLowerCase().replace(/\s+/g, ' ');
  var correctAnswer = section.answer.toLowerCase().replace(/\s+/g, ' ');

  if (userAnswer === correctAnswer) {
    fb.textContent = 'SUCCESS';
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
      const sectionId = DEFENSIVE_MODULES[modIndex].id + '-' + sectionIndex;
      const res = await window.Auth.submitTask('defensive', sectionId);
      if (res.success) {
        if (res.completed_ids)
          window.currentModuleCompletedIds = res.completed_ids;
      }
    }

    let moduleCompleted = true;
    for (let i = 0; i < DEFENSIVE_MODULES[modIndex].sections.length; i++) {
      let s = DEFENSIVE_MODULES[modIndex].sections[i];
      if (s.answer || s.flag || s.type === 'inbox_simulator') {
        let reqId = DEFENSIVE_MODULES[modIndex].id + '-' + i;
        if (!window.currentModuleCompletedIds || !window.currentModuleCompletedIds.includes(reqId)) {
          moduleCompleted = false;
          break;
        }
      }
    }
    if (moduleCompleted) {
      setTimeout(() => showModuleCompletePopup(modIndex, DEFENSIVE_MODULES.length), 500);
    }
  } else {
    fb.textContent = 'ผิด ลองใหม่อีกครั้ง!';
    fb.className = 'quiz-feedback error';
    setTimeout(function () {
      fb.textContent =
        '[i] Hint: ' + (section.hint || 'โปรดอ้างอิงเนื้อหาด้านบน');
      fb.className = 'quiz-feedback hint';
    }, 1500);
  }
}

function checkSiem(modIndex, sectionIndex) {
  var input = document.getElementById('siem-' + modIndex + '-' + sectionIndex);
  var fb = document.getElementById('siem-fb-' + modIndex + '-' + sectionIndex);
  var section = DEFENSIVE_MODULES[modIndex].sections[sectionIndex];

  if (!input.value.trim()) {
    fb.innerHTML =
      '<span style="color:#ffbd2e;">⚠️ ALERT: INCIDENT REPORT INCOMPLETE. ' +
      section.hint +
      '</span>';
    return;
  }

  var userAnswer = input.value.trim();
  var correctAnswer = section.answer;

  if (userAnswer === correctAnswer) {
    fb.innerHTML =
      '<div style="color:#00e676; background:#080808; padding:15px; border:1px solid #00e676; border-radius:4px; text-align:center; animation: fadeIn 0.3s ease;">' +
      '<div style="font-size:16px; margin-bottom:10px;">SUCCESS: THREAT IDENTIFIED AND CONTAINED</div>' +
      '<div style="font-size:12px; color:#aaa; margin-bottom:5px;">IP Address <b style="color:#fff;">' +
      userAnswer +
      '</b> ถูกบล็อก<br><span style="font-size:12px; color:#aaa; margin-top:5px; display:block;">โปรดรับ Flag ด้านล่างเพื่อยืนยันผลงาน</span>' +
      '</div>' +
      '<div style="color:#0ff; font-size:18px; letter-spacing:2px;">' +
      section.flag +
      '</div></div>';

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

    // Save granular progress
    const sectionId = DEFENSIVE_MODULES[modIndex].id + '-' + sectionIndex;
    if (!window.currentModuleCompletedIds)
      window.currentModuleCompletedIds = [];
    if (!window.currentModuleCompletedIds.includes(sectionId)) {
      window.currentModuleCompletedIds.push(sectionId);
    }

    let completedSections = 0;
    DEFENSIVE_MODULES[modIndex].sections.forEach((s, idx) => {
      const id = DEFENSIVE_MODULES[modIndex].id + '-' + idx;
      if (window.currentModuleCompletedIds.includes(id)) {
        completedSections++;
      }
    });

    let totalQuestions = 0;
    DEFENSIVE_MODULES[modIndex].sections.forEach((s) => {
      if (s.answer || s.flag || s.type === 'inbox_simulator') totalQuestions++;
    });

    let modulePercent =
      totalQuestions > 0 ? (completedSections / totalQuestions) * 100 : 100;

    if (window.Auth && typeof window.Auth.saveProgress === 'function') {
      window.Auth.saveProgress(
        'defensive',
        modulePercent,
        window.currentModuleCompletedIds,
      );
    }

    var flagSec = document.getElementById(
      'siem-flag-section-' + modIndex + '-' + sectionIndex,
    );
    if (flagSec) flagSec.style.display = 'block';
  } else {
    fb.innerHTML =
      '<span style="color:#f44336;">❌ ERROR: INCORRECT THREAT SOURCE DETECTED. SYSTEM REMAINS VULNERABLE.</span>';
    setTimeout(function () {
      fb.innerHTML =
        '<span style="color:#ffbd2e;">[i] Hint: ' + section.hint + '</span>';
    }, 2000);
  }
}

function submitSiemFlag(modIndex, sectionIndex) {
  var input = document.getElementById(
    'siem-flag-input-' + modIndex + '-' + sectionIndex,
  );
  var section = DEFENSIVE_MODULES[modIndex].sections[sectionIndex];

  if (input.value.trim() === section.flag) {
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

    // Save granular progress
    const sectionId = DEFENSIVE_MODULES[modIndex].id + '-' + sectionIndex;
    if (!window.currentModuleCompletedIds)
      window.currentModuleCompletedIds = [];
    if (!window.currentModuleCompletedIds.includes(sectionId)) {
      window.currentModuleCompletedIds.push(sectionId);
    }

    let completedSections = 0;
    DEFENSIVE_MODULES[modIndex].sections.forEach((s, idx) => {
      const id = DEFENSIVE_MODULES[modIndex].id + '-' + idx;
      if (window.currentModuleCompletedIds.includes(id)) {
        completedSections++;
      }
    });

    let totalQuestions = 0;
    DEFENSIVE_MODULES[modIndex].sections.forEach((s) => {
      if (s.answer || s.flag || s.type === 'inbox_simulator') totalQuestions++;
    });

    let modulePercent =
      totalQuestions > 0 ? (completedSections / totalQuestions) * 100 : 100;

    if (window.Auth && typeof window.Auth.saveProgress === 'function') {
      window.Auth.saveProgress(
        'defensive',
        modulePercent,
        window.currentModuleCompletedIds,
      );
    }

    let moduleCompleted = true;
    for (let i = 0; i < DEFENSIVE_MODULES[modIndex].sections.length; i++) {
      let s = DEFENSIVE_MODULES[modIndex].sections[i];
      if (s.answer || s.flag || s.type === 'inbox_simulator') {
        let reqId = DEFENSIVE_MODULES[modIndex].id + '-' + i;
        if (!window.currentModuleCompletedIds || !window.currentModuleCompletedIds.includes(reqId)) {
          moduleCompleted = false;
          break;
        }
      }
    }
    if (moduleCompleted) {
      setTimeout(() => showModuleCompletePopup(modIndex, DEFENSIVE_MODULES.length), 500);
    }

    input.style.borderColor = '#00e676';
    input.style.color = '#00e676';
  } else {
    input.style.borderColor = '#f44336';
    input.style.color = '#f44336';
    setTimeout(() => {
      input.style.borderColor = '#00e676';
      input.style.color = '#00e676';
    }, 800);
  }
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

  // Calculate overall mission progress across all DEFENSIVE_MODULES to fix ghost progress
  let totalAllQ = 0;
  let compAllQ = 0;
  DEFENSIVE_MODULES.forEach((m) => {
    m.sections.forEach((s, idx) => {
      if (s.answer || s.flag || s.type === 'inbox_simulator') {
        totalAllQ++;
        if (window.currentModuleCompletedIds.includes(m.id + '-' + idx))
          compAllQ++;
      }
    });
  });
  let percent = totalAllQ > 0 ? Math.round((compAllQ / totalAllQ) * 100) : 0;

  if (window.Auth && typeof window.Auth.saveProgress === 'function') {
    await window.Auth.saveProgress(
      'defensive',
      percent,
      window.currentModuleCompletedIds,
    );
    if (percent >= 100 && window.Auth.unlockBadge) {
      window.Auth.unlockBadge('badge-def');
    }
  }
  if (currentModIndex + 1 > (window.completedMods || 0)) {
    window.completedMods = currentModIndex + 1;
    buildSidebar();
  }

  void popup.offsetWidth;

  popup.style.opacity = '1';
  popup.style.pointerEvents = 'auto';
  popup.children[0].style.transform = 'scale(1)';

  // Build sidebar again to update [OK] markers
  buildSidebar();
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
    let progData = await window.Auth.getProgressData('defensive');
    window.currentModProgressData = progData;
    window.currentModuleCompletedIds = progData.completed_ids || [];
    // Calculate overall progress to fix ghost progress
    let totalAllQ = 0;
    let compAllQ = 0;
    let doneMods = 0;
    DEFENSIVE_MODULES.forEach((m) => {
      let mTotal = 0;
      let mDone = 0;
      m.sections.forEach((s, idx) => {
        if (s.answer || s.flag || s.type === 'inbox_simulator') {
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

    startIndex = Math.min(doneMods, DEFENSIVE_MODULES.length - 1);
  }
  loadModule(startIndex);
  if (typeof setupTerminal === 'function') setupTerminal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModule);
} else {
  initModule();
}
