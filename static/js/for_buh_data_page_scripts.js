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
                save_color_in_db('BuhUch',tds[1].querySelector('a').dataset.id, color)
            }
            else {tbodies[i].removeAttribute("bgcolor");
                save_color_in_db('BuhUch',tds[1].querySelector('a').dataset.id, '')
            }
            tds[0].querySelector('.form-check-input').checked=false;            
        }
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

function hide_table_rows(mol_name){
    console.log("🚀 ~ hide_table_rows ~ mol_name:", mol_name)
    var table = document.getElementById('buh_data_tbody');    
    var tbodies = table.getElementsByTagName('table');
    for(var i = 0; i < tbodies.length; i++){
        tds = tbodies[i].getElementsByTagName('td');        
        if (tds[3].textContent.indexOf(mol_name.trim()) === -1) {
            document.getElementById('inv_number_id_'+ tds[1].querySelector('a').dataset.id).remove()
            i--;
            number_of_records()
            }
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

function del_new_table(td_id) {
    let list_of_tables = document.getElementById(td_id).getElementsByTagName('table');
    console.log("🚀 ~ del_new_table ~ list_of_tables:", list_of_tables)
    var last = list_of_tables[list_of_tables.length - 1];
    last.parentNode.removeChild(last);
    }