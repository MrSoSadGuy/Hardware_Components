async function to_fill_sostav_modal(p_name, ud) {
    document.getElementById('save_kts').setAttribute("class", "btn btn-primary");
    document.getElementById("PON_id").value = p_name;
    document.getElementById("t_body").remove();
    const list_of_modules = await fetch_data(p_name,'/get_data_from_db/olt_data',"POST");
    const kts_data = await fetch_data(p_name,'/get_data_from_db/kts_data',"POST");
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
    var table = document.getElementById("Sostav_Modal_table");
    const tbody = document.createElement('tbody');
    tbody.setAttribute("id", "t_body");
    table.appendChild(tbody);
    const column_data = ['plata_mesto','inv_number','name_unit','serial_number','note']
    for (let item in  list_of_modules){
        // console.log(list_of_modules[item]);
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
    // list_of_modules.forEach(item => {
    //     console.log(item);

    // })
}

