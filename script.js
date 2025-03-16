document.addEventListener("DOMContentLoaded", function () {
    // Модальні вікна для додавання, редагування та видалення студентів
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
        } else {
            console.error("No row found for student: " + studentName);
        }

        closeModal("deleteStudentModal");
    }

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const row = btn.closest("tr");
            if (row) {
                const studentName = row.cells[2].textContent.trim();
                console.log("Opening delete modal for: " + studentName);
                openDeleteModal(studentName);
            } else {
                console.error("No row found for delete button click.");
            }
        });
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
        const status = document.getElementById("addStatus").value || "—";

        const table = document.querySelector("tbody");
        const newRow = document.createElement("tr");

        newRow.classList.add("studentsInfo");
        newRow.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${group}</td>
            <td>${name} ${surname}</td>
            <td>${gender}</td>
            <td>${birthday.split("-").reverse().join(".")}</td>
            <td>${status}</td>
            <td>
                <img src="pen.png" alt="Редагувати" class="edit-btn">
                <img src="close.png" alt="Видалити" class="delete-btn">
            </td>
        `;

        table.appendChild(newRow);
        addModal.style.display = "none";
        addStudentForm.reset();

        newRow.querySelector(".edit-btn").addEventListener("click", function () {
            currentRow = newRow;
            editModal.style.display = "flex";
            document.getElementById("editGroup").value = currentRow.cells[1].innerText;
            let fullName = currentRow.cells[2].innerText.trim().split(" ");
            document.getElementById("editName").value = fullName[0] || "";
            document.getElementById("editSurname").value = fullName.slice(1).join(" ") || "";
            document.getElementById("editGender").value = currentRow.cells[3].innerText;
            let dateParts = currentRow.cells[4].innerText.split(".");
            document.getElementById("editBirthday").value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            document.getElementById("editStatus").value = currentRow.cells[5].innerText;
        });

        newRow.querySelector(".delete-btn").addEventListener("click", function () {
            const studentName = newRow.cells[2].textContent.trim();
            openDeleteModal(studentName);
        });
    });

    editStudentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        currentRow.cells[1].innerText = document.getElementById("editGroup").value;
        let fullName = document.getElementById("editName").value + " " + document.getElementById("editSurname").value;
        currentRow.cells[2].innerText = fullName.trim();
        currentRow.cells[3].innerText = document.getElementById("editGender").value;
        currentRow.cells[4].innerText = document.getElementById("editBirthday").value.split("-").reverse().join(".");
        currentRow.cells[5].innerText = document.getElementById("editStatus").value;
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

    function addNotification(avatarSrc, text) {
        const dropNotification = document.querySelector(".drop-notification");
        const newMessage = document.createElement("div");
        newMessage.className = "message";
        newMessage.innerHTML = `
            <img src="${avatarSrc}" alt="avatar" class="icon2">
            <span class="messageInfo">${text}</span>
        `;
        dropNotification.appendChild(newMessage);
    }
});