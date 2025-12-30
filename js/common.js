// Common JavaScript for unified dental clinic interface

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initSidebar();
    initRoleBasedAccess();
    setActiveNavLink();
});

// Theme switching
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    // Add theme toggle button if not exists
    if (!document.querySelector('.theme-toggle')) {
        const toggle = document.createElement('button');
        toggle.className = 'btn btn-outline-secondary theme-toggle';
        toggle.innerHTML = '<i class="bi bi-moon"></i>';
        toggle.onclick = toggleTheme;
        toggle.style.position = 'fixed';
        toggle.style.top = '20px';
        toggle.style.right = '20px';
        toggle.style.zIndex = '1000';
        document.body.appendChild(toggle);
    }
    updateThemeIcon();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        toggle.innerHTML = isDark ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
    }
}

// Sidebar functionality
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.sidebar-toggle');

    if (toggle && sidebar) {
        toggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 991.98) {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        }
    });
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('show');
    }
}

// Role-based access control
function initRoleBasedAccess() {
    const role = getCurrentRole();
    hideUnauthorizedMenus(role);
}

function getCurrentRole() {
    // Determine role based on current path
    const path = window.location.pathname;
    if (path.includes('/admin/')) return 'admin';
    if (path.includes('/assistante/')) return 'assistante';
    if (path.includes('/patient/')) return 'patient';
    return 'admin'; // default
}

function hideUnauthorizedMenus(role) {
    const menuItems = document.querySelectorAll('.nav-link[data-role]');

    menuItems.forEach(item => {
        const requiredRole = item.getAttribute('data-role');
        if (requiredRole && !hasAccess(role, requiredRole)) {
            item.style.display = 'none';
        }
    });
}

function hasAccess(userRole, requiredRole) {
    const roleHierarchy = {
        'admin': ['admin', 'assistante', 'patient'],
        'assistante': ['assistante', 'patient'],
        'patient': ['patient']
    };

    return roleHierarchy[userRole]?.includes(requiredRole) || false;
}

// Navigation
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href)) {
            link.classList.add('active');
        }
    });

    // Scroll the active navigation link into view
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Logout function
function logout() {
    // Clear session data
    localStorage.removeItem('current_patient');
    localStorage.removeItem('current_user');

    // Redirect based on role
    const role = getCurrentRole();
    if (role === 'patient') {
        window.location.href = '../LOGING PORTAIL/html/index.html';
    } else {
        window.location.href = '../LOGING/html/loging.html';
    }
}

// Utility functions for data management
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Modal management
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const bsModal = bootstrap.Modal.getInstance(modal);
        if (bsModal) bsModal.hide();
    }
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return isValid;
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Export functions
function exportToCSV(data, filename) {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function exportToPDF(elementId, filename) {
    const element = document.getElementById(elementId);
    if (element && window.jspdf) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.html(element, {
            callback: function(pdf) {
                pdf.save(filename);
            }
        });
    }
}

// Search functionality
function initSearch(searchInputId, listContainerId, itemSelector) {
    const searchInput = document.getElementById(searchInputId);
    const listContainer = document.getElementById(listContainerId);

    if (searchInput && listContainer) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const items = listContainer.querySelectorAll(itemSelector);

            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

// Date formatting
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(date).toLocaleDateString('fr-FR', { ...defaultOptions, ...options });
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// UX Enhancement Utilities

// Loading spinner utility
function showLoadingSpinner(elementId, message = 'Chargement...') {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Create spinner overlay
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="spinner-container">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-message">${message}</div>
        </div>
    `;

    // Add styles if not already present
    if (!document.getElementById('loading-spinner-styles')) {
        const styles = document.createElement('style');
        styles.id = 'loading-spinner-styles';
        styles.textContent = `
            .loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                border-radius: var(--border-radius);
            }
            [data-theme="dark"] .loading-overlay {
                background: rgba(15, 23, 42, 0.9);
            }
            .spinner-container {
                text-align: center;
            }
            .spinner-message {
                margin-top: 10px;
                color: var(--text-color);
                font-weight: 500;
            }
        `;
        document.head.appendChild(styles);
    }

    element.style.position = 'relative';
    element.appendChild(overlay);
}

function hideLoadingSpinner(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const overlay = element.querySelector('.loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Confirmation dialog utility
function showConfirmationDialog(message, onConfirm, onCancel = null, confirmText = 'Confirmer', cancelText = 'Annuler') {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${cancelText}</button>
                    <button type="button" class="btn btn-danger" id="confirm-btn">${confirmText}</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Initialize Bootstrap modal
    const bsModal = new bootstrap.Modal(modal);

    // Handle confirm button
    const confirmBtn = modal.querySelector('#confirm-btn');
    confirmBtn.addEventListener('click', () => {
        bsModal.hide();
        if (onConfirm) onConfirm();
    });

    // Handle cancel
    modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
        if (onCancel) onCancel();
    });

    bsModal.show();
}

// Button disable/enable utility
function disableButton(buttonElement, loadingText = 'Traitement...') {
    if (!buttonElement) return;

    buttonElement.disabled = true;
    buttonElement.dataset.originalText = buttonElement.textContent;
    buttonElement.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        ${loadingText}
    `;
}

function enableButton(buttonElement) {
    if (!buttonElement) return;

    buttonElement.disabled = false;
    if (buttonElement.dataset.originalText) {
        buttonElement.textContent = buttonElement.dataset.originalText;
    }
}

// Global loading state for page-level operations
function showPageLoading(message = 'Chargement...') {
    if (document.getElementById('page-loading-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'page-loading-overlay';
    overlay.innerHTML = `
        <div class="page-spinner-container">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="mt-3">${message}</div>
        </div>
    `;

    // Add styles
    if (!document.getElementById('page-loading-styles')) {
        const styles = document.createElement('style');
        styles.id = 'page-loading-styles';
        styles.textContent = `
            #page-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                backdrop-filter: blur(2px);
            }
            [data-theme="dark"] #page-loading-overlay {
                background: rgba(15, 23, 42, 0.95);
            }
            .page-spinner-container {
                text-align: center;
                color: var(--text-color);
                font-weight: 500;
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(overlay);
}

function hidePageLoading() {
    const overlay = document.getElementById('page-loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}
