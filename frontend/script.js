document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('message');

    // API Endpoint - Replace this with your actual API Gateway URL after deployment
    const API_URL = 'https://8oe4rfogf7.execute-api.us-east-1.amazonaws.com/prod/submit';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset messages and errors
        messageDiv.classList.add('hidden');
        messageDiv.textContent = '';
        clearErrors();

        // Perform Validation
        if (!validateForm()) {
            return;
        }

        // Collect Data
        const formData = {
            name: form.name.value.trim(),
            age: Number(form.age.value),
            occupation: form.occupation.value.trim(),
            phoneNumber: form.phoneNumber.value.trim(),
            address: form.address.value.trim(),
            pincode: Number(form.pincode.value),
            annualIncome: Number(form.annualIncome.value)
        };

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            // Note: In a real scenario, you would replace API_URL with the actual URL.
            // For now, since we don't have the live URL, we can simulate or attempt the fetch.
            // Check if API_URL is set to placeholder
            if (API_URL === 'YOUR_API_GATEWAY_URL_HERE') {
                throw new Error("API URL is not configured. Please update script.js with your invoked API Gateway URL.");
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Submission failed');
            }

            const result = await response.json();

            showMessage('Details submitted successfully!', 'success');
            form.reset();

        } catch (error) {
            console.error('Error:', error);
            showMessage(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Details';
        }
    });

    function validateForm() {
        let isValid = true;

        const name = form.name.value.trim();
        if (name.length < 2) {
            showError('nameError', 'Name must be at least 2 characters');
            isValid = false;
        }

        const age = Number(form.age.value);
        if (isNaN(age) || age < 1 || age > 150) {
            showError('ageError', 'Please enter a valid age (1-150)');
            isValid = false;
        }

        const phone = form.phoneNumber.value.trim();
        if (!/^\d{10}$/.test(phone)) {
            showError('phoneNumberError', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        const pincode = form.pincode.value.trim();
        if (!/^\d{6}$/.test(pincode)) { // Assuming 6 digit pincode for this context, can be adjusted
            showError('pincodeError', 'Please enter a valid 6-digit pincode');
            isValid = false;
        }

        // Basic check for others are handled by 'required' attribute, but we can add more if needed.

        return isValid;
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(el => el.textContent = '');
    }

    function showMessage(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`;
        messageDiv.classList.remove('hidden');
    }
});
