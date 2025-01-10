async function fetch_data(data, route_str, method) {
    var formdata = new FormData();
    formdata.append("json", JSON.stringify(data));
    console.log("🚀 ~ fetch_data ~ route:", route_str)
    try {
        const response = await fetch(route_str,
        {
            method: method,
            body: formdata
        })
        return await response.json();
        } catch (error){console.log("🚀 ~ fetch_data ~ error:", error);
        return "error"}
}
async function fetch_data_2(data, route_str, method) {
    var formdata = new FormData();
    formdata.append("json", JSON.stringify(data));
    console.log("🚀 ~ fetch_data ~ route:", route_str)
    try {
        const response = await fetch(route_str,
        {
            method: method,
            body: formdata
        })
        return await response;
        } catch (error){console.error("🚀 ~ fetch_data ~ error:", error);
        return "Error is:"+ error
        }
}

async function change_password(){     
    var old_pass = document.getElementById("old_pass_id").value;
    var new_pass = document.getElementById("new_pass_id").value;
    var new_pass_2 = document.getElementById("new_pass_2_id").value;
    console.log(old_pass, new_pass, new_pass_2)
    let new_data_pass = { old_pass: old_pass , new_pass: new_pass, new_pass_2: new_pass_2};
    const data = new FormData();
    data.append("json", JSON.stringify(new_data_pass));
    if ((new_pass === new_pass_2) && (new_pass.length > 5)){
        const data = await fetch_data(new_data_pass,'/change_password','POST');
        if (data === "SUCCESS"){
            document.getElementById("raport_chang_pass").setAttribute("style", "color:green")
            document.getElementById("raport_chang_pass").textContent = "Пароль изменен успешно";
        }
        else {
            document.getElementById("raport_chang_pass").setAttribute("style", "color:red")
            document.getElementById("raport_chang_pass").textContent = data;
        }
    }
    else {
        console.log("Новый пароль задан не верно");
        document.getElementById("raport_chang_pass").setAttribute("style", "color:red")
        document.getElementById("raport_chang_pass").textContent = "Новый пароль задан не верно"}
}

async function delete_row(db_table, id, bt_id, tbody, row)  {
    console.log(row.rowIndex)
    var id_val = {id: id}
    console.log("🚀 ~ delete_row ~ id:", id)
    if (confirm("Удалить запись?")){
        const data = await fetch_data(id_val, '/delete_row/'+db_table,'POST');
        console.log(data);
        if(data==="SUCCESS"){
            document.getElementById(bt_id).setAttribute("class", "btn btn-success btn-sm");
            setTimeout(function (){row.remove()}, 500);      
        }
        else {
            document.getElementById(bt_id).setAttribute("class", "btn btn-danger btn-sm");
            alert(data);
    }}
}
async function delete_row_from_edit_mod(db_table, id, bt_id, tbody, row)  {
    console.log(row.rowIndex)
    var id_val = {id: id}
    console.log("🚀 ~ delete_row_from_edit_mod ~ id:", id)
    if (confirm("Удалить запись?")){
        const data = await fetch_data(id_val,'/delete_row/'+db_table, 'POST');
        console.log(data);
        if(data==="SUCCESS"){
            document.getElementById(bt_id).setAttribute("class", "btn btn-success");
            document.getElementById(tbody).deleteRow(row.rowIndex-1);
            number_of_records_main_table();
            setTimeout(function (){document.getElementById('close_btn_id').click()}, 800);      
        }
        else {
            document.getElementById(bt_id).setAttribute("class", "btn btn-danger");
            alert(data);
    }}
}
async function delete_table(db_table, id, bt_id)  {
    var id_val = {id: id}
    console.log("🚀 ~ delete_table ~ id:", id)
    if (confirm("Удалить данные?")){
        const data = await fetch_data(id_val,'/delete_row/'+db_table, 'POST');
        console.log(data);
        if(data==="SUCCESS"){
            document.getElementById(bt_id).setAttribute("class", "btn btn-success");
            setTimeout(function (){document.getElementById('inv_number_id_'+ id).remove()}, 500);
            number_of_records();
            setTimeout(function (){document.getElementById('close_btn_id').click()}, 800);      
        }
        else {
            document.getElementById(bt_id).setAttribute("class", "btn btn-danger");
            alert(data);
    }}
}
async function delete_table_list(db_table, id)  {
    var id_val = {id: id}
    console.log("🚀 ~ delete_table ~ id:", id)
    const data = await fetch_data(id_val,'/delete_row/'+db_table, 'POST');
    console.log(data);
    if(data==="SUCCESS"){
        setTimeout(function (){document.getElementById('inv_number_id_'+ id).remove()
            number_of_records();
        }, 500);
        
    }
    else {
        alert(data);
    }
}
async function delete_row_list(db_table, id, row)  {
    var id_val = {id: id}
    console.log("🚀 ~ delete_row_list ~ id:", id)
    const data = await fetch_data(id_val,'/delete_row/'+db_table, 'POST');
    console.log(data);
    if(data==="SUCCESS"){
        setTimeout(function (){row.remove()
            number_of_records_main_table();
        }, 500);        
    }
    else {
        row.setAttribute('bgcolor', '#E51515')
        alert(data);
    }
}


async function edit_row(db_table, id, bt_id, tbody, row, cells)  {
    console.log(row.cells.length)
    var edit_data = {id: id}
    var oCells = row.cells;
    for (let i = 0; i < cells; i++) {
        edit_data[i] = oCells[i].textContent;
    }
    console.log(edit_data)
    if (confirm("Сохранить изменнения?")){
        const data = await fetch_data(edit_data,'/save_data/'+db_table, 'POST');
        console.log(data);
        if(data==="SUCCESS"){
            document.getElementById(bt_id).setAttribute("class", "btn btn-success btn-sm");
            
        }
        else {
            document.getElementById(bt_id).setAttribute("class", "btn btn-danger btn-sm");
            alert(data);
        }
    }
}
async function reset_tbodys(tbody, db_table, bt_id, add_param, obj_id){
    r = await add_new_units(tbody, db_table, bt_id, add_param)
    console.log("🚀 ~ reset_tbodys ~ r:", r);
    if (r === 'SUCCESS'){
        setTimeout(function (){sostav_ma_unit(obj_id)}, 1000);
    }
    else{alert(r)}
}
async function send_to_storage(db, id, bt_id, row)  {
    var edit_data = {id: id, parent_obj: 543}
    if (confirm("Отправить на склад?")){
        const data = await fetch_data(edit_data,'/save_data/'+db, 'POST');
        console.log("🚀 ~ send_to_storage ~ data:", data)
        if(data==="SUCCESS"){
            document.getElementById(bt_id).setAttribute("class", "btn btn-success btn-sm");
            setTimeout(function (){row.remove()}, 500);
        }
        else {
            document.getElementById("button_for_save_edit_row").setAttribute("class", "btn btn-danger btn-sm");
            alert(data);
        }
    }
}
    
async function send_to_usage(id, db_table, parent_id, bt_id) {        
        var edit_data = {id: id, parent_obj :parent_id}           
        console.log("🚀 ~ send_to_usage ~ edit_data:", edit_data)
    if (confirm("Переместить устройство?")){
        const data = await fetch_data(edit_data, '/save_data/'+db_table+ '_edited','POST');
        console.log(data);
        if(data==="SUCCESS"){
            document.getElementById(bt_id).setAttribute("class", "btn btn-success");
            setTimeout(function (){document.getElementById('btn_to_close_mod_send_to_usage').click()}, 700);
        }
        else {
            document.getElementById(bt_id).setAttribute("class", "btn btn-danger");
            alert(data);
        }
    }
}

async function save_edit_buh_data() {
    const sel = document.getElementById("select_mol_id");
    var edit_data = {
        id: document.getElementById("id_buh").value,
        inv_number: document.getElementById("In_num").value,
        name: document.getElementById("description_id").value,
        MOL: sel.options[sel.selectedIndex].textContent,
        charracter: document.getElementById("char_id").value,
        note: document.getElementById("note_id").value
    }
    console.log("🚀 ~ save_edit_buh_data ~ edit_data:", edit_data)
    if (confirm("Сохранить изменнения?")){
    const fetch_response = await fetch_data(edit_data,'/save_data/Buhuchet', 'POST');
        console.log("🚀 ~ save_edit_buh_data ~ data:", fetch_response)
        if(fetch_response==="SUCCESS"){
            document.getElementById("button_for_save_edit_buh_data").setAttribute("class", "btn btn-success");
        }
        else {
            document.getElementById("button_for_save_edit_buh_data").setAttribute("class", "btn btn-danger");
            alert(fetch_response);
        }
    }
}

async function save_edit_table_row(tbody ,row_index) {
    console.log("🚀 ~ save_edit_table_row ~ row_index:", row_index)
    var edited_row = {
        id: document.getElementById("id_for_edit").value,
        ud_punkt: document.getElementById("edit_UD_id").value,
        name_PON: document.getElementById("edit_COD_id").value,
        name_unit: document.getElementById("edit_Name_id").value,
        inv_number: document.getElementById("edit_Inv_id").value,
        serial_number: document.getElementById("edit_Serial_id").value,
        row_mesto: document.getElementById("edit_Riad_id").value,
        plata_mesto: document.getElementById("edit_Mesto_id").value,
        note: document.getElementById("unit_note_id").value,
    }
    console.log(edited_row)
    if (confirm("Сохранить изменнения?")){
        const data = await fetch_data(edited_row,'/save_data/sostav', 'POST');
        console.log("🚀 ~ save_edit_table_row ~ data:", data)
        if(data==="SUCCESS"){
            document.getElementById("button_for_save_edit_row").setAttribute("class", "btn btn-success");
            let oTable = document.getElementById(tbody);
            var oRows = oTable.getElementsByTagName('tr');
            var oCells = oRows[row_index-1].getElementsByTagName('td');
            oCells[1].textContent = document.getElementById("edit_UD_id").value;
            oCells[2].querySelector('a').innerHTML = document.getElementById("edit_COD_id").value;
            oCells[3].textContent = document.getElementById("edit_Name_id").value;
            oCells[4].querySelector('a').innerHTML = document.getElementById("edit_Inv_id").value;
            oCells[5].textContent = document.getElementById("edit_Serial_id").value;
            oCells[6].textContent = document.getElementById("edit_Riad_id").value;
            oCells[7].textContent = document.getElementById("edit_Mesto_id").value;
            oCells[8].textContent = document.getElementById("unit_note_id").value;
        }
        else {
            document.getElementById("button_for_save_edit_row").setAttribute("class", "btn btn-danger");
            alert(data);
        }
    }
}
async function save_edit_MA_table(tbody ,row) {
    var edited_row = {
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
    if (confirm("Сохранить изменнения?")){
    const data = await fetch_data(edited_row,'/save_data/Objects_ur_lica_edited','POST');
        console.log(data);
        if(data==="SUCCESS"){
            document.getElementById("button_for_save_edit_row").setAttribute("class", "btn btn-success");
            let oTable = document.getElementById(tbody);
            var oCells = oTable.rows.item(row.rowIndex-1).cells;
            oCells[1].querySelector('a').innerHTML = document.getElementById("edit_cod_id").value;
            oCells[3].textContent = document.getElementById("edit_org_id").value;
            oCells[4].textContent = document.getElementById("edit_address_id").value;
            oCells[5].textContent = document.getElementById("edit_ip_id").value;
            oCells[7].textContent = document.getElementById("edit_naklad_id").value;
            oCells[9].textContent = document.getElementById("edit_orsh_id").value;
            oCells[8].textContent = document.getElementById("edit_inst_date_id").value;
            oCells[10].textContent = document.getElementById("unit_note_id").value;
        }
        else {
            document.getElementById("button_for_save_edit_row").setAttribute("class", "btn btn-danger");
            alert(data);
        }
    }
}
async function save_kts_data() {
    var kts_data = {
        UD:document.getElementById("Ud_id").value,
        cod_name: document.getElementById("PON_id").value,
        IP: document.getElementById("ip_id").value,
        OLT:  document.getElementById("olt_id").value,
        inv_number: document.getElementById("inv_id").value,
        Serial: document.getElementById("serial_id").value,
        date_of_production: document.getElementById("date_pr_id").value,
        date_of_entry: document.getElementById("date_exp_id").value,
        full_name: document.getElementById("full_name_id").value,
        mesto: document.getElementById("mesto_id").value,
        zavod: document.getElementById("zavod_id").value,
    }
    console.log(kts_data)
    if (confirm("Сохранить изменнения?")){
        const fetch_response = await fetch_data(kts_data,'/save_data/KTS','POST');
        console.log("🚀 ~ save_edit_buh_data ~ data:", fetch_response)
        if(fetch_response==="SUCCESS"){
            document.getElementById("save_kts").setAttribute("class", "btn btn-success");
        }
        else {
            document.getElementById("save_kts").setAttribute("class", "btn btn-danger");
            alert(fetch_response);
        }
    }
}

async function storage_reset_tbody(btn_id, stor_id){
    const table_1 = document.getElementById('new_MA_unit_tbody_storage_id')
    var rowLength_1 = table_1.rows.length;
    const table_2 = document.getElementById('new_MA_modules_tbody_storage_id')
    var rowLength_2 = table_2.rows.length;
    console.log(rowLength_1 , rowLength_2)
    if (rowLength_1 > 0 ){
        r = await add_new_units('new_MA_unit_tbody_storage_id', 'MA_Unit', btn_id, stor_id)
        console.log(r)
        if (r === 'SUCCESS'){
            setTimeout(function (){ma_unit_storage('ma_unit_Modal_table', stor_id,'stored_ma_unit_tbody_');
                document.getElementById(btn_id).setAttribute("class", "btn btn-primary");
            }, 1000);
            
        }
        else{alert(r);
        }   
    }
    if (rowLength_2 > 0 ){
        r = await add_new_units('new_MA_modules_tbody_storage_id', 'ma_add_modules', btn_id, stor_id)
        console.log(r)
        if (r === 'SUCCESS'){
            setTimeout(function (){ma_add_module_storage(stor_id); 
                document.getElementById(btn_id).setAttribute("class", "btn btn-primary");
            }, 1000);
        }
        else{
            alert(r);
        }
    }   
}
async function add_new_inv_numbers(parent_tag_id, btn_id) {
    const parent_tag = document.getElementById(parent_tag_id);
    const list_of_tables = parent_tag.querySelectorAll('table')
    for(let i=0; i<list_of_tables.length; i++){
        let list_of_tds = list_of_tables[i].querySelectorAll('td')
        for(let j=0; j<list_of_tds.length; j++){
        if(list_of_tds[j].querySelector('i') != null){list_of_tds[j].querySelector('i').remove()}    
        }
        if(list_of_tds[0].textContent === ""){
            list_of_tables[i].setAttribute('bgcolor', '#f5abb1')
            alert('Поле инвентарного номера не может быть пустым!')
            continue;    
        }
        else{
            list_of_tables[i].setAttribute('class', 'table table-sm table-bordered table-hover borderd_table');
            let new_inv_data = {
                inv_number: list_of_tds[0].textContent,
                name: list_of_tds[1].textContent,
                MOL: list_of_tds[2].textContent,
                charracter: list_of_tds[3].textContent,
                note:""
            }
        const response = await fetch_data(new_inv_data,'/save_data/Buhuchet','POST');
        console.log("🚀 ~ add_new_inv_numbers ~ response:", response)
        if(response==="SUCCESS"){
            document.getElementById(btn_id).setAttribute("class", "btn btn-success");
            list_of_tables[i].setAttribute('bgcolor', '#87ddb6')
            setTimeout(function (){list_of_tables[i].remove()}, 1000);
        }
        else {
            document.getElementById(btn_id).setAttribute("class", "btn btn-danger");
            list_of_tables[i].setAttribute('bgcolor', '#f5abb1')
            alert(response);
            break;
        }
        }    
    }
}

async function add_new_units(tbody, db_table, btn_id, add_param){
    var oTable = document.getElementById(tbody);
        //gets rows of table
    var list_of_rows = oTable.getElementsByTagName('tr')
        //loops through rows        
    if (confirm("Сохранить изменнения?")){
    for (i = 0; i < list_of_rows.length; i++){
        var new_unit ={add_p :add_param};
        let empty_row = 0;
        var oCells = list_of_rows[i].getElementsByTagName('td');
        //gets amount of cells of current row
        for (let j = 0; j < oCells.length; j++) {
            new_unit[j] = oCells[j].textContent;
            empty_row = empty_row + new_unit[j].length
        }
        if(empty_row === 0){
            list_of_rows[i].setAttribute('class', 'table-danger');                
            continue;
        }
        console.log(new_unit);
        const data = await fetch_data(new_unit,'/save_data/'+db_table,'POST');
        console.log(data);
        if(data==="SUCCESS"){
            document.getElementById(btn_id).setAttribute("class", "btn btn-success");
            list_of_rows[i].setAttribute('class', 'table-success')
            setTimeout(function (){
                for (y = 0; y < list_of_rows.length; y++){
                    if(list_of_rows[y].getAttribute('class')==='table-success'){list_of_rows[y].remove()}
                }}, 700);                  
        }                
        else {
            document.getElementById(btn_id).setAttribute("class", "btn btn-danger");
            list_of_rows[i].setAttribute('class', 'table-danger');
            alert(data);
        }
    }
        return "SUCCESS";  
        }
}