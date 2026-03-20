(function () {
  if (!window.quizAttempts) window.quizAttempts = {};
})();

var INBOX_EMAILS = [
  {
    id: 0,
    senderName: 'HR Department',
    senderEmail: 'hr@cyberpark.co.th',
    subject: 'แจ้งวันหยุดประจำเดือนมีนาคม 2026',
    date: '28 Feb, 09:15 AM',
    preview: 'สวัสดีทุกท่าน ขอแจ้งวันหยุดประจำเดือน...',
    isPhishing: false,
    body: '<p>สวัสดีทุกท่าน,</p><p>ขอแจ้งวันหยุดประจำเดือนมีนาคม 2026 ดังนี้:</p><ul><li>6 มี.ค. -- วันมาฆบูชา</li><li>14 มี.ค. -- วันช้างไทย</li></ul><p>กรุณาวางแผนงานล่วงหน้า</p><p>ขอบคุณค่ะ,<br>ฝ่ายทรัพยากรบุคคล</p>',
    feedback:
      '[OK] อีเมลนี้ปลอดภัย! Domain @cyberpark.co.th เป็น domain บริษัทจริง เนื้อหาเป็นข้อมูลทั่วไป ไม่มีลิงก์แปลก ไม่ขอข้อมูลส่วนตัว',
  },
  {
    id: 1,
    senderName: 'SCB Security Alert',
    senderEmail: 'alert@scb-th-secure.com',
    subject: '⚠️ URGENT: บัญชีของคุณถูกล็อค กรุณายืนยันตัวตน',
    date: '28 Feb, 08:30 AM',
    preview: 'เรียน ลูกค้าผู้มีอุปการคุณ พบกิจกรรม...',
    isPhishing: true,
    body: '<p>เรียน ลูกค้าผู้มีอุปการคุณ,</p><p>เราพบกิจกรรมที่ผิดปกติในบัญชีของคุณจากอุปกรณ์ที่ไม่รู้จัก บัญชีของคุณจะถูกระงับภายใน <strong>12 ชั่วโมง</strong> หากไม่ดำเนินการยืนยันตัวตน</p><div style="text-align:center;margin:20px 0"><a href="javascript:void(0)" class="mockup-btn" title="http://scb-th-secure.com/verify-login">ยืนยันตัวตนทันที</a></div><p>ขอแสดงความนับถือ,<br>ทีมรักษาความปลอดภัย SCB</p>',
    feedback:
      '🔴 นี่คืออีเมล Phishing! สังเกต: 1) Domain scb-th-secure.com ไม่ใช่ scb.co.th จริง 2) สร้างความเร่งด่วน "ระงับภายใน 12 ชม." 3) ใช้คำทักทายกว้างๆ "ลูกค้าผู้มีอุปการคุณ" 4) ลิงก์เป็น domain ปลอม',
  },
  {
    id: 2,
    senderName: 'Amazon',
    senderEmail: 'ship-confirm@amazon.com',
    subject: 'Your Amazon order #402-1928374 has shipped!',
    date: '27 Feb, 06:12 PM',
    preview: 'Your package is on its way! Track your...',
    isPhishing: false,
    body: '<p>Hello,</p><p>Your order <strong>#402-1928374</strong> has shipped and is on its way!</p><p><strong>Estimated Delivery:</strong> March 3-5, 2026</p><p><strong>Item:</strong> USB-C Hub Adapter</p><p>You can track your package in the Amazon app.</p><p>Thank you for shopping with us!</p>',
    feedback:
      '[OK] อีเมลนี้ปลอดภัย! Domain @amazon.com เป็น domain จริงของ Amazon มีหมายเลข order ชัดเจน ไม่ขอข้อมูลส่วนตัว ไม่สร้างความเร่งด่วน',
  },
  {
    id: 3,
    senderName: 'Microsoft 365 Team',
    senderEmail: 'no-reply@microsft365.com',
    subject: 'Action Required: Your password will expire in 24 hours',
    date: '27 Feb, 02:44 PM',
    preview: 'Your Microsoft 365 password is about to...',
    isPhishing: true,
    body: '<p>Dear User,</p><p>Your Microsoft 365 password will expire in <strong>24 hours</strong>. To avoid losing access to your email and files, please update your password immediately.</p><div style="text-align:center;margin:20px 0"><a href="javascript:void(0)" class="mockup-btn" title="http://microsft365.com/password-reset">Update Password Now</a></div><p>If you did not request this, please ignore this email.</p><p>Microsoft 365 Support Team</p>',
    feedback:
      '🔴 นี่คืออีเมล Phishing! สังเกต: 1) Domain สะกดผิด microsft365.com (ขาดตัว "o" ในคำว่า Microsoft) 2) สร้างความเร่งด่วน "expire in 24 hours" 3) ใช้คำทักทาย "Dear User" แบบกว้างๆ',
  },
  {
    id: 4,
    senderName: 'ThaiPost Tracking',
    senderEmail: 'notify@thai-post-tracking.xyz',
    subject: 'พัสดุของคุณตกค้าง! กรุณาชำระค่าธรรมเนียม',
    date: '27 Feb, 11:20 AM',
    preview: 'พัสดุหมายเลข TH2839182 ของคุณตกค้าง...',
    isPhishing: true,
    body: '<p>เรียน ลูกค้า,</p><p>พัสดุหมายเลข <strong>TH2839182</strong> ของคุณตกค้างที่ศูนย์กระจายสินค้า กรุณาชำระค่าธรรมเนียมจัดส่ง <strong>35 บาท</strong> ภายใน 48 ชั่วโมง มิเช่นนั้นพัสดุจะถูกส่งคืน</p><div style="text-align:center;margin:20px 0"><a href="javascript:void(0)" class="mockup-btn" title="http://thai-post-tracking.xyz/pay">ชำระค่าธรรมเนียม</a></div><p>ไปรษณีย์ไทย</p>',
    feedback:
      '🔴 นี่คืออีเมล Phishing! สังเกต: 1) Domain .xyz ไม่ใช่ thailandpost.co.th จริง 2) ขอให้ชำระเงินผ่านลิงก์ (ไปรษณีย์จริงไม่ทำแบบนี้) 3) สร้างความเร่งด่วน "48 ชั่วโมง"',
  },
  {
    id: 5,
    senderName: 'GitHub',
    senderEmail: 'noreply@github.com',
    subject: '[GitHub] Your monthly security digest -- February 2026',
    date: '26 Feb, 10:00 AM',
    preview: 'Here is your monthly security summary for...',
    isPhishing: false,
    body: "<p>Hi there,</p><p>Here's your monthly security digest for <strong>February 2026</strong>:</p><ul><li>No security vulnerabilities found in your repositories</li><li>2-factor authentication is enabled [V]</li><li>3 successful sign-ins this month</li></ul><p>Keep up the good security practices!</p><p>-- The GitHub Team</p>",
    feedback:
      '[OK] อีเมลนี้ปลอดภัย! Domain @github.com เป็น domain จริง เนื้อหาเป็นรายงานสรุปไม่ได้ขอข้อมูลใดๆ ไม่มีลิงก์ที่ต้องคลิก ไม่สร้างความตกใจ',
  },
  {
    id: 6,
    senderName: 'Somchai Wongsakul (CEO)',
    senderEmail: 'somchai.ceo.urgent@gmail.com',
    subject: 'ด่วนที่สุด! ช่วยโอนเงินให้ลูกค้าด้วย',
    date: '26 Feb, 08:55 AM',
    preview: 'สวัสดี ฉันกำลังอยู่ในประชุมสำคัญ ช่วย...',
    isPhishing: true,
    body: '<p>สวัสดี,</p><p>ฉันกำลังอยู่ในประชุมสำคัญกับลูกค้าที่ต่างประเทศ ไม่สะดวกโทรศัพท์ตอนนี้</p><p>ช่วยโอนเงิน <strong>฿450,000</strong> ไปยังบัญชีลูกค้ารายนี้ด้วยนะ:</p><p>ธนาคาร: กสิกรไทย<br>เลขบัญชี: 098-2-XXXXX-X<br>ชื่อ: บริษัท XYZ จำกัด</p><p>เรื่องด่วนมาก ทำให้เสร็จก่อนเที่ยงนะ!</p><p>ขอบคุณ,<br>สมชาย (CEO)</p>',
    feedback:
      '🔴 นี่คืออีเมล Phishing แบบ Whaling/BEC! สังเกต: 1) ใช้ Gmail ไม่ใช่อีเมลบริษัท 2) อ้างว่าไม่สะดวกโทร (ป้องกันการตรวจสอบ) 3) ขอให้โอนเงินก้อนใหญ่อย่างเร่งด่วน 4) CEO จริงจะไม่สั่งโอนเงินแบบนี้ทางอีเมล',
  },
];

var PHISH_MODULES = [
  {
    id: 'phishing',
    title: 'Phishing Fundamentals',
    icon: '[X]',
    sections: [
      {
        type: 'content',
        heading: 'Phishing Mail คืออะไร?',
        text: 'Phishing (การตกปลา) คือเทคนิคหลอกลวงทางอีเมล ที่ผู้โจมตีแสร้งทำตัวเป็นองค์กรหรือบุคคลที่น่าเชื่อถือ (เช่น ธนาคาร, บริษัทขนส่ง, หัวหน้างาน) เพื่อหลอกให้เหยื่อ:\n1. คลิกตัวอักษรหรือปุ่ม (Link) ที่พาไปยังเว็บไซต์ปลอม\n2. กรอกข้อมูลสำคัญ เช่น รหัสผ่าน, ข้อมูลบัตรเครดิต\n3. โหลดไฟล์แนบ (Attachment) ที่แฝงมัลแวร์ (Malware) มาติดตั้งในเครื่อง',
      },
      {
        type: 'content',
        heading: 'จุดสังเกต 5 ประการ ในการจับผิดอีเมลหลอกลวง',
        text: '1. ที่อยู่อีเมลผู้ส่ง (Sender Email): ชื่ออาจจะดูใช่ แต่ Domain name มักจะสะกดผิดหรือใช้ของฟรี (เช่น admin@paypa1.com แทน paypal.com หรือ amazon-support@gmail.com)\n2. การใช้คำทักทายกว้างๆ (Generic Greeting): เช่น Dear Customer, Dear User แทนที่จะระบุชื่อคุณ\n3. สร้างความเร่งด่วน (Urgency/Threat): ขู่ให้กลัว เช่น "บัญชีของคุณจะถูกระงับภายใน 24 ชม."\n4. ลิงก์ที่น่าสงสัย (Suspicious Links): เมื่อเอาเมาส์ไปชี้ลิงก์ (Hover) URL ที่โผล่ขึ้นมามักจะไม่ตรงกับชื่อองค์กรที่อ้าง\n5. ขอข้อมูลส่วนตัว: องค์กรที่น่าเชื่อถือจะไม่ขอรหัสผ่าน, PIN หรือข้อมูุลบัตรเครดิตทางอีเมล',
      },
      {
        type: 'content',
        heading: 'สิ่งที่ควรทำเมื่อเจอ Phishing',
        text: '- ห้ามคลิก! ลิงก์หรือเปิดไฟล์แนบใดๆ เด็ดขาด\n- ห้ามตอบกลับ อีเมลฉบับนั้น\n- ตรวจสอบกับต้นทาง โดยการพิมพ์ URL ขององค์กรนั้นด้วยตัวเองบนเบราว์เซอร์\n- กด Report Phishing ในระบบอีเมลเพื่อให้ระบบบันทึกและป้องกันผู้ใช้อื่นต่อไป',
      },
      {
        type: 'inbox_simulator',
        flag: 'FLAG_PH1SH_D3T3CT0R',
      },
    ],
  },
  {
    id: 'phishing-types',
    title: 'ประเภทของ Phishing',
    icon: '🎭',
    sections: [
      {
        type: 'content',
        heading: 'Phishing มีกี่ประเภท?',
        text: "Phishing ไม่ได้ส่งมาทางอีเมลแบบสุ่มๆ อย่างเดียวเสมอไป รูปแบบของ Phishing ถูกพัฒนาให้แนบเนียนและเจาะจงมากขึ้น:\n\n1. Spear Phishing: การโจมตีแบบเจาะจงบุคคลหรือองค์กร โดยมีการหาข้อมูลเหยื่อมาก่อน เพื่อสร้างเนื้อหาที่น่าเชื่อถือ\n2. Whaling: คล้าย Spear Phishing แต่พุ่งเป้าไปที่ 'ปลาวาฬ' หรือผู้บริหารระดับสูง (CEO, CFO) ที่มีอำนาจเข้าถึงข้อมูลสำคัญ\n3. Vishing (Voice Phishing): การหลอกลวงผ่านทางโทรศัพท์ เช่น แก๊งคอลเซ็นเตอร์ อ้างเป็นตำรวจหรือเจ้าหน้าที่รัฐ\n4. Smishing (SMS Phishing): การส่งลิงก์หลอกลวงผ่านทาง SMS เช่น 'คุณได้รับสินเชื่อ' หรือ 'พัสดุของคุณตกค้าง'",
      },
      {
        type: 'quiz',
        question:
          'การหลอกลวงผ่านทางโทรศัพท์เครือข่ายมือถือ (เช่น แก๊งคอลเซ็นเตอร์) เรียกว่าอะไร?',
        answer: 'vishing',
        hint: 'มาจากคำว่า Voice + Phishing',
      },
      {
        type: 'quiz',
        question:
          'การโจมตีที่พุ่งเป้าไปที่ผู้บริหารระดับสูงขององค์กร เรียกว่าเทคนิคใด?',
        answer: 'whaling',
        hint: 'เปรียบเทียบผู้บริหารเป็นสัตว์ทะเลขนาดใหญ่',
      },
    ],
  },
  {
    id: 'phishing-analysis',
    title: 'การตรวจสอบเชิงลึก',
    icon: '🔍',
    sections: [
      {
        type: 'content',
        heading: 'การใช้เครื่องมือตรวจสอบ',
        text: 'บางครั้งการดูแค่อีเมลอาจไม่พอ เราสามารถใช้เครื่องมือต่างๆ ช่วยในการตรวจสอบได้:\n\n1. การตรวจสอบ URL: หากไม่แน่ใจว่าลิงก์ปลอดภัยหรือไม่ ควรคัดลอกลิงก์นั้น (ห้ามคลิก) แล้วนำไปตรวจสอบในเว็บไซต์ระดับโลก เช่น VirusTotal (virustotal.com) หรือ URLScan (urlscan.io)\n2. การตรวจสอบ Email Header: ข้อมูลส่วนนี้จะซ่อนอยู่หลังอีเมล แสดงเส้นทางการส่งอีเมล IP Address ของผู้ส่ง ซึ่งช่วยให้ทีมรักษาความปลอดภัยตามรอยผู้โจมตีได้\n3. การทดสอบใน Sandbox: หากต้องเปิดไฟล์แนบจริงๆ ผู้เชี่ยวชาญจะเปิดในสภาพแวดล้อมจำลอง (Sandbox) ที่แยกออกจากระบบจริง เพื่อสังเกตพฤติกรรมของมัลแวร์',
      },
      {
        type: 'code',
        language: 'bash',
        code: '# ตัวอย่าง Email Header พื้นฐานบางส่วนที่มักจะนำไปวิเคราะห์\nReturn-Path: <attacker@scam-mail.com>\nReceived: from mail.scam-mail.com (192.168.1.100)\nFrom: "IT Support" <support@your-c0mpany.com>\nTo: target@your-company.com\nSubject: Password Reset Required',
      },
      {
        type: 'quiz',
        question:
          'เว็บไซต์ใดที่เราสามารถนำ URL ไปวางเพื่อตรวจสอบว่ามีมัลแวร์หรือเป็นเว็บฟิชชิ่งหรือไม่?',
        answer: 'virustotal',
        hint: 'ชื่อของเว็บไซต์มีคำว่า Virus และ Total ประกอบอยู่',
      },
    ],
  },
];

/* ── Inbox Simulator State ── */
var inboxState = {
  answered: {},
  score: 0,
  total: INBOX_EMAILS.length,
  selectedId: null,
};

function resetInbox() {
  inboxState = {
    answered: {},
    score: 0,
    total: INBOX_EMAILS.length,
    selectedId: null,
  };
}

function renderInboxSimulator(flag) {
  var h = '';
  h += '<style>';
  h +=
    '.inbox-sim { background: #111; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; font-family: "Chakra Petch", sans-serif; }';
  h +=
    '.inbox-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #1a1a2e; border-bottom: 1px solid var(--border); }';
  h += '.inbox-toolbar h3 { margin: 0; font-size: 14px; color: #fff; }';
  h +=
    '.inbox-progress { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--text-dim); }';
  h +=
    '.inbox-progress-bar { width: 120px; height: 6px; background: #333; border-radius: 3px; overflow: hidden; }';
  h +=
    '.inbox-progress-fill { height: 100%; background: var(--green); border-radius: 3px; transition: width 0.4s ease; }';
  h += '.inbox-body { display: flex; min-height: 420px; }';
  h +=
    '.inbox-list { width: 320px; min-width: 280px; border-right: 1px solid var(--border); overflow-y: auto; max-height: 460px; }';
  h +=
    '.inbox-item { padding: 12px 14px; border-bottom: 1px solid #1a1a1a; cursor: pointer; transition: background 0.15s; position: relative; }';
  h += '.inbox-item:hover { background:var(--surface-2); }';
  h +=
    '.inbox-item.selected { background:var(--surface-2); border-left: 3px solid var(--green); }';
  h += '.inbox-item.answered-correct { opacity: 0.5; }';
  h += '.inbox-item.answered-wrong { opacity: 0.5; }';
  h +=
    '.inbox-item .item-sender { font-size: 12px; font-weight: 600; color: #e0e0e0; margin-bottom: 2px; }';
  h +=
    '.inbox-item .item-subject { font-size: 11px; color: var(--text); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }';
  h +=
    '.inbox-item .item-preview { font-size: 10px; color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }';
  h +=
    '.inbox-item .item-date { font-size: 9px; color: var(--text-dim); position: absolute; top: 12px; right: 12px; }';
  h +=
    '.inbox-item .item-badge { display: inline-block; font-size: 9px; padding: 2px 6px; border-radius: 3px; margin-top: 4px; font-weight: 600; }';
  h +=
    '.item-badge.correct { background:var(--surface-2); color: var(--green); }';
  h +=
    '.item-badge.wrong { background:var(--surface-2); color: #ff5f57; }';
  h +=
    '.inbox-detail { flex: 1; padding: 20px; overflow-y: auto; max-height: 460px; }';
  h +=
    '.inbox-detail-empty { display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-dim); font-size: 13px; }';
  h +=
    '.inbox-email-view .ev-subject { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 12px; }';
  h +=
    '.inbox-email-view .ev-meta { font-size: 11px; color: var(--text-dim); margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }';
  h += '.inbox-email-view .ev-meta strong { color: #e0e0e0; }';
  h +=
    '.inbox-email-view .ev-body { font-size: 13px; color: var(--text); line-height: 1.8; }';
  h +=
    '.inbox-email-view .ev-body .mockup-btn { display: inline-block; background: #0070c9; color: white !important; padding: 10px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; cursor: default; position: relative; }';
  h +=
    '.inbox-email-view .ev-body .mockup-btn:hover::after { content: attr(title); position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); background: #ffebee; color: #c62828; padding: 4px 8px; font-size: 11px; white-space: nowrap; border: 1px solid #ffcdd2; border-radius: 4px; z-index: 10; }';
  h += '.inbox-actions { display: flex; gap: 10px; margin-top: 20px; }';
  h +=
    '.inbox-actions button { flex: 1; padding: 12px; font-family: "Chakra Petch", sans-serif; font-size: 13px; font-weight: 700; border: 2px solid; border-radius: 6px; cursor: pointer; transition: all 0.2s; }';
  h +=
    '.btn-safe { background: transparent; border-color: var(--green); color: var(--green); }';
  h += '.btn-safe:hover { background: var(--green); color: #000; }';
  h +=
    '.btn-phish { background: transparent; border-color: #ff5f57; color: #ff5f57; }';
  h += '.btn-phish:hover { background: #ff5f57; color: #fff; }';
  h +=
    '.inbox-feedback { margin-top: 14px; padding: 12px 16px; border-radius: 6px; font-size: 12px; line-height: 1.7; animation: fadeSlide 0.3s ease; }';
  h +=
    '.inbox-feedback.correct { background:var(--surface-2); border: 1px solid rgba(0,204,102,0.3); color: var(--green); }';
  h +=
    '.inbox-feedback.wrong { background:var(--surface-2); border: 1px solid rgba(255,95,87,0.3); color: #ff9a94; }';
  h +=
    '@keyframes fadeSlide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }';
  h += '.inbox-summary { text-align: center; padding: 40px 20px; }';
  h +=
    '.inbox-summary .score-big { font-size: 48px; font-weight: 700; color: var(--green); }';
  h +=
    '.inbox-summary .score-label { font-size: 14px; color: var(--text-dim); margin-bottom: 16px; }';
  h +=
    '.inbox-summary .flag-box { background:var(--surface-2); border: 1px solid var(--green); padding: 16px 24px; display: inline-block; border-radius: 6px; margin-top: 12px; }';
  h +=
    '.inbox-summary .flag-box code { font-family: "Fira Code", monospace; font-size: 18px; color: var(--green); letter-spacing: 2px; }';
  h += '</style>';

  var answeredCount = Object.keys(inboxState.answered).length;
  var pct = Math.round((answeredCount / inboxState.total) * 100);

  h += '<div class="inbox-sim">';
  h += '<div class="inbox-toolbar">';
  h += '<h3>📧 Email Inbox Simulator</h3>';
  h += '<div class="inbox-progress">';
  h +=
    '<div class="inbox-progress-bar"><div class="inbox-progress-fill" style="width:' +
    pct +
    '%"></div></div>';
  h += '<span>' + answeredCount + '/' + inboxState.total + '</span>';
  h += '</div></div>';

  if (answeredCount >= inboxState.total) {
    h += '<div class="inbox-summary">';
    h +=
      '<div class="score-big">' +
      inboxState.score +
      '/' +
      inboxState.total +
      '</div>';
    h += '<div class="score-label">คะแนนของคุณ</div>';
    if (inboxState.score >= 5) {
      h +=
        '<p style="color:var(--green);font-size:14px;margin-bottom:8px">!! ยอดเยี่ยม! คุณจับ Phishing ได้เก่งมาก!</p>';
      h +=
        '<div class="flag-box"><span style="font-size:11px;color:var(--text-dim)">[SUCCESS] FLAG:</span><br><code>' +
        flag +
        '</code></div>';
      // Save progress for inbox simulator
      const sectionId =
        PHISH_MODULES[currentModIndex].id +
        '-' +
        PHISH_MODULES[currentModIndex].sections.findIndex(
          (s) => s.type === 'inbox_simulator',
        );
      if (!window.currentModuleCompletedIds.includes(sectionId)) {
        window.currentModuleCompletedIds.push(sectionId);
        savePhishingProgress();
      }
    } else {
      h +=
        '<p style="color:#ffbd2e;font-size:14px">ลองทบทวนเนื้อหาด้านบนแล้วลองใหม่อีกครั้งนะ!</p>';
      h +=
        '<button onclick="resetInbox();loadModule(currentModIndex)" style="margin-top:12px;padding:10px 24px;background:transparent;border:1px solid var(--green);color:var(--green);font-family:Chakra Petch;font-size:13px;font-weight:600;cursor:pointer;border-radius:4px">🔄 ลองใหม่</button>';
    }
    h += '</div></div>';
    return h;
  }

  h += '<div class="inbox-body">';
  h += '<div class="inbox-list">';
  INBOX_EMAILS.forEach(function (email) {
    var cls = 'inbox-item';
    if (inboxState.selectedId === email.id) cls += ' selected';
    if (inboxState.answered[email.id] !== undefined) {
      cls += inboxState.answered[email.id]
        ? ' answered-correct'
        : ' answered-wrong';
    }
    h +=
      '<div class="' + cls + '" onclick="selectInboxEmail(' + email.id + ')">';
    h += '<div class="item-date">' + email.date + '</div>';
    h += '<div class="item-sender">' + email.senderName + '</div>';
    h += '<div class="item-subject">' + email.subject + '</div>';
    h += '<div class="item-preview">' + email.preview + '</div>';
    if (inboxState.answered[email.id] !== undefined) {
      h +=
        '<span class="item-badge ' +
        (inboxState.answered[email.id] ? 'correct' : 'wrong') +
        '">';
      h += inboxState.answered[email.id] ? '[V] ถูกต้อง' : '[X] ผิด';
      h += '</span>';
    }
    h += '</div>';
  });
  h += '</div>';

  h += '<div class="inbox-detail" id="inboxDetail">';
  if (inboxState.selectedId !== null) {
    h += renderEmailDetail(inboxState.selectedId, flag);
  } else {
    h +=
      '<div class="inbox-detail-empty">📬 เลือกอีเมลจากรายการเพื่อตรวจสอบ</div>';
  }
  h += '</div>';
  h += '</div></div>';
  return h;
}

function renderEmailDetail(emailId, flag) {
  var email = INBOX_EMAILS[emailId];
  var h = '<div class="inbox-email-view">';
  h += '<div class="ev-subject">' + email.subject + '</div>';
  h +=
    '<div class="ev-meta"><strong>From:</strong> ' +
    email.senderName +
    ' &lt;' +
    email.senderEmail +
    '&gt;<br>';
  h += '<strong>Date:</strong> ' + email.date + '</div>';
  h += '<div class="ev-body">' + email.body + '</div>';

  if (inboxState.answered[emailId] === undefined) {
    h += '<div class="inbox-actions">';
    h +=
      '<button class="btn-safe" onclick="answerInbox(' +
      emailId +
      ', false)">🟢 Safe</button>';
    h +=
      '<button class="btn-phish" onclick="answerInbox(' +
      emailId +
      ', true)">🔴 Report Phishing</button>';
    h += '</div>';
  } else {
    var wasCorrect = inboxState.answered[emailId];
    h +=
      '<div class="inbox-feedback ' +
      (wasCorrect ? 'correct' : 'wrong') +
      '">' +
      email.feedback +
      '</div>';
  }
  h += '</div>';
  return h;
}

function selectInboxEmail(emailId) {
  inboxState.selectedId = emailId;
  var simSection = document.querySelector('.inbox-sim');
  if (simSection) {
    var flag = simSection.getAttribute('data-flag') || '';
    simSection.outerHTML = renderInboxSimulator(flag);
  }
}

function answerInbox(emailId, userSaysPhishing) {
  var email = INBOX_EMAILS[emailId];
  var correct = userSaysPhishing === email.isPhishing;
  inboxState.answered[emailId] = correct;
  if (correct) inboxState.score++;

  var simSection = document.querySelector('.inbox-sim');
  if (simSection) {
    var flag = simSection.getAttribute('data-flag') || '';
    simSection.outerHTML = renderInboxSimulator(flag);
  }
}

var sidebarList = document.getElementById('sidebarList');
var contentArea = document.getElementById('contentArea');
var contentTitle = document.getElementById('contentTitle');
var currentModIndex = 0;

function buildSidebar() {
  var html = '';
  PHISH_MODULES.forEach(function (mod, i) {
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
    html += '<span class="mod-emoji">' + (mod.icon || '🎣') + '</span>';
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
  var mod = PHISH_MODULES[index];
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
      html += '<div class="lesson-text">' + escapeHtml(section.text) + '</div>';
      pageTextForBot +=
        '[เนื้อหา] ' + section.heading + '\\n' + section.text + '\\n';
    } else if (section.type === 'email_mockup') {
      html +=
        '<style>' +
        '.email-mockup { background: #fff; color: #333; border-radius: 8px; overflow: hidden; margin: 20px 0; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; box-shadow: 0 0 30px var(--cyan-glow); }' +
        '.email-header { background: #f1f3f4; padding: 15px 20px; border-bottom: 1px solid #e0e0e0; }' +
        '.email-subject { font-size: 18px; font-weight: 600; margin-bottom: 10px; color: #202124; }' +
        '.email-meta { display: flex; justify-content: space-between; font-size: 13px; color: #5f6368; }' +
        '.email-sender { display: flex; align-items: center; }' +
        '.sender-avatar { width: 36px; height: 36px; background: #1a73e8; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; margin-right: 12px; }' +
        '.sender-name { font-weight: bold; color: #202124; }' +
        '.sender-email { color: #5f6368; margin-left: 5px; }' +
        '.email-body { padding: 24px; font-size: 14px; line-height: 1.6; }' +
        '.mockup-btn { display: inline-block; background: #0070c9; color: white !important; padding: 10px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; cursor: pointer; position: relative; }' +
        '.mockup-btn:hover { background: #005bb5; }' +
        '.mockup-btn:hover::after { content: attr(title); position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); background: #ffebee; color: #c62828; padding: 4px 8px; font-size: 11px; white-space: nowrap; border: 1px solid #ffcdd2; border-radius: 4px; z-index: 10; }' +
        '</style>';

      html += '<div class="email-mockup">';
      html += '<div class="email-header">';
      html += '<div class="email-subject">' + section.subject + '</div>';
      html += '<div class="email-meta">';
      html += '<div class="email-sender">';
      html +=
        '<div class="sender-avatar">' + section.senderName.charAt(0) + '</div>';
      html += '<div>';
      html += '<span class="sender-name">' + section.senderName + '</span>';
      html +=
        '<span class="sender-email">&lt;' + section.senderEmail + '&gt;</span>';
      html += '<div style="font-size: 11px; margin-top: 2px;">to me</div>';
      html += '</div></div>';
      html += '<div>' + section.date + '</div>';
      html += '</div></div>';
      html += '<div class="email-body">' + section.body + '</div>';
      html += '</div>';

      pageTextForBot +=
        '[หน้าจอจำลองอีเมล] ผู้ส่ง: ' +
        section.senderName +
        ' <' +
        section.senderEmail +
        '>, หัวข้อ: ' +
        section.subject +
        '\\n';
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
    } else if (section.type === 'inbox_simulator') {
      resetInbox();
      html += renderInboxSimulator(section.flag);
      pageTextForBot +=
        '[Email Inbox Simulator -- ให้ผู้เรียนจำแนก phishing vs legit emails]\\n';
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
        if (s.type === 'inbox_simulator') {
          const simSection = document.querySelector(
            '.inbox-sim[data-flag="' + s.flag + '"]',
          );
          if (simSection) {
            // This is a bit tricky as renderInboxSimulator is called before this.
            // A simpler approach is to ensure the savePhishingProgress is called
            // when the inbox is fully completed.
            // For now, we'll rely on the saveProgress logic to mark it.
          }
        } else {
          var input = document.getElementById(
            'quiz-' + currentModIndex + '-' + idx,
          );
          if (input) {
            input.value = s.answer || s.flag || ''; // Use actual answer/flag if available
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
        }
      }
    });
  }

  if (window.Chatbot) {
    window.Chatbot.setCurrentLab(mod.id);
    window.Chatbot.setPageContext(pageTextForBot);
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
  var section = PHISH_MODULES[modIndex].sections[sectionIndex];

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

    savePhishingProgress(modIndex, sectionIndex);
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

async function savePhishingProgress(modIndex = currentModIndex, sectionIndex) {
  if (sectionIndex !== undefined) {
    const sectionId = PHISH_MODULES[modIndex].id + '-' + sectionIndex;
    if (!window.currentModuleCompletedIds)
      window.currentModuleCompletedIds = [];
    if (!window.currentModuleCompletedIds.includes(sectionId)) {
      window.currentModuleCompletedIds.push(sectionId);
    }
  }

  // Save granular progress to backend
  if (window.Auth && typeof window.Auth.submitTask === 'function') {
    const sectionId = PHISH_MODULES[modIndex].id + '-' + sectionIndex;
    const res = await window.Auth.submitTask('phishing', sectionId);
    if (res.success) {
      if (res.completed_ids)
        window.currentModuleCompletedIds = res.completed_ids;
    }
  }

  let moduleCompleted = true;
  for (let i = 0; i < PHISH_MODULES[modIndex].sections.length; i++) {
    let s = PHISH_MODULES[modIndex].sections[i];
    if (s.answer || s.flag || s.type === 'inbox_simulator') {
      let reqId = PHISH_MODULES[modIndex].id + '-' + i;
      if (
        !window.currentModuleCompletedIds ||
        !window.currentModuleCompletedIds.includes(reqId)
      ) {
        moduleCompleted = false;
        break;
      }
    }
  }
  if (moduleCompleted) {
    setTimeout(
      () => showModuleCompletePopup(modIndex, PHISH_MODULES.length),
      500,
    );
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
    let progData = await window.Auth.getProgressData('phishing');
    window.currentModProgressData = progData;
    window.currentModuleCompletedIds = progData.completed_ids || [];
    // Calculate overall progress to fix ghost progress
    let totalAllQ = 0;
    let compAllQ = 0;
    let doneMods = 0;
    PHISH_MODULES.forEach((m) => {
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

    startIndex = Math.min(doneMods, PHISH_MODULES.length - 1);
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

  // Calculate overall mission progress across all PHISH_MODULES to fix ghost progress
  let totalAllQ = 0;
  let compAllQ = 0;
  PHISH_MODULES.forEach((m) => {
    m.sections.forEach((s, idx) => {
      if (s.answer || s.flag || s.type === 'inbox_simulator') {
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
      profile && profile.progress && profile.progress['phishing']
        ? profile.progress['phishing'].percent
        : 0;
    if (percent >= 100 && window.Auth.unlockBadge) {
      window.Auth.unlockBadge('badge-phish');
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
