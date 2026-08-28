/**
 * Knowly Chat Widget
 * Embed on any website to add the AI chatbot.
 *
 * Usage:
 * <script src="https://your-knowly-domain.com/widget.js"></script>
 * <script>
 *   Knowly.init({ chatbotId: 'your-chatbot-id', position: 'bottom-right' });
 * </script>
 */
(function () {
  // Resolve the Knowly app origin from this script's own src, so the widget
  // works correctly no matter what site it's embedded on.
  var currentScript = document.currentScript;
  var API_ORIGIN = currentScript ? new URL(currentScript.src).origin : window.location.origin;

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function KnowlyWidget(config) {
    this.config = Object.assign(
      { position: 'bottom-right', primaryColor: '#4f46e5', theme: 'light' },
      config
    );
    this.isOpen = false;
    this.conversationId = null;
    this.chatbotName = 'Support Assistant';
    this.welcomeMessage = 'Hello! How can I help you?';
    this.init();
  }

  KnowlyWidget.prototype.init = function () {
    var self = this;
    fetch(API_ORIGIN + '/api/public/chatbot/' + encodeURIComponent(this.config.chatbotId))
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (data && data.chatbot) {
          self.chatbotName = data.chatbot.name || self.chatbotName;
          self.welcomeMessage = data.chatbot.welcome_message || self.welcomeMessage;
          self.config.primaryColor = self.config.primaryColor || data.chatbot.primary_color;
        }
        self.render();
      })
      .catch(function () {
        self.render();
      });
  };

  KnowlyWidget.prototype.render = function () {
    var container = this.createWidget();
    document.body.appendChild(container);
    this.addStyles();
    this.attachListeners();
    this.renderWelcomeMessage();
  };

  KnowlyWidget.prototype.createWidget = function () {
    var container = document.createElement('div');
    container.id = 'knowly-widget-container';
    container.innerHTML =
      '<div class="knowly-widget-button" id="knowly-toggle-btn" role="button" aria-label="Open chat">' +
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' +
      '</svg></div>' +
      '<div class="knowly-widget-chat" id="knowly-chat-window" style="display: none;">' +
      '<div class="knowly-chat-header">' +
      '<h3>' + escapeHtml(this.chatbotName) + '</h3>' +
      '<button id="knowly-close-btn" class="knowly-close-btn" aria-label="Close chat">\u00d7</button>' +
      '</div>' +
      '<div class="knowly-chat-messages" id="knowly-messages"></div>' +
      '<div class="knowly-chat-input">' +
      '<input type="text" id="knowly-input" placeholder="Ask a question..." aria-label="Message" />' +
      '<button id="knowly-send-btn" aria-label="Send">\u2192</button>' +
      '</div></div>';
    return container;
  };

  KnowlyWidget.prototype.renderWelcomeMessage = function () {
    var messagesContainer = document.getElementById('knowly-messages');
    if (!messagesContainer) return;
    var el = document.createElement('div');
    el.className = 'knowly-message assistant';
    el.innerHTML = '<div class="knowly-message-content">' + escapeHtml(this.welcomeMessage) + '</div>';
    messagesContainer.appendChild(el);
  };

  KnowlyWidget.prototype.addStyles = function () {
    var style = document.createElement('style');
    var positionClass = this.config.position || 'bottom-right';
    var parts = positionClass.split('-');
    var vPos = parts[0];
    var hPos = parts[1];
    var color = this.config.primaryColor || '#4f46e5';

    style.textContent =
      '#knowly-widget-container{position:fixed;' + vPos + ':24px;' + hPos + ':24px;' +
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;z-index:2147483000;}" +
      '.knowly-widget-button{width:56px;height:56px;border-radius:50%;background:' + color + ';color:#fff;' +
      'cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      'box-shadow:0 4px 12px rgba(0,0,0,.15);transition:transform .2s ease,box-shadow .2s ease;}' +
      '.knowly-widget-button:hover{transform:scale(1.08);box-shadow:0 6px 16px rgba(0,0,0,.2);}' +
      '.knowly-widget-chat{position:absolute;' + vPos + ':80px;' + hPos + ':0;width:380px;max-width:calc(100vw - 32px);' +
      'height:520px;max-height:70vh;background:#fff;border-radius:12px;' +
      'box-shadow:0 5px 40px rgba(0,0,0,.16);display:flex;flex-direction:column;overflow:hidden;}' +
      '.knowly-chat-header{background:' + color + ';color:#fff;padding:16px;display:flex;' +
      'justify-content:space-between;align-items:center;flex-shrink:0;}' +
      '.knowly-chat-header h3{margin:0;font-size:16px;font-weight:600;}' +
      '.knowly-close-btn{background:none;border:none;color:#fff;font-size:22px;cursor:pointer;' +
      'padding:0;width:24px;height:24px;line-height:1;}' +
      '.knowly-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;}' +
      '.knowly-message{display:flex;gap:8px;}' +
      '.knowly-message.user{justify-content:flex-end;}' +
      '.knowly-message-content{max-width:80%;padding:8px 12px;border-radius:8px;font-size:14px;' +
      'line-height:1.4;white-space:pre-wrap;word-break:break-word;}' +
      '.knowly-message.assistant .knowly-message-content{background:#f3f4f6;color:#1f2937;}' +
      '.knowly-message.user .knowly-message-content{background:' + color + ';color:#fff;}' +
      '.knowly-message-sources{font-size:11px;opacity:.7;margin-top:6px;}' +
      '.knowly-chat-input{padding:12px;border-top:1px solid #e5e7eb;display:flex;gap:8px;flex-shrink:0;}' +
      '.knowly-chat-input input{flex:1;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;' +
      'font-size:14px;outline:none;}' +
      '.knowly-chat-input input:focus{border-color:' + color + ';}' +
      '.knowly-chat-input button{background:' + color + ';color:#fff;border:none;border-radius:6px;' +
      'width:32px;height:32px;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      'transition:opacity .2s;flex-shrink:0;}' +
      '.knowly-chat-input button:disabled{opacity:.5;cursor:not-allowed;}' +
      '@media (max-width:480px){.knowly-widget-chat{width:calc(100vw - 32px);height:70vh;' + hPos + ':16px;}}';

    document.head.appendChild(style);
  };

  KnowlyWidget.prototype.attachListeners = function () {
    var self = this;
    var toggleBtn = document.getElementById('knowly-toggle-btn');
    var closeBtn = document.getElementById('knowly-close-btn');
    var sendBtn = document.getElementById('knowly-send-btn');
    var input = document.getElementById('knowly-input');

    if (toggleBtn) toggleBtn.addEventListener('click', function () { self.toggleChat(); });
    if (closeBtn) closeBtn.addEventListener('click', function () { self.toggleChat(); });
    if (sendBtn) sendBtn.addEventListener('click', function () { self.sendMessage(); });
    if (input) {
      input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') self.sendMessage();
      });
    }
  };

  KnowlyWidget.prototype.toggleChat = function () {
    var chatWindow = document.getElementById('knowly-chat-window');
    if (chatWindow) {
      this.isOpen = !this.isOpen;
      chatWindow.style.display = this.isOpen ? 'flex' : 'none';
    }
  };

  KnowlyWidget.prototype.sendMessage = function () {
    var self = this;
    var input = document.getElementById('knowly-input');
    var sendBtn = document.getElementById('knowly-send-btn');
    var messagesContainer = document.getElementById('knowly-messages');

    if (!input || !messagesContainer || !input.value.trim()) return;

    var message = input.value;
    input.value = '';
    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    var userMsg = document.createElement('div');
    userMsg.className = 'knowly-message user';
    userMsg.innerHTML = '<div class="knowly-message-content">' + escapeHtml(message) + '</div>';
    messagesContainer.appendChild(userMsg);

    var loadingMsg = document.createElement('div');
    loadingMsg.className = 'knowly-message assistant';
    loadingMsg.innerHTML = '<div class="knowly-message-content">Thinking...</div>';
    messagesContainer.appendChild(loadingMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    fetch(API_ORIGIN + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatbotId: self.config.chatbotId,
        message: message,
        conversationId: self.conversationId || undefined,
      }),
    })
      .then(function (response) {
        if (!response.ok) {
          return response.json().then(function (data) {
            throw new Error((data && data.error) || 'Failed to send message');
          });
        }

        var convoHeader = response.headers.get('X-Conversation-Id');
        if (convoHeader) self.conversationId = convoHeader;

        var sourcesHeader = response.headers.get('X-Sources');
        var sources = [];
        try {
          sources = sourcesHeader ? JSON.parse(decodeURIComponent(sourcesHeader)) : [];
        } catch (e) {
          sources = [];
        }

        var reader = response.body && response.body.getReader();
        if (!reader) throw new Error('No response body');

        var decoder = new TextDecoder();
        var assistantMessage = '';

        function pump() {
          return reader.read().then(function (result) {
            if (result.done) {
              if (sources.length > 0) {
                var sourcesHtml =
                  '<div class="knowly-message-sources">Sources: ' + escapeHtml(sources.join(', ')) + '</div>';
                loadingMsg.innerHTML =
                  '<div class="knowly-message-content">' + escapeHtml(assistantMessage) + sourcesHtml + '</div>';
              }
              return;
            }
            assistantMessage += decoder.decode(result.value, { stream: true });
            loadingMsg.innerHTML = '<div class="knowly-message-content">' + escapeHtml(assistantMessage) + '</div>';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            return pump();
          });
        }

        return pump();
      })
      .catch(function (error) {
        loadingMsg.innerHTML =
          '<div class="knowly-message-content">' +
          escapeHtml(error && error.message ? error.message : 'Sorry, something went wrong. Please try again.') +
          '</div>';
      })
      .then(function () {
        input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        input.focus();
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      });
  };

  window.Knowly = {
    init: function (config) {
      if (!config || !config.chatbotId) {
        console.error('Knowly.init requires a chatbotId');
        return;
      }
      new KnowlyWidget(config);
    },
  };
})();
