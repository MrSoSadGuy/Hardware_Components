function downloadFile(file) {
    let name = document.getElementById('PON_id').value;
    let url = '/download/'+ file +'/'+name;
    console.log(url)
    var link = document.createElement("a");
    link.setAttribute('download', file + name);
    link.href=url;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function reload_page() {
    // var serch_data = document.getElementById("myInput").value
    // localStorage.setItem("serch",JSON.stringify(serch_data));
    location.reload();
}

function add_new_row(table_id, cells){
    var table = document.getElementById(table_id);
    var row = table.insertRow();
    for (let i = 0; i < cells; i++ ){
        row.insertCell(i).contentEditable = true;
    }
}
function add_new_table(td_id, user_name){
    console.log("🚀 ~ add_new_table ~ user_name:", user_name)
    console.log("🚀 ~ add_new_table ~ td_id:", td_id)
    var td = document.getElementById(td_id);
    console.log("🚀 ~ add_new_table ~ td:", td)
    const new_table = document.createElement('table');
    const new_tbody = document.createElement('tbody');
    new_table.setAttribute('class',"table table-sm table-bordered table-hover borderd_table");
    
    new_table.appendChild(new_tbody);
    const first_line = document.createElement('tr');
    new_tbody.appendChild(first_line)
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    td1.setAttribute('contenteditable','true')
    td1.setAttribute('width','18%')
    td2.setAttribute('contenteditable','true')
    td3.setAttribute('width','18%')
    td3.textContent = user_name.replaceAll('\"','')
    first_line.appendChild(td1)
    first_line.appendChild(td2)
    first_line.appendChild(td3)
    const second_line = document.createElement('tr');
    new_tbody.appendChild(second_line)
    const td4 = document.createElement('td');
    td4.setAttribute('contenteditable','true')
    td4.setAttribute('colspan', '3')
    second_line.appendChild(td4)
    console.log("🚀 ~ add_new_table ~ new_table:", new_table)
    td.appendChild(new_table);
}
function del_row(tbody_id) {
    document.getElementById(tbody_id).deleteRow(-1);
    }

function del_new_table(td_id) {
    let list_of_tables = document.getElementById(td_id).getElementsByTagName('table');
    console.log("🚀 ~ del_new_table ~ list_of_tables:", list_of_tables)
    var last = list_of_tables[list_of_tables.length - 1];
    last.parentNode.removeChild(last);
    }

async function save_main_table_in_file(){
    var oTable = document.getElementById('tbody_main_table');
    console.log($('tr:visible').length)
    var rowLength = oTable.rows.length;
    var list_data = []
    for (i = 0; i < rowLength; i++){
        var style = oTable.rows.item(i).getAttribute("style")
        if(style == null){
        var oCells = oTable.rows.item(i).cells;
        list_data.push(oCells[0].textContent)
    }}
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

async function save_buh_data_table_in_file(){
    let table = document.getElementById('buh_data_tbody');
    let tbodies = table.getElementsByTagName('table');
    var list_data = []
    for(var i = 0; i < tbodies.length; i++){
        var style = tbodies[i].getAttribute("style");
        if(style == null){
            list_data.push(tbodies[i].id.replace('inv_number_id_',''))
        }
    }
    console.log("🚀 ~ save_buh_data_table_in_file ~ list_data:", list_data)
    const data = await fetch_data(list_data, "/buh_table_data", "POST")
    console.log("🚀 ~ save_main_table_in_file ~ data:", data)
    if (data === "SUCCESS"){
        const link = document.createElement('a');
        link.href = '/download/buh_table';
        document.body.appendChild(link);
        link.click();
        link.remove();}
    else {alert("ERROR");}
    }

// Поиск по таблице
function myFunction() {
    var rb1 = document.getElementById("inlineRadio1").checked
    var rb2 = document.getElementById("inlineRadio2").checked
    var input, filter, table, tr;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    const list_of_words= filter.split(" ")
    table = document.getElementById("tbody_main_table");
    tr = table.getElementsByTagName("tr");
    var number_of_records = 0;
    for (var i = 0; i < tr.length; i++) {
        var tds = tr[i].getElementsByTagName("td");        
        // поиск И
        if (rb1){
            var flag = [];
            list_of_words.forEach(word =>{
                for(var j = 0; j < tds.length; j++){
                var td = tds[j];
                if (td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
                flag.push(true);
                return;
                }
            }})
            if(flag.length >= list_of_words.length){tr[i].removeAttribute("style");
                number_of_records++;
            }
            else {tr[i].style.display = "none";}}
        // поиск ИЛИ
        if (rb2){
            var flag = false;
            list_of_words.forEach(word =>{
                for(var j = 0; j < tds.length; j++){
                    var td = tds[j];
                    if (td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
                    flag = true;
                    return;
                    }
                }})
            if(flag){tr[i].removeAttribute("style");
                number_of_records++;
            }           
            else {tr[i].style.display = "none";}
        }        
        document.getElementById('number_of_records').innerHTML= 'Записей отображено: ' + number_of_records ;
    }    
}

function number_of_records(){
    let table = document.getElementById('buh_data_tbody');
    let tbodies = table.getElementsByTagName('table');
    let number_of_records = 0;
    for(var i = 0; i < tbodies.length; i++){
        var style = tbodies[i].getAttribute("style");
        if(style == null){
            number_of_records++;
        }
    }
    document.getElementById('number_of_records').innerHTML= 'Записей отображено: ' + number_of_records;
}

function buh_data_table_serch(){
    document.getElementById('flexSwitchCheckChecked').checked = false;
    var input, filter, table, tbodies, td;    
    input = document.getElementById("Input_for_buh_data_serch");    
    filter = input.value.toUpperCase();    
    const list_of_words= filter.split(" ")
    table = document.getElementById('buh_data_tbody');    
    tbodies = table.getElementsByTagName('table');
    for(var i = 0; i < tbodies.length; i++){
        tds = tbodies[i].getElementsByTagName('td');
        if (tds[0].querySelector('.form-check-input').checked) {
            console.log(tds[1])
            continue;}
        var flag = false;
        for(var j = 0; j < list_of_words.length; j++){
            var td = tds[1] 
            var word = list_of_words[j];
            if(td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
                flag =true;
                continue;
            } 
        }
        if(flag){tbodies[i].removeAttribute("style");}
        else {tbodies[i].style.display = "none";
        }
        number_of_records() ;
    }    
}
function check_all_visible(status){
    let table = document.getElementById('buh_data_tbody');
    let tbodies = table.getElementsByTagName('table');
    for(var i = 0; i < tbodies.length; i++){
        var style = tbodies[i].getAttribute("style");
        if(style == null){
            var check = tbodies[i].querySelector('.form-check-input');
            check.checked = status
        }
    }
}
function show_checked(status){
    let table = document.getElementById('buh_data_tbody');
    let tbodies = table.getElementsByTagName('table');
    for(var i = 0; i < tbodies.length; i++){
        tds = tbodies[i].getElementsByTagName('td');
        if(tds[0].querySelector('.form-check-input').checked===false){
            if (status)tbodies[i].style.display = "none";
            else tbodies[i].removeAttribute("style");           
        }
    }
    number_of_records();
}
function set_custom_bg_color(status, color){
    let table = document.getElementById('buh_data_tbody');
    let tbodies = table.getElementsByTagName('table');
    for(var i = 0; i < tbodies.length; i++){
        tds = tbodies[i].getElementsByTagName('td');
        if(tds[0].querySelector('.form-check-input').checked===true){
            if (status) {tbodies[i].setAttribute('bgcolor',color)
                save_color_in_db(tds[1].querySelector('a').dataset.id, color)
            }
            else {tbodies[i].removeAttribute("bgcolor");
                save_color_in_db(tds[1].querySelector('a').dataset.id, '')
            }            
        }
    }
}
async function save_color_in_db(id, color){
    const data = {id: id, color: color}
    const fetch_color = await fetch_data(data, "change_color/BuhUch",'POST')
}

//копирование в таблицу из Excel 
function paste_to_cells_like_excel(tbody_id, data, start_r, start_c,  cells_in_row){
    let value = data.split(/\r\n|\n|\r/);
    if (value[value.length-1] === ""){value.pop()}
    let start_row = start_r;
    let start_cell = start_c
    let oTable = document.getElementById(tbody_id);
    let rowLength = oTable.rows.length;
    for (let j = 0; j < value.length; j++) {
        var oCells = oTable.rows.item(start_row).cells;
        var words = value[j].split(/\t/);
        for (let k = 0; k < words.length; k++) {
            if (k === oCells.length - start_c){
                start_cell = start_c;
                break;}
            oCells[start_cell].innerHTML = words[k];
            start_cell++;
        }
        start_cell=start_c;
        start_row++;
        if (rowLength <= start_row){
            add_new_row(tbody_id,cells_in_row);
            rowLength++;
        }
    }
}
