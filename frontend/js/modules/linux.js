(function () {
  if (!window.quizAttempts) window.quizAttempts = {};
})();

var LINUX_MODULES = [
  {
    id: 'intro',
    title: 'Introduction to Linux & CLI',
    icon: '',
    sections: [
      {
        type: 'diagram',
        image: '../assets/images/linux.jpg',
      },

      {
        type: 'content',
        heading: 'Linux คืออะไร?',
        text: 'Linux เป็นระบบปฏิบัติการแบบ Open Source ที่ได้รับความนิยมอย่างมากในด้าน Cybersecurity เนื่องจากความยืดหยุ่น ความปลอดภัย และเครื่องมือจำนวนมากที่ใช้ในงาน Security โดย Linux ถูกพัฒนาครั้งแรกในปี 1991 โดย Linus Torvalds และได้กลายเป็นระบบปฏิบัติการหลักของ Server กว่า 90% ทั่วโลก รวมถึง Cloud Computing, IoT Devices และ Android Smartphones\n\nทำไมต้อง Linux ในงาน Cybersecurity?\n• Open Source -- สามารถตรวจสอบ Source Code ได้ มั่นใจเรื่องความปลอดภัย\n• CLI-Centric -- เครื่องมือ Security ส่วนใหญ่ทำงานผ่าน Command Line ทำให้ Automate ได้ง่าย\n• Customizable -- ปรับแต่งระบบได้ลึกถึง Kernel Level\n• Free -- ไม่มีค่าลิขสิทธิ์ เหมาะกับการ Lab และฝึกฝน\n\nDistributions ยอดนิยมสำหรับงาน Security:\n• Kali Linux -- สำหรับ Penetration Testing มี Tools กว่า 600 ตัว เช่น Nmap, Metasploit, Burp Suite\n• Parrot OS -- สำหรับทั้ง Pentest, Privacy และ Digital Forensics น้ำหนักเบากว่า Kali\n• Ubuntu Server -- สำหรับ Server Administration เสถียรและ Community ใหญ่\n• REMNUX -- สำหรับ Malware Analysis โดยเฉพาะ\n• Security Onion -- สำหรับ Network Security Monitoring',
      },
      {
        type: 'content',
        heading: 'Command Line Interface (CLI)',
        text: 'CLI (Command Line Interface) คือวิธีหลักในการใช้งาน Linux สำหรับงาน Security เพราะเครื่องมือส่วนใหญ่ไม่มีหน้าจอกราฟิก (GUI) การเชี่ยวชาญ CLI ทำให้คุณสามารถ Automate งาน Security ได้อย่างมีประสิทธิภาพ\n\nหลักการทำงานของ CLI:\n• Shell -- โปรแกรมที่รับคำสั่งจากผู้ใช้ (เช่น Bash, Zsh, Fish)\n• Terminal -- หน้าต่างที่ใช้พิมพ์คำสั่ง\n• Prompt -- เครื่องหมายบอกว่าพร้อมรับคำสั่ง (เช่น $ สำหรับ user, # สำหรับ root)\n\nคำสั่งพื้นฐานที่ต้องรู้สำหรับงาน Security:',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# แสดงไดเรกทอรีปัจจุบัน\npwd\n\n# แสดงรายการไฟล์\nls -la\n\n# เปลี่ยนไดเรกทอรี\ncd /home/user/documents\n\n# สร้างไดเรกทอรี\nmkdir my_folder\n\n# แสดงเนื้อหาไฟล์\ncat /etc/hostname\n\n# ค้นหาข้อความในไฟล์\ngrep "error" /var/log/syslog',
      },
      {
        type: 'quiz',
        question:
          'คำสั่งใดใช้แสดงรายการไฟล์และโฟลเดอร์ทั้งหมด รวมถึงไฟล์ที่ซ่อน?',
        answer: 'ls -la',
        hint: 'ลองนึกถึง flag -a ที่แสดงไฟล์ทั้งหมด (all)',
      },
      {
        type: 'quiz',
        question:
          "ถ้าต้องการค้นหาคำว่า 'failed' ในไฟล์ /var/log/auth.log ต้องใช้คำสั่งอะไร?",
        answer: 'grep "failed" /var/log/auth.log',
        hint: 'ใช้คำสั่ง grep ตามด้วยคำที่ต้องการค้นหาและชื่อไฟล์',
      },
    ],
  },
  {
    id: 'filesystem',
    title: 'File System & Permissions',
    icon: '',
    sections: [
      {
        type: 'content',
        heading: 'โครงสร้าง File System ของ Linux',
        text: 'Linux ใช้โครงสร้างแบบ Tree (Filesystem Hierarchy Standard - FHS) โดยมี / (root directory) เป็นจุดเริ่มต้นของทุกอย่าง ต่างจาก Windows ที่มี C:\\ D:\\ เป็น Drive ต่างกัน\n\nไดเรกทอรีสำคัญที่ Security Professional ต้องจำ:\n• /etc -- ไฟล์ Config ของระบบ (passwd, shadow, hosts, crontab, ssh/sshd_config)\n• /etc/passwd -- รายชื่อ User ทั้งหมดในระบบ (อ่านได้ทุกคน)\n• /etc/shadow -- รหัสผ่านที่ถูก Hash (อ่านได้เฉพาะ root)\n• /var/log -- Log Files ทั้งหมด เช่น syslog, auth.log, kern.log, apache2/access.log\n• /home -- โฮมไดเรกทอรีของผู้ใช้แต่ละคน เช่น /home/alice\n• /tmp -- ไฟล์ชั่วคราวที่ใครก็เขียนได้ มักถูกใช้โดย Malware เพื่อซ่อนตัว\n• /bin, /sbin -- โปรแกรมพื้นฐานของระบบ (ls, cat, cp) และโปรแกรมสำหรับ Admin (iptables, fdisk)\n• /root -- โฮมไดเรกทอรีของ root user (แยกจาก / เด็ดขาด)\n• /opt -- โปรแกรมเสริมที่ติดตั้งเพิ่มเติม\n• /proc -- ข้อมูล Process และ Kernel แบบ Virtual Filesystem (ไม่ได้อยู่บน Disk จริง)',
      },
      {
        type: 'content',
        heading: 'File Permissions',
        text: 'ทุกไฟล์ใน Linux มีระบบ Permission 3 ระดับที่ควบคุมว่าใครทำอะไรกับไฟล์ได้บ้าง ซึ่งเป็นหัวใจของ Linux Security:\n\n3 ระดับ Permission:\n• Owner (u) -- เจ้าของไฟล์ ผู้สร้างไฟล์จะเป็น Owner โดยอัตโนมัติ\n• Group (g) -- กลุ่มผู้ใช้ที่สังกัดอยู่ ใช้จัดกลุ่มสิทธิ์สำหรับทีม\n• Others (o) -- ผู้ใช้คนอื่นๆ ทั้งหมดที่ไม่ใช่ Owner และไม่ได้อยู่ใน Group\n\n3 ประเภท Permission:\n• Read (r=4) -- อ่านเนื้อหาไฟล์ / ดูรายชื่อใน Directory\n• Write (w=2) -- แก้ไขไฟล์ / สร้าง-ลบไฟล์ใน Directory\n• Execute (x=1) -- รันไฟล์เป็นโปรแกรม / เข้าไปใน Directory (cd)\n\nตัวอย่างค่า Permission แบบตัวเลข (Octal):\n• 777 = rwxrwxrwx -- ทุกคนทำได้หมด (อันตรายมาก!)\n• 755 = rwxr-xr-x -- Owner ทำได้หมด, คนอื่นอ่าน+รันได้\n• 644 = rw-r--r-- -- Owner อ่าน+เขียน, คนอื่นอ่านอย่างเดียว\n• 600 = rw------- -- เฉพาะ Owner อ่าน+เขียนเท่านั้น (เหมาะสำหรับไฟล์ลับ)\n\nSpecial Permissions ที่เกี่ยวข้องกับ Security:\n• SUID (4000) -- ไฟล์จะรันด้วยสิทธิ์ของ Owner (ถ้า Owner เป็น root จะรันเป็น root!)\n• SGID (2000) -- ไฟล์จะรันด้วยสิทธิ์ของ Group\n• Sticky Bit (1000) -- ใน Directory ที่มี Sticky Bit เฉพาะเจ้าของไฟล์เท่านั้นที่ลบได้ (เช่น /tmp)',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# ดูสิทธิ์ของไฟล์\nls -la /etc/passwd\n# -rw-r--r-- 1 root root 2847 Jan 15 10:30 /etc/passwd\n\n# เปลี่ยนสิทธิ์ไฟล์\nchmod 755 script.sh    # rwxr-xr-x\nchmod 600 secret.key   # rw-------\n\n# เปลี่ยนเจ้าของไฟล์\nchown user:group file.txt\n\n# ค้นหาไฟล์ที่มี SUID bit (ช่องโหว่ที่พบบ่อย)\nfind / -perm -4000 -type f 2>/dev/null',
      },
      {
        type: 'quiz',
        question:
          'ถ้าต้องการตั้งค่าให้ไฟล์ secret.txt อ่านและเขียนได้เฉพาะเจ้าของเท่านั้น ต้องใช้คำสั่งอะไร?',
        answer: 'chmod 600 secret.txt',
        hint: 'Owner = rw (4+2=6), Group = none (0), Others = none (0)',
      },
      {
        type: 'quiz',
        question: 'ไดเรกทอรีใดเก็บ log files ของระบบ?',
        answer: '/var/log',
        hint: 'อยู่ภายใต้ /var',
      },
    ],
  },
  {
    id: 'users',
    title: 'Users, Groups & Processes',
    icon: '',
    sections: [
      {
        type: 'content',
        heading: 'การจัดการ Users & Groups',
        text: 'ใน Linux การจัดการ Users & Groups เป็นหัวใจสำคัญของ Security เพราะเป็นตัวกำหนดว่าใครมีสิทธิ์ทำอะไรได้บ้างบนระบบ:\n\nUser Identification:\n• แต่ละ User มี UID (User ID) เฉพาะตัว UID เริ่มต้นที่ 1000 สำหรับ User ทั่วไป\n• root (UID 0) มีสิทธิ์สูงสุด สามารถทำอะไรก็ได้ในระบบ (Superuser) ต้องระวังการใช้งาน root เพราะอาจทำให้ระบบเสียหายได้\n• System Users (UID 1-999) ใช้รัน Services เช่น www-data สำหรับเว็บเซิร์ฟเวอร์, mysql สำหรับฐานข้อมูล\n\nไฟล์สำคัญเกี่ยวกับ Users:\n• /etc/passwd -- เก็บข้อมูล User ทุกคน (username, UID, home directory, shell) สามารถอ่านได้ทุกคน\n  ตัวอย่าง: alice:x:1001:1001:Alice:/home/alice:/bin/bash\n• /etc/shadow -- เก็บ Password Hash ของทุก User (อ่านได้เฉพาะ root) ถ้าแฮกเกอร์ได้ไฟล์นี้ไป สามารถใช้เครื่องมือ Crack รหัสผ่านได้ เช่น John the Ripper หรือ Hashcat\n• /etc/group -- เก็บข้อมูล Group ทั้งหมด\n\nGroup Management:\n• Groups ใช้จัดกลุ่ม Users ที่มีสิทธิ์คล้ายกัน\n• Group ที่สำคัญ: sudo (มีสิทธิ์ใช้ sudo), wheel (เหมือน sudo ใน CentOS/RHEL), docker, www-data\n• sudo -- คำสั่งที่ให้ User ธรรมดาทำงานในสิทธิ์ root ชั่วคราว (ต้องอยู่ใน Group sudo ถึงใช้ได้)',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# สร้าง user ใหม่\nsudo useradd -m -s /bin/bash newuser\nsudo passwd newuser\n\n# เพิ่ม user เข้า group\nsudo usermod -aG sudo newuser\n\n# ดูข้อมูล user ปัจจุบัน\nwhoami\nid\n\n# ดูรายชื่อ user ทั้งหมด\ncat /etc/passwd\n\n# ดู user ที่ login อยู่\nwho\nw',
      },
      {
        type: 'content',
        heading: 'Process Management',
        text: 'การตรวจสอบ Process เป็นทักษะสำคัญสำหรับการตรวจจับ Malware หรือ Unauthorized Access เพราะทุกโปรแกรมที่ทำงานอยู่ในระบบจะปรากฏเป็น Process\n\nProcess คืออะไร?\n• Process คือโปรแกรมที่กำลังทำงานอยู่ แต่ละ Process จะมี PID (Process ID) ไม่ซ้ำกัน\n• Parent Process (PPID) คือ Process ที่สร้าง Process นี้ขึ้นมา\n• Process เริ่มต้นของระบบคือ init หรือ systemd (PID 1)\n\nสิ่งที่ต้องสังเกตเมื่อตรวจหา Malware:\n• Process ที่ใช้ CPU/Memory สูงผิดปกติ\n• Process ที่รันด้วย root แต่ไม่ใช่ Service ที่ควรจะรัน\n• Process ที่มีชื่อคล้ายกับ Service จริงแต่สะกดผิดเล็กน้อย (เช่น sshdd แทน sshd)\n• Process ที่เปิด Network Connection ไปยัง IP ที่ไม่รู้จัก\n• Process ที่รันจาก /tmp หรือไดเรกทอรีที่ผิดปกติ',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# แสดง process ทั้งหมด\nps aux\n\n# แสดง process แบบ real-time\ntop\nhtop\n\n# ค้นหา process ที่น่าสงสัย\nps aux | grep suspicious\n\n# หยุด process\nkill -9 <PID>\n\n# ดู network connections ของ process\nnetstat -tulnp\nss -tulnp',
      },
      {
        type: 'quiz',
        question: 'คำสั่งใดใช้ดูว่า user ปัจจุบันอยู่ใน group ใดบ้าง?',
        answer: 'id',
        hint: 'คำสั่งสั้นๆ 2 ตัวอักษร',
      },
      {
        type: 'quiz',
        question: 'ไฟล์ใดเก็บ password hash ของ user ทั้งหมดในระบบ?',
        answer: '/etc/shadow',
        hint: "อยู่ในไดเรกทอรี /etc และชื่อเกี่ยวกับ 'เงา'",
      },
    ],
  },
  {
    id: 'scripting',
    title: 'Shell Scripting สำหรับ Security',
    icon: '',
    sections: [
      {
        type: 'content',
        heading: 'ทำไมต้องเรียน Shell Scripting?',
        text: 'Shell Scripting เป็นทักษะที่ขาดไม่ได้สำหรับ Security Professional เพราะช่วยให้คุณ Automate งาน Security ที่ต้องทำซ้ำๆ ได้อย่างรวดเร็วและแม่นยำ\n\nทำไมต้องเรียน Shell Scripting?\n• ตรวจสอบ Log Files อัตโนมัติ -- เขียน Script เพื่อ Scan log หาคำสำคัญ เช่น Failed password, error, unauthorized\n• สแกนหาไฟล์ที่ถูกแก้ไข -- ใช้ find + md5sum ตรวจสอบ File Integrity\n• สร้าง Report การ Audit -- รวมข้อมูลระบบเป็น Report อัตโนมัติ\n• Automate Incident Response -- เช่น Block IP อัตโนมัติเมื่อพบ Brute Force Attack\n• Scheduled Tasks -- ใช้ Cron Job ตั้งเวลารัน Script เป็นประจำ เช่น ทุก 5 นาที\n\nBasics ของ Shell Script:\n• Shebang (#!/bin/bash) -- บรรทัดแรกสุดที่บอกว่าใช้ Shell ตัวไหนรัน\n• Variables -- เก็บค่าตัวแปร เช่น NAME="Alice"\n• Conditionals -- if-else สำหรับตัดสินใจ\n• Loops -- for, while สำหรับทำซ้ำ\n• Functions -- แยกโค้ดเป็นส่วนย่อยเพื่อ Reuse\n• Exit Codes -- 0 = สำเร็จ, ไม่ใช่ 0 = ล้มเหลว',
      },
      {
        type: 'code',
        language: 'bash',
        code: '#!/bin/bash\n# === Security Log Monitor ===\n# สคริปต์ตรวจสอบ failed login attempts\n\nLOG_FILE="/var/log/auth.log"\nTHRESHOLD=5\n\necho "[*] Checking failed login attempts..."\n\n# นับจำนวน failed attempts ต่อ IP\ngrep "Failed password" $LOG_FILE | \\\n  awk \'{print $(NF-3)}\' | \\\n  sort | uniq -c | sort -rn | \\\n  while read count ip; do\n    if [ "$count" -ge "$THRESHOLD" ]; then\n      echo "[!] ALERT: $ip has $count failed attempts!"\n    fi\n  done\n\necho "[*] Check complete."',
      },
      {
        type: 'content',
        heading: 'สร้างสคริปต์ตรวจสอบระบบ',
        text: 'ลองเขียนสคริปต์ Security Audit เพื่อตรวจสอบความปลอดภัยของระบบอัตโนมัติ สคริปต์นี้จะรวบรวมข้อมูลสำคัญเช่น ระบบปฏิบัติการ, Port ที่เปิดอยู่, ไฟล์ที่มี SUID bit, การ Login ล่าสุด, และ Cron Job ที่ตั้งเวลาไว้ ซึ่งข้อมูลเหล่านี้ช่วยให้ SOC Analyst ตรวจสอบได้ว่ามีความผิดปกติหรือไม่:',
      },
      {
        type: 'code',
        language: 'bash',
        code: '#!/bin/bash\n# === System Security Audit ===\n\necho "========== SYSTEM INFO =========="\nuname -a\necho ""\n\necho "========== LISTENING PORTS =========="\nss -tulnp\necho ""\n\necho "========== SUID FILES =========="\nfind / -perm -4000 -type f 2>/dev/null\necho ""\n\necho "========== RECENT LOGINS =========="\nlast -n 10\necho ""\n\necho "========== CRON JOBS =========="\nfor user in $(cut -d: -f1 /etc/passwd); do\n  crontab -l -u $user 2>/dev/null\ndone',
      },
      {
        type: 'quiz',
        question:
          'ในบรรทัดแรกของ shell script ต้องเขียนอะไรเพื่อระบุว่าใช้ bash?',
        answer: '#!/bin/bash',
        hint: 'เรียกว่า shebang (#!) ตามด้วย path ของ bash',
      },
      {
        type: 'quiz',
        question: 'คำสั่งใดใช้ค้นหาไฟล์ที่มี SUID bit ตั้งค่าอยู่?',
        answer: 'find / -perm -4000 -type f',
        hint: 'ใช้ find กับ -perm flag โดย SUID = 4000',
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
  LINUX_MODULES.forEach(function (mod, i) {
    // Exact completion check
    let totalQ = 0;
    let compQ = 0;
    mod.sections.forEach((s, idx) => {
      if (s.answer || s.flag) {
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
    html += '<span class="mod-emoji">' + (mod.icon || '🐧') + '</span>';
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
  var mod = LINUX_MODULES[index];
  contentTitle.textContent = mod.icon + ' ' + mod.title;

  window.CURRENT_LAB_ID = mod.id;
  window.CURRENT_LAB_TITLE = mod.title;
  var quizzes = [];
  mod.sections.forEach(function (s) {
    if (s.type === 'quiz') quizzes.push(s.question);
  });
  window.CURRENT_LAB_QUIZZES = quizzes;

  var html = '';
  mod.sections.forEach(function (section, si) {
    html += '<div class="lesson-section">';

    if (section.type === 'content') {
      html += '<h2>' + section.heading + '</h2>';
      html += '<div class="lesson-text">' + escapeHtml(section.text) + '</div>';
    } else if (section.type === 'code') {
      html += '<div class="code-block">';
      html += '<div class="code-header">';
      html += '<span class="dot red"></span>';
      html += '<span class="dot yel"></span>';
      html += '<span class="dot grn"></span>';
      html += '<span class="lang">' + section.language + '</span>';
      html += '</div>';
      html += '<div class="code-body">';
      html += '<pre>' + highlightBash(escapeHtml(section.code)) + '</pre>';
      html += '</div>';
      html += '</div>';
    } else if (section.type === 'diagram') {
      html += '<div class="diagram-container">';
      html += '<img src="' + section.image + '" alt="Diagram">';
      if (section.caption) {
        html += '<p class="diagram-caption">' + section.caption + '</p>';
      }
      html += '</div>';
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
        var input = document.getElementById(
          'quiz-' + currentModIndex + '-' + idx,
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

  window.scrollTo(0, 0);

  document.querySelector('.module-sidebar').classList.remove('open');
}

async function checkQuiz(modIndex, sectionIndex) {
  var input = document.getElementById('quiz-' + modIndex + '-' + sectionIndex);
  var fb = document.getElementById('fb-' + modIndex + '-' + sectionIndex);
  var section = LINUX_MODULES[modIndex].sections[sectionIndex];

  if (!input.value.trim()) {
    fb.textContent = '[i] Hint: ' + section.hint;
    fb.className = 'quiz-feedback hint';
    return;
  }

  var userAnswer = input.value.trim().toLowerCase().replace(/\s+/g, ' ');
  var correctAnswer = section.answer.toLowerCase().replace(/\s+/g, ' ');

  if (userAnswer === correctAnswer) {
    fb.textContent = '[OK] SUCCESS';
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
      const sectionId = LINUX_MODULES[modIndex].id + '-' + sectionIndex;
      const res = await window.Auth.submitTask('linux', sectionId);
      if (res.success) {
        // Update local state if needed (optional)
        if (res.completed_ids)
          window.currentModuleCompletedIds = res.completed_ids;
      }
    }

    let moduleCompleted = true;
    for (let i = 0; i < LINUX_MODULES[modIndex].sections.length; i++) {
      let s = LINUX_MODULES[modIndex].sections[i];
      if (s.answer || s.flag || s.type === 'inbox_simulator') {
        let reqId = LINUX_MODULES[modIndex].id + '-' + i;
        if (!window.currentModuleCompletedIds || !window.currentModuleCompletedIds.includes(reqId)) {
          moduleCompleted = false;
          break;
        }
      }
    }
    if (moduleCompleted) {
      setTimeout(() => showModuleCompletePopup(modIndex, LINUX_MODULES.length), 500);
    }
  } else {
    fb.textContent = '❌ Incorrect. Try again!';
    fb.className = 'quiz-feedback error';
    setTimeout(function () {
      fb.textContent = '[i] Hint: ' + section.hint;
      fb.className = 'quiz-feedback hint';
    }, 1500);
  }
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function highlightBash(code) {
  return code.replace(/(#[^\n]*)/g, '<span class="comment">$1</span>');
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
    let progData = await window.Auth.getProgressData('linux');
    window.currentModProgressData = progData;
    window.currentModuleCompletedIds = progData.completed_ids || [];
    // Calculate overall progress across all LINUX_MODULES to fix ghost progress
    let totalAllQ = 0;
    let compAllQ = 0;
    let doneMods = 0;
    LINUX_MODULES.forEach((m) => {
      let mTotal = 0;
      let mDone = 0;
      m.sections.forEach((s, idx) => {
        if (s.answer || s.flag) {
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
    startIndex = Math.min(doneMods, LINUX_MODULES.length - 1);
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

  if (window.Auth && typeof window.Auth.getMe === 'function') {
    const profile = await window.Auth.getMe();
    const percent =
      profile && profile.progress && profile.progress['linux']
        ? profile.progress['linux'].percent
        : 0;
    if (percent >= 100 && window.Auth.unlockBadge) {
      window.Auth.unlockBadge('badge-linux');
    }
  }
  if (currentModIndex + 1 > (window.completedMods || 0)) {
    window.completedMods = currentModIndex + 1;
    buildSidebar();
  }

  void popup.offsetWidth; // force reflow
  popup.style.opacity = '1';
  popup.style.pointerEvents = 'auto';
  popup.children[0].style.transform = 'scale(1)';

  // Build sidebar again to update [OK] markers
  buildSidebar();
}
