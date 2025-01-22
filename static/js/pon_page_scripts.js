async function to_fill_sostav_modal(p_name) {
    document.getElementById('save_kts').setAttribute("class", "btn btn-primary");
    // document.getElementById("PON_id").value = p_name;
    document.getElementById("t_sostav_body").remove();
    var table = document.getElementById("Sostav_Modal_table");
    const tbody = document.createElement('tbody');
    tbody.setAttribute('id', 't_sostav_body');
    table.appendChild(tbody);
    const modules_data = await fetch_data_2(p_name,'/get_data_from_db/olt_data',"POST");
    if(modules_data.ok){
        let list_of_modules = await modules_data.json();
        for (let item in  list_of_modules){
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = item;
            tr.appendChild(td);
            for (let i in list_of_modules[item]) {
                let td = document.createElement('td');
                td.textContent = list_of_modules[item][i];
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }
    const data_for_kts = await fetch_data_2(p_name,'/get_data_from_db/kts_data_new',"POST");
    if(data_for_kts.ok){
        let kts_data = await data_for_kts.json();
        console.log(kts_data);
        document.getElementById("PON_id").value = kts_data['cod_name_of_olt'] ? kts_data['cod_name_of_olt']: '';
        document.getElementById("Ud_id").value = kts_data['UD'] ? kts_data['UD']: '';
        document.getElementById("ip_id").value = kts_data['IP'] ? kts_data['IP']: '';
        document.getElementById("olt_id").value = kts_data['OLT'] ? kts_data['OLT']: '';
        document.getElementById("inv_id").value = kts_data['inv_number'] ? kts_data['inv_number']: '';
        document.getElementById("serial_id").value = kts_data['Serial'] ?kts_data['Serial']: '';
        document.getElementById("date_pr_id").value = kts_data['date_of_production'] ?kts_data['date_of_production']: '';
        document.getElementById("date_exp_id").value = kts_data['date_of_entry'] ?kts_data['date_of_entry']: '';
        document.getElementById("full_name_id").value = kts_data['full_name'] ?kts_data['full_name']: '';
        document.getElementById("mesto_id").value = kts_data['mesto'] ?kts_data['mesto']: '';
        document.getElementById("zavod_id").value = kts_data['zavod'] ? kts_data['zavod']: '';
    }
}
async function to_fill_ud_edit_modal(id, row) {
    document.getElementById('button_for_save_edit_ud').setAttribute("class", "btn btn-primary");
    document.getElementById('button_for_delete_ud').setAttribute("class", "btn btn-primary");
    const data = await fetch_data_2(id,'/get_data_from_db/Uzel_dostupa',"POST");
    if(data.ok){
        let db_data = await data.json();
        console.log(db_data);
        document.getElementById("edit_ud_Name_id").value = db_data.name;
        document.getElementById("edit_ud_adr_id").value = db_data.Adress;
        document.getElementById("edit_ud_cod_id").value = db_data.cod_ud;
        document.getElementById('button_for_save_edit_ud').onclick = function (){save_edit_ud_data('Uzel_dostupa', id ,row)}
        document.getElementById('button_for_delete_ud').onclick = function (){delete_ud('Uzel_dostupa', id , 'button_for_delete_row','tbody_main_table',
            row)}
    }
}
async function to_fill_edit_modal(id, db, row) {
    document.getElementById('button_for_save_edit_row').setAttribute("class", "btn btn-primary");
    document.getElementById('button_for_delete_row').setAttribute("class", "btn btn-primary");
    // if (document.getElementById("div_cod")){delete_inputs_from_edit_modal()}
    const data = await fetch_data_2(id,'/get_data_from_db/'+db,"POST");
    if(data.ok){
        let db_data = await data.json();
        console.log(db_data);
        // if(db!=="olt_list"){
        //     document.getElementById("edit_Name_id").value = db_data.name_of_modules;
        // }
        // else {
        //     add_inputs_to_edit_modal()
        //     document.getElementById("edit_Name_id").value = db_data.name;
        //     document.getElementById("edit_Cod_id").value = db_data.cod_name_of_olt;
        //     document.getElementById("edit_Riad_id").value = db_data.row_box_shelf;
        //     document.getElementById("edit_IP_id").value = db_data.IP;
        // }
        document.getElementById("edit_Name_id").value = db_data.name_of_modules;
        document.getElementById("edit_Inv_id").value = db_data.inv_number;
        document.getElementById("edit_Serial_id").value = db_data.serial_number;
        document.getElementById("unit_note_id").value = db_data.note;
        document.getElementById('button_for_save_edit_row').onclick = function (){save_edit_data_pon(db, id ,row)}
        document.getElementById('button_for_delete_row').onclick = function (){delete_row_from_edit_mod(db, id , 'button_for_delete_row','tbody_main_table',
            row)}
    }
}


// function add_inputs_to_edit_modal(){
//     let divF = document.getElementById("first_row")
//     let divS = document.getElementById("second_row")
//     let div1 = document.createElement("div");
//     div1.setAttribute('class', 'col-sm');
//     div1.setAttribute('id', 'div_cod');
//     div1.innerHTML = "  <div class=\"mb-3\">\n" +
//         "                   <label class=\"col-form-label\">Код:</label>\n" +
//         "                   <input type=\"text\"  class=\"form-control\" id=\"edit_Cod_id\">\n" +
//         "               </div>" 
//     // divF.appendChild(div1);
//     let div2 = document.createElement("div");
//     div2.setAttribute('class', 'col-sm');
//     div2.setAttribute('id', 'div_row');
//     div2.innerHTML = " <div class=\"mb-3\">\n" +
//         "                   <label class=\"col-form-label\">Ряд\Шкаф\Полка:</label>\n" +
//         "                   <input type=\"text\"  class=\"form-control\" id=\"edit_Riad_id\">\n" +
//         "               </div>"
//     let div3 = document.createElement("div");
//     div3.setAttribute('class', 'col-sm');
//     div3.setAttribute('class', 'col-sm');
//     div3.setAttribute('id', 'div_ip');
//     div3.innerHTML =  " <div class=\"mb-3\">\n" +
//         "                   <label class=\"col-form-label\">IP:</label>\n" +
//         "                   <input type=\"text\"  class=\"form-control\" id=\"edit_IP_id\">\n" +
//         "               </div>"
//     divF.appendChild(div1);
//     divF.appendChild(div3);
//     divS.appendChild(div2);
// }


// function delete_inputs_from_edit_modal(){
//     document.getElementById("div_cod").remove();
//     document.getElementById("div_row").remove();
//     document.getElementById("div_ip").remove();
// }
async function save_edit_ud_data(db, id ,row_index) {
    var edited_row = {
        id: id,
        name: document.getElementById("edit_ud_Name_id").value,
        Adress: document.getElementById("edit_ud_adr_id").value,
        cod_ud: document.getElementById("edit_ud_cod_id").value,
    }
    if(confirm("Сохранить изменнения?")){
        const data = await fetch_data_2(edited_row,'/save_data/'+db, 'POST');
        if(data.ok){
            document.getElementById("button_for_save_edit_ud").setAttribute("class", "btn btn-success");
            var oCells = row_index.getElementsByTagName('td');
            oCells[0].textContent = document.getElementById("edit_ud_Name_id").value;
            oCells[1].textContent = document.getElementById("edit_ud_adr_id").value;
        }
        else{
            document.getElementById("button_for_save_edit_ud").setAttribute("class", "btn btn-danger");
            alert(data);
        }
    }
}

async function save_edit_data_pon(db, id ,row_index) {
    var edited_row = {
        id: id,
        name: document.getElementById("edit_Name_id").value,
        inv_number: document.getElementById("edit_Inv_id").value,
        serial: document.getElementById("edit_Serial_id").value,
        note: document.getElementById("unit_note_id").value,
    }
    // if(db==="olt_list"){
    //     edited_row['riad'] = document.getElementById("edit_Riad_id").value
    //     edited_row['cod_name_of_olt'] = document.getElementById("edit_Cod_id").value
    //     edited_row['IP'] = document.getElementById("edit_IP_id").value
    // }
    if (confirm("Сохранить изменнения?")){
        const data = await fetch_data_2(edited_row,'/save_data/'+db, 'POST');
        console.log(data.ok);
        if(data.ok){
            document.getElementById("button_for_save_edit_row").setAttribute("class", "btn btn-success");
            var oCells = row_index.getElementsByTagName('td');
            if(db!=="olt_list"){
                oCells[3].textContent = document.getElementById("edit_Name_id").value;
                oCells[5].querySelector('a').innerHTML = document.getElementById("edit_Inv_id").value;
                oCells[4].textContent = document.getElementById("edit_Serial_id").value;
                oCells[6].textContent = document.getElementById("unit_note_id").value;}
            else {
                oCells[1].querySelector('a').innerHTML = document.getElementById("edit_Cod_id").value;
                oCells[2].textContent = document.getElementById("edit_Name_id").value;
                oCells[3].textContent = document.getElementById("edit_IP_id").value;
                oCells[4].textContent = document.getElementById("edit_Serial_id").value;
                oCells[5].querySelector('a').innerHTML = document.getElementById("edit_Inv_id").value;
                oCells[6].textContent = document.getElementById("edit_Riad_id").value;
                oCells[7].textContent = document.getElementById("unit_note_id").value;
            }
        }
        else {
            document.getElementById("button_for_save_edit_row").setAttribute("class", "btn btn-danger");
            alert(data);
        }
    }
}
function colaps_olt_tbody(status, bat){
    let table = bat.closest('table')
    let t_bod = table.querySelector('tbody');
    let tr = t_bod.querySelectorAll('tr');
    [].forEach.call(tr, function (row) {
        status? hide_rows(row) :show_rows(row)
        colaps_btn_chng(bat, status)
    })
}
function hide_rows(row){
    row.style.display = "none"
    row.classList.remove('for_file_download')
}
function show_rows(row){
    row.removeAttribute("style")
    row.classList.add('for_file_download')
}
function colaps_btn_chng(btn, status){
    if(status){
        btn.setAttribute('data-status','plus')
        btn.setAttribute('src','/static/images/stat_plus_.svg')
    }
    else{
        btn.setAttribute('data-status','minus')
        btn.setAttribute('src','/static/images/stat_minus_.svg')
    }
}

async function move_obj_modal(id, db){
    document.getElementById("apply_move_modul_btn").setAttribute("class", "btn btn-primary");
    const slct_unit = document.getElementById('select_unit')
    const slct_sock = document.getElementById('select_socket')
    slct_sock.disabled = true;
    while(slct_unit.length>0){slct_unit.remove(0)}
    const opt_slct_unit = document.createElement('option')
    opt_slct_unit.selected
    opt_slct_unit.text = 'Выберите обьект'
    opt_slct_unit.value = '0'
    slct_unit.add(opt_slct_unit)
    const data = await fetch_data_2(id,'/get_data_from_db/'+db+'_move',"POST")
    let list_of_data = await data.json();
    console.log("🚀 ~ move_obj_modal ~ list_of_data:", list_of_data)
    let target, target_val, sockets

    Object.keys(list_of_data).forEach(item => {
        const opt = document.createElement('option')
        opt.value = list_of_data[item][0]
        opt.text = item
        slct_unit.add(opt)
    })


    slct_unit.addEventListener("change", function() {
        while(slct_sock.length>0){slct_sock.remove(0)}
        const opt_slct_sock = document.createElement('option')
        opt_slct_sock.selected
        opt_slct_sock.text = 'Выберите место'
        opt_slct_sock.value = '0'
        slct_sock.add(opt_slct_sock)
        this.options[this.selectedIndex].value === '0' ? slct_sock.disabled = true : slct_sock.disabled = false;
        target = this.options[this.selectedIndex].textContent
        target_val = this.options[this.selectedIndex].value
        // console.log(list_of_data[target])
        for(i in list_of_data[target][1]){
            console.log(i)
            const opt = document.createElement('option')
            opt.value = i
            opt.text = list_of_data[target][1][i]
            slct_sock.add(opt)
        }
    });
    document.getElementById('apply_move_modul_btn').onclick = function (){
        let socket = slct_sock.options[slct_sock.selectedIndex].value
        console.log("🚀 ~ move_obj_modal ~ socket:", socket)
        if (target_val !== '0' && socket !== '0'){
            var data = {id: id, target : target_val, socket:socket}
            console.log("🚀 ~ data:", data)
            apply_move_modul(data, db,  this)}
        else{alert('Выберите объект и плата-место')}

}}
async function apply_move_modul(edit_data, db, btn){
    if (confirm("Переместить устройство?")){
        const data = await fetch_data_2(edit_data, '/save_data/'+ db,'POST');
        if(data.ok){
            btn.setAttribute("class", "btn btn-success");
            setTimeout(function (){document.getElementById('close_mv_mod_btn').click()
                reload_page()
            }, 700);
        }
        else {
            btn.setAttribute("class", "btn btn-danger");
            alert(data);
        }
    }
}

// async function add_new_modal() {
//     const slct_ud = document.getElementById('select_ud')
//     const slct_unit = document.getElementById('select_unit')
//     while(slct_ud.length>0){slct_ud.remove(0)}
//     const opt_slct_ud = document.createElement('option')
//     opt_slct_ud.selected
//     opt_slct_ud.text = 'Выберите обьект'
//     opt_slct_ud.value = 0
//     slct_ud.add(opt_slct_ud)
//     const data = await fetch_data_2("all",'/get_data_from_db/Uzel_dostupa_all',"POST")
//     let list_of_data = await data.json();
//
//     list_of_data.forEach(item => {
//         console.log("🚀 ~ Object.keys ~ item:", item)
//         const opt = document.createElement('option')
//         opt.value = item['id']
//         opt.text = item['name'] + ' ' + item['Adress']
//         slct_ud.add(opt)
//     })
//     const opt_new = document.createElement('option')
//     opt_new.value = "new"
//     opt_new.text = "Добавить новый"
//     slct_ud.add(opt_new)
//     slct_ud.addEventListener("change", function() {
//         while(slct_unit.length>0){slct_unit.remove(0)}
//         const opt_slct_unit = document.createElement('option')
//         opt_slct_unit.selected
//         opt_slct_unit.text = 'Выберите место'
//         opt_slct_unit.value = '0'
//         slct_unit.add(opt_slct_unit)
//         if(this.options[this.selectedIndex].value === '0'){
//             slct_unit.disabled = true
//         }
//         if (this.options[this.selectedIndex].value === 'new') {
//             create_new_ud()
//         } else {
//             select_units(this.options[this.selectedIndex].value, slct_unit)
//         }
//     })
// }
function create_new_ud(){}
async function select_units(id, slct_unit) {
    slct_unit.disabled = false
    const data1 = await fetch_data_2(id,'/get_data_from_db/Uzel_dostupa_lst',"POST")
    let list_of_data1 = await data1.json();
    console.log(list_of_data1)

        Object.keys(list_of_data1).forEach(item => {
            const opt = document.createElement('option')
            opt.value = item
            opt.text = list_of_data1[item]
            slct_unit.add(opt)
        })
}

async function move_olt_modal(id, db) {
    let appl_btn = document.getElementById("apply_move_olt_btn")
    let cod = document.getElementById("cod_to_mv")
    let IP = document.getElementById("new_IP")
    let mesto  = document.getElementById("new_mesto")
    appl_btn.setAttribute("class", "btn btn-primary");
    appl_btn.disabled = true;
    const slct_ud = document.getElementById('select_ud')
    while(slct_ud.length>0){slct_ud.remove(0)}
    const opt_slct_ud = document.createElement('option')
    opt_slct_ud.selected
    opt_slct_ud.text = 'Выберите обьект'
    opt_slct_ud.value = '0'
    slct_ud.add(opt_slct_ud)
    const ud_data = await fetch_data_2("all",'/get_data_from_db/Uzel_dostupa_all',"POST")
    const olt_data = await fetch_data_2(id,'/get_data_from_db/olt_data_2',"POST")
    let list_of_data = await ud_data.json();
    let olt = await olt_data.json();
    list_of_data.forEach(item => {
        const opt = document.createElement('option')
        opt.value = item['id']
        opt.text = item['name'] + ' ' + item['Adress']
        opt.setAttribute('data-num', item['number_ud']);
        opt.setAttribute('data-cod', item['cod_ud']);
        slct_ud.add(opt)
    })
    slct_ud.addEventListener("change", function() {
        if ((this.options[this.selectedIndex].value !== '14') && (this.options[this.selectedIndex].value !== '13')){
            cod.value = olt[1]['start']+ this.options[this.selectedIndex].dataset.num + '-'
                + olt[1]['midl'] + this.options[this.selectedIndex].dataset.cod + olt[1]['end']+ '**'
            IP.value = '192.168.*.*'
            appl_btn.disabled = false;
        }
        else {cod.value = olt[1]['type']+'-'+ olt[0]['id']
            IP.value = '-'
            mesto.value = '-'
            appl_btn.disabled = false;
        }
        if (this.options[this.selectedIndex].value === '0'){
            cod.value=""
            IP.value=""
            mesto.value=""
            appl_btn.disabled = true;
        }
    })
    appl_btn.addEventListener("click", function() {
        var data = {id: id, uzel_id : slct_ud.value,
            cod_name_of_olt:cod.value, IP:IP.value, mesto:mesto.value}
        console.log("🚀 ~ apply_move_modul ~ edit_data:", data)
        apply_move_modul(data, 'olt_list', this)
    })
}
async function add_new_unit_data(id) {
    let save_btn = document.getElementById('save_new_modules');
    save_btn.setAttribute("class", "btn btn-primary");
    let cl_btn = document.getElementById('cl_add_pon_mod').onclick = function(){reload_page()}
    document.getElementById("t_body_add_to_un").remove();
    var table = document.getElementById("table_add_to_un");
    const tbody = document.createElement('tbody');
    tbody.setAttribute('id', 't_body_add_to_un');
    table.appendChild(tbody);
    let response = await fetch_data_2(id, '/get_data_from_db/olt_data_3', 'POST')
    if (response.ok){
        let data = await response.json()
        console.log("🚀 ~ add_new_unit_data ~ data:", data)
        Object.keys(data).forEach(elem => {
            var row = tbody.insertRow();
            row.insertCell(0).textContent = elem
            if(data[elem][0]){
                console.log(data[elem])
                for (let i = 1; i < data[elem].length; i++ ){
                    row.insertCell(i).textContent = data[elem][i]
                }
                row.insertCell(0).innerHTML ='<input class="form-check-input" type="checkbox" value="" checked disabled>'
            }
            else {
                let sel = document.createElement('select')
                for (let i = 1; i < data[elem].length ; i++) {
                    const opt = document.createElement('option')
                    opt.text = data[elem][i]
                    sel.add(opt)
                }
                row.insertCell(1).appendChild(sel)
                row.insertCell(2).contentEditable = true
                row.insertCell(3).contentEditable = true
                row.insertCell(4).contentEditable = true
                row.insertCell(0).innerHTML = '<input class="form-check-input" type="checkbox" value="">'
            }
        })
    }
    let ful_data = []
    save_btn.addEventListener("click", function() {
        let rows = document.getElementById('t_body_add_to_un').rows
        for (let r of rows) {
            let cells = r.cells
            let check = cells[0].querySelector('.form-check-input')
            if (check.checked === true && check.disabled === false){
                var select = cells[2].getElementsByTagName('select')[0]
                console.log(select)
                var text = select.options[select.selectedIndex].text;
                let n_data = {
                    'unit_id':id,
                    'mesto': cells[1].textContent,
                    'type' : text,
                    'name' : cells[4].textContent,
                    'inv_number': cells[3].textContent,
                    'serial': cells[5].textContent,
                }
                ful_data.push(n_data)

            }
        }
        ful_data.length > 0? add_new_pon_modules(ful_data, this.id): alert('Не выбраны новые модули для добовления')
    })
}

async function shelf_new_modules(id) {
    let save_btn = document.getElementById('save_new_mod');
    save_btn.setAttribute("class", "btn btn-primary");
    let cl_btn = document.getElementById('cl_new_pon_mod').onclick = function(){reload_page()}
    document.getElementById("t_body_add_to_shelf").remove();
    var table = document.getElementById("table_add_to_shelf");
    const tbody = document.createElement('tbody');
    tbody.setAttribute('id', 't_body_add_to_shelf');
    table.appendChild(tbody);
    let response = await fetch_data_2(id, '/get_data_from_db/olt_data_4', 'POST')
    let data
    if (response.ok){
        data = await response.json()
        add_new_row('t_body_add_to_shelf', 5)
        add_select_menu(tbody.rows[tbody.rows.length-1],data)
        document.getElementById("add_new_row").addEventListener('click', function(){
            add_new_row('t_body_add_to_shelf', 5)
            add_select_menu(tbody.rows[tbody.rows.length-1],data)
        });
        document.getElementById("rmv_lst_row").addEventListener('click', function(){
            del_row('t_body_add_to_shelf')
        });
    }
    save_btn.addEventListener("click", function() {
        let rows = document.getElementById('t_body_add_to_shelf').rows;
        let full_data = [], row_data ={}
        // rows.forEach((row) => {
        for (let row of rows) {
            let cells = row.cells
            let sel = cells[0].querySelector('select')
            let sel2 = cells[1].querySelector('select')
            if (sel.options[sel.selectedIndex].value !== '0'){
                row_data['olt_id'] = sel.options[sel.selectedIndex].value
                row_data['type_of_modules'] = sel2.options[sel2.selectedIndex].value
                row_data['name'] = cells[2].textContent
                row_data['serial_number'] = cells[3].textContent
                row_data['name_of_modules'] = cells[4].textContent
                row_data['socket'] = '75'
                full_data.push(row_data)}

        }
        console.log(full_data)
    })

}
function add_select_menu(row, data){
    let sel = document.createElement('select')
    const opt1 = document.createElement('option')
    opt1.selected
    opt1.text = 'Выберите'
    opt1.value = '0'
    sel.add(opt1)
    Object.keys(data).forEach(elem => {
        const opt = document.createElement('option')
        opt.text = data[elem][0]
        opt.value = elem
        sel.add(opt)
    })
    row.cells[0].appendChild(sel)
    sel.addEventListener('change', function(){
        row.cells[1].innerHTML=''
        let sel2 = document.createElement('select')
        if(sel.options[sel.selectedIndex].value !== '0'){
            console.log(row.cells[1].innerHTML)
            let platy = data[sel.options[sel.selectedIndex].value][1]
            Object.keys(platy).forEach(p => {
                const opt = document.createElement('option')
                opt.text = platy[p]
                opt.value = p
                sel2.add(opt)
        })
            row.cells[1].appendChild(sel2)
        }

    })
}