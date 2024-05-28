document.addEventListener('DOMContentLoaded', async function() {
    const SHEET_ID = '128bnCwot_ifFV_B5e1Zxi4VrMLIzGyV4X9iBe7JMJMk';
    const API_KEY = 'AIzaSyCYgExuxs0Kme9-tWRCsz4gVD9yRjHY74g';
    const RANGE = 'A1:F11';
    const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    // Функция для загрузки данных из Google Sheets с кешированием
    async function fetchDataWithCache() {
        let cachedData = localStorage.getItem('cachedData');
        let cachedTime = localStorage.getItem('cachedTime');

        // Проверяем, есть ли данные в кеше и не устарели ли они
        if (cachedData && cachedTime) {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - parseInt(cachedTime);

            // Если данные в кеше не устарели (например, менее 15 минут), используем их
            if (timeDiff < 900000) { // 900000 миллисекунд = 15 минут
                return JSON.parse(cachedData);
            }
        }

        // Если данные в кеше устарели или их нет, обращаемся к API и обновляем кеш
        const response = await fetch(API_URL);
        const data = await response.json();

        // Сохраняем полученные данные и текущее время в кеш
        localStorage.setItem('cachedData', JSON.stringify(data));
        localStorage.setItem('cachedTime', new Date().getTime().toString());

        return data;
    }

    // Функция для отображения данных на странице
    async function renderData() {
        const data = await fetchDataWithCache();
        const tableBody = document.querySelector('#dataTable tbody');

        if (tableBody && data.values) {
            // Очищаем таблицу перед добавлением новых данных
            tableBody.innerHTML = '';

            // Добавляем данные в таблицу
            data.values.forEach((row, rowIndex) => {
                const newRow = document.createElement('tr');

                row.forEach((cell, colIndex) => {
                    const newCell = document.createElement(rowIndex === 0 || colIndex === 0 ? 'th' : 'td');
                    newCell.textContent = cell;
                    newRow.appendChild(newCell);
                });

                tableBody.appendChild(newRow);
            });
        }
    }

    // Инициализация загрузки данных и отображение таблицы
    await renderData();
});