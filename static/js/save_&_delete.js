function change_password(){     
        var old_pass = document.getElementById("old_pass_id").value;
        var new_pass = document.getElementById("new_pass_id").value;
        var new_pass_2 = document.getElementById("new_pass_2_id").value;
        console.log(old_pass, new_pass, new_pass_2)
        let new_data_pass = { old_pass: old_pass , new_pass: new_pass, new_pass_2: new_pass_2};
        const data = new FormData();
        data.append("json", JSON.stringify(new_data_pass));
        if ((new_pass === new_pass_2) && (new_pass.length > 5)){
            fetch("/change_password",
                {
                    method: "POST",
                    body: data
                })
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {
                    if (data === "SUCCESS"){
                        document.getElementById("raport_chang_pass").setAttribute("style", "color:green")
                        document.getElementById("raport_chang_pass").textContent = "Пароль изменен успешно";
                    }
                    else {
                        document.getElementById("raport_chang_pass").setAttribute("style", "color:red")
                        document.getElementById("raport_chang_pass").textContent = data;
                    }
                })
        }
        else {
            console.log("Новый пароль задан не верно");
            document.getElementById("raport_chang_pass").setAttribute("style", "color:red")
            document.getElementById("raport_chang_pass").textContent = "Новый пароль задан не верно"}

        }
function delete_row(db, id, bt_id, tbody, row)  {
    console.log(row.rowIndex)
    var id_val = {id: id}
    console.log("🚀 ~ delete_row ~ id:", id)
    var data = new FormData();
            data.append( "json", JSON.stringify(id_val) );
            if (confirm('Удалить запись?')){
                fetch("/delete_row/"+db,
            {
                method: "POST",
                body: data
            })
                .then(function(res){ return res.json(); })
            .then(function(data){
                console.log("🚀 ~ delete_row ~ data:", data)
                if ((data === 'SUCCESS')&&(typeof(data) === "string")){
                    document.getElementById(bt_id).setAttribute("class", "btn btn-success btn-sm");
                    setTimeout(function (){document.getElementById(tbody).deleteRow(row.rowIndex-1)}, 500);
                    return data;
                }
                else {
                    alert(data)
                    document.getElementById(bt_id).setAttribute("class", "btn btn-danger btn-sm");
                }
            })
                
            }
}

async function delete_data_from_db() {
    var data = new FormData();
    data.append( "json", JSON.stringify(id_val) );
    if (confirm('Удалить запись?')){
        fetch("/delete_row/"+db,
    {
        method: "POST",
        body: data
    })
        .then(function(res){ return res.json(); })
    .then(function(data){
        console.log("🚀 ~ delete_row ~ data:", data)
        if ((data === 'SUCCESS')&&(typeof(data) === "string")){
            document.getElementById(bt_id).setAttribute("class", "btn btn-success btn-sm");
            setTimeout(function (){document.getElementById(tbody).deleteRow(row.rowIndex-1)}, 500);
            return data;
        }
        else {
            alert(data)
            document.getElementById(bt_id).setAttribute("class", "btn btn-danger btn-sm");
        }
    })
        
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
                const data = await fetch_data_to_save_new(edit_data, db_table);
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

async function send_to_storage(db, id, bt_id, tbody, row_index, cells, dataID)  {
    console.log("🚀 ~ send_to_storage ~ row_index:", row_index)
    var edit_data = {id: id, parent_obj: 543}
    console.log("🚀 ~ send_to_storage ~ edit_data:", edit_data)
    if (confirm("Отправить на склад?")){
        const data = await fetch_data_to_save_new(edit_data, db);
        console.log("🚀 ~ send_to_storage ~ data:", data)
        if(data==="SUCCESS"){
            document.getElementById(bt_id).setAttribute("class", "btn btn-success btn-sm");
            setTimeout(function (){document.getElementById(tbody).deleteRow(row_index.rowIndex-1)}, 500);
            ma_add_module_storage();
        }
        else {
            document.getElementById("button_for_save_edit_row").setAttribute("class", "btn btn-danger btn-sm");
            alert(data);
        }
    }}
    
async function send_to_usage(id, db_table, parent_id, bt_id) {        
        var edit_data = {id: id, parent_obj :parent_id}           
        console.log("🚀 ~ send_to_usage ~ edit_data:", edit_data)
    if (confirm("Переместить устройство?")){
                const data = await fetch_data_to_save_new(edit_data, db_table+ '_edited');
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

function save_edit_buh_data() {
            var edited_buh_data = {
                id: document.getElementById("id_buh").value,
                inv_number: document.getElementById("In_num").value,
                MOL: document.getElementById("mol_id").value,
                charracter: document.getElementById("char_id").value,
                note: document.getElementById("note_id").value
            }
            console.log(edited_buh_data)
            if (confirm("Сохранить изменнения?")){
            fetch_data_to_save(edited_buh_data , "Buhuchet", "button_for_save_edit_buh_data")
            }}

async function save_edit_table_row(tbody ,row_index) {
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
            // fetch_data_to_save(edited_row , "sostav", "button_for_save_edit_row")
                const data = await fetch_data_to_save_new(edited_row, "sostav");
                console.log(data);
                if(data==="SUCCESS"){
                    document.getElementById("button_for_save_edit_row").setAttribute("class", "btn btn-success");
                    let oTable = document.getElementById(tbody);
                    var oCells = oTable.rows.item(row_index-1).cells;
                        oCells[1].textContent = document.getElementById("edit_UD_id").value;
                        oCells[2].textContent = document.getElementById("edit_COD_id").value;
                        oCells[3].textContent = document.getElementById("edit_Name_id").value;
                        oCells[4].textContent = document.getElementById("edit_Inv_id").value;
                        oCells[5].textContent = document.getElementById("edit_Serial_id").value;
                        oCells[6].textContent = document.getElementById("edit_Riad_id").value;
                        oCells[7].textContent = document.getElementById("edit_Mesto_id").value;
                        oCells[8].textContent = document.getElementById("unit_note_id").value;
                }
                else {
                    document.getElementById("button_for_save_edit_row").setAttribute("class", "btn btn-danger");
                    alert(data);
                }
            }}
async function save_edit_MA_table(tbody ,row) {
            const list_input_id = [];
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
            const data = await fetch_data_to_save_new(edited_row, "Objects_ur_lica_edited");
                console.log(data);
                if(data==="SUCCESS"){
                    document.getElementById("button_for_save_edit_row").setAttribute("class", "btn btn-success");
                    let oTable = document.getElementById(tbody);
                    var oCells = oTable.rows.item(row.rowIndex-1).cells;
                    oCells[1].textContent = document.getElementById("edit_cod_id").value;
                    oCells[3].textContent = document.getElementById("edit_org_id").value;
                    oCells[4].textContent = document.getElementById("edit_address_id").value;
                    oCells[5].textContent = document.getElementById("edit_ip_id").value;
                    oCells[7].textContent = document.getElementById("edit_naklad_id").value;
                    oCells[8].textContent = document.getElementById("edit_orsh_id").value;
                    oCells[9].textContent = document.getElementById("edit_inst_date_id").value;
                    oCells[10].textContent = document.getElementById("unit_note_id").value;
                }
                else {
                    document.getElementById("button_for_save_edit_row").setAttribute("class", "btn btn-danger");
                    alert(data);
                }
            }}
function save_kts_data() {
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
            fetch_data_to_save(kts_data, "KTS", "save_kts")
            }}

function reset_tbodys(tbody, db_table, bt_id, add_param, obj_id){
    add_new_units(tbody, db_table, bt_id, add_param).then(function (r){
        console.log(r)
        if (r === 'SUCCESS'){
            setTimeout(function (){sostav_ma_unit(obj_id)}, 1000);
        }
        else{alert(r)}
    });
}
function storage_reset_tbody(btn_id){
    const table_1 = document.getElementById('new_MA_unit_tbody_storage_id')
    var rowLength_1 = table_1.rows.length;
    const table_2 = document.getElementById('new_MA_modules_tbody_storage_id')
    var rowLength_2 = table_2.rows.length;
    console.log(rowLength_1 , rowLength_2)
    if (rowLength_1 > 0 ){
        add_new_units('new_MA_unit_tbody_storage_id', 'MA_Unit', btn_id, "543").then(function (r){
        console.log(r)
        if (r === 'SUCCESS'){
            setTimeout(function (){ma_unit_storage('ma_unit_Modal_table', '543','stored_ma_unit_tbody_');}, 1000);
            document.getElementById(btn_id).setAttribute("class", "btn btn-primary");
        }
        else{alert(r)}
    });
    }
    if (rowLength_2 > 0 ){
        add_new_units('new_MA_modules_tbody_storage_id', 'ma_add_modules', btn_id, "543").then(function (r){
        console.log(r)
        if (r === 'SUCCESS'){
            setTimeout(function (){ma_add_module_storage(); }, 1000);
            document.getElementById(btn_id).setAttribute("class", "btn btn-primary");
        }
        else{alert(r)}
    });
    }
    
}

async function add_new_units(tbody, db_table, btn_id, add_param){
        var oTable = document.getElementById(tbody);
            //gets rows of table
        var rowLength = oTable.rows.length;
            //loops through rows
        if (confirm("Сохранить изменнения?")){
        for (i = 0; i < rowLength; i++){
            var new_unit ={add_p :add_param};

            var oCells = oTable.rows.item(i).cells;
           //gets amount of cells of current row
            for (let j = 0; j < oCells.length; j++) {
                new_unit[j] = oCells[j].textContent;
            }
                console.log(new_unit);
                const data = await fetch_data_to_save_new(new_unit, db_table);
                console.log(data);
                if(data==="SUCCESS"){
                    document.getElementById(btn_id).setAttribute("class", "btn btn-success");
                }
                else {
                    document.getElementById(btn_id).setAttribute("class", "btn btn-danger");
                    alert(data);
                }
        }
            return "SUCCESS"
            }
        }


function fetch_data_to_save(data_to_save, db, btn_id) {
    var data = new FormData();
    data.append("json", JSON.stringify(data_to_save));
    const route = "/save_data/" + db
    console.log(route)
    fetch(route,
        {
            method: "POST",
            body: data
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data)
            if(data==="SUCCESS"){
                document.getElementById(btn_id).setAttribute("class", "btn btn-success");
            }
            else {
                document.getElementById(btn_id).setAttribute("class", "btn btn-danger");
                alert(data);
            }
            }
        )
}

async function fetch_data_to_save_new(data_to_save, db) {
    var data = new FormData();
    data.append("json", JSON.stringify(data_to_save));
    const route = "/save_data/" + db
    console.log(route)
    try {
        const response = await fetch(route,
        {
            method: "POST",
            body: data
        })
        return await response.json();
        } catch (error){console.log("error: ", error)
            return "Не удалось внести изменения, запись не найдена"}
}

async function fetch_data_to_get(data_to_get, db) {
    var data = new FormData();
    data.append("json", JSON.stringify(data_to_get));
    const route = "/get_data_from_db/" + db
    console.log(route)
    try {
        const response = await fetch(route,
        {
            method: "POST",
            body: data
        })
        return await response.json();
        } catch (error){console.log("error: ", error)
        return "error"}
}