async function sostav_ma_unit(dataID){

    const data = await fetch_data_to_get(dataID,"Objects_ur_lica");
    console.log(data)
    console.log(data.unit)
    //document.getElementById("type_id").value = data[0]['type_equipment'];
    document.getElementById("cod_id").value = data[0]['cod_name'];
    //document.getElementById("Serial_id").value = data[0]['serial_number'];
    document.getElementById("ip_id").value = data[0]['IP'];
    const tbody_current = document.getElementById('current_MA_modules_tbody_id');
    while (tbody_current.rows.length) {tbody_current.deleteRow(0);}
    const tbody_new = document.getElementById('new_MA_modules_tbody_id');
    while (tbody_new.rows.length) {tbody_new.deleteRow(0);}
    document.getElementById("btn_to_add_new_ma_modules").setAttribute("class", "btn btn-primary");
    document.getElementById("btn_to_add_new_ma_modules").setAttribute("name", dataID);
    const column_name = ['type_equipment','inv_number','serial_number','note'];
    if (data[1].length > 0){create_tables(dataID, data[1],'current_MA_modules_tbody_id', column_name)}
    if (data[2].length > 0){create_tables(data[1].id, data[2],'new_MA_modules_tbody_id', column_name)}

}

function create_tables(dataPon, moduls, table_id, column_name){
   const tbody_current = document.getElementById(table_id);
   
        moduls.forEach(item => {
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
            a1.onclick = function (){edit_row('ma_add_modules_edited', item['id'],'btn_edit_ma_mod_'+item['id'],'current_MA_modules_tbody_id',
            this.closest("tr").rowIndex,7)};
            a2.onclick = function (){delete_row('ma_add_modules', item['id'],'btn_del_ma_mod_'+item['id'],'current_MA_modules_tbody_id',
            this.closest("tr").rowIndex)};
            a3.onclick = function (){send_to_storage('ma_add_modules_edited', item['id'],'btn_send_ma_mod_to_storage_'+item['id'],'current_MA_modules_tbody_id',
            this.closest("tr").rowIndex, 7)};
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
            tbody_current.appendChild(tr);
        })
        
}




async function ma_unit_storage(){
    const tbody_current = document.getElementById('current_MA_unit_tbody_storage_id');
    while (tbody_current.rows.length) {tbody_current.deleteRow(0);}
    const column_name_unit = ['type_equipment','modules_name','inv_number','serial_number','note'];
    const stor_ma_unit = await fetch_data_to_get('склад',"MA_Unit_stor");
    console.log(stor_ma_unit)
    get_data_for_ma_storage('current_MA_unit_tbody_storage_id','new_MA_unit_tbody_storage_id', 5,'MA_Unit', column_name_unit,stor_ma_unit)
 }
async function ma_add_module_storage(){
    const tbody_new = document.getElementById('current_MA_modules_tbody_storage_id');
    while (tbody_new.rows.length) {tbody_new.deleteRow(0);}
    const column_name_modul = ['type','modules_name','inv_number','serial_number','note'];
    const stor_ma_unit = await fetch_data_to_get('склад',"ma_add_modules");
    if (stor_ma_unit === "error"){alert("Произошла ошибка")}
    else get_data_for_ma_storage('current_MA_modules_tbody_storage_id','new_MA_modules_tbody_storage_id', 6,'ma_add_modules',column_name_modul, stor_ma_unit)
}

function get_data_for_ma_storage(cur_tbody_id, new_tbody_id, cells, db_table, column_name, data){
    const tbody_current = document.getElementById(cur_tbody_id);
    data.forEach(item => {
        const tr = document.createElement('tr');
        for (let i = 0; i < column_name.length; i++) {
            const td = document.createElement('td');
            td.contentEditable = true;
            td.textContent = item[column_name[i]];
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
        a1.onclick = function (){edit_row(db_table + '_edited', item['id'],'btn_edit_ma_mod_'+item['id'],cur_tbody_id,
        this.closest("tr").rowIndex,cells)};
        a2.onclick = function (){delete_row(db_table, item['id'],'btn_del_ma_mod_'+item['id'],cur_tbody_id,
        this.closest("tr").rowIndex)};
        a3.onclick = function (){send_to_storage('ma_add_modules_edited', item['id'],'btn_send_ma_mod_to_storage_'+item['id'],'current_MA_modules_tbody_id', this.closest("tr").rowIndex, cells)};
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
        tbody_current.appendChild(tr);
    })


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
