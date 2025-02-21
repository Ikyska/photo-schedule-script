console.log("Скрипт успешно подключен с GitHub!");

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
