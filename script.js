function plus(idname) {
    var oldVal = document.getElementById(idname);
    var newVal = oldVal.value;
    if (newVal >= 44) {
        alert('You cannot go above 44!');
        return;
    } else {
        newVal++;
        oldVal.value = newVal;
    }
}

function minus(idname) {
    var oldVal = document.getElementById(idname);
    var newVal = oldVal.value;
    if (newVal <= 20) {
        alert('You cannot go below 20!');
        return;
    } else {
        newVal--;
        oldVal.value = newVal;
    }
}

window.addEventListener('DOMContentLoaded', function () {
    var resultBtn = document.getElementById('resultBtn');
    resultBtn.addEventListener('click', calculateDueDate);

    var messageDiv = document.getElementById('message');
    var clearBtn;

    function addResetButton() {
        clearBtn = document.createElement('button');
        clearBtn.id = 'clearBtn';
        clearBtn.textContent = 'Click to calculate again!';
        clearBtn.addEventListener('click', resetForm);
        document.querySelector('.hlder.results').appendChild(clearBtn);
    }

    function removeResetButton() {
        clearBtn.removeEventListener('click', resetForm);
        clearBtn.parentNode.removeChild(clearBtn);
        clearBtn = null;
    }

    function calculateDueDate() {
        var lpdDaySelect = document.getElementById('lpdDay');
        var lpdMonthSelect = document.getElementById('lpdMonth');
        var lpdYearInput = document.getElementById('lpdYear');
        var lpdDay = parseInt(lpdDaySelect.value, 10);
        var lpdMonth = lpdMonthSelect.value;
        var lpdYear = parseInt(lpdYearInput.value, 10);

        if (isNaN(lpdDay) || isNaN(lpdYear)) {
            showMessage('Please enter a valid date!');
            return;
        }

        // Limit the input date to the current date
        var currentDate = new Date();
        var minDate = new Date(currentDate);
        minDate.setMonth(currentDate.getMonth() - 9);

        var selectedDate = new Date(lpdYear, getMonthIndex(lpdMonth), lpdDay);

        if (selectedDate > currentDate) {
            showMessage('Please enter a date on or before the current date.');
            return;
        }

        if (selectedDate < minDate) {
            showMessage('Please enter a date within the last 9 months.');
            return;
        }

        var lpdDate = new Date(lpdYear, getMonthIndex(lpdMonth), lpdDay);

        var lengthCycleInput = document.getElementById('lengthCycle');
        var lengthCycle = parseInt(lengthCycleInput.value, 10);

        if (isNaN(lengthCycle) || lengthCycle <= 19 || lengthCycle >= 45) {
            showMessage('Please enter a valid cycle length! Must be between 20 and 44');
            return;
        }

        var gestationPeriod = 280; // Default gestation period in days
        gestationPeriod += (lengthCycle - 28);

        var dueDate = new Date(lpdDate);
        dueDate.setDate(dueDate.getDate() + gestationPeriod);

        var formattedDueDate = formatDate(dueDate);

        var currentDate = new Date();
        var fetalAge = Math.floor((currentDate - lpdDate) / (1000 * 60 * 60 * 24)); // In days
        var weeks = Math.floor(fetalAge / 7);
        var days = fetalAge % 7;

        if (fetalAge >= 7) {
            pregnancyDateResult.innerHTML = 'You may be ' + weeks + ' week' + (weeks > 1 ? 's' : '') + (days > 0 ? ' and ' + days + ' day' + (days > 1 ? 's' : '') : '') + ' pregnant';
        } else {
            pregnancyDateResult.innerHTML = 'You are ' + fetalAge + ' day' + (fetalAge > 1 ? 's' : '') + ' pregnant';
        }

        dueDateResult.innerHTML = 'Based on this information, your due date is around ' + formattedDueDate;

        if (!clearBtn) {
            addResetButton();
        }

        disableFormInputs();
        addPointerEvents();
        // showMessage('Calculation complete! Please see the results below!', true);
    }

    function resetForm() {
        var lpdDaySelect = document.getElementById('lpdDay');
        var lpdMonthSelect = document.getElementById('lpdMonth');
        var lpdYearInput = document.getElementById('lpdYear');
        var lengthCycleInput = document.getElementById('lengthCycle');
        var pregnancyDateResultDiv = document.getElementById('pregnancyDateResult');
        var dueDateResultDiv = document.getElementById('dueDateResult');

        lpdDaySelect.value = '';
        lpdMonthSelect.value = '';
        lpdYearInput.value = '';
        lengthCycleInput.value = '';
        pregnancyDateResultDiv.innerHTML = '';
        dueDateResultDiv.innerHTML = '';;

        if (clearBtn) {
            removeResetButton();
        }

        enableFormInputs();
        removePointerEvents();
        showMessage('Form reset!', true);
    }

    function showMessage(message, success) {
        messageDiv.textContent = message;
        messageDiv.style.color = success ? 'green' : 'red';
        messageDiv.style.display = 'block';
    }

    function hideMessage() {
        messageDiv.textContent = '';
        messageDiv.style.display = 'none';
    }

    function formatDate(date) {
        var months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        var year = date.getFullYear();
        var month = months[date.getMonth()];
        var day = date.getDate().toString().padStart(2, '0');

        return day + ' ' + month + ' ' + year;
    }

    function getMonthIndex(month) {
        var months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months.indexOf(month);
    }

    function disableFormInputs() {
        var lpdDaySelect = document.getElementById('lpdDay');
        var lpdMonthSelect = document.getElementById('lpdMonth');
        var lpdYearInput = document.getElementById('lpdYear');
        var lengthCycleInput = document.getElementById('lengthCycle');
        lpdDaySelect.disabled = true;
        lpdMonthSelect.disabled = true;
        lpdYearInput.disabled = true;
        lengthCycleInput.disabled = true;
    }

    function enableFormInputs() {
        var lpdDaySelect = document.getElementById('lpdDay');
        var lpdMonthSelect = document.getElementById('lpdMonth');
        var lpdYearInput = document.getElementById('lpdYear');
        var lengthCycleInput = document.getElementById('lengthCycle');
        lpdDaySelect.disabled = false;
        lpdMonthSelect.disabled = false;
        lpdYearInput.disabled = false;
        lengthCycleInput.disabled = false;
    }

    function addPointerEvents() {
        document.getElementById("minus").style.pointerEvents = "none";
        document.getElementById("plus").style.pointerEvents = "none";
    }

    function removePointerEvents() {
        document.getElementById("minus").style.pointerEvents = "auto";
        document.getElementById("plus").style.pointerEvents = "auto";
    }

    function updateDays() {
        var lpdDaySelect = document.getElementById('lpdDay');
        var lpdMonthSelect = document.getElementById('lpdMonth');
        var lpdYearInput = document.getElementById('lpdYear');
        var lpdMonth = lpdMonthSelect.value;
        var lpdYear = parseInt(lpdYearInput.value, 10);

        var daysInMonth = new Date(lpdYear, getMonthIndex(lpdMonth) + 1, 0).getDate();
        lpdDaySelect.innerHTML = '';

        for (var i = 1; i <= daysInMonth; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            lpdDaySelect.appendChild(option);
        }
    }

    var lpdMonthSelect = document.getElementById('lpdMonth');
    var lpdYearInput = document.getElementById('lpdYear');

    lpdYearInput.addEventListener('change', updateDays);
    lpdMonthSelect.addEventListener('change', updateDays);
    updateDays();

    var lpdMonthSelect = document.getElementById('lpdMonth');
    var months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    for (var i = 0; i < months.length; i++) {
        var option = document.createElement('option');
        option.value = months[i];
        option.textContent = months[i];
        lpdMonthSelect.appendChild(option);
    }

    // Hide the message initially
    hideMessage();
});
