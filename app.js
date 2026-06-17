document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const connectButtons = document.querySelectorAll('.btn-connect');
  const modalOverlay = document.getElementById('fb-modal-overlay');
  const modalClose = document.getElementById('fb-modal-close');
  const fbBtnAction = document.getElementById('fb-btn-action');
  
  const fbStep1 = document.getElementById('fb-step-1');
  const fbStep2 = document.getElementById('fb-step-2');
  const fbStep3 = document.getElementById('fb-step-3');
  
  const webhookLogs = document.getElementById('webhook-logs');
  
  let currentStep = 1;
  let simulatedWebhookInterval = null;

  // Open Modal
  connectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close Modal
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  function openModal() {
    currentStep = 1;
    updateModalUI();
    modalOverlay.classList.add('active');
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  function updateModalUI() {
    fbStep1.style.display = 'none';
    fbStep2.style.display = 'none';
    fbStep3.style.display = 'none';

    if (currentStep === 1) {
      fbStep1.style.display = 'block';
      fbBtnAction.innerText = 'Iniciar Sesión con Facebook';
    } else if (currentStep === 2) {
      fbStep2.style.display = 'block';
      fbBtnAction.innerText = 'Vincular Cuenta WhatsApp';
    } else if (currentStep === 3) {
      fbStep3.style.display = 'block';
      fbBtnAction.innerText = 'Finalizar Configuración';
    }
  }

  // Handle Modal Flow Action
  if (fbBtnAction) {
    fbBtnAction.addEventListener('click', () => {
      if (currentStep < 3) {
        currentStep++;
        updateModalUI();
      } else {
        // Successful connection
        closeModal();
        startSimulatedWebhooks();
      }
    });
  }

  // Simulated Webhook logs in Dashboard console
  const webhookSimMessages = [
    { type: 'incoming', phone: '+58 414-5551234', text: 'Hola, ¿cómo puedo contratar sus servicios?' },
    { type: 'sent', phone: '+58 414-5551234', text: '¡Hola! Gracias por escribir a MBTech. ¿En qué podemos ayudarte?' },
    { type: 'incoming', phone: '+34 612-987654', text: 'Hola, me interesa la automatización de WhatsApp para mi empresa' },
    { type: 'status_delivered', phone: '+58 414-5551234', text: 'Entregado' },
    { type: 'status_read', phone: '+58 414-5551234', text: 'Leído' },
    { type: 'incoming', phone: '+58 424-9998877', text: 'Hola, ¿pueden enviarme su catálogo de precios?' }
  ];

  let simIndex = 0;

  function addLogLine(text, isSystem = false) {
    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = `webhook-line ${isSystem ? 'system' : ''}`;
    line.innerHTML = `<span class="webhook-timestamp">[${time}]</span> ${text}`;
    webhookLogs.appendChild(line);
    
    // Auto-scroll to bottom
    webhookLogs.scrollTop = webhookLogs.scrollHeight;
  }

  function startSimulatedWebhooks() {
    // Clear logs first
    webhookLogs.innerHTML = '';
    
    // Stop any existing simulation
    if (simulatedWebhookInterval) {
      clearInterval(simulatedWebhookInterval);
    }

    addLogLine('<span class="webhook-event">Soporte:</span> Asistente automático iniciado. Esperando interacciones de clientes...', true);
    addLogLine('<span class="webhook-event">Soporte:</span> Línea de WhatsApp vinculada correctamente.', true);

    simulatedWebhookInterval = setInterval(() => {
      if (simIndex >= webhookSimMessages.length) {
        simIndex = 0;
      }
      const msg = webhookSimMessages[simIndex];
      let logText = '';

      if (msg.type === 'incoming') {
        logText = `<span class="webhook-event">Cliente (${msg.phone}):</span> "${msg.text}"`;
      } else if (msg.type === 'sent') {
        logText = `<span class="webhook-event">Respuesta del Agente:</span> "${msg.text}"`;
      } else if (msg.type === 'status_delivered') {
        logText = `<span class="webhook-event">Estado:</span> Mensaje entregado a <span class="webhook-data">${msg.phone}</span>`;
      } else if (msg.type === 'status_read') {
        logText = `<span class="webhook-event">Estado:</span> Mensaje leído por <span class="webhook-data">${msg.phone}</span>`;
      }

      addLogLine(logText);
      simIndex++;
    }, 3500);
  }
});
