async function sostav_ma_unit(dataID){

    const data = await fetch_data_to_get(dataID,"Objects_ur_lica");
    console.log(data);
    document.getElementById("cod_id").value = data[0]['cod_name'];
    document.getElementById("ip_id").value = data[0]['IP'];
    const tbody_current = document.getElementById('curent_MA_unit_tbody_id');
    while (tbody_current.rows.length) {tbody_current.deleteRow(0);}
    const tbody_new = document.getElementById('curent_MA_modules_tbody_id');
    while (tbody_new.rows.length) {tbody_new.deleteRow(0);}
    const tbody_mod = document.getElementById('new_MA_modules_tbody_id');
    while (tbody_mod.rows.length) {tbody_mod.deleteRow(0);}
    document.getElementById("btn_to_add_new_ma_modules").setAttribute("class", "btn btn-primary");
    document.getElementById("btn_to_add_new_ma_modules").setAttribute("name", dataID);
    const column_name_unit = ['type_equipment','inv_number','serial_number','note'];
    const column_name_modules = ['type','inv_number','serial_number','note'];
    if (Object.keys(data[1]).length > 0){
        for (let key in data[1]){
            let temp_list = [data[1][key]]
            create_tables(temp_list,'curent_MA_unit_tbody_id', column_name_unit, 'MA_Units', true)
            if(data[2][key].length > 0){
                console.log('start')
                create_tables(data[2][key],'curent_MA_modules_tbody_id', column_name_modules, 'ma_add_modules', true)
            }
        }     
        

    }
    
}

function create_tables(moduls, table_id, column_name, db_table, buse){
   const tbody_current = document.getElementById(table_id);
        console.log(moduls)
        moduls.forEach(item => {
            console.log(item)
            const tr = document.createElement('tr');
            for (let i = 0; i < column_name.length; i++) {
                const td = document.createElement('td');
                td.contentEditable = true;
                td.textContent = item[column_name[i]];
                console.log(item[column_name[i]])
                tr.appendChild(td);
            }
            const td8 = document.createElement('td');
            const a1 = document.createElement('a');
            const a2 = document.createElement('a');
            const a3 = document.createElement('a');
            const i1 = document.createElement('i');
            const i2 = document.createElement('i');
            const i3 = document.createElement('i');
            const div = document.createElement('div');
            div.setAttribute('class','d-grid gap-1 d-md-flex');
            a1.setAttribute('id','btn_edit_ma_mod_'+item['id']);
            a1.setAttribute('class','btn btn-primary btn-sm');
            a2.setAttribute('id','btn_del_ma_mod_'+item['id']);
            a2.setAttribute('class','btn btn-primary btn-sm');
            a3.setAttribute('id','btn_send_ma_mod_to_storage_'+item['id']);
            a3.setAttribute('class','btn btn-primary btn-sm');
            a1.onclick = function (){edit_row(db_table + '_edited', item['id'],'btn_edit_ma_mod_'+item['id'],table_id,
            this.closest("tr").rowIndex,4)};
            a2.onclick = function (){delete_row(db_table, item['id'],'btn_del_ma_mod_'+item['id'],table_id,
            this.closest("tr").rowIndex)};
            a3.onclick = function (){
                if (buse){
                    send_to_storage(db_table + '_edited', item['id'],'btn_send_ma_mod_to_storage_'+item['id'],table_id,
                        this.closest("tr").rowIndex, 4)
                    
                    }
                else {console.log("qrwyequretqweyquwe")}
                }                 
            i1.setAttribute('class', "bi bi-pencil-square h7");
            i2.setAttribute('class', "bi bi-trash3 h7");
            i3.setAttribute('class', "bi bi-box-arrow-up-right h10");
            a1.appendChild(i1);
            a2.appendChild(i2);
            a3.appendChild(i3);
            div.appendChild(a1);
            div.appendChild(a3);
            div.appendChild(a2);
            td8.appendChild(div);
            tr.appendChild(td8);
            td8.setAttribute('style',"width:70px")
            tbody_current.appendChild(tr);
        })
        
}
function create_tables2(table_id, column_name, unit_id){
   const tbody_current = document.getElementById(table_id);       
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute('colspan', '5')
    const tr_h = document.createElement('tr');
    const thead_n = document.createElement('thead');
    thead_n.appendChild(tr_h);
    
    const table_n = document.createElement('table');
    table_n.setAttribute('class','table mb-0 table-striped table-bordered table-success' )
    const tbody_n = document.createElement('tbody');
    tbody_n.setAttribute('id',"tbody_unit_modules_"+ unit_id);
    table_n.appendChild(thead_n);
    table_n.appendChild(tbody_n);
    td.appendChild(table_n);
    tr.appendChild(td);
    tbody_current.appendChild(tr);
             
}
async function ma_unit_storage(){
    const tbody_current = document.getElementById('current_MA_unit_tbody_storage_id');
    while (tbody_current.rows.length) {tbody_current.deleteRow(0);}
    const stor_ma_unit = await fetch_data_to_get('543',"Objects_ur_lica");
     console.log(stor_ma_unit)
    const column_name = ['type_equipment','inv_number','serial_number','note'];
    const column_name_mod = ['type','inv_number','serial_number','note'];
    if(Object.keys(stor_ma_unit[1]).length>0){
        for (let key in stor_ma_unit[1]){
            temp_list = [stor_ma_unit[1][key]]
            create_tables(temp_list,'current_MA_unit_tbody_storage_id', column_name, 'MA_Units',false)
            if(stor_ma_unit[2][key].length > 0){
                create_tables2('current_MA_unit_tbody_storage_id', column_name, stor_ma_unit[1][key]['id'] )
                create_tables(stor_ma_unit[2][key],"tbody_unit_modules_"+ stor_ma_unit[1][key]['id'], column_name_mod, 'ma_add_modules',true)
            }
        }            
    }   
 }

 async function ma_add_module_storage(){
    const tbody_new = document.getElementById('current_MA_modules_tbody_storage_id');
    while (tbody_new.rows.length) {tbody_new.deleteRow(0);}
    const column_name = ['type','inv_number','serial_number','note'];
    const stor_ma_modules = await fetch_data_to_get('543',"MA_Units");
    if(stor_ma_modules[1].length>0){
        create_tables(stor_ma_modules[1],'current_MA_modules_tbody_storage_id', column_name, 'ma_add_modules', false)
    }

}

function invent_modal(param){
    document.getElementById("In_num").value = param;
    document.getElementById("button_for_save_edit_buh_data").setAttribute("class", "btn btn-primary");
      var data = new FormData();
      data.append('json', JSON.stringify(document.getElementById("In_num").value))
      fetch("/get_data_from_db/BuhUch",
            {
                method: "POST",
                body: data
            })
            .then(function(res){ return res.json(); })
            .then(function(data){
                console.log(data)
                if (data === null){alert("Нет данных по этому номеру")}
                else {
                    document.getElementById("description_id").value = data['name'];
                    document.getElementById("mol_id").value = data['MOL'];
                    document.getElementById("char_id").value = data['charracter'];
                    document.getElementById("note_id").value = data['note'];
                }
        })
}
async function edit_ma_unit_modal(unit_id, row_index){
              const data = await fetch_data_to_get(unit_id,"MA_Unit");
              console.log(data);
              document.getElementById("id_for_edit").value = unit_id;
              document.getElementById('button_for_save_edit_row').setAttribute("class", "btn btn-primary");
              document.getElementById('button_for_delete_row').setAttribute("class", "btn btn-primary");
              console.log(document.getElementById("id_for_edit").value)
                document.getElementById("edit_cod_id").value = data[0].cod_name;
                document.getElementById("edit_org_id").value = data[0].organization;
                document.getElementById("edit_address_id").value = data[0].address;
                document.getElementById("edit_type_id").value = data[0].type_equipment;
                document.getElementById("edit_Inv_id").value = data[0].inv_number;
                document.getElementById("edit_naklad_id").value = data[0].naklodnaja;
                document.getElementById("edit_Serial_id").value = data[0].serial_number;
                document.getElementById("edit_ip_id").value = data[0].IP;
                document.getElementById("edit_inst_date_id").value = data[0].install_date;
                document.getElementById("edit_orsh_id").value = data[0].ORSH;
                document.getElementById("unit_note_id").value = data[0].note;
                document.getElementById('button_for_delete_row').onclick = function (){
                    delete_row('MA_Unit', id , 'button_for_delete_row','tbody_main_table', row_index)};
                document.getElementById('button_for_storage_ma_unit').onclick = function (){
                    send_to_storage_ma_unit('Ma_Units_edited', unit_id , 'button_for_storage_ma_unit','tbody_main_table', row_index)};
                document.getElementById('button_for_save_edit_row').onclick = function (){
                    save_edit_MA_table('tbody_main_table', row_index)};
}
