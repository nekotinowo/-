document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     1. Мобильное меню (Navbar Burger)
     ========================================================= */
  const burgerBtn = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');

  if (burgerBtn && navLinks) {
    burgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* =========================================================
     2. Симулятор Telegram-чата (безопасный DOM без innerHTML)
     ========================================================= */
  const chatMessages = document.getElementById('chatMessages');
  const botStatus = document.getElementById('botStatus');
  const cmdButtons = document.querySelectorAll('.tg-cmd-btn');
  let isBotTyping = false;

  const botScenarios = {
    resume: {
      userText: '📄 Собрать PDF-резюме',
      title: '✅ Резюме успешно сгенерировано!',
      items: [
        'Позиция: Frontend / Python Developer',
        'Шаблон: Dark Minimalist Pro',
        'Размер файла: 148 КБ (1 страница)'
      ],
      code: '📎 CV_Alex_Neko_2026.pdf • Готово к отправке'
    },
    orders: {
      userText: '🔥 Найти свежие заказы',
      title: '🔥 Найдено 3 релевантных заказа:',
      items: [
        '1. Telegram-бот на Python + Aiogram — 35 000 ₽',
        '2. Верстка лендинга (HTML/CSS/JS) — 18 000 ₽',
        '3. Интеграция OpenAI API в CRM — 45 000 ₽'
      ],
      code: '⚡ Отклик в 1 клик доступен в тарифе Pro'
    },
    payment: {
      userText: '💳 Проверить оплату',
      title: '💳 Статус подписки: Активна',
      items: [
        'Текущий тариф: NEKO.BOT Pro',
        'Лимит генераций: Безлимитно',
        'Следующее списание: 25.12.2026'
      ],
      code: 'ID транзакции: #NK-88412-OK'
    }
  };

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  function appendUserMessage(text) {
    const msgEl = document.createElement('div');
    msgEl.className = 'msg msg-user';
    msgEl.textContent = text;

    const timeEl = document.createElement('span');
    timeEl.className = 'msg-time';
    timeEl.textContent = getCurrentTime();

    msgEl.appendChild(timeEl);
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendBotMessage(scenario) {
    const msgEl = document.createElement('div');
    msgEl.className = 'msg msg-bot';

    const titleEl = document.createElement('span');
    titleEl.className = 'msg-title';
    titleEl.textContent = scenario.title;
    msgEl.appendChild(titleEl);

    const listEl = document.createElement('ul');
    listEl.className = 'msg-list';
    scenario.items.forEach((itemText) => {
      const li = document.createElement('li');
      li.textContent = itemText;
      listEl.appendChild(li);
    });
    msgEl.appendChild(listEl);

    if (scenario.code) {
      const codeEl = document.createElement('span');
      codeEl.className = 'msg-code';
      codeEl.textContent = scenario.code;
      msgEl.appendChild(codeEl);
    }

    const timeEl = document.createElement('span');
    timeEl.className = 'msg-time';
    timeEl.textContent = getCurrentTime();
    msgEl.appendChild(timeEl);

    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  cmdButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (isBotTyping) return;
      const actionKey = btn.dataset.action;
      const scenario = botScenarios[actionKey];
      if (!scenario) return;

      isBotTyping = true;
      cmdButtons.forEach((b) => (b.disabled = true));

      appendUserMessage(scenario.userText);
      botStatus.textContent = 'печатает...';
      botStatus.classList.add('typing');

      setTimeout(() => {
        appendBotMessage(scenario);
        botStatus.textContent = 'бот • в сети';
        botStatus.classList.remove('typing');
        isBotTyping = false;
        cmdButtons.forEach((b) => (b.disabled = false));
      }, 700);
    });
  });

  /* =========================================================
     3. Переключатель тарифов «Месяц / Год (-25%)»
     ========================================================= */
  const billingSwitch = document.getElementById('billingSwitch');
  const labelMonth = document.getElementById('labelMonth');
  const labelYear = document.getElementById('labelYear');
  const priceValues = document.querySelectorAll('.price-value');

  function animateValue(el, start, end, duration = 300) {
    if (start === end) return;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(start + (end - start) * progress);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if (billingSwitch) {
    billingSwitch.addEventListener('click', () => {
      const isYearly = billingSwitch.getAttribute('aria-pressed') === 'true';
      const nextYearly = !isYearly;

      billingSwitch.setAttribute('aria-pressed', String(nextYearly));
      labelMonth.classList.toggle('active', !nextYearly);
      labelYear.classList.toggle('active', nextYearly);

      priceValues.forEach((el) => {
        const currentVal = Number(el.textContent) || 0;
        const targetVal = Number(nextYearly ? el.dataset.year : el.dataset.month);
        animateValue(el, currentVal, targetVal, 280);
      });
    });
  }

  /* =========================================================
     4. FAQ Аккордеон
     ========================================================= */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* =========================================================
     5. Модальное окно заявки
     ========================================================= */
  const orderModal = document.getElementById('orderModal');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const doneModalBtn = document.getElementById('doneModalBtn');

  const modalFormState = document.getElementById('modalFormState');
  const modalSuccessState = document.getElementById('modalSuccessState');
  const selectedPlanName = document.getElementById('selectedPlanName');

  const leadForm = document.getElementById('leadForm');
  const tgUsernameInput = document.getElementById('tgUsername');
  const formError = document.getElementById('formError');
  const submittedUser = document.getElementById('submittedUser');
  const submittedPlan = document.getElementById('submittedPlan');

  let currentPlan = 'Pro';

  function openModal(plan) {
    currentPlan = plan || 'Pro';
    selectedPlanName.textContent = currentPlan;
    formError.textContent = '';
    tgUsernameInput.value = '';
    modalFormState.hidden = false;
    modalSuccessState.hidden = true;

    orderModal.classList.add('active');
    orderModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => tgUsernameInput.focus(), 50);
  }

  function closeModal() {
    orderModal.classList.remove('active');
    orderModal.setAttribute('aria-hidden', 'true');
  }

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.openModal));
  });

  closeModalBtn.addEventListener('click', closeModal);
  doneModalBtn.addEventListener('click', closeModal);

  orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && orderModal.classList.contains('active')) {
      closeModal();
    }
  });

  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let rawValue = tgUsernameInput.value.trim();

    if (!rawValue) {
      formError.textContent = 'Введите ваш Telegram @username';
      return;
    }

    if (!rawValue.startsWith('@')) {
      rawValue = '@' + rawValue;
    }

    const validUsernameRegex = /^@[a-zA-Z0-9_]{4,32}$/;
    if (!validUsernameRegex.test(rawValue)) {
      formError.textContent = 'Некорректный формат (от 4 до 32 символов: латиница, цифры, _)';
      return;
    }

    formError.textContent = '';
    submittedUser.textContent = rawValue;
    submittedPlan.textContent = currentPlan;

    modalFormState.hidden = true;
    modalSuccessState.hidden = false;
  });
});