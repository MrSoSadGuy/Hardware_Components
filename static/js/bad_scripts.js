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
                var serch_data = document.getElementById("myInput").value
                localStorage.setItem("serch",JSON.stringify(serch_data));
                location.reload();
                }

 function add_new_row(table_id, cells){
        var table = document.getElementById(table_id);
        var row = table.insertRow();
        for (let i = 0; i < cells; i++ ){
            row.insertCell(i).contentEditable = true;
        }
        }
 function del_row(tbody_id) {
        document.getElementById(tbody_id).deleteRow(-1);
        }
 //копирование в таблицу из Excel 2
 function paste_to_cells_like_excel(tbody_id, data, start_r, start_c,  cells_in_row){
                let value = data.split(/\r\n|\n|\r/);
                console.log(value)
                let start_row = start_r;
                let start_cell = start_c
              let oTable = document.getElementById(tbody_id);
              let rowLength = oTable.rows.length;
              console.log('1  ',rowLength, value.length);
                for (let j = 0; j < value.length-1; j++) {
                    var oCells = oTable.rows.item(start_row).cells;
                    var words = value[j].split(/\t/);
                    console.log("wl=",words.length);
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

 function save_main_table_in_file(){
        var oTable = document.getElementById('tbody_main_table');
        console.log($('tr:visible').length)
        var rowLength = oTable.rows.length;
        var data = new FormData();
        var list_data = []
        for (i = 0; i < rowLength; i++){
            var style = oTable.rows.item(i).getAttribute("style")
            if(style == null){
            var oCells = oTable.rows.item(i).cells;
            list_data.push(oCells[0].textContent)
        }}
            data.append( "json", JSON.stringify(list_data ));
            fetch("/main_table_data",
                {
                    method: "POST",
                    body: data
                })
                .then(function(res){ return res.json(); })
                .then(function(data){
                    if (data === "SUCCESS"){
                        const link = document.createElement('a');
                        link.href = '/download/main_table';
                        document.body.appendChild(link);
                        link.click();
                        link.remove();}
                    else {alert("ERROR");
                        console.log(data)}
            })
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
              for (var i = 0; i < tr.length; i++) {
                var tds = tr[i].getElementsByTagName("td");
                if (rb1){
                    var flag = [];
                    list_of_words.forEach(word =>{
                      for(var j = 0; j < tds.length; j++){
                        var td = tds[j];
                        if (td.innerHTML.toUpperCase().indexOf(word.trim()) > -1) {
                        flag.push(true);
                        return;
                      }
                    }})
                    if(flag.length >= list_of_words.length){tr[i].removeAttribute("style");}
                    else {tr[i].style.display = "none";}}
                if (rb2){
                    var flag = false;
                    list_of_words.forEach(word =>{
                        for(var j = 0; j < tds.length; j++){
                            var td = tds[j];
                            if (td.innerHTML.toUpperCase().indexOf(word.trim()) > -1) {
                            flag = true;
                            return;
                         }
                        }})
                if(flag){tr[i].removeAttribute("style");}
                else {tr[i].style.display = "none";}
                }
              }
            }


 // function get_table_column_data(){
 //            const select = document.getElementsByTagName("select")
 //                while(select.length > 1){
 //                select[select.length-1] = null;
 //                }
 //            var oTable = document.getElementById('tbody_main_table');
 //            var list_rows = []
 //            var list_cells = []
 //            for (i = 0; i < oTable.rows.length; i++){
 //                var style = oTable.rows.item(i).getAttribute("style")
 //                if(style == null){
 //                    var oCells = oTable.rows.item(i).cells;
 //                    list_cells = [oCells[1],oCells[2],oCells[3],oCells[4]];
 //                    list_rows.push(list_cells);
 //                    list_cells=[];
 //                }
 //            }
 //            console.log(list_rows);
 //            }
 //
 //            // for (i = 0; i < list_rows.length; i++){
 //            //     const option = document.createElement("option");
 //            //     option.text = list_rows[i][0];
 //            //     option.value = list_rows[i][0];
 //            //     document.getElementById("select_1").appendChild(option);
 //            // }
 //            // }

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
            // if (confirm('Удалить запись?')){
            //     fetch("/edit_row/"+db,
            // {
            //     method: "POST",
            //     body: data
            // })
            //     .then(function(res){ return res.json(); })
            // .then(function(data){
            //     if (data === 'SUCCESS'){
            //         document.getElementById(bt_id).setAttribute("class", "castom-green");
            //     }
            //     else {
            //         document.getElementById(bt_id).setAttribute("class", "castom-red");
            //     }
            //     console.log(data)
            // })
            // }
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
function add_new_units(){
        var oTable = document.getElementById('table_body_id');
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
                fetch_data_to_save(new_unit, "new_units", "button_for_save_new_units")
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