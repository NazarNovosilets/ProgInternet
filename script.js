document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("studentModal");
    const openModalBtn = document.querySelector(".plus");
    const closeModalBtn = document.querySelector(".close-btn");
    const studentForm = document.getElementById("studentForm");

    openModalBtn.addEventListener("click", function () {
        modal.style.display = "flex";
    });

    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    studentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const group = document.getElementById("group").value;
        const name = document.getElementById("name").value;
        const gender = document.getElementById("gender").value;
        const birthday = document.getElementById("birthday").value;
        const status = document.getElementById("status").value || "—";

        const table = document.querySelector("tbody");
        const newRow = document.createElement("tr");
        newRow.classList.add("studentsInfo");
        newRow.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${group}</td>
            <td>${name}</td>
            <td>${gender}</td>
            <td>${birthday.split("-").reverse().join(".")}</td> <!-- Формат дати: DD.MM.YYYY -->
            <td>${status}</td>
            <td>
                <img src="pen.png" alt="Редагувати" class="optionIcons">
                <img src="close.png" alt="Видалити" class="optionIcons">
            </td>
        `;

        table.appendChild(newRow);

        studentForm.reset();
        modal.style.display = "none";
    });
});
