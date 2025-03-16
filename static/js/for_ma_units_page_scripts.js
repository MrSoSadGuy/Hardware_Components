// Функция подтягивает данные инвентарного номера при формировании таблиц в модальных окнах
async function invent_popover(param, attr, table_id){
    const fetch_response = await fetch_data_get(param.replaceAll('/','+'),'BuhUch');
    // const fetch_response = await fetch_data_get(param,'/get_data/BuhUch');
    let list_data = []
    if (!fetch_response.ok){list_data = ["Нет данных","Нет данных","Нет данных"]}
    else {
        let data = await fetch_response.json()
        list_data = [data['MOL'],data['name'],data['charracter']]
    }
    attr.setAttribute('data-bs-toggle',"popover-bg");
    attr.setAttribute('tabindex',"0");
    attr.setAttribute('data-bs-trigger',"hover");
    attr.setAttribute('title',`МОЛ: ${list_data[0]}`);
    attr.setAttribute('data-bs-content', `Наименование: ${list_data[1]} \r\n Характеристика: ${list_data[2]}`);
    popover_func(table_id)
}

// Функция выбирает все отображенные строки в главной таблице
function check_all_visible_main_table(status){
    let table = document.getElementById('tbody_main_table');
    let tr = table.getElementsByTagName('tr');
    for(var i = 0; i < tr.length; i++){
        var style = tr[i].getAttribute("style");
        if(style == null){
            var check = tr[i].querySelector('.form-check-input');
            check.checked = status
        }
    }
}
// Функция отображает\скрывает не выбранные строки в главной таблице
function show_checked_main_table(status){
    let table = document.getElementById('tbody_main_table');
    let tr = table.getElementsByTagName('tr');
    for(var i = 0; i < tr.length; i++){
        tds = tr[i].getElementsByTagName('td');
        if(tds[0].querySelector('.form-check-input').checked===false){
            status ? tr[i].style.display = "none": tr[i].removeAttribute("style");
        }
    }
    number_of_records_main_table();
}
// Функция устанавливает\убирает цветовое обозначение выбранных строк в главной таблице
function set_custom_bg_color_main_table(db_table, status, color){
    let table = document.getElementById('tbody_main_table');
    let tr = table.getElementsByTagName('tr');
    for(var i = 0; i < tr.length; i++){
        tds = tr[i].getElementsByTagName('td');
        if(tds[0].querySelector('.form-check-input').checked===true){
            if (status) {tr[i].setAttribute('bgcolor',color)
                save_color_in_db(db_table, tds[0].dataset.id, color)
            }
            else {tr[i].removeAttribute("bgcolor");
                save_color_in_db(db_table, tds[0].dataset.id, '')
            }
            tds[0].querySelector('.form-check-input').checked=false;            
        }
    }
}

// Считаем отображенные строки в главной таблице
function number_of_records_main_table(){
    let number_of_records = 0;
    let table = document.getElementById('tbody_main_table');
    let tr = table.getElementsByTagName('tr');
    for(var i = 0; i < tr.length; i++){
        var style = tr[i].getAttribute("style");
        if(style == null){
            number_of_records++;
        }
    }
    document.getElementById('number_of_records').innerHTML= 'Записей отображено: ' + number_of_records;
}
// меню Склад/ЗИП/Неисправные
function breadcrumbs(ev,tb_n,id){
    let act_br = document.getElementsByClassName('breadcrumb-item active') 
    act_br[0].innerHTML='<a href="#">'+act_br[0].textContent+'</a>'
    act_br[0].classList.remove('active')
    ev.currentTarget.className += " active";
    ev.currentTarget.innerHTML = ev.currentTarget.textContent
    localStorage.setItem('stor_brd_n', tb_n)
    localStorage.setItem('stor_brd_id', id)
    ma_unit_storage('ma_unit_Modal_table', id,'stored_ma_unit_tbody_');
    ma_add_module_storage(id);
}
//  Функция заполнения модального окна для отображения скрытия колонок в таблице многопртовиков
function hide_colums_modal(){
    let data = localStorage.getItem('hide-column').split(',')
    let form = document.getElementById('hide_column_form')
    let check = form.getElementsByTagName('input')
    for (let i = 0; i < check.length; i++) {
        data[parseInt(check[i].dataset.id)]==='true'? check[i].checked = true: check[i].checked = false
    }
    document.getElementById('button_hide_columns').addEventListener('click',()=>{
        new_data =[]
        for (let k = 0; k < check.length; k++) {
            new_data[parseInt(check[k].dataset.id)] = check[k].checked     
        }
        // Сохраняем локально данные о скратых\отабражаемых колонках
        localStorage.setItem('hide-column',new_data)
        hide_colums()
    })
}
// Функция берет данные из localStorage о скрытых\отображаемых колонках, применяет их
function hide_colums() {
    let data = localStorage.getItem('hide-column').split(',')
    for (let i = 1; i < data.length; i++) {
        let tds = document.querySelectorAll('.hide-column'+i)
        for (let q = 0; q < tds.length; q++) {
        data[i]==='true' ? tds[q].style.display = '': tds[q].style.display = 'none'
            }
    }
}