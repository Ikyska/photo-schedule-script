console.log("Скрипт успешно загружен с GitHub!");

// Глобальные переменные
window.records = [];
window.editingIndex = -1;

// Открытие формы расписания
window.openScheduleForm = function(existingData = "") {
    console.log("Открытие формы расписания. Полученные данные:", existingData);
    
    // Обработка существующих данных
    window.records = (existingData && existingData !== "undefined" && existingData.trim() !== "") 
        ? existingData.split('\n').map(line => {
            const [name, time, workTypes, status] = line.split(' | ');
            return { name, time, workTypes: workTypes.split(','), status };
        }) 
        : [];

    if (window.records.length === 0) {
        console.log("Нет записей — создаём пустую запись автоматически");
        window.addNewRecord();
    } else {
        console.log("Есть записи — показываем список записей");
        renderRecords();
        $("#recordsContainer").dialog({
            modal: true,
            width: 600,
            buttons: {
                "Добавить новую запись": function() {
                    window.addNewRecord();
                },
                "Сохранить все данные": function() {
                    console.log("Сохранение всех записей через google.script.run");
                    google.script.run
                        .withSuccessHandler(() => {
                            console.log("Данные успешно сохранены в Google Sheets");
                            google.script.host.close();
                        })
                        .withFailureHandler((error) => {
                            console.error("Ошибка при сохранении данных:", error);
                        })
                        .saveScheduleData({ records: window.records });
                },
                "Отмена": function() {
                    google.script.host.close();
                }
            }
        });
    }
};

// Автоматическое добавление новой пустой записи
window.addNewRecord = function() {
    console.log("Автоматическое добавление новой пустой записи");
    window.editingIndex = window.records.length;
    window.records.push({ name: "", time: "10:00", workTypes: [], status: "Принят" });

    // Открытие формы для редактирования новой записи
    $('#name').val('');
    $('#time').val('10:00');
    $('input[type=checkbox]').prop('checked', false);
    $('input[name="status"][value="Принят"]').prop('checked', true);

    $("#dialog-form").dialog("open");
};

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
