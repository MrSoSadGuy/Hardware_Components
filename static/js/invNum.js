// Заполнение модального окна для Инвентарного номера
async function invent_modal(param,user){
    document.getElementById("In_num").value = param;

    const fetch_response = await fetch_data_get(param.replaceAll('/','+'),'BuhUch');
    const select = document.getElementById('select_mol_id')
    var options = select.getElementsByTagName('option');
    if (fetch_response.status === 404){alert("Нет данных по этому номеру")
        for(let i=0; i < options.length; i++) {
            if (user === options[i].text){
                options[i].selected = true}
        }
    }
    else if(fetch_response.ok){
        let data = await fetch_response.json();
        document.getElementById("description_id").value = data['name'];
        for(let i=0; i < options.length; i++) {
            if (data['MOL_id'].toString() === options[i].value){
                options[i].selected = 'selected'}
        }
        document.getElementById("char_id").value = data['charracter'];
        document.getElementById("note_id").value = data['note'];
    }
    else {alert(await fetch_response.json())}
}
// Сохранение изменений для инвентарного номера
async function save_edit_buh_data() {
    const sel = document.getElementById("select_mol_id");
    var edit_data = {
        id: document.getElementById("id_buh").value,
        inv_number: document.getElementById("In_num").value,
        name: document.getElementById("description_id").value,
        MOL: sel.options[sel.selectedIndex].textContent,
        charracter: document.getElementById("char_id").value,
        note: document.getElementById("note_id").value
    }
    console.log("🚀 ~ save_edit_buh_data ~ edit_data:", edit_data)
    if (confirm("Сохранить изменения?")){
        const fetch_response = await fetch_data_2(edit_data,'/save_data/Buhuchet', 'POST');
        console.log("🚀 ~ save_edit_buh_data ~ data:", fetch_response)
        if(fetch_response.ok){
            liveToast(true, "Изменения сохранены")
        }
        else {
            liveToast(false, "Ошибка сохранения")
            console.error(await fetch_response.json())
        }
    }
}