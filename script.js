document.addEventListener("DOMContentLoaded", function () {
    const addModal = document.getElementById("addStudentModal");
    const editModal = document.getElementById("editStudentModal");
    const deleteModal = document.getElementById("deleteStudentModal");
    const openAddModalBtn = document.querySelector(".plus");
    const closeAddModalBtn = addModal.querySelector(".close-btn");
    const closeEditModalBtn = editModal.querySelector(".close-btn");
    const closeDeleteModalBtn = deleteModal.querySelector(".close-btn");
    const addStudentForm = document.getElementById("addStudentForm");
    const editStudentForm = document.getElementById("editStudentForm");
    const okButton = deleteModal.querySelector(".modal-footer button:last-child");
    let currentRow = null;
    let currentPage = 1;
    const rowsPerPage = 4;

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = "none";
    }

    function openDeleteModal(studentName) {
        document.getElementById("deleteStudentName").textContent = studentName;
        document.getElementById("deleteStudentModal").style.display = "flex";
    }

    function confirmDelete() {
        const studentName = document.getElementById("deleteStudentName").textContent.trim();
        const rows = document.querySelectorAll(".studentsInfo");
        let rowToDelete = null;

        rows.forEach(row => {
            const nameCell = row.cells[2].textContent.trim();
            if (nameCell === studentName) {
                rowToDelete = row;
            }
        });

        if (rowToDelete) {
            rowToDelete.remove();
            console.log("Student " + studentName + " deleted successfully.");
            alert("User " + studentName + " has been deleted!");
            updatePagination();
        }
        closeModal("deleteStudentModal");
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

    function handleDeleteClick() {
        const row = this.closest("tr");
        if (row) {
            const studentName = row.cells[2].textContent.trim();
            openDeleteModal(studentName);
        }
    }

    function handleEditClick() {
        currentRow = this.closest("tr");
        editModal.style.display = "flex";
        document.getElementById("editGroup").value = currentRow.cells[1].innerText;
        let fullName = currentRow.cells[2].innerText.trim().split(" ");
        document.getElementById("editName").value = fullName[0] || "";
        document.getElementById("editSurname").value = fullName.slice(1).join(" ") || "";
        document.getElementById("editGender").value = currentRow.cells[3].innerText;
        let dateParts = currentRow.cells[4].innerText.split(".");
        document.getElementById("editBirthday").value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        document.getElementById("editStatus").checked = currentRow.querySelector('.status').checked;
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            handleDeleteClick.call(e.target);
        }
        if (e.target.classList.contains('edit-btn')) {
            handleEditClick.call(e.target);
        }
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
            }
        }
    };

    openAddModalBtn.addEventListener("click", function () {
        addModal.style.display = "flex";
    });

    closeAddModalBtn.addEventListener("click", function () {
        addModal.style.display = "none";
    });

    closeEditModalBtn.addEventListener("click", function () {
        editModal.style.display = "none";
    });

    addStudentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const group = document.getElementById("addGroup").value;
        const name = document.getElementById("addName").value;
        const surname = document.getElementById("addSurname").value;
        const gender = document.getElementById("addGender").value;
        const birthday = document.getElementById("addBirthday").value;

        const table = document.querySelector("tbody");
        const newRow = document.createElement("tr");

        newRow.classList.add("studentsInfo");
        newRow.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${group}</td>
            <td>${name} ${surname}</td>
            <td>${gender}</td>
            <td>${birthday.split("-").reverse().join(".")}</td>
            <td><input type="radio" class="status"></td>
            <td>
                <img src="pen.png" alt="Редагувати" title="Edit" class="edit-btn">
                <img src="close.png" alt="Видалити" title="Delete" class="delete-btn">
            </td>
        `;

        var namefromHTML = document.querySelector(".rightText").textContent.split(" ");
        if(name === namefromHTML[0] && surname === namefromHTML[1]) {
            newRow.querySelector(".status").checked = true;
        }

        table.appendChild(newRow);
        addModal.style.display = "none";
        addStudentForm.reset();
        
        updatePagination();
        attachEventListeners();
    });

    editStudentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (currentRow) {
            const group = document.getElementById("editGroup").value;
            const name = document.getElementById("editName").value;
            const surname = document.getElementById("editSurname").value;
            const gender = document.getElementById("editGender").value;
            const birthday = document.getElementById("editBirthday").value;
            const status = document.getElementById("editStatus").checked;

            currentRow.cells[1].innerText = group;
            currentRow.cells[2].innerText = `${name} ${surname}`;
            currentRow.cells[3].innerText = gender;
            currentRow.cells[4].innerText = birthday.split("-").reverse().join(".");
            currentRow.querySelector('.status').checked = status;

            editModal.style.display = "none";
            editStudentForm.reset();
            currentRow = null;
        }
    });

    updatePagination();
    attachEventListeners();

    editStudentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        currentRow.cells[1].innerText = document.getElementById("editGroup").value;
        let fullName = document.getElementById("editName").value + " " + document.getElementById("editSurname").value;
        currentRow.cells[2].innerText = fullName.trim();
        currentRow.cells[3].innerText = document.getElementById("editGender").value;
        currentRow.cells[4].innerText = document.getElementById("editBirthday").value.split("-").reverse().join(".");
        editModal.style.display = "none";
    });

    const userProfile = document.querySelector(".dropbutton");
    const dropdownContent = document.querySelector(".dropdown-content");

    userProfile.addEventListener("click", function (event) {
        event.stopPropagation();
        dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".dropbutton")) {
            dropdownContent.style.display = "none";
        }
    });

    const notificationWrapper = document.querySelector(".notification-wrapper");
    const notificationMenu = document.querySelector(".drop-notification");

    notificationWrapper.addEventListener("click", function (event) {
        event.stopPropagation();
        notificationMenu.style.display = notificationMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".notification-wrapper")) {
            notificationMenu.style.display = "none";
        }
    });

    const notificationIcon = document.getElementById("notification");
    notificationIcon.addEventListener("click", function (event) {
        event.stopPropagation();
        notificationIcon.src = "bell.png";
        setTimeout(() => {
            notificationMenu.style.display = notificationMenu.style.display === "block" ? "none" : "block";
        }, 100);
    });
    updatePagination();
});