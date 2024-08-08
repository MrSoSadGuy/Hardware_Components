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



function delete_row(db, id, bt_id, tbody, row_index)  {
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
                console.log(data)
                if ((data === 'SUCCESS')&&(typeof(data) === "string")){
                    document.getElementById(bt_id).setAttribute("class", "btn btn-success");
                    setTimeout(function (){document.getElementById(tbody).deleteRow(row_index-1)}, 500);
                    return data;
                }
                else {
                    document.getElementById(bt_id).setAttribute("class", "btn btn-danger");
                }
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
     if (confirm("Сохранить изменнения?")){
            fetch_data_to_save(edit_data , db, bt_id)
            }}


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
            fetch_data_to_save(edited_row , "Ma_Units_edit", "button_for_save_edit_row")
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
function reset_tbodys(tbody, db_table, bt_id, add_param){
    add_new_units(tbody, db_table, bt_id, add_param);
    console.log("sdasddas")
    setTimeout(function (){create_tables(add_param)}, 1000);

}

// function reset_table(db, id, bt_id, tbody, row_index ){
//     console.log(tbody, row_index)
//     const server_answer = delete_row(db, id, bt_id);
//         var rows = document.getElementById(tbody).getElementsByTagName('tr');
//         setTimeout(function (){
//             console.log(server_answer)
//             if (server_answer === "SUCCESS"){
//             rows[row_index-1].style.display = "none";}}, 1000);




function add_new_units(tbody, db_table, bt_id, add_param){
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
                fetch_data_to_save(new_unit, db_table, bt_id)
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
                 alert(data);
             }
             }
         )
 }