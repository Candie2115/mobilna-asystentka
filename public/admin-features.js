// ===== MOBILNA ASYSTENTKA - ROZSZERZONE FUNKCJE =====
// Plik: admin-features.js
// Obsługuje: Task Manager, Chat, Faktury, Kalendarz, Logi, Archiwum, Memorium, Wymianę Emergency

const API_URL = window.location.origin + '/api';

// ===== GLOBALNE ZMIENNE =====
let currentClientId = null;
let currentClientName = '';
let chatUpdateInterval = null;
let emergencyBlockTimer = null;

// ===== SYSTEM LOGÓW =====
async function addSystemLog(action, details = '') {
    try {
        await fetch(`${API_URL}/logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, details })
        });
        await refreshSystemLogs();
    } catch (error) {
        console.error('Błąd dodawania logu:', error);
    }
}

async function refreshSystemLogs() {
    try {
        const response = await fetch(`${API_URL}/logs`);
        const logs = await response.json();
        const container = document.getElementById('system-logs-container');
        if (container) {
            container.innerHTML = logs.slice(0, 20).map(log => `
                <div class="log-item">
                    <span class="log-time">[${new Date(log.createdAt).toLocaleTimeString('pl-PL')}]</span>
                    <span class="log-action">${log.action}</span>
                    ${log.details ? `<span class="log-details"> - ${log.details}</span>` : ''}
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Błąd ładowania logów:', error);
    }
}

// ===== TASK MANAGER =====
async function loadTasks(clientId) {
    try {
        const response = await fetch(`${API_URL}/tasks/${clientId}`);
        const tasks = await response.json();
        renderTasksAdmin(tasks);
    } catch (error) {
        console.error('Błąd ładowania zadań:', error);
    }
}

function renderTasksAdmin(tasks) {
    const container = document.getElementById('task-list-admin');
    if (!container) return;
    
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state">Brak zadań dla tego klienta</div>';
        return;
    }
    
    container.innerHTML = tasks.map(task => `
        <div class="task-item ${task[4] === 'done' ? 'task-done' : ''}" data-task-id="${task[0]}">
            <div class="task-content">
                <div class="task-title">${task[2]}</div>
                <div class="task-meta">
                    <span class="task-status ${task[4]}">${task[4].toUpperCase()}</span>
                    <span class="task-priority ${task[5]}">${task[5]}</span>
                </div>
            </div>
            <div class="task-actions">
                <button onclick="toggleTaskStatus(${task[0]}, '${task[4]}')" class="btn-task-toggle">
                    ${task[4] === 'done' ? '↶ Cofnij' : '✓ Wykonano'}
                </button>
                <button onclick="deleteTask(${task[0]})" class="btn-task-delete">🗑</button>
            </div>
        </div>
    `).join('');
}

async function addTask() {
    const titleInput = document.getElementById('task-title-input');
    const descInput = document.getElementById('task-desc-input');
    
    if (!titleInput.value || !currentClientId) return;
    
    try {
        await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientId: currentClientId,
                title: titleInput.value,
                description: descInput.value || ''
            })
        });
        
        titleInput.value = '';
        descInput.value = '';
        await loadTasks(currentClientId);
        await addSystemLog('Dodano zadanie', `Klient: ${currentClientName}`);
    } catch (error) {
        console.error('Błąd dodawania zadania:', error);
    }
}

async function toggleTaskStatus(taskId, currentStatus) {
    const newStatus = currentStatus === 'done' ? 'pending' : 'done';
    try {
        await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        await loadTasks(currentClientId);
    } catch (error) {
        console.error('Błąd zmiany statusu:', error);
    }
}

async function deleteTask(taskId) {
    if (!confirm('Usunąć to zadanie?')) return;
    
    try {
        await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE' });
        await loadTasks(currentClientId);
    } catch (error) {
        console.error('Błąd usuwania zadania:', error);
    }
}

// ===== DIRECT CHAT =====
async function loadChat(clientId) {
    try {
        const response = await fetch(`${API_URL}/chat/${clientId}`);
        const messages = await response.json();
        renderChatAdmin(messages);
    } catch (error) {
        console.error('Błąd ładowania chatu:', error);
    }
}

function renderChatAdmin(messages) {
    const container = document.getElementById('chat-messages-admin');
    if (!container) return;
    
    container.innerHTML = messages.map(msg => `
        <div class="chat-message msg-${msg.sender}">
            <div class="msg-sender">${msg.sender === 'admin' ? 'Ty' : currentClientName}</div>
            <div class="msg-text">${msg.message}</div>
            <div class="msg-time">${new Date(msg.createdAt).toLocaleString('pl-PL')}</div>
        </div>
    `).join('');
    
    container.scrollTop = container.scrollHeight;
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input-admin');
    if (!input.value || !currentClientId) return;
    
    try {
        await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientId: currentClientId,
                sender: 'admin',
                message: input.value
            })
        });
        
        input.value = '';
        await loadChat(currentClientId);
    } catch (error) {
        console.error('Błąd wysyłania wiadomości:', error);
    }
}

function startChatAutoRefresh() {
    if (chatUpdateInterval) clearInterval(chatUpdateInterval);
    chatUpdateInterval = setInterval(() => {
        if (currentClientId) loadChat(currentClientId);
    }, 5000); // Odświeżanie co 5 sekund
}

function stopChatAutoRefresh() {
    if (chatUpdateInterval) {
        clearInterval(chatUpdateInterval);
        chatUpdateInterval = null;
    }
}

// ===== FAKTURY/ROZLICZENIA =====
async function loadInvoices(clientId) {
    try {
        const response = await fetch(`${API_URL}/invoices/${clientId}`);
        const invoices = await response.json();
        renderInvoicesAdmin(invoices);
    } catch (error) {
        console.error('Błąd ładowania faktur:', error);
    }
}

function renderInvoicesAdmin(invoices) {
    const container = document.getElementById('invoices-list-admin');
    if (!container) return;
    
    if (invoices.length === 0) {
        container.innerHTML = '<div class="empty-state">Brak faktur</div>';
        return;
    }
    
    container.innerHTML = invoices.map(inv => `
        <div class="invoice-item">
            <div class="invoice-info">
                <div class="invoice-number">${inv.invoiceNumber}</div>
                <div class="invoice-date">${new Date(inv.createdAt).toLocaleDateString('pl-PL')}</div>
            </div>
            <div class="invoice-amount">${inv.amount.toFixed(2)} PLN</div>
            <div class="invoice-status status-${inv.status.toLowerCase()}">${inv.status}</div>
            <button onclick="changeInvoiceStatus(${inv.id}, '${inv.status}')" class="btn-invoice-action">
                ${inv.status === 'PROFORMA' ? 'Opłacono' : 'Anuluj'}
            </button>
        </div>
    `).join('');
}

async function generateInvoice() {
    if (!currentClientId) return;
    
    const amount = prompt('Kwota faktury (PLN):');
    if (!amount || isNaN(amount)) return;
    
    try {
        const response = await fetch(`${API_URL}/invoices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientId: currentClientId,
                amount: parseFloat(amount)
            })
        });
        
        const result = await response.json();
        alert(`Wygenerowano fakturę: ${result.invoiceNumber}`);
        await loadInvoices(currentClientId);
        await addSystemLog('Wygenerowano fakturę', `${result.invoiceNumber} - ${currentClientName}`);
    } catch (error) {
        console.error('Błąd generowania faktury:', error);
    }
}

async function changeInvoiceStatus(invoiceId, currentStatus) {
    const newStatus = currentStatus === 'PROFORMA' ? 'PAID' : 'CANCELLED';
    
    try {
        await fetch(`${API_URL}/invoices/${invoiceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        await loadInvoices(currentClientId);
    } catch (error) {
        console.error('Błąd zmiany statusu faktury:', error);
    }
}

// ===== KALENDARZ WSPÓŁPRACY =====
async function loadCalendar(clientId) {
    try {
        const response = await fetch(`${API_URL}/calendar/${clientId}`);
        const events = await response.json();
        renderCalendarAdmin(events);
    } catch (error) {
        console.error('Błąd ładowania kalendarza:', error);
    }
}

function renderCalendarAdmin(events) {
    const container = document.getElementById('calendar-grid-admin');
    if (!container) return;
    
    const daysInMonth = 31;
    const eventDays = events.map(e => new Date(e.eventDate).getDate());
    
    container.innerHTML = Array.from({length: daysInMonth}, (_, i) => {
        const day = i + 1;
        const hasEvent = eventDays.includes(day);
        return `
            <div class="calendar-day ${hasEvent ? 'has-event' : ''}" onclick="toggleCalendarDay(${day})">
                ${day}
            </div>
        `;
    }).join('');
}

async function toggleCalendarDay(day) {
    if (!currentClientId) return;
    
    const date = new Date();
    date.setDate(day);
    const dateStr = date.toISOString().split('T')[0];
    
    try {
        // Sprawdź czy dzień już istnieje
        const response = await fetch(`${API_URL}/calendar/${currentClientId}`);
        const events = await response.json();
        const existingEvent = events.find(e => e.eventDate === dateStr);
        
        if (existingEvent) {
            // Usuń event
            await fetch(`${API_URL}/calendar/${existingEvent.id}`, { method: 'DELETE' });
        } else {
            // Dodaj event
            const title = prompt('Tytuł wydarzenia:') || 'Wizyta';
            await fetch(`${API_URL}/calendar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: currentClientId,
                    eventDate: dateStr,
                    eventTitle: title
                })
            });
        }
        
        await loadCalendar(currentClientId);
    } catch (error) {
        console.error('Błąd zmiany kalendarza:', error);
    }
}

// ===== ARCHIWUM MIESIĘCZNE =====
async function archiveClientMonth(clientId) {
    const now = new Date();
    
    if (!confirm(`Zarchiwizować miesiąc ${now.toLocaleString('pl-PL', {month: 'long'})} ${now.getFullYear()} dla tego klienta?`)) {
        return;
    }
    
    try {
        await fetch(`${API_URL}/archive`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientId: clientId,
                month: now.getMonth() + 1,
                year: now.getFullYear()
            })
        });
        
        alert('Miesiąc zarchiwizowany!');
        await addSystemLog('Archiwizacja miesiąca', currentClientName);
        await loadArchiveList();
    } catch (error) {
        console.error('Błąd archiwizacji:', error);
    }
}

async function archiveAllClients() {
    if (!confirm('Zarchiwizować bieżący miesiąc dla WSZYSTKICH klientów?')) return;
    
    try {
        // Pobierz listę wszystkich klientów
        const response = await fetch(`${API_URL}/clients`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const clients = await response.json();
        
        const now = new Date();
        for (const client of clients) {
            await fetch(`${API_URL}/archive`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: client.id,
                    month: now.getMonth() + 1,
                    year: now.getFullYear()
                })
            });
        }
        
        alert('Wszystkie miesiące zarchiwizowane!');
        await addSystemLog('Masowa archiwizacja', 'Wszyscy klienci');
        await loadArchiveList();
    } catch (error) {
        console.error('Błąd masowej archiwizacji:', error);
    }
}

async function loadArchiveList() {
    try {
        const response = await fetch(`${API_URL}/archive`);
        const archives = await response.json();
        renderArchiveList(archives);
    } catch (error) {
        console.error('Błąd ładowania archiwum:', error);
    }
}

function renderArchiveList(archives) {
    const container = document.getElementById('archive-tree');
    if (!container) return;
    
    // Grupuj po klientach
    const grouped = {};
    archives.forEach(arch => {
        if (!grouped[arch.clientName]) grouped[arch.clientName] = [];
        grouped[arch.clientName].push(arch);
    });
    
    container.innerHTML = Object.keys(grouped).map(clientName => `
        <div class="archive-client-group">
            <div class="archive-client-name">📁 ${clientName}</div>
            ${grouped[clientName].map(a => `
                <div class="archive-month">
                    📅 ${a.month}/${a.year}
                </div>
            `).join('')}
        </div>
    `).join('') || '<div class="empty-state">Brak archiwum</div>';
}

// ===== MEMORIUM (dezaktywowani) =====
async function moveToMemorium(clientId, clientName) {
    if (!confirm(`Przenieść ${clientName} do Memorium i dezaktywować konto?`)) return;
    
    try {
        await fetch(`${API_URL}/memorium/${clientId}`, { method: 'POST' });
        alert('Klient przeniesiony do Memorium');
        await addSystemLog('Memorium', `Dezaktywowano: ${clientName}`);
        await loadMemoriumList();
        // Odśwież listę klientów
        window.location.reload();
    } catch (error) {
        console.error('Błąd przenoszenia do Memorium:', error);
    }
}

async function reactivateClient(clientId, clientName) {
    if (!confirm(`Przywrócić ${clientName} z Memorium?`)) return;
    
    try {
        await fetch(`${API_URL}/memorium/reactivate/${clientId}`, { method: 'POST' });
        alert('Klient przywrócony!');
        await addSystemLog('Reaktywacja', `Przywrócono: ${clientName}`);
        await loadMemoriumList();
        window.location.reload();
    } catch (error) {
        console.error('Błąd reaktywacji:', error);
    }
}

async function loadMemoriumList() {
    try {
        const response = await fetch(`${API_URL}/memorium`);
        const deactivated = await response.json();
        renderMemoriumList(deactivated);
    } catch (error) {
        console.error('Błąd ładowania Memorium:', error);
    }
}

function renderMemoriumList(deactivated) {
    const container = document.getElementById('memorium-list');
    if (!container) return;
    
    if (deactivated.length === 0) {
        container.innerHTML = '<div class="empty-state">Brak zdezaktywowanych klientów</div>';
        return;
    }
    
    container.innerHTML = deactivated.map(client => `
        <div class="memorium-item">
            <div class="memorium-info">
                <div class="memorium-name">${client.username}</div>
                <div class="memorium-package">${client.package}</div>
                <div class="memorium-date">Dezaktywowano: ${new Date(client.deactivatedAt).toLocaleDateString('pl-PL')}</div>
            </div>
            <button onclick="reactivateClient(${client.id}, '${client.username}')" class="btn-reactivate">
                ↶ Przywróć
            </button>
        </div>
    `).join('');
}

// ===== WYMIANA EMERGENCY =====
function openExchangeModal() {
    const modal = document.getElementById('exchange-modal');
    if (modal) modal.style.display = 'flex';
}

function closeExchangeModal() {
    const modal = document.getElementById('exchange-modal');
    if (modal) modal.style.display = 'none';
}

async function handleExchange(exchangeType) {
    if (!currentClientId) return;
    
    try {
        const response = await fetch(`${API_URL}/emergency/exchange`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientId: currentClientId,
                exchangeType: exchangeType
            })
        });
        
        const result = await response.json();
        alert(result.message || 'Wymiana zakończona!');
        await addSystemLog('Wymiana Emergency', `${currentClientName} - ${exchangeType}`);
        closeExchangeModal();
    } catch (error) {
        console.error('Błąd wymiany:', error);
        alert('Brak interwencji Emergency do wymiany');
    }
}

// ===== BLOKOWANIE EMERGENCY NA CZAS =====
let isEmergencyBlocked = false;

function toggleEmergencyBlock() {
    const duration = document.getElementById('block-duration').value;
    const badge = document.getElementById('emergency-status-badge');
    const btn = document.getElementById('block-emergency-btn');
    
    isEmergencyBlocked = !isEmergencyBlocked;
    
    if (isEmergencyBlocked) {
        badge.textContent = 'ZABLOKOWANE';
        badge.className = 'status-badge status-blocked';
        btn.textContent = 'Odblokuj';
        
        addSystemLog('Emergency zablokowane', `Czas: ${duration}`);
        
        if (duration !== 'manual') {
            const minutes = parseInt(duration);
            emergencyBlockTimer = setTimeout(() => {
                toggleEmergencyBlock();
            }, minutes * 60 * 1000);
        }
    } else {
        badge.textContent = 'AKTYWNE';
        badge.className = 'status-badge status-active';
        btn.textContent = 'Zablokuj';
        
        if (emergencyBlockTimer) {
            clearTimeout(emergencyBlockTimer);
            emergencyBlockTimer = null;
        }
        
        addSystemLog('Emergency odblokowane', '');
    }
}

// ===== MENU KONTEKSTOWE (PPM) =====
let contextMenuTarget = null;

function showContextMenu(event, clientId, clientName) {
    event.preventDefault();
    contextMenuTarget = { clientId, clientName };
    
    const menu = document.getElementById('context-menu');
    if (menu) {
        menu.style.display = 'block';
        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';
    }
}

function hideContextMenu() {
    const menu = document.getElementById('context-menu');
    if (menu) menu.style.display = 'none';
}

async function contextMenuAction(action) {
    if (!contextMenuTarget) return;
    
    const { clientId, clientName } = contextMenuTarget;
    
    switch(action) {
        case 'archive':
            await archiveClientMonth(clientId);
            break;
        case 'memorium':
            await moveToMemorium(clientId, clientName);
            break;
        case 'delete':
            if (confirm(`UWAGA! Czy na pewno usunąć ${clientName} bezpowrotnie?`)) {
                // TODO: implementacja usuwania
                alert('Funkcja w przygotowaniu');
            }
            break;
    }
    
    hideContextMenu();
}

// Ukryj menu po kliknięciu gdziekolwiek
document.addEventListener('click', hideContextMenu);

// ===== INICJALIZACJA =====
function initAdminFeatures(clientId, clientName) {
    currentClientId = clientId;
    currentClientName = clientName;
    
    // Załaduj wszystkie dane
    loadTasks(clientId);
    loadChat(clientId);
    loadInvoices(clientId);
    loadCalendar(clientId);
    
    // Uruchom auto-odświeżanie chatu
    startChatAutoRefresh();
}

function cleanupAdminFeatures() {
    stopChatAutoRefresh();
    currentClientId = null;
    currentClientName = '';
}

// Export funkcji dla użycia w HTML
window.adminFeatures = {
    init: initAdminFeatures,
    cleanup: cleanupAdminFeatures,
    addTask,
    sendChatMessage,
    generateInvoice,
    archiveAllClients,
    toggleEmergencyBlock,
    openExchangeModal,
    closeExchangeModal,
    handleExchange,
    showContextMenu,
    contextMenuAction
};
