console.log("Скрипт успешно подключен с GitHub!");

// Открытие модального окна
window.openScheduleForm = function() {
    console.log("Открытие формы расписания");

    // Открытие диалогового окна через jQuery UI
    $("#dialog-form").dialog({
        autoOpen: true,
        modal: true,
        width: 500,
        buttons: {
            "Сохранить": function() {
                window.saveRecord();
            },
            "Отмена": function() {
                $(this).dialog("close");
            }
        }
    });
};

// Сохранение данных из формы
window.saveRecord = function() {
    const record = {
        name: $('#name').val(),
        time: $('#time').val(),
        workTypes: $('input[type=checkbox]:checked').map((_, el) => el.value).get(),
        status: $('input[name="status"]:checked').val()
    };
    console.log("Сохранение записи:", record);

    // Передача данных в Google Apps Script
    google.script.run.saveScheduleData({ records: [record] });

    // Закрытие диалогового окна
    $("#dialog-form").dialog("close");
};

// Проверка работы функций через консоль
console.log("Доступные функции:", {
    openScheduleForm: window.openScheduleForm,
    saveRecord: window.saveRecord
});

// Отображение списка записей
function renderRecords() {
    const container = $('#recordsContainer');
    container.empty();

    window.records.forEach((record, index) => {
        container.append(`
            <div class="record-card">
                <strong>Имя:</strong> ${record.name}<br>
                <strong>Время:</strong> ${record.time}<br>
                <strong>Тип работы:</strong> ${record.workTypes.join(', ')}<br>
                <strong>Статус:</strong> ${record.status}<br>
                <button onclick="window.editRecord(${index})">✏️ Редактировать</button>
                <button onclick="window.deleteRecord(${index})">❌ Удалить</button>
            </div>
        `);
    });
}

// Открытие формы для редактирования
window.editRecord = function(index) {
    const record = window.records[index];
    window.editingIndex = index;

    $('#name').val(record.name);
    $('#time').val(record.time);
    $('input[type=checkbox]').each(function() {
        $(this).prop('checked', record.workTypes.includes($(this).val()));
    });
    $('input[name="status"][value="'+record.status+'"]').prop('checked', true);

    console.log("Редактирование записи:", record);
    $("#dialog-form").dialog("open");
};

// Удаление записи
window.deleteRecord = function(index) {
    console.log("Удаление записи с индексом:", index);
    window.records.splice(index, 1);
    renderRecords();
};

// Сохранение новой или отредактированной записи
window.saveRecord = function() {
    const record = {
        name: $('#name').val(),
        time: $('#time').val(),
        workTypes: $('input[type=checkbox]:checked').map((_, el) => el.value).get(),
        status: $('input[name="status"]:checked').val()
    };

    if (window.editingIndex > -1) {
        console.log("Обновление записи:", record);
        window.records[window.editingIndex] = record;
    } else {
        console.log("Добавление новой записи:", record);
        window.records.push(record);
    }

    $('#dialog-form').dialog("close");

    if (window.records.length > 0) {
        renderRecords();
    } else {
        google.script.run.saveScheduleData({ records: window.records });
        google.script.host.close();
    }
};
