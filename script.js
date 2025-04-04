document.addEventListener("DOMContentLoaded", function () {
    const studentModal = document.getElementById("studentModal");
    const deleteModal = document.getElementById("deleteStudentModal");
    const openAddModalBtn = document.querySelector(".plus");
    const closeStudentModalBtn = studentModal.querySelector(".close-btn");
    const closeDeleteModalBtn = deleteModal.querySelector(".close-btn");
    const studentForm = document.getElementById("studentForm");
    const modalTitle = document.getElementById("modalTitle");
    const headerCheckbox = document.querySelector('thead input[type="checkbox"]');
    const okButton = deleteModal.querySelector(".modal-footer button:last-child");
    let currentRow = null;
    let isEditing = false;
    let currentPage = 1;
    const rowsPerPage = 4;

    function validateName(name) {
        const nameRegex = /^[A-ZА-ЯІЇЄҐ][a-zA-Zа-яА-ЯіїєґІЇЄҐ'-]{1,}$/;
        if (isEmail(name)) {
            return false;
        }
        return nameRegex.test(name);
    }

    function isEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    function validateBirthday(birthday) {
        const birthdayDate = new Date(birthday);
        const today = new Date();
        const age = today.getFullYear() - birthdayDate.getFullYear();
        const monthDiff = today.getMonth() - birthdayDate.getMonth();
        const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdayDate.getDate())
            ? age - 1 : age;
        return !isNaN(birthdayDate) && adjustedAge >= 16 && adjustedAge <= 100;
    }

    function validateGroup(group) {
        const groupRegex = /^[A-Za-zА-Яа-я0-9-]{2,}$/;
        return groupRegex.test(group);
    }

    function displayValidationError(fieldId, errorMessage) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`) || document.createElement("span");
        if (!errorElement.id) {
            errorElement.id = `${fieldId}Error`;
            errorElement.className = "error-message";
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        errorElement.textContent = errorMessage;
        field.classList.add("error-input");
    }

    function clearValidationErrors() {
        document.querySelectorAll(".error-message").forEach(el => el.remove());
        document.querySelectorAll(".error-input").forEach(el => el.classList.remove("error-input"));
    }

    function validateField(fieldId, validationFunction, errorMessage) {
        const field = document.getElementById(fieldId);
        if (!validationFunction(field.value.trim())) {
            displayValidationError(fieldId, errorMessage);
        } else {
            const errorElement = document.getElementById(`${fieldId}Error`);
            if (errorElement) errorElement.remove();
            field.classList.remove("error-input");
        }
    }

    document.getElementById("studentGroup").addEventListener("input", function() {
        validateField("studentGroup", validateGroup, "Група повинна містити щонайменше 2 символи!");
    });

    document.getElementById("studentName").addEventListener("input", function() {
        const value = this.value.trim();
        if (isEmail(value)) {
            displayValidationError("studentName", "Будь ласка, введіть ім'я, а не email!");
        } else {
            validateField("studentName", validateName, "Ім'я повинно починатися з великої літери та не містити цифр!");
        }
    });

    document.getElementById("studentSurname").addEventListener("input", function() {
        validateField("studentSurname", validateName, "Прізвище повинно починатися з великої літери та не містити цифр!");
    });

    document.getElementById("studentBirthday").addEventListener("input", function() {
        validateField("studentBirthday", validateBirthday, "Вік студента повинен бути між 16 і 100 роками!");
    });

    function validateForm() {
        clearValidationErrors();
        const group = document.getElementById("studentGroup").value.trim();
        const name = document.getElementById("studentName").value.trim();
        const surname = document.getElementById("studentSurname").value.trim();
        const gender = document.getElementById("studentGender").value;
        const birthday = document.getElementById("studentBirthday").value;

        if (!group || !name || !surname || !gender || !birthday) {
            alert("Будь ласка, заповніть усі обов'язкові поля!");
            return false;
        }

        if (!validateGroup(group)) {
            displayValidationError("studentGroup", "Група повинна містити щонайменше 2 символи!");
            return false;
        }

        if (isEmail(name)) {
            displayValidationError("studentName", "Будь ласка, введіть ім'я, а не email!");
            return false;
        }

        if (!validateName(name)) {
            displayValidationError("studentName", "Ім'я повинно починатися з великої літери та не містити цифр!");
            return false;
        }

        if(document.getElementById('studentName').value.trim().toLowerCase() === "select" || document.getElementById('studentSurname').value.trim().toLowerCase() === "select")
            {
                displayValidationError("studentName","You cannot input this, you may be a thief");
                return;
            }

        if (!validateName(surname)) {
            displayValidationError("studentSurname", "Прізвище повинно починатися з великої літери та не містити цифр!");
            return false;
        }

        if (!validateBirthday(birthday)) {
            displayValidationError("studentBirthday", "Вік студента повинен бути між 16 і 100 роками!");
            return false;
        }

        return true;
    }

    headerCheckbox.addEventListener('change', function () {
        const allCheckboxes = document.querySelectorAll('.studentsInfo input[type="checkbox"]');
        allCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateButtonStates();
    });

    document.addEventListener('change', function (e) {
        if (e.target.type === 'checkbox' && e.target.closest('.studentsInfo')) {
            updateButtonStates();
        }
    });

    function updateButtonStates() {
        const checkedBoxes = document.querySelectorAll('.studentsInfo input[type="checkbox"]:checked');
        const editButtons = document.querySelectorAll('.edit-btn');
        const deleteButtons = document.querySelectorAll('.delete-btn');

        editButtons.forEach(btn => btn.disabled = checkedBoxes.length !== 1);
        deleteButtons.forEach(btn => btn.disabled = checkedBoxes.length === 0);
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = "none";
    }

    function openDeleteModal(studentNames) {
        document.getElementById("deleteStudentName").textContent = studentNames;
        deleteModal.style.display = "flex";
    }

    function serializeStudentData(group, name, surname, gender, birthday, status, id = null) {
        return {
            id: id || Date.now().toString(),
            group: group,
            firstName: name,
            lastName: surname,
            gender: gender,
            birthday: birthday,
            status: status ? "Online" : "Offline"
        };
    }

    function sendToServer(studentData, action = "add") {
        console.log(`Sending to server (${action}):`, JSON.stringify(studentData, null, 2));
    }

    function confirmDelete() {
        const checkedBoxes = document.querySelectorAll('.studentsInfo input[type="checkbox"]:checked');
        if (checkedBoxes.length === 0) {
            alert("Будь ласка, виберіть студента для видалення!");
            closeModal("deleteStudentModal");
            return;
        }

        checkedBoxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const studentData = {
                id: row.dataset.id || null,
                fullName: row.cells[2].textContent.trim()
            };
            sendToServer(studentData, "delete");
            row.remove();
        });

        headerCheckbox.checked = false;
        alert(`Вибраних студентів видалено!`);
        closeModal("deleteStudentModal");
        updatePagination();
        updateButtonStates();
    }

    function updatePagination() {
 
   
 const rows = document.querySelectorAll(".studentsInfo");
        const totalPages = Math.ceil(rows.length / rowsPerPage);
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;

        rows.forEach((row, index) => {
            row.style.display = (index >= startIndex && index < endIndex) ? "" : "none";
        });

        const pagination = document.querySelector(".pagination");
        pagination.innerHTML = "";

        const prevButton = document.createElement("button");
        prevButton.className = "pagebtn";
        prevButton.textContent = "<";
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
            }
        });
        pagination.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.className = "pagebtn";
            button.textContent = i;
            if (i === currentPage) button.classList.add("active");
            button.addEventListener("click", () => {
                currentPage = i;
                updatePagination();
            });
            pagination.appendChild(button);
        }

        const nextButton = document.createElement("button");
        nextButton.className = "pagebtn";
        nextButton.textContent = ">";
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
            }
        });
        pagination.appendChild(nextButton);
    }

    function handleEditClick(e) {
        const row = e.target.closest('tr');
        const checkbox = row.querySelector('input[type="checkbox"]');
        
        if (!checkbox.checked) {
            alert("Ви можете редагувати тільки студента, якого відмічено галочкою!");
            return;
        }

        currentRow = row;
        isEditing = true;
        modalTitle.textContent = "Редагувати студента";
        studentModal.style.display = "flex";

        document.getElementById("studentGroup").value = currentRow.cells[1].innerText;
        let fullName = currentRow.cells[2].innerText.trim().split(" ");
        document.getElementById("studentName").value = fullName[0] || "";
        document.getElementById("studentSurname").value = fullName.slice(1).join(" ") || "";
        document.getElementById("studentGender").value = currentRow.cells[3].innerText;
        let dateParts = currentRow.cells[4].innerText.split(".");
        document.getElementById("studentBirthday").value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }

    function handleDeleteClick(e) {
        const checkedBoxes = document.querySelectorAll('.studentsInfo input[type="checkbox"]:checked');
        
        if (checkedBoxes.length === 0) {
            alert("Будь ласка, виберіть студента для видалення!");
            return;
        }

        const studentNames = Array.from(checkedBoxes)
            .map(checkbox => checkbox.closest('tr').cells[2].textContent.trim())
            .join(", ");
        openDeleteModal(studentNames);
    }

    function attachEventListeners() {
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.removeEventListener('click', handleDeleteClick);
            btn.addEventListener('click', handleDeleteClick);
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.removeEventListener('click', handleEditClick);
            btn.addEventListener('click', handleEditClick);
        });
    }

    openAddModalBtn.addEventListener("click", function () {
        isEditing = false;
        modalTitle.textContent = "Додати студента";
        studentForm.reset();
        clearValidationErrors();
        studentModal.style.display = "flex";
    });

    closeStudentModalBtn.addEventListener("click", function () {
        studentModal.style.display = "none";
        clearValidationErrors();
    });

    closeDeleteModalBtn.addEventListener("click", function () {
        closeModal("deleteStudentModal");
    });

    const cancelButton = deleteModal.querySelector(".modal-footer button:first-child");
    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            closeModal("deleteStudentModal");
        });
    }

    if (okButton) {
        okButton.addEventListener("click", function () {
            confirmDelete();
        });
    }

    window.onclick = function (event) {
        const modals = document.getElementsByClassName("modal");
        for (let modal of modals) {
            if (event.target === modal) {
                modal.style.display = "none";
                if (modal.id === "studentModal") {
                    clearValidationErrors();
                }
            }
        }
    };

    var i = 0;

    studentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!validateForm()) return;

        const group = document.getElementById("studentGroup").value;
        const name = document.getElementById("studentName").value;
        const surname = document.getElementById("studentSurname").value;
        const gender = document.getElementById("studentGender").value;
        const birthday = document.getElementById("studentBirthday").value;

        const status = false;

        const studentData = serializeStudentData(
            group,
            name,
            surname,
            gender,
            birthday,
            status,
            isEditing && currentRow ? currentRow.dataset.id : null
        );

        if (isEditing && currentRow) {
            sendToServer(studentData, "edit");
            currentRow.cells[1].innerText = group;
            currentRow.cells[2].innerText = `${name} ${surname}`;
            currentRow.cells[3].innerText = gender;
            currentRow.cells[4].innerText = birthday.split("-").reverse().join(".");
            currentRow.querySelector('.status').checked = status;
        } else {
            sendToServer(studentData, "add");
            const table = document.querySelector("tbody");

            const newRow = document.createElement("tr");
            newRow.classList.add("studentsInfo");
            newRow.dataset.id = studentData.id;
            newRow.innerHTML = `
                <td><input type="checkbox" id="check${i}"><label style="visibility: hidden;" for="check${i}">t</label></td>
                <td>${group}</td>
                <td>${name} ${surname}</td>
                <td>${gender}</td>
                <td>${birthday.split("-").reverse().join(".")}</td>
                <td><input type="radio" class="status" id="status${i}"><label style="visibility: hidden;" for="status${i}">as</label></td>
                <td>
                    <img src="pen.png" alt="Редагувати" title="Edit" class="edit-btn">
                    <img src="close.png" alt="Видалити" title="Delete" class="delete-btn">
                </td>
            `;

            i++;
            newRow.querySelector(".status").checked = status;

            table.appendChild(newRow);
            updatePagination();
            attachEventListeners();
        }

        clearValidationErrors();
        studentModal.style.display = "none";
        studentForm.reset();
        currentRow = null;
        alert('Студента успішно ' + (isEditing ? 'оновлено' : 'додано'));
    });

    updatePagination();
    attachEventListeners();
    updateButtonStates();
});