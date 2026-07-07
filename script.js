document.addEventListener('DOMContentLoaded', () => {
    // ---- MODAL LOGIC ----
    const plannerBtn = document.getElementById('btn-planner-waitlist');
    const vendorBtn = document.getElementById('btn-vendor-waitlist');
    
    const plannerModal = document.getElementById('planner-modal');
    const vendorModal = document.getElementById('vendor-modal');
    
    const closeBtns = document.querySelectorAll('.close-btn');

    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    plannerBtn.addEventListener('click', () => openModal(plannerModal));
    vendorBtn.addEventListener('click', () => openModal(vendorModal));

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });

    // ---- FORM SUBMISSION LOGIC ----
    // TODO: The user needs to paste their deployed Google Apps Script Web App URL here.
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtwPJI7AJpRFn4EGfQ-TNkfQTdMQU-2gibd3tOW2Az278cEB1sR3cS9tFJvn1zQ871/exec";

    const plannerForm = document.getElementById('planner-form');
    const vendorForm = document.getElementById('vendor-form');

    async function handleFormSubmit(e, form, type) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const statusDiv = form.querySelector('.form-status');
        
        // Basic validation check for script URL
        if (SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
            statusDiv.className = 'form-status status-error';
            statusDiv.textContent = 'Error: Google Apps Script URL not configured yet. Please follow the setup instructions.';
            return;
        }

        // Gather data
        const formData = new FormData(form);
        const data = { type: type };
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // UI Loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        statusDiv.className = 'form-status';
        statusDiv.textContent = '';

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', // Bypass CORS preflight
                }
            });
            
            const result = await response.json();
            
            if (result.result === 'success') {
                statusDiv.className = 'form-status status-success';
                statusDiv.textContent = 'Thank you! You have been added to the waitlist.';
                form.reset();
            } else {
                throw new Error(result.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            statusDiv.className = 'form-status status-error';
            statusDiv.textContent = 'An error occurred. Please try again.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Join Waitlist';
        }
    }

    plannerForm.addEventListener('submit', (e) => handleFormSubmit(e, plannerForm, 'planner'));
    vendorForm.addEventListener('submit', (e) => handleFormSubmit(e, vendorForm, 'vendor'));
});
