async function to_fill_sostav_modal(p_name, ud) {
    document.getElementById('save_kts').setAttribute("class", "btn btn-primary");
    document.getElementById("PON_id").value = p_name;
    document.getElementById("t_sostav_body").remove();
    var table = document.getElementById("Sostav_Modal_table");
    const tbody = document.createElement('tbody');
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
    const data_for_kts = await fetch_data_2(p_name,'/get_data_from_db/kts_data',"POST");
    if(data_for_kts.ok){
        let kts_data = await data_for_kts.json();
        document.getElementById("Ud_id").value = kts_data['UD'];
        document.getElementById("ip_id").value = kts_data['IP'];
        document.getElementById("olt_id").value = kts_data['OLT'];
        document.getElementById("inv_id").value = kts_data['inv_number'];
        document.getElementById("serial_id").value = kts_data['Serial'];
        document.getElementById("date_pr_id").value = kts_data['date_of_production'];
        document.getElementById("date_exp_id").value = kts_data['date_of_entry'];
        document.getElementById("full_name_id").value = kts_data['full_name'];
        document.getElementById("mesto_id").value = kts_data['mesto'];
        document.getElementById("zavod_id").value = kts_data['zavod'];

        tbody.setAttribute("id", "t_body");
        table.appendChild(tbody);
    }
}


async function to_fill_edit_modal(id, db, row) {
    document.getElementById('button_for_save_edit_row').setAttribute("class", "btn btn-primary");
    document.getElementById('button_for_delete_row').setAttribute("class", "btn btn-primary");
    if (document.getElementById("div_cod")){delete_inputs_from_edit_modal()}
    const data = await fetch_data_2(id,'/get_data_from_db/'+db,"POST");
    if(data.ok){
        let db_data = await data.json();
        console.log(db_data);
        if(db!=="olt_list"){
            document.getElementById("edit_Name_id").value = db_data.name_of_modules;
        }
        else {
            add_inputs_to_edit_modal()
            document.getElementById("edit_Name_id").value = db_data.name;
            document.getElementById("edit_Cod_id").value = db_data.cod_name_of_olt;
            document.getElementById("edit_Riad_id").value = db_data.row_box_shelf;
            document.getElementById("edit_IP_id").value = db_data.IP;
        }
        document.getElementById("edit_Inv_id").value = db_data.inv_number;
        document.getElementById("edit_Serial_id").value = db_data.serial_number;
        document.getElementById("unit_note_id").value = db_data.note;
        document.getElementById('button_for_save_edit_row').onclick = function (){save_edit_data_pon(db, id ,row)}
        document.getElementById('button_for_delete_row').onclick = function (){delete_row_from_edit_mod(db, id , 'button_for_delete_row','tbody_main_table',
            row)}
    }
}


function add_inputs_to_edit_modal(){
    let divF = document.getElementById("first_row")
    let divS = document.getElementById("second_row")
    let div1 = document.createElement("div");
    div1.setAttribute('class', 'col-sm');
    div1.setAttribute('id', 'div_cod');
    div1.innerHTML = "  <div class=\"mb-3\">\n" +
        "                   <label class=\"col-form-label\">Код:</label>\n" +
        "                   <input type=\"text\"  class=\"form-control\" id=\"edit_Cod_id\">\n" +
        "               </div>" +
    divF.appendChild(div1);
     let div2 = document.createElement("div");
    div2.setAttribute('class', 'col-sm');
    div2.setAttribute('id', 'div_row');
    div2.innerHTML = " <div class=\"mb-3\">\n" +
        "                   <label class=\"col-form-label\">Ряд\Шкаф\Полка:</label>\n" +
        "                   <input type=\"text\"  class=\"form-control\" id=\"edit_Riad_id\">\n" +
        "               </div>"
    let div3 = document.createElement("div");
    div3.setAttribute('class', 'col-sm');
    div3.setAttribute('class', 'col-sm');
    div3.setAttribute('id', 'div_ip');
    div3.innerHTML =  " <div class=\"mb-3\">\n" +
        "                   <label class=\"col-form-label\">IP:</label>\n" +
        "                   <input type=\"text\"  class=\"form-control\" id=\"edit_IP_id\">\n" +
        "               </div>"
    divF.appendChild(div1);
    divF.appendChild(div3);
    divS.appendChild(div2);
}


function delete_inputs_from_edit_modal(){
    document.getElementById("div_cod").remove();
    document.getElementById("div_row").remove();
    document.getElementById("div_ip").remove();
}


async function save_edit_data_pon(db, id ,row_index) {
    var edited_row = {
        id: id,
        name: document.getElementById("edit_Name_id").value,
        inv_number: document.getElementById("edit_Inv_id").value,
        serial: document.getElementById("edit_Serial_id").value,
        note: document.getElementById("unit_note_id").value,
    }
    if(db==="olt_list"){
        edited_row['riad'] = document.getElementById("edit_Riad_id").value
        edited_row['cod_name_of_olt'] = document.getElementById("edit_Cod_id").value
        edited_row['IP'] = document.getElementById("edit_IP_id").value
    }
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
        if(status){
            row.style.display = "none"
            bat.setAttribute('data-status','plus')
            bat.setAttribute('src','/static/images/stat_plus_.svg')
        }
        else{
            row.removeAttribute("style")
            bat.setAttribute('data-status','minus')
            bat.setAttribute('src','/static/images/stat_minus_.svg')
        }
    })  
}