// ===== MOBILNA ASYSTENTKA - FUNKCJE DLA KLIENTÓW =====
// Plik: client-features.js
// Lustrzane odbicie funkcji admina dla widoku klienta

const API_URL = window.location.origin + '/api';
let chatUpdateInterval = null;
let currentUserId = null;

// ===== INICJALIZACJA =====
function initClientFeatures(userId) {
    currentUserId = userId;
    
    // Załaduj wszystkie dane
    loadClientTasks();
    loadClientChat();
    loadClientInvoices();
    loadClientCalendar();
    
    // Uruchom auto-odświeżanie chatu
    startClientChatAutoRefresh();
}

function cleanupClientFeatures() {
    stopClientChatAutoRefresh();
    currentUserId = null;
}

// ===== TASK MANAGER (widok klienta - tylko odczyt + dodawanie) =====
async function loadClientTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks/${currentUserId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const tasks = await response.json();
        renderClientTasks(tasks);
    } catch (error) {
        console.error('Błąd ładowania zadań:', error);
    }
}

function renderClientTasks(tasks) {
    const container = document.getElementById('client-tasks-list');
    if (!container) return;
    
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state">Brak aktywnych zadań</div>';
        return;
    }
    
    container.innerHTML = tasks.map(task => `
        <div class="task-item-client ${task[4] === 'done' ? 'task-done' : ''}">
            <div class="task-icon">${task[4] === 'done' ? '✓' : '○'}</div>
            <div class="task-content">
                <div class="task-title">${task[2]}</div>
                ${task[3] ? `<div class="task-description">${task[3]}</div>` : ''}
                <div class="task-meta">
                    <span class="task-status ${task[4]}">${getStatusLabel(task[4])}</span>
                    ${task[5] === 'emergency' ? '<span class="task-emergency">🚨 PILNE</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'W realizacji',
        'done': 'Wykonane',
        'new': 'Nowe'
    };
    return labels[status] || status;
}

async function addClientTaskRequest() {
    const titleInput = document.getElementById('client-task-title');
    const descInput = document.getElementById('client-task-desc');
    
    if (!titleInput.value) {
        alert('Wpisz tytuł zadania');
        return;
    }
    
    try {
        await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                clientId: currentUserId,
                title: titleInput.value,
                description: descInput.value || ''
            })
        });
        
        titleInput.value = '';
        descInput.value = '';
        await loadClientTasks();
        showNotification('Zlecenie wysłane do admina!', 'success');
    } catch (error) {
        console.error('Błąd dodawania zadania:', error);
        showNotification('Błąd wysyłania zlecenia', 'error');
    }
}

// ===== DIRECT CHAT (klient) =====
async function loadClientChat() {
    try {
        const response = await fetch(`${API_URL}/chat/${currentUserId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const messages = await response.json();
        renderClientChat(messages);
    } catch (error) {
        console.error('Błąd ładowania chatu:', error);
    }
}

function renderClientChat(messages) {
    const container = document.getElementById('chat-messages-client');
    if (!container) return;
    
    if (messages.length === 0) {
        container.innerHTML = '<div class="empty-state">Brak wiadomości. Napisz pierwszą!</div>';
        return;
    }
    
    container.innerHTML = messages.map(msg => `
        <div class="chat-message msg-${msg.sender}">
            <div class="msg-sender">${msg.sender === 'client' ? 'Ty' : 'Mobilna Asystentka'}</div>
            <div class="msg-text">${msg.message}</div>
            <div class="msg-time">${new Date(msg.createdAt).toLocaleString('pl-PL')}</div>
        </div>
    `).join('');
    
    container.scrollTop = container.scrollHeight;
}

async function sendClientChatMessage() {
    const input = document.getElementById('chat-input-client');
    if (!input.value) return;
    
    try {
        await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                clientId: currentUserId,
                sender: 'client',
                message: input.value
            })
        });
        
        input.value = '';
        await loadClientChat();
    } catch (error) {
        console.error('Błąd wysyłania wiadomości:', error);
    }
}

function startClientChatAutoRefresh() {
    if (chatUpdateInterval) clearInterval(chatUpdateInterval);
    chatUpdateInterval = setInterval(() => {
        if (currentUserId) loadClientChat();
    }, 5000); // Odświeżanie co 5 sekund
}

function stopClientChatAutoRefresh() {
    if (chatUpdateInterval) {
        clearInterval(chatUpdateInterval);
        chatUpdateInterval = null;
    }
}

// Obsługa Enter w input
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input-client');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendClientChatMessage();
            }
        });
    }
});

// ===== FAKTURY (widok klienta - tylko odczyt) =====
async function loadClientInvoices() {
    try {
        const response = await fetch(`${API_URL}/invoices/${currentUserId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const invoices = await response.json();
        renderClientInvoices(invoices);
        updateInvoicesSummary(invoices);
    } catch (error) {
        console.error('Błąd ładowania faktur:', error);
    }
}

function renderClientInvoices(invoices) {
    const container = document.getElementById('client-invoices-list');
    if (!container) return;
    
    if (invoices.length === 0) {
        container.innerHTML = '<div class="empty-state">Brak faktur</div>';
        return;
    }
    
    container.innerHTML = invoices.map(inv => `
        <div class="invoice-item-client">
            <div class="invoice-info">
                <div class="invoice-number">${inv.invoiceNumber}</div>
                <div class="invoice-date">${new Date(inv.createdAt).toLocaleDateString('pl-PL')}</div>
            </div>
            <div class="invoice-amount">${inv.amount.toFixed(2)} PLN</div>
            <div class="invoice-status status-${inv.status.toLowerCase()}">
                ${getInvoiceStatusLabel(inv.status)}
            </div>
        </div>
    `).join('');
}

function getInvoiceStatusLabel(status) {
    const labels = {
        'PROFORMA': 'Do zapłaty',
        'PAID': 'Opłacone',
        'CANCELLED': 'Anulowane'
    };
    return labels[status] || status;
}

function updateInvoicesSummary(invoices) {
    const totalElement = document.getElementById('invoices-total');
    const paidElement = document.getElementById('invoices-paid');
    const unpaidElement = document.getElementById('invoices-unpaid');
    
    if (!totalElement) return;
    
    const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paid = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.amount, 0);
    const unpaid = invoices.filter(inv => inv.status === 'PROFORMA').reduce((sum, inv) => sum + inv.amount, 0);
    
    totalElement.textContent = `${total.toFixed(2)} PLN`;
    if (paidElement) paidElement.textContent = `${paid.toFixed(2)} PLN`;
    if (unpaidElement) unpaidElement.textContent = `${unpaid.toFixed(2)} PLN`;
}

// ===== KALENDARZ (widok klienta - tylko odczyt) =====
async function loadClientCalendar() {
    try {
        const response = await fetch(`${API_URL}/calendar/${currentUserId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const events = await response.json();
        renderClientCalendar(events);
    } catch (error) {
        console.error('Błąd ładowania kalendarza:', error);
    }
}

function renderClientCalendar(events) {
    const container = document.getElementById('calendar-grid-client');
    if (!container) return;
    
    const daysInMonth = 31;
    const eventDays = events.map(e => new Date(e.eventDate).getDate());
    const eventTitles = {};
    events.forEach(e => {
        const day = new Date(e.eventDate).getDate();
        eventTitles[day] = e.eventTitle;
    });
    
    container.innerHTML = Array.from({length: daysInMonth}, (_, i) => {
        const day = i + 1;
        const hasEvent = eventDays.includes(day);
        const title = eventTitles[day] || '';
        return `
            <div class="calendar-day ${hasEvent ? 'has-event' : ''}" title="${title}">
                ${day}
                ${hasEvent ? '<div class="event-indicator">•</div>' : ''}
            </div>
        `;
    }).join('');
}

// ===== EMERGENCY REQUEST =====
async function sendEmergencyRequest() {
    const messageInput = document.getElementById('emergency-message');
    const phoneInput = document.getElementById('emergency-phone');
    
    if (!messageInput.value) {
        alert('Opisz problem');
        return;
    }
    
    if (!confirm('Wysłać pilne zlecenie? (Koszt: 150 PLN)')) {
        return;
    }
    
    try {
        await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                clientId: currentUserId,
                title: 'EMERGENCY: ' + messageInput.value,
                description: `Telefon kontaktowy: ${phoneInput.value || 'brak'}`,
                priority: 'emergency'
            })
        });
        
        messageInput.value = '';
        phoneInput.value = '';
        showNotification('Pilne zlecenie wysłane! Skontaktujemy się wkrótce.', 'success');
        await loadClientTasks();
    } catch (error) {
        console.error('Błąd wysyłania emergency:', error);
        showNotification('Błąd wysyłania zlecenia', 'error');
    }
}

// ===== NOTYFIKACJE =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
        color: white;
        border-radius: 10px;
        font-weight: 700;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Dodaj style dla animacji
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export funkcji
window.clientFeatures = {
    init: initClientFeatures,
    cleanup: cleanupClientFeatures,
    addTaskRequest: addClientTaskRequest,
    sendChatMessage: sendClientChatMessage,
    sendEmergencyRequest: sendEmergencyRequest,
    loadTasks: loadClientTasks,
    loadChat: loadClientChat,
    loadInvoices: loadClientInvoices,
    loadCalendar: loadClientCalendar
};
