const get_data = {
   1 :'Uzel_dostupa',
   2 :'Uzel_dostupa_all',
   3 :'kts_data_new',
   4 :'Type_of_olt',
   5 :'olt_data',
   6 :'olt_data_2',
   7 :'olt_data_3',
   8 :'olt_data_4',
   9 :'list_of_modules',
   10 :'list_of_modules_move'
}


async function to_fill_sostav_modal(id, un_row) {
    let tbody = document.getElementById("t_sostav_body");
    let delBtn = document.getElementById('del_pon_unit')
    try {

        clearTbody(tbody);
        const modules_data = await fetch_data_get(id, get_data[5]);
        if (modules_data.ok) {
            let list_of_modules = await modules_data.json();
            console.log("🚀 ~ to_fill_sostav_modal ~ list_of_modules:",list_of_modules)
            console.log(Object.keys(list_of_modules).length)
            Object.keys(list_of_modules).length > 0? delBtn.disabled = true: delBtn.disabled = false
            const ordered = Object.keys(list_of_modules)
                .sort() // Sort the keys alphabetically
                .reduce((obj, key) => {
                    obj[key] = list_of_modules[key]; // Rebuild the object with sorted keys
                    return obj;
                }, {});
            // list_of_modules.sort((a,b) => a.socket - b.socket);
            for (let item in ordered) {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                item !== '-1' ?td.textContent = item : td.textContent ='fan';
                tr.appendChild(td);
                for (let i in ordered[item]) {
                    let td = document.createElement('td');
                    td.textContent = ordered[item][i];
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }
        }
        const getData = await fetch_data_get(id, get_data[3]);
        if (getData.ok) {
            let unit_data= await getData.json();
            console.log("🚀 ~ to_fill_sostav_modal ~ unit_data:", unit_data)
            document.getElementById("PON_id").value = unit_data[0]['cod_name_of_olt'] ? unit_data[0]['cod_name_of_olt'] : '';
            document.getElementById("Ud_id").value = unit_data[1] ? unit_data[1] : '';
            document.getElementById("ip_id").value = unit_data[0]['IP'] ? unit_data[0]['IP'] : '';
            document.getElementById("olt_id").value = unit_data[0]['OLT'] ? unit_data[0]['OLT'] : '';
            document.getElementById("inv_id").value = unit_data[0]['inv_number'] ? unit_data[0]['inv_number'] : '';
            document.getElementById("serial_id").value = unit_data[0]['serial_number'] ? unit_data[0]['serial_number'] : '';
            document.getElementById("date_pr_id").value = unit_data[0]['date_of_production'] ? unit_data[0]['date_of_production'] : '';
            document.getElementById("date_exp_id").value = unit_data[0]['date_of_entry'] ? unit_data[0]['date_of_entry'] : '';
            document.getElementById("full_name_id").value = unit_data[0]['full_name'] ? unit_data[0]['full_name'] : '';
            document.getElementById("mesto_id").value = unit_data[0]['row_box_shelf'] ? unit_data[0]['row_box_shelf'] : '';
            document.getElementById("zavod_id").value = unit_data[0]['zavod'] ? unit_data[0]['zavod'] : '';
        }
        document.getElementById('kts').onclick = () => { downloadFile('kts', id); }
        document.getElementById('sostav').onclick = () => { downloadFile('sostav', id); }
    } catch (error) {
        console.error("Error in to_fill_sostav_modal:", error);
    }
    document.getElementById('save_kts').onclick= () => {save_kts_data(id, un_row)}
    delBtn.onclick= async ()=>{let resp = await deletePONdata(id,'List_of_OLT')
                            if(resp.ok){
                                liveToast(true, "Устройство удаленно!")
                                setTimeout(reload_page, 800)
                            }
                            else if (resp.status === 420){
                                alert(await resp.json())
                                liveToast(false, "Ошибка удаления")
                                alert(await resp.json())
                            }
                            else {
                                liveToast(false, "Ошибка удаления")
                                console.log('delPonData error - '+ await resp.json())
                            }
    }

}

async function save_kts_data(id, un_row) {
    var kts_data = {
        id: id,
        UD:document.getElementById("Ud_id").value,
        cod_name_of_olt: document.getElementById("PON_id").value,
        IP: document.getElementById("ip_id").value,
        OLT:  document.getElementById("olt_id").value,
        inv_number: document.getElementById("inv_id").value,
        serial_number: document.getElementById("serial_id").value,
        date_of_production: document.getElementById("date_pr_id").value,
        date_of_entry: document.getElementById("date_exp_id").value,
        full_name: document.getElementById("full_name_id").value,
        row_box_shelf: document.getElementById("mesto_id").value,
        zavod: document.getElementById("zavod_id").value,
    }
    console.log(kts_data)
    if (confirm("Сохранить изменнения?")){
        const fetch_response = await fetch_data_post(kts_data,'KTS',1);
        console.log("🚀 ~ save_edit_buh_data ~ data:", fetch_response)
        if(fetch_response.ok){
            liveToast(true,"Данные сохраненны");
            let cells = un_row.getElementsByTagName('td');
            cells[0].textContent='OLT#'+kts_data.OLT;
            cells[1].querySelector('a').innerHTML = kts_data['cod_name_of_olt'];
            cells[2].textContent=kts_data['full_name'];
            cells[3].textContent='s/n: '+kts_data['serial_number'];
            cells[4].querySelector('a').innerHTML = kts_data['inv_number'];
            cells[4].querySelector('a').dataset.id = kts_data['inv_number'];
            cells[5].textContent='IP: '+kts_data['IP'];
            cells[6].textContent='Место: '+kts_data['row_box_shelf'];
            
        }
        else {
            liveToast(false,"Ошибка сохранения");
            console.log("error save kts data: " + await fetch_response.json());
        }
        
    }
}

// async function to_fill_ud_edit_modal(id, row) {
//     document.getElementById('button_for_save_edit_ud').setAttribute("class", "btn btn-primary");
//     document.getElementById('button_for_delete_ud').setAttribute("class", "btn btn-primary");
//     const data = await fetch_data_get(id,get_data[1]);
//     if(data.ok){
//         let db_data = await data.json();
//         console.log(db_data);
//         document.getElementById("edit_ud_Name_id").value = db_data.name;
//         document.getElementById("edit_ud_adr_id").value = db_data.Adress;
//         document.getElementById("edit_ud_cod_id").value = db_data.cod_ud;
//         document.getElementById('button_for_save_edit_ud').onclick =  ()=>{save_edit_ud_data('Uzel_dostupa', id ,row)}
//         document.getElementById('button_for_delete_ud').onclick =  ()=>{del_ud(id)
//
// }
// }}




async function to_fill_edit_modal(id, db, row) {
    const data = await fetch_data_get(id,get_data[9]);
    if(data.ok){
        let db_data = await data.json();
        console.log(db_data);
        document.getElementById("edit_Name_id").value = db_data.name_of_modules;
        document.getElementById("edit_Inv_id").value = db_data.inv_number;
        document.getElementById("edit_Serial_id").value = db_data.serial_number;
        document.getElementById("unit_note_id").value = db_data.note;
        document.getElementById('button_for_save_edit_row').onclick = function (){save_edit_data_pon(db, id ,row)}
        document.getElementById('button_for_delete_row').onclick = async function (){
            let resp = await deletePONdata(id, 'List_of_modules')
            if(resp.ok){
                liveToast(true, "Модуль удален")
                row.remove()
                setTimeout(function (){document.getElementById('btn_cls_edit_mod').click()}, 800)
            }
            else liveToast(false, "Ошибка удаления")
        }
    }
}
async function deletePONdata(id, db){
    if (confirm("Удалить запись?")){
        var id_val = {id: id}
        return await fetch_data_post(id_val, db, 2)
}}



async function save_edit_data_pon(db, id ,row_index) {
    var edited_row = {
        id: id,
        name: document.getElementById("edit_Name_id").value,
        inv_number: document.getElementById("edit_Inv_id").value,
        serial: document.getElementById("edit_Serial_id").value,
        note: document.getElementById("unit_note_id").value,
    }
    if (confirm("Сохранить изменнения?")){
        const data = await fetch_data_post(edited_row,db, 1);
        console.log(data.ok);
        if(data.ok){
            liveToast(true, "Данные сохранены")
            var oCells = row_index.getElementsByTagName('td');
            oCells[3].textContent = document.getElementById("edit_Name_id").value;
            oCells[5].querySelector('a').innerHTML = document.getElementById("edit_Inv_id").value;
            oCells[5].querySelector('a').dataset.id = document.getElementById("edit_Inv_id").value;
            oCells[4].textContent = document.getElementById("edit_Serial_id").value;
            oCells[6].textContent = document.getElementById("unit_note_id").value;}
        else {
            liveToast(false,"Ошибка сохранения")
            console.log("error save edit modul data: " + await data.json());
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

async function move_modul_modal(id){
    const slct_unit = document.getElementById('select_unit')
    const slct_sock = document.getElementById('select_socket')
    slct_sock.disabled = true;
    while(slct_unit.length>1){slct_unit.remove(1)}
    const data = await fetch_data_get(id,get_data[10])
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
        while(slct_sock.length>1){slct_sock.remove(1)}
        this.options[this.selectedIndex].value === '0' ? slct_sock.disabled = true : slct_sock.disabled = false;
        target = this.options[this.selectedIndex].textContent
        target_val = this.options[this.selectedIndex].value
        for(let i in list_of_data[target][1]){
            const opt = document.createElement('option')
            opt.value = i
            list_of_data[target][1][i] === -1 ? opt.text = 'fan' : opt.text = list_of_data[target][1][i]
            slct_sock.add(opt)
        }
    });
    document.getElementById('apply_move_modul_btn').onclick = function (){
        let socket = slct_sock.options[slct_sock.selectedIndex].value
        console.log("🚀 ~ move_obj_modal ~ socket:", socket)
        if (target_val !== '0' && socket !== '0'){
            var data = {id: id, target : target_val, socket:socket}
            console.log("🚀 ~ data:", data)
            apply_move_modul(data, 'list_of_modules')}
        else{liveToast(false,'Выберите объект и плата-место')}
}}
async function apply_move_modul(edit_data, db){
    if (confirm("Переместить устройство?")){
        const data = await fetch_data_post(edit_data, db,1);
        if(data.ok){
            liveToast(true,"Модуль перемещен")
            setTimeout(function (){document.getElementById('close_mv_mod_btn').click()
                reload_page()
            }, 700);
        }
        else {
            liveToast(false,"Ошибка при перемещении")
            console.log("error move  pon modul: " + await data.json());
        }
    }
}

async function add_new_unit(id,tm) {
    let appl_btn = document.getElementById("save_new_unit")
    appl_btn.disabled = true;
    let cod = document.getElementById("cod_new_un")
    let IP = document.getElementById("ip_new_un")
    let mesto  = document.getElementById("mecto_new_un")
    const slct = document.getElementById('select_type_unit')
    slct.removeEventListener('click',async (e) => {})
    while(slct.length>1){slct.remove(1)}
    const data = await fetch_data_get("all",get_data[4])
    let list_of_data = await data.json();
    list_of_data.forEach(item => {
        console.log("🚀 ~ Object.keys ~ item:", item)
        const opt = document.createElement('option')
        opt.value = item['id']
        opt.text = item['type'] 
        slct.add(opt)
    })
    slct.addEventListener("change", async (e) => {
        cod.value =''
        IP.value = ''
        mesto.value =''
        let val =e.target.options[e.target.selectedIndex].value
        if( val !== '0'){
            IP.readOnly = false;
            mesto.readOnly = false;
            cod.readOnly = false;
            appl_btn.disabled = false;
            if(id !== 13 && id!==14){
                IP.value = '192.168.*.*'
                list_of_data.forEach(item => {
                    if(item['id'].toString() === val){
                        cod.value = item['start']+ '**' + '-'
                            + item['midl'] + tm + item['end']+ '**'
                    }
                })}
                else{
                    cod.value='Устройство ' + e.target.options[e.target.selectedIndex].text
                    cod.readOnly = false
                    IP.readOnly = true;
                    mesto.readOnly = true;
                    appl_btn.disabled = false;
                }
        }
        else {
            cod.readOnly = true
            IP.readOnly = true;
            mesto.readOnly = true;
            appl_btn.disabled = true;   }
    })
    appl_btn.addEventListener('click', ()=>{
        let data = {
            'UD': id,
            "type_of_olt":slct.options[slct.selectedIndex].value,
            'IP': IP.value,
            'cod_name_of_olt': cod.value,
            'mesto': mesto.value
        }
        apply_create_unit(data, 'NewPONnit' )
    })
    // document.getElementById('cl_add_pon_un').onclick =  () => { reload_page() }
}

async function apply_create_unit(data, db){
    console.log("🚀 ~ apply_create_unit ~ data:", data)
    if (confirm("Добавить новое устройство?")){
        const response = await fetch_data_post(data, db,1);
        if(response.ok){
            liveToast(true,"Новое устройство добавлено")
            setTimeout(function (){document.getElementById('close_mv_mod_btn').click()
                reload_page()
            }, 700);
        }
        else if(response.status === 420) liveToast(false, await response.json())
        else {
            liveToast(false,"Ошибка добавления нового устройства")
            console.error("error move  pon modul: " + await response.json());
        }
    }
}

function clearTbody(tbody){
    while (tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild)
}


async function settings_obj_data(qualifiedName){
    document.getElementById('form_settings_obj_data').innerHTML= ud_settings_html
    let save_btn = document.getElementById("save_ud_data")
    let del_btn = document.getElementById("del_ud_data")
    save_btn.disabled = true;
    del_btn.disabled = true;
    let lst_obj = document.getElementById('list_of_obj');

    const response = await fetch_data_get('all',get_data[2])
    const data = await response.json();
    Object.keys(data).forEach(item => {
        const li = document.createElement('li')
        li.value = item;
        li.textContent = data[item]['name'];
        lst_obj.appendChild(li);
    })

    let links = document.querySelectorAll('#div_of_obj ul li');
    links.forEach(function (element) {
        element.addEventListener('click', function (e) {
            links.forEach(function (element) {
                element.classList.remove('active');
            });
            document.getElementById("ud_name").removeAttribute('style')
            this.classList.add('active');
            fill_inputs(this.value);
        });
    });
    let id
    function fill_inputs(key){
        save_btn.disabled = false;
        if(key!==999){
            id = data[key]['id']
            del_btn.disabled = false;
            document.getElementById('ud_name').value = data[key]['name'];
            document.getElementById('ud_address').value = data[key]['Adress'];
            document.getElementById('ud_tm_num').value = data[key]['number_ud'];
            document.getElementById('ud_tm_cod').value = data[key]['cod_ud'];
        }
        else {
            id = 0
            del_btn.disabled = true;
            document.getElementById('ud_name').value = '';
            document.getElementById('ud_address').value = '';
            document.getElementById('ud_tm_num').value = '';
            document.getElementById('ud_tm_cod').value = '';
        }

    }
    save_btn.onclick = function () {
        document.getElementById("ud_name").value !==''? save_edit_ud_data('Uzel_dostupa', id ):
            // document.getElementById("ud_name").styl
            document.getElementById("ud_name").setAttribute('style', 'border-color:red')
        }
    del_btn.onclick = function (){del_ud(id)}
    // lst_obj.addEventListener('click')
}
async function settings_unit_data(qualifiedName){
    document.getElementById('form_settings_obj_data').innerHTML= unit_settings_html
    let save_btn = document.getElementById("save_ud_data")
    let del_btn = document.getElementById("del_ud_data")
    save_btn.disabled = true;
    del_btn.disabled = true;
    let lst_obj = document.getElementById('list_of_obj');

    const response = await fetch_data_get('all',get_data[4])
    const data = await response.json();
    console.log("🚀 ~ settings_unit_data ~ data:", data)
    Object.keys(data[0]).forEach(item => {
        const li = document.createElement('li')
        li.value = item;
        li.textContent = data[0][item]['type'];
        lst_obj.appendChild(li);
    })

    let links = document.querySelectorAll('#div_of_obj ul li');
    links.forEach(function (element) {
        element.addEventListener('click', function (e) {
            links.forEach(function (element) {
                element.classList.remove('active');
            });
            document.getElementById("un_name").removeAttribute('style')
            this.classList.add('active');
            fill_inputs(this.value);
        });
    });
    let id
    function fill_inputs(key){
        save_btn.disabled = false;
        if(key!==999){
            id = data[0][key]['id']
            del_btn.disabled = false;
            document.getElementById('un_name').value = data[0][key]['type'];
            document.getElementById('un_start').value = data[0][key]['start'];
            document.getElementById('un_end').value = data[0][key]['end'];
            let lst = []
            Object.keys(data[1]).forEach(item => {
                if(data[1][item]['socket']===-1){}
                else if(data[1][item]['type_of_olt'] === id){lst.push(data[1][item]['socket'])}
                
            })
            document.getElementById('socket_start').value = Math.min(...lst)
            document.getElementById('socket_end').value = Math.max(...lst)


        }
        else {
            id = 0
            del_btn.disabled = true;
            document.getElementById('un_name').value = '';
            document.getElementById('un_start').value = '';
            document.getElementById('un_end').value = '';
        }

    }
    save_btn.onclick = function () {
        document.getElementById("ud_name").value !==''? save_edit_ud_data('Uzel_dostupa', id ):
            // document.getElementById("ud_name").styl
            document.getElementById("ud_name").setAttribute('style', 'border-color:red')
        }
    del_btn.onclick = function (){del_ud(id)}
    // lst_obj.addEventListener('click')
}

async function save_edit_ud_data(db, id) {
    var edited_row = {
        id: id,
        name: document.getElementById("ud_name").value,
        Adress: document.getElementById("ud_address").value,
        number_ud: document.getElementById("ud_tm_num").value,
        cod_ud: document.getElementById("ud_tm_cod").value,

    }
    if(confirm("Сохранить изменнения?")){
        const data = await fetch_data_post(edited_row,db, 1);
        if(data.ok){
            liveToast(true,"Данные сохранены")
            await settings_obj_data()
        }
        else{
            liveToast(false,"Ошибка сохранения")
            console.log("error save edit UD data: " + await data.json());
        }
    }
}

async function del_ud(id){
    let resp = await deletePONdata(id, 'Uzel_dostupa')
    console.log("🚀 ~ resp:", resp.status)
    if(resp.ok){
        liveToast(true, "Объект удален")
        await settings_obj_data()
    }
    else if (resp.status === 420){
        alert(await resp.json())
        liveToast(false, "Ошибка удаления")
    }
    else {
        liveToast(false, "Ошибка удаления")
        console.log('delPonData error - '+ await resp.json())
    }
}

async function move_olt_modal(id) {
    let appl_btn = document.getElementById("apply_move_olt_btn")
    let cod = document.getElementById("cod_to_mv")
    let IP = document.getElementById("new_IP")
    let mesto  = document.getElementById("new_mesto")
    appl_btn.disabled = true;
    const slct_ud = document.getElementById('select_ud')
    while(slct_ud.length>1){slct_ud.remove(1)}
    const ud_data = await fetch_data_get("all",get_data[2])
    const olt_data = await fetch_data_get(id,get_data[6])
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
            cod.value = olt[1]['start']+ '**' + '-'
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
        apply_move_modul(data, 'olt_list', this)
    })
}
async function add_new_unit_data(id) {
  // Add event listener to reload page when 'cl_add_pon_mod' is clicked
  document.getElementById('cl_add_pon_mod').addEventListener('click', reload_page);

  const tbody = document.getElementById("t_body_add_to_un");
  clearTbody(tbody);
  const response = await fetch_data_get(id, get_data[7]);
  if (response.ok) {
    const data = await response.json();
    console.log("🚀 ~ add_new_unit_data ~ data:", data);

    // Iterate over each key of the returned data object
    Object.keys(data).forEach((elem) => {
      // Create a new row and insert the key value as the first cell
      const row = tbody.insertRow();
      row.insertCell(0).textContent = elem !=='-1' ? elem : 'fan';

      if (data[elem][0]) {
        // For rows where the first element is truthy.
        console.log(data[elem]);
        // Insert remaining cells with data values (starting from index 1)
        for (let i = 1; i < data[elem].length; i++) {

          row.insertCell(i).textContent = data[elem][i];
        }
        // Prepend a disabled and checked checkbox cell at the beginning
        row.insertCell(0).innerHTML =
          '<input class="form-check-input" type="checkbox" value="" checked disabled>';
      } else {
        // For rows where the first element is falsy: create a select element.
        let sel = document.createElement('select');
        for (let i = 1; i < data[elem].length; i++) {
          const opt = document.createElement('option');
          opt.text = data[elem][i];
          sel.add(opt);
        }

        // Append additional editable cells and a select cell
        row.insertCell(1).appendChild(sel);         // Cell for select dropdown
        row.insertCell(2).contentEditable = true;     // Editable cell
        row.insertCell(3).contentEditable = true;     // Editable cell
        row.insertCell(4).contentEditable = true;     // Editable cell
        // Prepend an enabled checkbox cell at the beginning
        row.insertCell(0).innerHTML =
          '<input class="form-check-input" type="checkbox" value="">';
      }
    });
  }

  // Collect new module data when the 'save' button is clicked
  let ful_data = [];
  document.getElementById('save_new_modules').addEventListener("click", function () {
    const rows = document.getElementById('t_body_add_to_un').rows;
    console.log("🚀 ~ rows:", rows)
    for (const row of rows) {
      const cells = row.cells;
      const checkbox = cells[0].querySelector('.form-check-input');
      // Process only rows with an enabled and checked checkbox
      if (checkbox.checked && !checkbox.disabled) {
        const selectElement = cells[2].querySelector('select');
        console.log(selectElement);
        const selectedType = selectElement.options[selectElement.selectedIndex].text;
        const n_data = {
          'unit_id': id,
          'mesto': cells[1].textContent,
          'type': selectedType,
          'name': cells[4].textContent,
          'inv_number': cells[3].textContent,
          'serial': cells[5].textContent,
        };
        ful_data.push(n_data);
      }
    }
    if (ful_data.length > 0) {
      add_new_pon_modules(ful_data, this.id);
    } else {
      alert('Не выбраны новые модули для добавления');
    }
  });
}

async function shelf_new_modules(id) {
    document.getElementById('cl_new_pon_mod').addEventListener('click',reload_page)
    const tbody = document.getElementById('t_body_add_to_shelf');
    clearTbody(tbody)
    let response = await fetch_data_get(id, get_data[8])
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
    document.getElementById('save_new_modules_shelf').addEventListener("click", function() {
        let rows = tbody.getElementsByTagName('tr')
        let full_data = []
        for (let i = 0; i< rows.length;  i++) {
            let row_data ={}
            let cells = rows[i].cells
            let sel = cells[0].querySelector('select')
            let sel2 = cells[1].querySelector('select')
            if (sel.options[sel.selectedIndex].value !== '0'){
                row_data['unit_id'] = id
                row_data['type'] = sel2.options[sel2.selectedIndex].text
                row_data['name'] = cells[2].textContent
                row_data['serial'] = cells[3].textContent
                row_data['inv_number'] = cells[4].textContent
                full_data.push(row_data)
                if (rows[i].classList.contains('table-danger')){
                    rows[i].classList.remove('table-danger')
                }
                rows[i].classList.add('table-success')
            }
            else rows[i].classList.add('table-danger')
        }
        console.log(full_data)
        full_data.length > 0? add_new_pon_modules(full_data): alert('Не введены новые модули для добовления')
        for (let i = rows.length-1; i >= 0;  i--) {
            if (rows[i].classList.contains('table-success')) rows[i].remove()
        }
    })
}

async function add_new_pon_modules(data){
    if (confirm("Сохранить изменнения?")){
        const response = await fetch_data_post(data,'add_new_pon_modules',1);
        if(response.ok){
            liveToast(true, "Данные добавлены успешно")
        }
        else{
            liveToast(false, response.json)
            console.log(await response.json())
        }
    }
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


function serechRowsWithCheckInputs(){
    let data = [];
    [].forEach.call(document.getElementsByClassName('ud_tbody'), function (ud_tb) {
        let units = ud_tb.getElementsByClassName('plata_tbody');
        for(let i =0; i<units.length; i++){
            let rows =  units[i].getElementsByTagName('tr')
            for(let j = 0; j < rows.length; j++ ){
                data.push(rows[j])
            }
        }
    });
    return data
}


function set_custom_bg_color_PON_table(status, color) {
let rows = serechRowsWithCheckInputs()
for(row of rows){
    let td0 = row.getElementsByTagName('td')[0]
    if(td0.querySelector('.form-check-input') && td0.querySelector('.form-check-input').checked){
        if(status){
            save_color_in_db('List_of_modules', td0.dataset.id, color)
            row.setAttribute('bgcolor',color)
        } 
        else{
            save_color_in_db('List_of_modules', td0.dataset.id,'')
            row.removeAttribute("bgcolor");
        }
    }
    td0.querySelector('.form-check-input').checked = false      
}     
}

function check_all_visible_PON_table(status){
    let rows = serechRowsWithCheckInputs()
    for(row of rows){
        let td0 = row.getElementsByTagName('td')[0]
        if(row.getAttribute("style") !== 'display: none;' && td0.querySelector('.form-check-input')){
            td0.querySelector('.form-check-input').checked = status
        }
        }
}

function show_checked_PON_table(status){
    let rows = serechRowsWithCheckInputs()
    for(row of rows){
        let td0 = row.getElementsByTagName('td')[0]
        if(td0.querySelector('.form-check-input') && td0.querySelector('.form-check-input').checked===false){
            if(status){
                row.style.display = "none"
                row.classList.remove('for_file_download')
            } 
            else{
                row.removeAttribute("style");
                row.classList.add('for_file_download')
            } 
            }
        }
        hidePONunit()
    }

function hidePONunit(){
    [].forEach.call(document.getElementsByClassName('ud_tbody'), function (ud_tb) {
        let ud =[]
        let units = ud_tb.getElementsByClassName('olt_tbody');
        for(let i =0; i<units.length; i++){
            let btn = units[i].querySelectorAll('img')[1]
            let un = []
            let unit = units[i].getElementsByClassName('plata_tbody')
            let shassi_row = units[i].rows[0]
            let rows =  unit[0].getElementsByTagName('tr')
            for(let j = 0; j < rows.length; j++ ){
                if(rows[j].style.display === "none") un.push(rows[j])
            }
        
            if (rows.length === un.length) {
                units[i].closest('tr').style.display = "none"
                shassi_row.classList.remove('for_file_download')
                ud.push(un)
            }
            else if(un.length === 0){
                units[i].closest('tr').removeAttribute("style");
                shassi_row.classList.add('for_file_download')
                colaps_btn_chng(btn,false)
            }
            else{
                colaps_btn_chng(btn,true)
            }
        }
        ud.length === units.length? ud_tb.style.display = "none":ud_tb.removeAttribute("style");
    });
}
const ud_settings_html = ' <div class="row_ud_data">\n' +
    '\n' +
    '                            <div id="div_of_obj"  class="rounded bg-secondary-subtle">\n' +
    '                                <ul  id="list_of_obj">\n' +
    '                                <li value = 999 >Новый</li>\n' +
    '                                </ul>\n' +
    '                            </div>\n' +
    '\n' +
    '                            <div class="rounded bg-secondary-subtle" id="col-ud-data">\n' +
    '                                <div class="row">\n' +
    '                                    <label for="ud_name">Название объекта связи <i>(уникальное)</i></label>\n' +
    '                                    <input type="text" class="ud_data" id="ud_name" style="box-sizing: border-box">\n' +
    '                                </div>\n' +
    '                                <div class="row">\n' +
    '                                    <label for="ud_address">Адрес объекта связи</label>\n' +
    '                                    <input type="text" class="ud_data" id="ud_address" style="box-sizing: border-box">\n' +
    '                                </div>\n' +
    '                                <div class="row">\n' +
    '                                    <div class="col">\n' +
    '                                        <label for="ud_tm_cod">района обслуживания СПД <i>(A5GM \'XX\' -)</i></label>\n' +
    '                                        <input type="text" class="ud_data" id="ud_tm_num" placeholder="XX" style="width: 100%">\n' +
    '                                    </div>\n' +
    '                                    <div class="col">\n' +
    '                                        <label for="ud_tm_cod">Идентификатор выноса <i>(-A \'XXX\' UL01)</i></label>\n' +
    '                                        <input type="text" class="ud_data" id="ud_tm_cod" placeholder="XXX" style="width: 100%">\n' +
    '                                    </div>\n' +
    '\n' +
    '                                </div>\n' +
    '                                <div class="row">\n' +
    '                                    <div class="col-sm custom-footer" >\n' +
    '\n' +
    '\n' +
    '                                        <button type="button" class="btn btn-primary" id = "save_ud_data"  data-toggle="tooltip" data-placement="top" title=\'Сохранить изменения\'>\n' +
    '                                            <i class="bi bi-floppy"></i>\n' +
    '                                        </button>\n' +
    '                                        <button type="button" class="btn btn-primary" id = "del_ud_data"  data-toggle="tooltip" data-placement="top" title=\'Удалить устройство\'>\n' +
    '                                            <i class="bi bi-trash3"></i>\n' +
    '                                        </button>\n' +
    '\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '\n' +
    '\n' +
    '                            </div>\n' +
    '                        </div>'
const unit_settings_html = ' <div class="row_ud_data">\n' +
    '\n' +
    '                            <div id="div_of_obj"  class="rounded bg-secondary-subtle">\n' +
    '                                <ul  id="list_of_obj">\n' +
    '                                <li value = 999 >Новый</li>\n' +
    '                                </ul>\n' +
    '                            </div>\n' +
    '\n' +
    '                            <div class="rounded bg-secondary-subtle" id="col-ud-data">\n' +
    '                                <div class="row">\n' +
    '                                    <label for="ud_name">Название устройства: <i>(уникальное)</i></label>\n' +
    '                                    <input type="text" class="ud_data" id="un_name" style="box-sizing: border-box">\n' +
    '                                </div>\n' +
    '                                <div class="row">\n' +
    '                                    <div class="col">\n' +
    '                                    <label for="ud_address">Признак сети:</label>\n' +
    '                                    <input type="text" class="ud_data" id="un_start" style="width: 100%">\n' +
    '                                    </div>\n' +
    '                                    <div class="col">\n' +
    '                                    <label for="ud_address">Тип оборудования:</label>\n' +
    '                                    <input type="text" class="ud_data" id="un_end" style="width: 100%">\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                                <div class="row">\n' +
 
    '                                    <div style = "display:flex;gap:1rem;align-items:baseline" >\n' +
    '                                        <label for="ud_tm_cod">Диапазон мест для установки плат: </label>\n' +
    '                                        <input type="number" class="ud_data" id="socket_start" style="width:7%">\n' +
    '                                        <label for="ud_tm_cod"> - </label>\n' +
    '                                        <input type="number" class="ud_data" id="socket_end" style="width:7%">\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '                                <div class="row">\n' +
    '                                    <div class="col-sm custom-footer" >\n' +
    '\n' +
    '\n' +
    '                                        <button type="button" class="btn btn-primary" id = "save_ud_data"  data-toggle="tooltip" data-placement="top" title=\'Сохранить изменения\'>\n' +
    '                                            <i class="bi bi-floppy"></i>\n' +
    '                                        </button>\n' +
    '                                        <button type="button" class="btn btn-primary" id = "del_ud_data"  data-toggle="tooltip" data-placement="top" title=\'Удалить устройство\'>\n' +
    '                                            <i class="bi bi-trash3"></i>\n' +
    '                                        </button>\n' +
    '\n' +
    '                                    </div>\n' +
    '                                </div>\n' +
    '\n' +
    '\n' +
    '                            </div>\n' +
    '                        </div>'
