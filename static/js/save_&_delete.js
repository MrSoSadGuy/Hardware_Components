async function fetch_data(data, route_str, method) {
    var formdata = new FormData();
    formdata.append("json", JSON.stringify(data));
    try {
        const response = await fetch(route_str,
        {
            method: method,
            body: formdata
        })
        return await response.json();
        } catch (error){console.log("🚀 ~ fetch_data ~ error:", error);
        return "error"}
}
async function fetch_data_2(data, route_str, method) {
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(data));
    try {
        const response = await fetch(route_str,
        {
            method: method,
            body: formdata
        })
        return await response;
        } catch (error){console.error("🚀 ~ fetch_data ~ error:", error);
        return "Error is:"+ error
        }
}
async function fetch_data_get(data, req) {
    try {
        const response = await fetch(`/get_data/${req}/${data}`,
            {
                method: 'GET',
            })
        return await response;
    } catch (error){console.error("🚀 ~ fetch_data ~ error:", error);
        return "Error is:"+ error
    }
}
async function fetch_data_post(data, req, act) {
    const action = {1: 'save_data', 2: 'delete_data'};
    const formdata = new FormData();
    formdata.append("json", JSON.stringify(data));
    try {
        console.log(`/${action[act]}/${req}`)
        const response = await fetch(`/${action[act]}/${req}`,
            {
                method: 'POST',
                body: formdata
            })
        return await response;
    } catch (error){console.error("🚀 ~ fetch_data ~ error:", error);
        return "Error is:"+ error
    }
}

async function change_password(){     
    var old_pass = document.getElementById("old_pass_id").value;
    var new_pass = document.getElementById("new_pass_id").value;
    var new_pass_2 = document.getElementById("new_pass_2_id").value;
    console.log(old_pass, new_pass, new_pass_2)
    let new_data_pass = { old_pass: old_pass , new_pass: new_pass, new_pass_2: new_pass_2};
    const data = new FormData();
    data.append("json", JSON.stringify(new_data_pass));
    if ((new_pass === new_pass_2) && (new_pass.length > 5)){
        const data = await fetch_data(new_data_pass,'/change_password','POST');
        if (data === "SUCCESS"){
            document.getElementById("raport_chang_pass").setAttribute("style", "color:green")
            document.getElementById("raport_chang_pass").textContent = "Пароль изменен успешно";
        }
        else {
            document.getElementById("raport_chang_pass").setAttribute("style", "color:red")
            document.getElementById("raport_chang_pass").textContent = data;
        }
    }
    else {
        console.log("Новый пароль задан не верно");
        document.getElementById("raport_chang_pass").setAttribute("style", "color:red")
        document.getElementById("raport_chang_pass").textContent = "Новый пароль задан не верно"}
}


async function delete_table(db_table, id, bt_id)  {
    var id_val = {id: id}
    console.log("🚀 ~ delete_table ~ id:", id)
    if (confirm("Удалить данные?")){
        const data = await fetch_data(id_val,'/delete_row/'+db_table, 'POST');
        console.log(data);
        if(data==="SUCCESS"){
            document.getElementById(bt_id).setAttribute("class", "btn btn-success");
            setTimeout(function (){document.getElementById('inv_number_id_'+ id).remove()}, 500);
            number_of_records();
            setTimeout(function (){document.getElementById('close_btn_id').click()}, 800);      
        }
        else {
            document.getElementById(bt_id).setAttribute("class", "btn btn-danger");
            alert(data);
    }}
}
async function delete_table_list(db_table, id)  {
    var id_val = {id: id}
    console.log("🚀 ~ delete_table ~ id:", id)
    const data = await fetch_data(id_val,'/delete_row/'+db_table, 'POST');
    console.log(data);
    if(data==="SUCCESS"){
        setTimeout(function (){document.getElementById('inv_number_id_'+ id).remove()
            number_of_records();
        }, 500);
        
    }
    else {
        alert(data);
    }
}
async function delete_row_list(db_table, id, row)  {
    var id_val = {id: id}
    console.log("🚀 ~ delete_row_list ~ id:", id)
    const data = await fetch_data(id_val,'/delete_row/'+db_table, 'POST');
    console.log(data);
    if(data==="SUCCESS"){
        setTimeout(function (){row.remove()
            number_of_records_main_table();
        }, 500);        
    }
    else {
        row.setAttribute('bgcolor', '#E51515')
        alert(data);
    }
}

async function add_new_inv_numbers(parent_tag_id, btn_id) {
    const parent_tag = document.getElementById(parent_tag_id);
    const list_of_tables = parent_tag.querySelectorAll('table')
    for(let i=0; i<list_of_tables.length; i++){
        let list_of_tds = list_of_tables[i].querySelectorAll('td')
        for(let j=0; j<list_of_tds.length; j++){
        if(list_of_tds[j].querySelector('i') != null){list_of_tds[j].querySelector('i').remove()}    
        }
        if(list_of_tds[0].textContent === ""){
            list_of_tables[i].setAttribute('bgcolor', '#f5abb1')
            alert('Поле инвентарного номера не может быть пустым!')
            continue;    
        }
        else{
            list_of_tables[i].setAttribute('class', 'table table-sm table-bordered table-hover borderd_table');
            let new_inv_data = {
                inv_number: list_of_tds[0].textContent,
                name: list_of_tds[1].textContent,
                MOL: list_of_tds[2].textContent,
                charracter: list_of_tds[3].textContent,
                note:""
            }
        const response = await fetch_data(new_inv_data,'/save_data/Buhuchet','POST');
        console.log("🚀 ~ add_new_inv_numbers ~ response:", response)
        if(response==="SUCCESS"){
            document.getElementById(btn_id).setAttribute("class", "btn btn-success");
            list_of_tables[i].setAttribute('bgcolor', '#87ddb6')
            setTimeout(function (){list_of_tables[i].remove()}, 1000);
        }
        else {
            document.getElementById(btn_id).setAttribute("class", "btn btn-danger");
            list_of_tables[i].setAttribute('bgcolor', '#f5abb1')
            alert(response);
            break;
        }
        }    
    }
}



