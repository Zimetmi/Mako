document.addEventListener('DOMContentLoaded', async function() {
    const inputFields = document.querySelectorAll('.data-input');

    // Функция для загрузки данных из Google Sheets с кешированием
    async function fetchDataWithCache(sheetName = 'Mako') { // Добавили параметр sheetName
        let cachedData = localStorage.getItem(`cachedData_${sheetName}`);
        let cachedTime = localStorage.getItem(`cachedTime_${sheetName}`);

        // Проверяем, есть ли данные в кеше и не устарели ли они
        if (cachedData && cachedTime) {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - parseInt(cachedTime);

            // Если данные в кеше не устарели (например, менее 7 минут), используем их
            if (timeDiff < 420000) { // 420000 миллисекунд = 7 минут
                return JSON.parse(cachedData);
            }
        }

        // Если данные в кеше устарели или их нет, обращаемся к API и обновляем кеш
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/128bnCwot_ifFV_B5e1Zxi4VrMLIzGyV4X9iBe7JMJMk/values/${sheetName}!A1:F120?key=AIzaSyCYgExuxs0Kme9-tWRCsz4gVD9yRjHY74g`);
        const data = await response.json();

        // Сохраняем полученные данные и текущее время в кеш
        localStorage.setItem(`cachedData_${sheetName}`, JSON.stringify(data));
        localStorage.setItem(`cachedTime_${sheetName}`, new Date().getTime().toString());

        return data;
    }

    // Функция для отображения данных на странице
    async function renderData(sheetName = 'Mako') { // Добавили параметр sheetName
        const data = await fetchDataWithCache(sheetName);
        const tableBody = document.querySelector('#dataTable tbody');

        if (tableBody) {
            // Очищаем таблицу перед добавлением новых данных
            tableBody.innerHTML = '';

            // Добавляем данные в таблицу
            data.values.forEach((row) => {
                const newRow = document.createElement('tr');
                row.forEach((cell) => {
                    const newCell = document.createElement('td');
                    newCell.textContent = cell;
                    newRow.appendChild(newCell);
                });
                tableBody.appendChild(newRow);
            });
        }

        // Заполнение значений из ячеек в редактируемые поля ввода
        inputFields.forEach(async (input) => {
            const column = input.getAttribute('data-column');
            const row = input.getAttribute('data-row');
            const cellValue = data.values[row - 1] ? data.values[row - 1][column.charCodeAt(0) - 65] : '';
            input.placeholder = cellValue;

            if (input.tagName === 'SELECT') {
                input.value = cellValue;
            }
        });
    }

    // Инициализация загрузки данных и установка интервала сохранения
    await renderData('Mako'); // Пример использования с листом по умолчанию

    // Устанавливаем обработчики событий для каждого поля ввода
    inputFields.forEach((input) => {
        input.addEventListener('input', async function() {
            const column = input.getAttribute('data-column');
            const row = input.getAttribute('data-row');
            await saveData(input.value, column, row, 'Mako'); // Пример использования
        });
    });
});

// Функция для сохранения данных
async function saveData(value, column, row, sheetName = 'Mako') { // Добавили параметр sheetName
    const url = 'https://script.google.com/macros/s/AKfycbyAXgt-Q1wikBmbkxVUJ-oqKlG4sIXcVMUt40M2GYx4y_s2b5fFvT0V0LaCXn1sSfPwBA/exec';
    const params = new URLSearchParams({
        column: column,
        row: row,
        value: value,
        sheet: sheetName // Передаем название листа
    });
    try {
        const response = await fetch(`${url}?${params.toString()}`, {
            method: 'GET'
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Проверка на существование элемента с классом .time перед попыткой доступа к его textContent
let timeElement = document.querySelector('.time');
if (timeElement) {
    let text = timeElement.textContent;
    console.log(text);
}

document.addEventListener('DOMContentLoaded', function() {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
});
