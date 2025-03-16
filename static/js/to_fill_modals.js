const get_req ={  //get запросы к базе данных
    1:'Objects_ur_lica',
    2:'MA_Units',
    3:'_to_usage',
    4:'MA_Unit_type',
    5:'MA_module_type'}

const post_req = {

}

// Заполнение модульного окна устройства установленного на объекте
async function sostav_ma_unit(dataID) {
    const response = await fetch_data_get(dataID, get_req[1]);
    const data = await response.json()
    let addbtn = document.getElementById("btn_add_mod_sostav");
    let delbtn = document.getElementById("btn_del_mod_sostav");
    let savebtn = document.getElementById("btn_save_mod_sostav");
    let sockets_count = document.getElementById("sockets_count");
    addbtn.disabled = true;
    delbtn.disabled = true;
    savebtn.disabled = true;
    console.log("🚀 ~ sostav_ma_unit ~ data:", data)
    document.getElementById("cod_id").value = data[0]['cod_name'];
    document.getElementById("ip_id").value = data[0]['IP'];
    document.getElementById("ordan_id").value = data[0]['organization'];
    document.getElementById("address_id").value = data[0]['address'];
    //очистка таблиц в модульном окне
    const tbody_current = document.getElementById('curent_MA_unit_tbody_id');
    while (tbody_current.rows.length) {
        tbody_current.deleteRow(0);
    }
    const tbody_new = document.getElementById('new_MA_modules_tbody_id');
    while (tbody_new.rows.length) {
        tbody_new.deleteRow(0);
    }
    const tbody_mod = document.getElementById('curent_MA_modules_tbody_id');
    while (tbody_mod.rows.length) {
        tbody_mod.deleteRow(0);
    }
    //описание колонок таблиц
    const column_name_unit = ['type_equipment', 'inv_number', 'serial_number', 'MAC', 'note'];
    const column_name_modules = ['type', 'inv_number', 'serial_number', 'note'];
    if (Object.keys(data[1]).length > 0) {
        for (let key in data[1]) {
            let temp_list = [data[1][key]]
            create_tables(temp_list, 'curent_MA_unit_tbody_id', column_name_unit, 'MA_Units', true, 'tr', dataID)
            // если устройстово содержит доп модули

            if (data[2][key].length > 0) {
                create_tables(data[2][key], 'curent_MA_modules_tbody_id', column_name_modules, 'ma_add_modules', true, 'tr', dataID)
            }
            // добавления новых модулей устройства в базу данных
            check_tbodys()
            addbtn.onclick=  function () {
                add_new_row('new_MA_modules_tbody_id',4)
                console.log(data[3][tbody_new.rows.length]);
                add_ma_select_menu(tbody_new.rows[tbody_new.rows.length - 1], data[4][key])
                delbtn.disabled = false;
                savebtn.disabled = false;
                check_tbodys()
            }
            savebtn.onclick = function () {
                reset_tbodys('new_MA_modules_tbody_id', 'ma_add_modules',  data[1][key]['id'], dataID)
            };
            delbtn.onclick = function () {
                del_row('new_MA_modules_tbody_id')
                check_tbodys()
            };
            function check_tbodys (){
                sockets_count.textContent = tbody_mod.rows.length+'/'+data[3][key]['sockets']
                if (data[3][key]['sockets'] > tbody_new.rows.length + tbody_mod.rows.length) {
                    addbtn.disabled = false;
                }
                if (data[3][key]['sockets'] === tbody_new.rows.length + tbody_mod.rows.length) {
                    addbtn.disabled = true;
                }
                if (tbody_new.rows.length === 0) {
                    delbtn.disabled = true;
                    savebtn.disabled = true;
                }
            }
        }
    }
}

// функция заполнения таблицы с данными об устройстве/модуле
function create_tables(moduls, table_id, column_name, db_table, busy, tag, dataid) {
    const tbody_current = document.getElementById(table_id);
    moduls.forEach(item => {
        const tr = document.createElement('tr');
        for (let i = 0; i < column_name.length; i++) {
            const td = document.createElement('td');
            // ширина колонок в таблице
            let width = 100 / (column_name).length
            td.setAttribute('width', width + '%')
            // колонка с названием устройства не редактируемая
            i > 0 ? td.contentEditable = true : td.contentEditable = false;
            // запрос в бд на данные для инвентарного номера если он есть
            if (column_name[i] === 'inv_number' && item[column_name[i]] !== null && item[column_name[i]] !== '') {
                const a1 = document.createElement('a');
                a1.textContent = item[column_name[i]];
                a1.setAttribute('href', "");
                invent_popover(item[column_name[i]].toString(), a1, table_id);
                td.appendChild(a1);
            } else td.textContent = item[column_name[i]];
            tr.appendChild(td);
        }
        //добавление кнопок редактирования/перемещения/удаления в последнюю ячейку строки
        const td8 = document.createElement('td');
        const a1 = document.createElement('a');
        const a2 = document.createElement('a');
        const a3 = document.createElement('a');
        const i1 = document.createElement('i');
        const i2 = document.createElement('i');
        const i3 = document.createElement('i');
        const div = document.createElement('div');
        a1.appendChild(i1);
        a2.appendChild(i2);
        a3.appendChild(i3);
        div.appendChild(a1);
        div.appendChild(a3);
        div.appendChild(a2);
        td8.appendChild(div);
        tr.appendChild(td8);
        td8.setAttribute('style', "width:70px")
        tbody_current.appendChild(tr);
        let n_cells = tr.cells.length - 1
        div.setAttribute('class', 'd-grid gap-1 d-md-flex');
        a1.setAttribute('id', 'btn_edit_ma_mod_' + item['id']);
        a1.setAttribute('class', 'btn btn-primary btn-sm');
        a1.setAttribute('data-toggle', 'tooltip2');
        a1.setAttribute('data-placement', 'top');
        a1.setAttribute('title', 'Редактировать');
        a2.setAttribute('data-toggle', 'tooltip2');
        a2.setAttribute('data-placement', 'top');
        a3.setAttribute('data-toggle', 'tooltip2');
        a3.setAttribute('data-placement', 'top');
        a2.setAttribute('title', 'Удалить запись');
        a2.setAttribute('id', 'btn_del_ma_mod_' + item['id']);
        a2.setAttribute('class', 'btn btn-primary btn-sm');
        a3.setAttribute('id', 'btn_send_ma_mod_to_storage_' + item['id']);
        a3.setAttribute('class', 'btn btn-primary btn-sm');
        // определение функций для кнопок
        a1.onclick = function () {
            edit_row(db_table + '_edited', item['id'], table_id, this.closest("tr"), n_cells)
        };

        // busy = true устройство установленно на объекте либо модуль установлен в устройство
        if (busy) {
            a2.onclick = function () {
                delete_row(db_table, item['id'], table_id, this.closest(tag))
                setTimeout(function () {
                    sostav_ma_unit(dataid)
                }, 1000);

            };
            a3.setAttribute('title', 'Демонтировать устройство');
            a3.onclick = function () {
                send_to_storage(db_table + '_edited', item['id'], this.closest("tr"))
                setTimeout(function () {
                    sostav_ma_unit(dataid)
                }, 1000);
            }
        }
        //busy = false устройство либо модуль на складе/зипе/неисправно
        else {
            a2.onclick = function () {
                console.log(this.closest(tag))
                delete_row(db_table, item['id'], table_id, this.closest(tag))
            };
            a3.setAttribute('title', 'Отправить');
            a3.setAttribute('data-bs-toggle', "modal")  // вызов модального окна выбора куда
            a3.setAttribute('data-bs-target', "#select_usege_Modal") // переместить
            a3.setAttribute('data-id', item['id'])
            a3.setAttribute('data-db', db_table)
        }
        // иконки на кнопки
        i1.setAttribute('class', "bi bi-pencil-square h7");
        i2.setAttribute('class', "bi bi-trash3 h7");
        i3.setAttribute('class', "bi bi-box-arrow-up-right h10");

    })
    tooltip_func(table_id)
}

// редактировать запись в таблицах модульного окна
async function edit_row(db_table, id, tbody, row, cells) {
    console.log(row.cells.length)
    var edit_data = {id: id}
    var oCells = row.cells;
    for (let i = 0; i < cells; i++) {
        edit_data[i] = oCells[i].textContent;
    }
    console.log(edit_data)
    if (confirm("Сохранить изменнения?")) {
        const data = await fetch_data_post(edit_data, db_table, 1);
        console.log(data);
        if (data.ok) {
            liveToast(true, "Успешно сохранено")
        } else {
            liveToast(false, "Ошибка сохранения")
            console.error("Ошибка удаления: " + await data.json());
        }
    }
}

// перемещение устройства/модуля на склад
async function send_to_storage(db, id, row) {
    var edit_data = {id: id, parent_obj: 543}
    if (confirm("Отправить на склад?")) {
        const data = await fetch_data_post(edit_data, db, 1);
        console.log("🚀 ~ send_to_storage ~ data:", data)
        if (data.ok) {
            liveToast(true, 'Перемещено успешно')
            setTimeout(function () {
                row.remove()
            }, 500);
        } else {
            liveToast(false, "Ошибка перемещения")
            console.error('Ошибка перемещения устройства: ' + await data.json())
        }
    }
}

// удаление данных из дб
async function delete_row(db_table, id, tbody, row) {
    var id_val = {id: id}
    if (confirm("Удалить?")) {
        const data = await fetch_data_post(id_val, db_table, 2);
        console.log(data);
        if (data.ok) {
            liveToast(true, "Успешно удаленно")
            setTimeout(function () {
                row.remove()
            }, 300);
        } else {
            liveToast(false, "Ошибка удаления")
            console.error("Ошибка удаления: " + await data.json());
        }
    }
}


//  для устройств склад/зип/неисправные, если устройство содержит модули, создается подтаблица,
//  в которую помещается таблица с модулями
function create_tables2(table_id, column_name, unit_id) {
    const tbody_current = document.getElementById(table_id);
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute('colspan', '6')
    const tr_h = document.createElement('tr');
    const thead_n = document.createElement('thead');
    thead_n.appendChild(tr_h)
    const table_n = document.createElement('table');
    table_n.setAttribute('class', 'table mb-0 table-striped table-bordered table-sm')
    table_n.setAttribute('bgcolor', '#989ca2')// отделяем модули серым цветом
    const tbody_n = document.createElement('tbody');
    tbody_n.setAttribute('id', "tbody_unit_modules_" + unit_id);
    table_n.appendChild(thead_n);
    table_n.appendChild(tbody_n);
    td.appendChild(table_n);
    tr.appendChild(td);
    tbody_current.appendChild(tr);
}

// Создание таблицы с многопортовыми устройствами в модульном окне Starage
async function ma_unit_storage(table_id, stor_id, tbody_ma_id) {
    const table_current = document.getElementById(table_id); //  основная таблица
    while (table_current.rows.length > 1) {
        table_current.deleteRow(-1);
    }
    while (table_current.getElementsByTagName("tbody").length > 0) {
        table_current.removeChild(table_current.getElementsByTagName("tbody")[0]);
    }
    const response = await fetch_data_get(stor_id, get_req[1]);
    const stor_ma_unit = await response.json()
    console.table("🚀 ~ ma_unit_storage ~ stor_ma_unit:", stor_ma_unit)
    const column_name = ['type_equipment', 'inv_number', 'serial_number', 'MAC', 'note'];
    const column_name_mod = ['type', 'inv_number', 'serial_number', 'note'];
    //определяем кнопку добавить новые устройства/модули на склад
    document.getElementById('btn_to_add_new_ma_storage').onclick = function () {
        storage_reset_tbody(this.id, stor_id)
    }
    // если на складе/зипе/неиспавные есть устройства
    if (Object.keys(stor_ma_unit[1]).length > 0) {
        for (let key in stor_ma_unit[1]) {
            // для каждого устройства свое tbody
            const new_tbody = document.createElement('tbody');
            new_tbody.setAttribute('id', 'stored_ma_unit_tbody_' + key);
            new_tbody.setAttribute('class', "borderd_table");
            table_current.appendChild(new_tbody);
            const name_line = document.createElement('tr');
            new_tbody.appendChild(name_line)
            const td = document.createElement('td');
            td.setAttribute('colspan', '5')
            name_line.appendChild(td)
            td.innerHTML = "Устройство - " + stor_ma_unit[1][key]['id']  // именуем устройство
            const empty_line = document.createElement('tr');
            empty_line.setAttribute('height', "15")  // промежуток между устройствами
            table_current.appendChild(empty_line)
            // заполняем tbody
            create_tables([stor_ma_unit[1][key]], tbody_ma_id + key, column_name, 'MA_Units', false, 'tbody')
            // если устройство имеет установленные модули
            if (stor_ma_unit[2][key].length > 0) {
                // создаем подтаблицу
                create_tables2(tbody_ma_id + key, column_name, stor_ma_unit[1][key]['id'])
                // заполняем подтаблицу
                create_tables(stor_ma_unit[2][key], "tbody_unit_modules_" + stor_ma_unit[1][key]['id'], column_name_mod, 'ma_add_modules', true, 'tr')
            }
        }
    }
    // создаем tfoot, место для ручного добавления новых устройств
    const tfoot_for_new_ma_unit = document.createElement('tfoot');
    tfoot_for_new_ma_unit.setAttribute('id', 'new_MA_unit_tbody_storage_id')
    table_current.appendChild(tfoot_for_new_ma_unit);
}

// Создание таблицы с доп модулями для многопортовых устройств в модульном окне Starage
async function ma_add_module_storage(id) {
    const tbody_current = document.getElementById('current_MA_modules_tbody_storage_id');
    const tbody_new = document.getElementById('new_MA_modules_tbody_storage_id');
    while (tbody_new.rows.length) {
        tbody_new.deleteRow(0);
    }
    while (tbody_current.rows.length) {
        tbody_current.deleteRow(0);
    }
    const column_name = ['type', 'inv_number', 'serial_number', 'note'];
    const data = await fetch_data_get(id, get_req[2]);
    if (data.ok) {
        let stor_ma_modules = await data.json()
        if (stor_ma_modules[1].length > 0) {
            create_tables(stor_ma_modules[1], 'current_MA_modules_tbody_storage_id', column_name, 'ma_add_modules', false, 'tr')
        }
    }
}

// Заполнение модульного окна редактирования данных об Объекте, где расположено устройство
async function edit_ma_unit_modal(obj_id, row_index) {
    const response = await fetch_data_get(obj_id, get_req[1]);
    const data = await response.json()
    console.log("🚀 ~ edit_ma_unit_modal ~ data:", data)
    document.getElementById("id_for_edit").value = obj_id;
    document.getElementById('button_for_save_edit_row').setAttribute("class", "btn btn-primary");
    document.getElementById('button_for_delete_row').setAttribute("class", "btn btn-primary");
    console.log(document.getElementById("id_for_edit").value)
    document.getElementById("edit_cod_id").value = data[0].cod_name;
    document.getElementById("edit_org_id").value = data[0].organization;
    document.getElementById("edit_address_id").value = data[0].address;
    document.getElementById("edit_naklad_id").value = data[0].naklodnaja;
    document.getElementById("edit_ip_id").value = data[0].IP;
    document.getElementById("edit_inst_date_id").value = data[0].install_date;
    document.getElementById("edit_orsh_id").value = data[0].ORSH;
    document.getElementById("unit_note_id").value = data[0].note;
    document.getElementById('button_for_delete_row').onclick = function () {
        delete_row_from_edit_mod('Objects_ur_lica', obj_id, 'button_for_delete_row', 'tbody_main_table', row_index)
    };
    document.getElementById('button_for_save_edit_row').onclick = function () {
        save_edit_MA_table('tbody_main_table', row_index)
    };
}

// удаление объекта для многопортового устройства
async function delete_row_from_edit_mod(db_table, id, bt_id, tbody, row) {
    console.log(row.rowIndex)
    var id_val = {id: id}
    if (confirm("Удалить запись?")) {
        const data = await fetch_data_post(id_val,db_table, 2);
        console.log(data);
        if (data.ok) {
            liveToast(true, "Успешно удаленно")
            document.getElementById(tbody).deleteRow(row.rowIndex - 1);
            number_of_records_main_table();
            setTimeout(function () {
                document.getElementById('close_btn_id').click()
            }, 800);
        } else {
            liveToast(false, "Ошибка удаления")
            console.error("Ошибка удаления: " + await data.json());
        }
    }

}

// сохранения изменений в данных об объекте для ма устройств
async function save_edit_MA_table(tbody, row) {
    const edited_row = {
        id: document.getElementById("id_for_edit").value,
        cod_name: document.getElementById("edit_cod_id").value,
        organization: document.getElementById("edit_org_id").value,
        address: document.getElementById("edit_address_id").value,
        naklodnaja: document.getElementById("edit_naklad_id").value,
        IP: document.getElementById("edit_ip_id").value,
        install_date: document.getElementById("edit_inst_date_id").value,
        ORSH: document.getElementById("edit_orsh_id").value,
        note: document.getElementById("unit_note_id").value,
    }
    console.log(edited_row)
    if (confirm("Сохранить изменнения?")) {
        const data = await fetch_data_post(edited_row, 'Objects_ur_lica_edited', 1);
        console.log(data);
        if (data.ok) {
            liveToast(true, "Успешно сохранено")
            let oTable = document.getElementById(tbody);
            var oCells = oTable.rows.item(row.rowIndex - 1).cells;
            oCells[1].querySelector('a').innerHTML = document.getElementById("edit_cod_id").value;
            oCells[3].textContent = document.getElementById("edit_org_id").value;
            oCells[4].textContent = document.getElementById("edit_address_id").value;
            oCells[5].textContent = document.getElementById("edit_ip_id").value;
            oCells[7].textContent = document.getElementById("edit_naklad_id").value;
            oCells[9].textContent = document.getElementById("edit_orsh_id").value;
            oCells[8].textContent = document.getElementById("edit_inst_date_id").value;
            oCells[10].textContent = document.getElementById("unit_note_id").value;
        } else {
            liveToast(false, "Ошибка сохранения")
            console.error("Ошибка удаления: " + await data.json());
        }
    }
}

// Модульное окно перемещения устройства\модуля
async function select_usage_modal(id, db_table) {
    let confirmBtn = document.getElementById('btn_send_to_usage')
    confirmBtn.disabled = true;
    document.getElementById("btn_send_to_usage").setAttribute("class", "btn btn-primary");
    const select = document.getElementById('select_send_to_usage')
    while (select.length > 1) {select.remove(1)} // очистка select
    const response = await fetch_data_get(id, db_table + get_req[3])
    if (response.ok) {
        let data = await response.json()
        console.log(data)
        // заполняем список для выбора
        data.forEach(item => {
            const opt = document.createElement('option')
            opt.value = item.id
            opt.text = item.cod_name + ' (' + item.address + ')'
            select.add(opt)
        })
        // добавляем в выпадающий список пункты склад/зип/неисправны кроме активного
        let act_br = document.getElementsByClassName('breadcrumb-item')
        for (let i = 0; i < act_br.length; i++) {
            if (!act_br[i].classList.contains('active')) {
                const opt = document.createElement('option')
                opt.value = act_br[i].dataset.id
                opt.text = act_br[i].dataset.name
                select.add(opt)
            }
        }
        // слушаем изменения в списке выбора select
        let target_id, target_list
        select.addEventListener("change", function () {
            target_id = this.value
            // if (target_list.length>1){target_id = target_list[1]}// для устройства
            // else {target_id = target_list[0]} // для модуля
            target_id !== '0' ? confirmBtn.disabled = false : confirmBtn.disabled = true // вкл/выкл кнопки применить
        });
        // определяем кнопку применить
        confirmBtn.onclick = function () {
            send_to_usage(id, db_table, target_id)
        };
    }
}

// функция сохранения перемещения устройств
async function send_to_usage(id, db_table, parent_id) {
    var edit_data = {id: id, parent_obj: parent_id}
    if (confirm("Переместить устройство?")) {
        const response = await fetch_data_post(edit_data, db_table + '_edited', 1);
        if (response.ok) {
            liveToast(true, 'Изменения сохранены')
            setTimeout(function () {
                document.getElementById('btn_to_close_mod_send_to_usage').click()
            }, 700);
        } else {
            liveToast(false, "Ошибка сохранения")
            console.error('Ошибка перемещения устройства: ' + await response.json())
        }
    }
}

async function add_new_units(tbody, db_table, add_param) {
    var oTable = document.getElementById(tbody);
    var list_of_rows = oTable.getElementsByTagName('tr')
    if (confirm("Сохранить изменнения?")) {
        for (i = 0; i < list_of_rows.length; i++) {
            var new_unit = {add_p: add_param};
            // let empty_row = 0;
            var oCells = list_of_rows[i].getElementsByTagName('td');
            let sel = oCells[0].querySelector('select')
            new_unit[0] = sel.options[sel.selectedIndex].text
            // empty_row = empty_row + sel.options[sel.selectedIndex].value
            for (let j = 1; j < oCells.length; j++) {
                new_unit[j] = oCells[j].textContent;
                // empty_row = empty_row + new_unit[j].length
            }
            if (sel.options[sel.selectedIndex].value === '0' ) {
                liveToast(false, "Устройство не выбрано")
                list_of_rows[i].setAttribute('class', 'table-danger');
                continue;
            }
            console.log(new_unit);
            const response = await fetch_data_post(new_unit, db_table, 1);
            if (response.ok) {
                liveToast(true, "Успешно добавлен")
                list_of_rows[i].setAttribute('class', 'table-success')
                setTimeout(function () {
                    for (y = 0; y < list_of_rows.length; y++) {
                        if (list_of_rows[y].getAttribute('class') === 'table-success') {
                            list_of_rows[y].remove()
                        }
                    }
                }, 700);
            } else {
                liveToast(false, "Ошибка добавления")
                list_of_rows[i].setAttribute('class', 'table-danger');
                console.log(await response.json());
            }
        }
        return true;// херня кокая-то!!!!!!!!!!!зачем??
    }
}
async function add_new_obj(tbody, db_table) {
    var oTable = document.getElementById(tbody);
    var list_of_rows = oTable.getElementsByTagName('tr')
    if (confirm("Добавить объекты?")) {
        for (i = 0; i < list_of_rows.length; i++) {
            var new_obj = {};
            let empty_row = 0;
            var oCells = list_of_rows[i].getElementsByTagName('td');
            for (let j = 0; j < oCells.length; j++) {
                new_obj[j] = oCells[j].textContent;
                empty_row = empty_row + new_obj[j].length
            }
            if (empty_row === '0' ) {
                liveToast(false, "Строка пуста, введите данные")
                list_of_rows[i].setAttribute('class', 'table-danger');
                continue;
            }
            const response = await fetch_data_post(new_obj, db_table, 1);
            if (response.ok) {
                liveToast(true, "Успешно добавлен")
                list_of_rows[i].setAttribute('class', 'table-success')
                setTimeout(function () {
                    for (let y = 0; y < list_of_rows.length; y++) {
                        if (list_of_rows[y].getAttribute('class') === 'table-success') {
                            list_of_rows[y].remove()
                        }
                    }
                }, 700);
            } else {
                liveToast(false, "Ошибка добавления")
                list_of_rows[i].setAttribute('class', 'table-danger');
                console.log(await response.json());
            }
        }
    }
}
// добавление новых модулей к устройству, в окне состава оборудования
async function reset_tbodys(tbody, db_table, add_param, obj_id) {
    let r = await add_new_units(tbody, db_table, add_param)
    if (r) {
        setTimeout(function () {
            sostav_ma_unit(obj_id)
        }, 1000);
    }
}

// добавление новых модулей и устройств, в окне Склад
async function storage_reset_tbody(btn_id, stor_id) {
    const table_1 = document.getElementById('new_MA_unit_tbody_storage_id')
    const table_2 = document.getElementById('new_MA_modules_tbody_storage_id')
    if (table_1.rows.length > 0) {
        const r = await add_new_units('new_MA_unit_tbody_storage_id', 'MA_Unit', stor_id)
        if (r) {
            setTimeout(function () {
                ma_unit_storage('ma_unit_Modal_table', stor_id, 'stored_ma_unit_tbody_');
            }, 1000);
        }
    }
    if (table_2.rows.length > 0) {
        const r = await add_new_units('new_MA_modules_tbody_storage_id', 'ma_add_modules', stor_id)
        if (r) {
            setTimeout(function () {
                ma_add_module_storage(stor_id);
            }, 1000);
        }
    }
}
// Добавления строки для нового устройство на складе
async function add_MA_unit() {
    const tbody = document.getElementById('new_MA_unit_tbody_storage_id');
    let response = await fetch_data_get(0, get_req[4])
    let data
    if (response.ok) {
        data = await response.json()
        add_new_row('new_MA_unit_tbody_storage_id', 5)
        add_ma_select_menu(tbody.rows[tbody.rows.length - 1], data)
    }
}
async function add_MA_module() {
    const tbody = document.getElementById('new_MA_modules_tbody_storage_id');
    let response = await fetch_data_get(0, get_req[5])
    let data
    if (response.ok) {
        data = await response.json()
        add_new_row('new_MA_modules_tbody_storage_id', 4)
        add_ma_select_menu(tbody.rows[tbody.rows.length - 1], data)
    }
}
function add_ma_select_menu(row, data) {
    console.log(data)
    let sel = document.createElement('select')
    const opt1 = document.createElement('option')
    opt1.selected
    opt1.text = 'Устройство'
    opt1.value = '0'
    sel.add(opt1)
    Object.keys(data).forEach(elem => {
        const opt = document.createElement('option')
        opt.text = data[elem]['type']
        opt.value = data[elem]['id']
        sel.add(opt)
    })
    row.cells[0].appendChild(sel)
    row.cells[0].contentEditable=false
}