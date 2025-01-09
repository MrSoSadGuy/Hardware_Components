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

function show_checked_main_table(status){
    let table = document.getElementById('tbody_main_table');
    let tr = table.getElementsByTagName('tr');
    for(var i = 0; i < tr.length; i++){
        tds = tr[i].getElementsByTagName('td');
        if(tds[0].querySelector('.form-check-input').checked===false){
            if (status)tr[i].style.display = "none";
            else tr[i].removeAttribute("style");           
        }
    }
    number_of_records_main_table();
}

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

function breadcrumbs(ev,id){
    let act_br = document.getElementsByClassName('breadcrumb-item active') 
    act_br[0].innerHTML='<a href="#">'+act_br[0].textContent+'</a>'
    act_br[0].classList.remove('active')
    ev.currentTarget.className += " active";
    ev.currentTarget.innerHTML = ev.currentTarget.textContent
    ma_unit_storage('ma_unit_Modal_table', id,'stored_ma_unit_tbody_');
    ma_add_module_storage(id);
}
    
