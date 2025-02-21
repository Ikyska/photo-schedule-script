console.log("Скрипт успешно загружен с GitHub!");

// Пример вызова Google Apps Script через API
function saveRecord() {
    const record = {
        name: $('#name').val(),
        time: $('#time').val(),
        workTypes: $('input[type=checkbox]:checked').map((_, el) => el.value).get(),
        status: $('input[name="status"]:checked').val()
    };

    console.log("Сохранение записи через API:", record);

    // Вызов Google Apps Script
    google.script.run
        .withSuccessHandler(() => {
            console.log("Данные успешно сохранены в Google Sheets");
            google.script.host.close();
        })
        .withFailureHandler((error) => {
            console.error("Ошибка при сохранении данных:", error);
        })
        .saveScheduleData({ records: [record] });
}
