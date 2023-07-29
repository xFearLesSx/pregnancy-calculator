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

    var pregnancyDateDiv = document.getElementById('pregnancyDateResult');
    var dueDateDiv = document.getElementById('dueDateResult');
    var clearBtn;

    function addResetButton() {
        clearBtn = document.createElement('button');
        clearBtn.id = 'clearBtn';
        clearBtn.textContent = 'Click to Calculate Again!';
        clearBtn.addEventListener('click', resetForm);
        document.querySelector('.hlder.results').appendChild(clearBtn);
    }

    function removeResetButton() {
        clearBtn.removeEventListener('click', resetForm);
        clearBtn.parentNode.removeChild(clearBtn);
        clearBtn = null;
    }

    function updateLPDDays() {
        var lpdDaySelect = document.getElementById('lpdDay');
        var lpdMonthSelect = document.getElementById('lpdMonth');
        var lpdYearInput = document.getElementById('lpdYear');

        var month = lpdMonthSelect.value;
        var year = parseInt(lpdYearInput.value, 10);

        if (isNaN(year)) {
            return;
        }

        var daysInMonth = getDaysInMonth(month, year);
        var currentDay = parseInt(lpdDaySelect.value, 10);

        lpdDaySelect.innerHTML = '';

        for (var day = 1; day <= daysInMonth; day++) {
            var option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            lpdDaySelect.appendChild(option);
        }

        if (currentDay >= 1 && currentDay <= daysInMonth) {
            lpdDaySelect.value = currentDay;
        }
    }

    function getDaysInMonth(month, year) {
        var monthsWith31Days = ['January', 'March', 'May', 'July', 'August', 'October', 'December'];

        if (month === 'February') {
            return isLeapYear(year) ? 29 : 28;
        } else {
            return monthsWith31Days.includes(month) ? 31 : 30;
        }
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    var lpdYearInput = document.getElementById('lpdYear');
    lpdYearInput.addEventListener('input', updateLPDDays);

    function calculateDueDate() {
        var lpdDaySelect = document.getElementById('lpdDay');
        var lpdMonthSelect = document.getElementById('lpdMonth');
        var lpdYearInput = document.getElementById('lpdYear');
        var lpdDay = parseInt(lpdDaySelect.value, 10);
        var lpdMonth = lpdMonthSelect.value;
        var lpdYear = parseInt(lpdYearInput.value, 10);

        if (isNaN(lpdDay) || isNaN(lpdYear)) {
            alert('Please enter a valid date!');
            return;
        }

        // Limit the input date to the current date
        var currentDate = new Date();
        var minDate = new Date(currentDate);
        minDate.setMonth(currentDate.getMonth() - 9);

        var selectedDate = new Date(lpdYear, getMonthIndex(lpdMonth), lpdDay);

        if (selectedDate > currentDate) {
            alert('Please enter a date on or before the current date.');
            return;
        }

        if (selectedDate < minDate) {
            alert('Please enter a date within the last 9 months.');
            return;
        }

        var lpdDate = new Date(lpdYear, getMonthIndex(lpdMonth), lpdDay);

        var lengthCycleInput = document.getElementById('lengthCycle');
        var lengthCycle = parseInt(lengthCycleInput.value, 10);

        if (isNaN(lengthCycle) || lengthCycle <= 19 || lengthCycle >= 45) {
            alert('Please enter a valid cycle length!');
            return;
        } else {
            alert('Congratulations, please see the details below!');
        }

        var gestationPeriod = 280;
        gestationPeriod += (lengthCycle - 28);

        var dueDate = new Date(lpdDate);
        dueDate.setDate(dueDate.getDate() + gestationPeriod);

        var currentDate = new Date();
        var fetalAge = Math.floor((currentDate - lpdDate) / (1000 * 60 * 60 * 24));
        var weeks = parseInt(fetalAge / 7);
        var days = Math.floor(fetalAge % 7);

        var formattedDueDate = formatDate(dueDate);

        pregnancyDateDiv.innerHTML = 'You are ' + weeks + " week" + (weeks > 1 ? "s" : "") + " and " + days + " day" + (days > 1 ? "s" : "") + ' pregnant';
        dueDateDiv.innerHTML = 'Your due date is ' + formattedDueDate

        if (!clearBtn) {
            addResetButton();
        }

        disableFormInputs();
        addPointerEvents();
    }

    function resetForm() {
        var lpdDaySelect = document.getElementById('lpdDay');
        var lpdMonthSelect = document.getElementById('lpdMonth');
        var lpdYearInput = document.getElementById('lpdYear');
        var pregnancyDateDiv = document.getElementById('pregnancyDateResult');
        var dueDateDiv = document.getElementById('dueDateResult');

        lpdDaySelect.value = '';
        lpdMonthSelect.value = '';
        lpdYearInput.value = '';
        pregnancyDateDiv.innerHTML = '';
        dueDateDiv.innerHTML = '';

        if (clearBtn) {
            removeResetButton();
        }

        enableFormInputs();
        removePointerEvents();
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

    // Populate days and months
    var lpdDaySelect = document.getElementById('lpdDay');
    for (var i = 1; i <= 31; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        lpdDaySelect.appendChild(option);
    }

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

});
