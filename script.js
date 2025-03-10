document.addEventListener("DOMContentLoaded", function () {
    const addModal = document.getElementById("addStudentModal");
    const editModal = document.getElementById("editStudentModal");
    
    const openAddModalBtn = document.querySelector(".plus");
    const closeAddModalBtn = addModal.querySelector(".close-btn");
    const closeEditModalBtn = editModal.querySelector(".close-btn");

    const addStudentForm = document.getElementById("addStudentForm");
    const editStudentForm = document.getElementById("editStudentForm");

    let currentRow = null; // Поточний студент для редагування

    // Відкриття вікна додавання
    openAddModalBtn.addEventListener("click", function () {
        addModal.style.display = "flex";
    });

    // Закриття вікон
    closeAddModalBtn.addEventListener("click", function () {
        addModal.style.display = "none";
    });

    closeEditModalBtn.addEventListener("click", function () {
        editModal.style.display = "none";
    });

    // Додавання студента
    addStudentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const group = document.getElementById("addGroup").value;
        const name = document.getElementById("addName").value;
        const gender = document.getElementById("addGender").value;
        const birthday = document.getElementById("addBirthday").value;
        const status = document.getElementById("addStatus").value || "—";

        const table = document.querySelector("tbody");
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${group}</td>
            <td>${name}</td>
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

        // Додаємо обробник для кнопок редагування
        newRow.querySelector(".edit-btn").addEventListener("click", function () {
            currentRow = newRow;
            editModal.style.display = "flex";

            document.getElementById("editGroup").value = group;
            document.getElementById("editName").value = name;
            document.getElementById("editGender").value = gender;
            document.getElementById("editBirthday").value = birthday;
            document.getElementById("editStatus").value = status;
        });

        // Видалення студента
        newRow.querySelector(".delete-btn").addEventListener("click", function () {
            table.removeChild(newRow);
        });
    });

    // Редагування студента
    editStudentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        currentRow.cells[1].innerText = document.getElementById("editGroup").value;
        currentRow.cells[2].innerText = document.getElementById("editName").value;
        currentRow.cells[3].innerText = document.getElementById("editGender").value;
        currentRow.cells[4].innerText = document.getElementById("editBirthday").value.split("-").reverse().join(".");
        currentRow.cells[5].innerText = document.getElementById("editStatus").value;

        editModal.style.display = "none";
    });
});
