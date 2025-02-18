async function sostav_ma_unit(dataID){
    const data = await fetch_data(dataID,'/get_data_from_db/Objects_ur_lica',"POST");
    console.log("🚀 ~ sostav_ma_unit ~ data:", data)
    document.getElementById("cod_id").value = data[0]['cod_name'];
    document.getElementById("ip_id").value = data[0]['IP'];
    document.getElementById("ordan_id").value = data[0]['organization'];
    document.getElementById("address_id").value = data[0]['address'];
    const tbody_current = document.getElementById('curent_MA_unit_tbody_id');
    while (tbody_current.rows.length) {tbody_current.deleteRow(0);}
    const tbody_new = document.getElementById('curent_MA_modules_tbody_id');
    while (tbody_new.rows.length) {tbody_new.deleteRow(0);}
    const tbody_mod = document.getElementById('new_MA_modules_tbody_id');
    while (tbody_mod.rows.length) {tbody_mod.deleteRow(0);}
    document.getElementById("btn_to_add_new_ma_modules").setAttribute("class", "btn btn-primary");   
    const column_name_unit = ['type_equipment','inv_number','serial_number','MAC','note'];
    const column_name_modules = ['type','inv_number','serial_number','note'];
    if (Object.keys(data[1]).length > 0){
        for (let key in data[1]){
            let temp_list = [data[1][key]]
            create_tables(temp_list,'curent_MA_unit_tbody_id', column_name_unit, 'MA_Units', true, 'tr')
            if(data[2][key].length > 0){
                create_tables(data[2][key],'curent_MA_modules_tbody_id', column_name_modules, 'ma_add_modules', true, 'tr')
            }
            document.getElementById("btn_to_add_new_ma_modules").onclick = function(){reset_tbodys('new_MA_modules_tbody_id', 'ma_add_modules','btn_to_add_new_ma_modules',data[1][key]['id'], dataID)}; 
        }            
    }
}

async function invent_modal(param,user){
    console.log("🚀 ~ invent_modal ~ user:", user)
    document.getElementById("In_num").value = param;
    document.getElementById("button_for_save_edit_buh_data").setAttribute("class", "btn btn-primary");
    const fetch_response = await fetch_data(param,'/get_data_from_db/BuhUch',"POST");
    console.log("🚀 ~ invent_modal ~ fetch_response:", fetch_response)
    const select = document.getElementById('select_mol_id')
    var options = select.getElementsByTagName('option');
    console.log("🚀 ~ invent_modal ~ options:", options);
    if (fetch_response === null){alert("Нет данных по этому номеру")
        for(let i=0; i < options.length; i++) {
            if (user === options[i].text){
                options[i].selected = true}
        }
    }
    else {
        document.getElementById("description_id").value = fetch_response['name'];
        for(let i=0; i < options.length; i++) {
            console.log("🚀 ~ invent_modal ~ fetch_response:",typeof fetch_response['MOL_id'], typeof options[i].value);
            if (fetch_response['MOL_id'].toString() === options[i].value){
                options[i].selected = 'selected'}
        }
        document.getElementById("char_id").value = fetch_response['charracter'];
        document.getElementById("note_id").value = fetch_response['note'];
    }
}

async function invent_popover(param, attr, table_id){
    const fetch_response = await fetch_data(param,'/get_data_from_db/BuhUch',"POST");
    var list_data = []
    if (fetch_response === null){list_data = ["Нет данных","Нет данных","Нет данных"]}
    else {
        list_data = [fetch_response['MOL'],fetch_response['name'],fetch_response['charracter']]
    }
    attr.setAttribute('data-bs-toggle',"popover-bg");
    attr.setAttribute('tabindex',"0");
    attr.setAttribute('data-bs-trigger',"hover");
    attr.setAttribute('title',"МОЛ: " + list_data[0]);
    attr.setAttribute('data-bs-content', "Наименование: " + list_data[1] + "\n Характеристика: " + list_data[2]); 
    popover_func(table_id)
}


function create_tables(moduls, table_id, column_name, db_table, busy, tag){
    const tbody_current = document.getElementById(table_id);
    moduls.forEach(item => {
        const tr = document.createElement('tr');
        
        for (let i = 0; i < column_name.length; i++) {
            const td = document.createElement('td');
            let width = 100/(column_name).length
            td.setAttribute('width', width+'%')
            i>0?td.contentEditable = true:td.contentEditable = false;
            
            if (column_name[i] === 'inv_number'){
                const a1 = document.createElement('a');
                a1.textContent = item[column_name[i]];
                a1.setAttribute('href',"");
                invent_popover(item[column_name[i]], a1, table_id);
                td.appendChild(a1);
            }
            else td.textContent = item[column_name[i]];
            // console.log(item[column_name[i]])
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
        let n_cells = tr.cells.length-1
        div.setAttribute('class','d-grid gap-1 d-md-flex');
        a1.setAttribute('id','btn_edit_ma_mod_'+item['id']);
        a1.setAttribute('class','btn btn-primary btn-sm');
        a1.setAttribute('data-toggle','tooltip2');
        a1.setAttribute('data-placement','top');
        a1.setAttribute('title','Редактировать');
        a2.setAttribute('data-toggle','tooltip2');
        a2.setAttribute('data-placement','top');
        a3.setAttribute('data-toggle','tooltip2');
        a3.setAttribute('data-placement','top');
        a2.setAttribute('title','Удалить запись');
        a2.setAttribute('id','btn_del_ma_mod_'+item['id']);
        a2.setAttribute('class','btn btn-primary btn-sm');
        a3.setAttribute('id','btn_send_ma_mod_to_storage_'+item['id']);
        a3.setAttribute('class','btn btn-primary btn-sm');
        a1.onclick = function (){edit_row(db_table + '_edited', item['id'],'btn_edit_ma_mod_'+item['id'],table_id, this.closest("tr"), n_cells)};
        a2.onclick = function (){
            console.log(this.closest(tag))
            delete_row(db_table, item['id'],'btn_del_ma_mod_'+item['id'],table_id, this.closest(tag))};
        if (busy){
            a3.setAttribute('title','Демонтировать устройство');
            a3.onclick = function (){send_to_storage(db_table + '_edited', item['id'],'btn_send_ma_mod_to_storage_'+item['id'], this.closest("tr"))}
        }
        else{
            a3.setAttribute('title','Отправить устройство');
            a3.setAttribute('data-bs-toggle',"modal")
            a3.setAttribute('data-bs-target',"#select_usege_Modal")
            a3.setAttribute('data-id', item['id'])
            a3.setAttribute('data-db', db_table)
        }                
        i1.setAttribute('class', "bi bi-pencil-square h7");
        i2.setAttribute('class', "bi bi-trash3 h7");
        i3.setAttribute('class', "bi bi-box-arrow-up-right h10");
        
    }) 
    tooltip_func(table_id)      
}
function create_tables2(table_id, column_name, unit_id){
    const tbody_current = document.getElementById(table_id);       
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.setAttribute('colspan', '6')
    const tr_h = document.createElement('tr');
    const thead_n = document.createElement('thead');
    thead_n.appendChild(tr_h) 
    const table_n = document.createElement('table');
    table_n.setAttribute('class','table mb-0 table-striped table-bordered table-sm')
    table_n.setAttribute('bgcolor','#989ca2')
    const tbody_n = document.createElement('tbody');
    tbody_n.setAttribute('id',"tbody_unit_modules_"+ unit_id);
    table_n.appendChild(thead_n);
    table_n.appendChild(tbody_n);
    td.appendChild(table_n);
    tr.appendChild(td);
    tbody_current.appendChild(tr);
}

async function ma_unit_storage(table_id, stor_id, tbody_ma_id){

    const table_current = document.getElementById(table_id);
    while (table_current.rows.length > 1) {table_current.deleteRow(-1);}
    while (table_current.getElementsByTagName("tbody").length>0) {table_current.removeChild(table_current.getElementsByTagName("tbody")[0]);}
    const stor_ma_unit = await fetch_data(stor_id,'/get_data_from_db/Objects_ur_lica',"POST");
    console.log("🚀 ~ ma_unit_storage ~ stor_ma_unit:", stor_ma_unit)
    const column_name = ['type_equipment','inv_number','serial_number','MAC','note'];
    const column_name_mod = ['type','inv_number','serial_number','note'];
    document.getElementById('btn_to_add_new_ma_storage').onclick = function(){
        storage_reset_tbody(this.id, stor_id)
    }
    if(Object.keys(stor_ma_unit[1]).length>0){
        for (let key in stor_ma_unit[1]){
            const new_tbody = document.createElement('tbody');
            new_tbody.setAttribute('id', 'stored_ma_unit_tbody_'+ key);
            new_tbody.setAttribute('class',"borderd_table");
            table_current.appendChild(new_tbody);
            const name_line = document.createElement('tr');
            new_tbody.appendChild(name_line)
            const td = document.createElement('td');
            td.setAttribute('colspan', '5')
            name_line.appendChild(td)
            td.innerHTML="Устройство - \"Склад-"  + stor_ma_unit[1][key]['id'] + "\""
            const empty_line = document.createElement('tr');
            empty_line.setAttribute('height',"15")
            table_current.appendChild(empty_line)          
            temp_list = [stor_ma_unit[1][key]]
            create_tables(temp_list,tbody_ma_id + key, column_name, 'MA_Units',false, 'tbody')
            if(stor_ma_unit[2][key].length > 0){
                create_tables2(tbody_ma_id  + key, column_name, stor_ma_unit[1][key]['id'] )
                create_tables(stor_ma_unit[2][key],"tbody_unit_modules_"+ stor_ma_unit[1][key]['id'], column_name_mod, 'ma_add_modules',true, 'tr')
            }
        }            
    }
    const tfoot_for_new_ma_unit = document.createElement('tfoot');
    tfoot_for_new_ma_unit.setAttribute('id','new_MA_unit_tbody_storage_id')
    table_current.appendChild(tfoot_for_new_ma_unit);
}

async function ma_add_module_storage(id){
    const tbody_curent = document.getElementById('current_MA_modules_tbody_storage_id');
    const tbody_new = document.getElementById('new_MA_modules_tbody_storage_id');
    while (tbody_new.rows.length) {tbody_new.deleteRow(0);}
    while (tbody_curent.rows.length) {tbody_curent.deleteRow(0);}
    const column_name = ['type','inv_number','serial_number','note'];
    const data = await fetch_data_2(id,'/get_data_from_db/MA_Units',"POST");
    if (data.ok){
        let stor_ma_modules = await data.json()
        if(stor_ma_modules[1].length>0){
            create_tables(stor_ma_modules[1],'current_MA_modules_tbody_storage_id', column_name, 'ma_add_modules', false,'tr')
        }
    }
    
}

async function edit_ma_unit_modal(obj_id, row_index){        
    const data = await fetch_data(obj_id,'/get_data_from_db/Objects_ur_lica',"POST");
    console.log("🚀 ~ edit_ma_unit_modal ~ data:", data)
    document.getElementById("id_for_edit").value = obj_id;
    document.getElementById('button_for_save_edit_row').setAttribute("class", "btn btn-primary");
    document.getElementById('button_for_delete_row').setAttribute("class", "btn btn-primary");
    console.log(document.getElementById("id_for_edit").value)
    document.getElementById("edit_cod_id").value = data[0].cod_name;
    document.getElementById("edit_org_id").value = data[0].organization;
    document.getElementById("edit_address_id").value = data[0].address;
    document.getElementById("edit_naklad_id").value = data[0].naklodnaja;
    document.getElementById("edit_ip_id").value = data[0].IP;
    document.getElementById("edit_inst_date_id").value = data[0].install_date;
    document.getElementById("edit_orsh_id").value = data[0].ORSH;
    document.getElementById("unit_note_id").value = data[0].note;
    document.getElementById('button_for_delete_row').onclick = function (){
        delete_row_from_edit_mod('Objects_ur_lica', obj_id , 'button_for_delete_row','tbody_main_table', row_index)};
    document.getElementById('button_for_save_edit_row').onclick = function (){
        save_edit_MA_table('tbody_main_table', row_index)};
}

async function select_usage_modal(id, db_table) {
    document.getElementById("btn_send_to_usage").setAttribute("class", "btn btn-primary");
    const select = document.getElementById('select_send_to_usage')
    while(select.length>0){select.remove(0)}
    const opt_selected = document.createElement('option')
    opt_selected.selected
    opt_selected.text = 'Выберите обьект'
    select.add(opt_selected)
    const data = await fetch_data(id,'/get_data_from_db/'+db_table+'_to_usage',"POST")
    console.log(data)
    if (db_table === "MA_Units"){        
        data.forEach(item => {
            const opt = document.createElement('option')
            opt.value = item.id
            opt.text = item.cod_name
            select.add(opt)
        })
    }
    
    if (db_table === "ma_add_modules"){        
        data.forEach(item => {
            const opt = document.createElement('option')
            opt.value = item.id
            opt.text = item.cod_name
            select.add(opt)
        })
    }
    let act_br = document.getElementsByClassName('breadcrumb-item')
    for (let i = 0; i < act_br.length; i++) {
        if(!act_br[i].classList.contains('active')){
            const opt = document.createElement('option')
            opt.value = act_br[i].dataset.id
            opt.text = act_br[i].dataset.name
            select.add(opt)
        }
    }  
    
    let target_id, target_list
    select.addEventListener("change", function() {
        target_list = this.value.split(",")
        if (target_list.length>1){target_id = target_list[1]}
        else {target_id = target_list[0]}        
    });
    document.getElementById('btn_send_to_usage').onclick = function (){
        send_to_usage(id, db_table, target_id, "btn_send_to_usage")};
}