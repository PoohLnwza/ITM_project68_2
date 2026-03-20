(function () {
  var API_URL = window.location.origin + '/api/chat';

  var basePath = window.location.pathname.includes('/pages/') ? '../' : '';

  var chatHead = document.createElement('div');
  chatHead.className = 'chat-head';
  chatHead.innerHTML =
    '<img src="' +
    basePath +
    'assets/images/bot-avatar.png" class="chat-head-img" alt="bot">';
  document.body.appendChild(chatHead);

  var chatWindow = document.createElement('div');
  chatWindow.className = 'chat-window';
  chatWindow.innerHTML =
    '<div class="chat-header">' +
    '<div class="bot-avatar"><img src="' +
    basePath +
    'assets/images/bot-avatar.png" alt="bot"></div>' +
    '<div class="bot-info">' +
    '<span class="bot-name">BOGIE REAL CAT</span>' +
    '<span class="bot-status"><span class="status-dot"></span>ONLINE</span>' +
    '</div>' +
    '<button class="chat-expand" title="ขยายเต็มจอ">⛶</button>' +
    '<button class="chat-close">✕</button>' +
    '</div>' +
    '<div class="chat-messages" id="chatMessages"></div>' +
    '<div class="chat-input-row">' +
    '<input class="chat-input" id="chatInput" type="text" placeholder="พิมพ์ข้อความ..." autocomplete="off">' +
    '<button class="chat-send" id="chatSend">▶</button>' +
    '</div>';
  document.body.appendChild(chatWindow);

  var messagesEl = document.getElementById('chatMessages');
  var inputEl = document.getElementById('chatInput');
  var sendBtn = document.getElementById('chatSend');
  var closeBtn = chatWindow.querySelector('.chat-close');
  var expandBtn = chatWindow.querySelector('.chat-expand');

  appendMessage(
    'bot',
    'สวัสดีค่ะ! ฉัน โบกี้ บอทแมว\nถามอะไรเกี่ยวกับบทเรียนได้เลย!',
    'System',
  );

  function openChat() {
    chatHead.style.display = 'none';
    chatWindow.classList.add('open');
    inputEl.focus();
  }

  closeBtn.addEventListener('click', function () {
    chatWindow.classList.remove('open');
    chatWindow.classList.remove('expanded');
    chatHead.style.display = 'flex';
  });

  expandBtn.addEventListener('click', function () {
    chatWindow.classList.toggle('expanded');
  });

  var isDragging = false;
  var dragStartX, dragStartY, headStartX, headStartY;
  var dragThreshold = 5;

  function snapToEdge() {
    var rect = chatHead.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var margin = 20;

    var clampedTop = Math.max(
      margin,
      Math.min(rect.top, window.innerHeight - rect.height - margin),
    );

    chatHead.style.transition =
      'left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), top 0.4s ease';
    chatHead.style.top = clampedTop + 'px';
    chatHead.style.bottom = 'auto';

    if (centerX < window.innerWidth / 2) {
      chatHead.style.left = margin + 'px';
      chatHead.style.right = 'auto';
    } else {
      chatHead.style.left = window.innerWidth - rect.width - margin + 'px';
      chatHead.style.right = 'auto';
    }

    setTimeout(function () {
      chatHead.style.transition = 'background 0.2s, transform 0.2s';
      chatHead.style.left = '';
      if (centerX >= window.innerWidth / 2) {
        chatHead.style.right = margin + 'px';
      } else {
        chatHead.style.left = margin + 'px';
      }
    }, 400);
  }

  chatHead.addEventListener('mousedown', function (e) {
    isDragging = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    var rect = chatHead.getBoundingClientRect();
    headStartX = rect.left;
    headStartY = rect.top;
    chatHead.style.cursor = 'grabbing';
    chatHead.style.transition = 'none';

    function onMouseMove(ev) {
      var dx = ev.clientX - dragStartX;
      var dy = ev.clientY - dragStartY;
      if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
        isDragging = true;
        chatHead.style.left = headStartX + dx + 'px';
        chatHead.style.top = headStartY + dy + 'px';
        chatHead.style.right = 'auto';
        chatHead.style.bottom = 'auto';
      }
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      chatHead.style.cursor = 'grab';
      if (isDragging) {
        snapToEdge();
      } else {
        openChat();
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  chatHead.addEventListener('touchstart', function (e) {
    isDragging = false;
    var touch = e.touches[0];
    dragStartX = touch.clientX;
    dragStartY = touch.clientY;
    var rect = chatHead.getBoundingClientRect();
    headStartX = rect.left;
    headStartY = rect.top;
    chatHead.style.transition = 'none';

    function onTouchMove(ev) {
      var t = ev.touches[0];
      var dx = t.clientX - dragStartX;
      var dy = t.clientY - dragStartY;
      if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
        isDragging = true;
        chatHead.style.left = headStartX + dx + 'px';
        chatHead.style.top = headStartY + dy + 'px';
        chatHead.style.right = 'auto';
        chatHead.style.bottom = 'auto';
        ev.preventDefault();
      }
    }

    function onTouchEnd() {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      if (isDragging) {
        snapToEdge();
      } else {
        openChat();
      }
    }

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  });

  // ── Send message ──
  function sendMessage() {
    var text = inputEl.value.trim();
    if (!text) return;

    appendMessage('user', text);
    inputEl.value = '';

    var typingId = showTyping();

    var labId = window.CURRENT_LAB_ID || null;
    var pageContext = null;
    if (window.CURRENT_LAB_TITLE) {
      pageContext = 'ผู้ใช้กำลังเรียนบท: ' + window.CURRENT_LAB_TITLE;
      if (window.CURRENT_LAB_QUIZZES && window.CURRENT_LAB_QUIZZES.length > 0) {
        pageContext += '\nคำถาม Quiz ในหน้านี้มีดังนี้:\n';
        window.CURRENT_LAB_QUIZZES.forEach(function (q, idx) {
          pageContext += idx + 1 + '. ' + q + '\n';
        });
      }
    }

    const lowerText = text.toLowerCase();
    const hintKeywords = [
      'hint',
      'คำใบ้',
      'ช่วยด้วย',
      'ติด',
      'ทำไง',
      'ยังไง',
      'แนะ',
      'บอกหน่อย',
      'ขอรายละเอียด',
    ];
    const isHintReq = hintKeywords.some((kw) => lowerText.includes(kw));

    if (window.botHintLevel === undefined) window.botHintLevel = 0;

    if (isHintReq) {
      // Increment if asking for hint again
      window.botHintLevel = Math.min(window.botHintLevel + 1, 3);
    } else {
      // Only reset if it's a completely new question (arbitrary but simple for now)
      // If the message is short and doesn't look like a question, maybe don't reset
      if (text.length > 20 || !text.includes('?')) {
        window.botHintLevel = 0;
      }
    }

    var payload = {
      message: text,
      lab_id: labId,
      hint_level: window.botHintLevel,
      page_context: pageContext,
    };

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('API error: ' + res.status);
        removeTyping(typingId);

        // Create a new bot message element for streaming
        var botMsgId = 'bot-' + Date.now();
        var botDiv = appendMessage('bot', '', null, botMsgId);
        var botContentSpan = botDiv.querySelector('.msg-content');
        var fullText = '';

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        function readStream() {
          return reader.read().then(function ({ done, value }) {
            if (done) {
              // Final format update if needed
              return;
            }
            const chunk = decoder.decode(value, { stream: true });
            fullText += chunk;

            // Simple formatting for real-time
            var formatted = fullText
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/`(.*?)`/g, '<code>$1</code>')
              .replace(/\n/g, '<br>');

            botContentSpan.innerHTML = formatted;
            messagesEl.scrollTop = messagesEl.scrollHeight;

            return readStream();
          });
        }

        return readStream();
      })
      .catch(function (err) {
        removeTyping(typingId);
        appendMessage(
          'bot',
          'ไม่สามารถเชื่อมต่อ AI ได้ กรุณาตรวจสอบว่า API server กำลังทำงานอยู่',
        );
        console.error('Streaming error:', err);
      });
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') sendMessage();
  });

  function appendMessage(type, text, timeOverride, id) {
    var div = document.createElement('div');
    div.className = 'chat-msg ' + type;
    if (id) div.id = id;

    var formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');

    var now = new Date();
    var timeStr =
      timeOverride ||
      now.getHours().toString().padStart(2, '0') +
        ':' +
        now.getMinutes().toString().padStart(2, '0');

    div.innerHTML =
      '<span class="msg-content">' +
      formatted +
      '</span><span class="time">' +
      timeStr +
      '</span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    var id = 'typing-' + Date.now();
    var div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.id = id;
    div.innerHTML =
      '<span class="chat-typing">กำลัง kiss (づ ￣ ³￣)づ< </span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return id;
  }

  function removeTyping(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  }
})();
