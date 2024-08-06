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
 function delete_table_row() {
            var id = {
            id: document.getElementById("id_for_edit").value
            }
            console.log(id)
            var data = new FormData();
            data.append( "json", JSON.stringify( id ) );
            fetch("/delete_table_row",
            {
                method: "POST",
                body: data
            })
            .then(function(res){ return res.json(); })
            .then(function(data){
                if (data === 'SUCCESS'){
                    document.getElementById("button_for_delete_row").setAttribute("class", "btn btn-success");
                }
                else {
                    document.getElementById("button_for_delete_row").setAttribute("class", "btn btn-danger");
                }
                console.log(data)
            })

            }

function delete_row(db, id, bt_id)  {
    var id_val = {id: id}
            console.log(id)
     var data = new FormData();
            data.append( "json", JSON.stringify( id_val ) );
            if (confirm('Удалить запись?')){
                fetch("/delete_row/"+db,
            {
                method: "POST",
                body: data
            })
                .then(function(res){ return res.json(); })
            .then(function(data){
                if (data === 'SUCCESS'){
                    document.getElementById(bt_id).setAttribute("class", "castom-green");
                }
                else {
                    document.getElementById(bt_id).setAttribute("class", "castom-red");
                }
                console.log(data)
            })
            }
 }
 function edit_row(db, id, bt_id, tbody, row_index, cells)  {
    console.log(row_index)
    var edit_data = {id: id}
     let oTable = document.getElementById(tbody);
    var oCells = oTable.rows.item(row_index-1).cells;
     for (let i = 0; i < cells; i++) {
         edit_data[i] = oCells[i].textContent;
     }
     console.log(edit_data)
     var data = new FormData();
     data.append( "json", JSON.stringify( edit_data ) );
            if (confirm('Изменить запись?')){
                fetch("/edit_row/"+db,
            {
                method: "POST",
                body: data
            })
                .then(function(res){ return res.json(); })
            .then(function(data){
                if (data === 'SUCCESS'){
                    document.getElementById(bt_id).setAttribute("class", "castom-green");
                }
                else {
                    document.getElementById(bt_id).setAttribute("class", "castom-red");
                }
                console.log(data)
            })
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
 function save_edit_table_row() {
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
            fetch_data_to_save(edited_row , "sostav", "button_for_save_edit_row")
            }}
 function save_edit_MA_table() {
            var edited_row = {
                id: document.getElementById("id_for_edit").value,
                cod_name: document.getElementById("edit_cod_id").value,
                organization: document.getElementById("edit_org_id").value,
                address: document.getElementById("edit_address_id").value,
                type_equipment: document.getElementById("edit_type_id").value,
                inv_number: document.getElementById("edit_Inv_id").value,
                naklodnaja: document.getElementById("edit_naklad_id").value,
                serial_number: document.getElementById("edit_Serial_id").value,
                IP: document.getElementById("edit_ip_id").value,
                ORSH: document.getElementById("edit_orsh_id").value,
                note: document.getElementById("unit_note_id").value,
            }
            console.log(edited_row)
            if (confirm("Сохранить изменнения?")){
            fetch_data_to_save(edited_row , "ma_units", "button_for_save_edit_row")
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
function add_new_units(tbody, db_table){
        var oTable = document.getElementById(tbody);
            //gets rows of table
        var rowLength = oTable.rows.length;
            //loops through rows
    if (confirm("Сохранить изменнения?")){
        for (i = 0; i < rowLength; i++){
           //gets cells of current row
            var oCells = oTable.rows.item(i).cells;
           //gets amount of cells of current row
            var new_unit = {
                ud_punkt: oCells[0].textContent,
                name_PON: oCells[1].textContent,
                name_unit: oCells[2].textContent,
                inv_number: oCells[3].textContent,
                serial_number: oCells[4].textContent,
                row_mesto: oCells[5].textContent,
                plata_mesto: oCells[6].textContent,
                };
                console.log(new_unit);
                fetch_data_to_save(new_unit, db_table, "button_for_save_new_units")
           }
            }
        }

function save_ma_add_modules(){
        var oTable = document.getElementById('new_MA_modules_tbody_id');
            //gets rows of table
        var rowLength = oTable.rows.length;
            //loops through rows
    if (confirm("Сохранить изменнения?")){
        for (i = 0; i < rowLength; i++){
           //gets cells of current row
            var oCells = oTable.rows.item(i).cells;
           //gets amount of cells of current row
            var new_unit = {
                cod_name: document.getElementById('cod_id').value,
                type: oCells[0].textContent,
                modules_name: oCells[1].textContent,
                inv_number: oCells[2].textContent,
                serial_number: oCells[3].textContent,
                port: oCells[4].textContent,
                size: oCells[5].textContent,
                note: oCells[6].textContent,
                };
                console.log(new_unit);
                fetch_data_to_save(new_unit, "ma_add_modules", "btn_to_add_new_ma_modules")
           }
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
             }
             }
         )
 }