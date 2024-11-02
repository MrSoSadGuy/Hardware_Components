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

async function save_main_table_in_file(){
    var oTable = document.getElementById('tbody_main_table');
    console.log($('tr:visible').length)
    var trs = oTable.getElementsByTagName('tr');
    var list_data = []
    for (i = 0; i < trs.length; i++){
        if(trs[i].getAttribute("style") == null){
        list_data.push(trs[i].querySelector('td').dataset.id)
    }}
    console.log("🚀 ~ save_main_table_in_file ~ list_data:", list_data)
    const data = await fetch_data(list_data, "/main_table_data", "POST")
    console.log("🚀 ~ save_main_table_in_file ~ data:", data)
    if (data === "SUCCESS"){
        const link = document.createElement('a');
        link.href = '/download/main_table';
        document.body.appendChild(link);
        link.click();
        link.remove();}
    else {alert("ERROR");}
    }