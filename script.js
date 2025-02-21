console.log("Скрипт успешно подключен с GitHub!");

// Глобальные переменные
window.records = [];
window.editingIndex = -1;

// Открытие формы расписания
window.openScheduleForm = function(existingData = "") {
    console.log("Открытие формы расписания");
    
    // Обработка существующих данных с проверкой на undefined или пустую строку
    window.records = (existingData && existingData !== "undefined") ? existingData.split('\n').map(line => {
        const [name, time, workTypes, status] = line.split(' | ');
        return { name, time, workTypes: workTypes.split(','), status };
    }) : [];

    if (window.records.length === 0) {
        console.log("Нет записей — сразу открываем форму создания новой записи");
        window.editingIndex = -1;
        $("#dialog-form").dialog("open");
    } else {
        console.log("Есть записи — показываем список записей");
        renderRecords();
        $("#recordsContainer").dialog({
            modal: true,
            width: 600,
            buttons: {
                "Добавить новую запись": function() {
                    window.editingIndex = -1;
                    $("#dialog-form").dialog("open");
                },
                "Сохранить все данные": function() {
                    google.script.run.saveScheduleData({ records: window.records });
                    google.script.host.close();
                },
                "Отмена": function() {
                    google.script.host.close();
                }
            }
        });
    }
};
