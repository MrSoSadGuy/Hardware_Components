function sostav_ma_unit(units, dataPon){

     units.forEach((unit) => {
          if (dataPon === unit.cod_name){

            document.getElementById("type_id").value = unit.type_equipment;
            document.getElementById("Serial_id").value = unit.serial_number;
            console.log(unit.serial_number)
            document.getElementById("ip_id").value = unit.IP;
            }})
     create_tables(dataPon);
}
function create_tables(dataPon){
    document.getElementById("current_MA_modules_tbody_id").remove();
    document.getElementById("new_MA_modules_tbody_id").remove();
    document.getElementById("btn_to_add_new_ma_modules").setAttribute("class", "btn btn-primary");
    document.getElementById("btn_to_add_new_ma_modules").setAttribute("name", dataPon);
    var table = document.getElementById("Sostav_Modal_table");
        const tbody_new = document.createElement('tbody');
        const tbody_current = document.createElement('tbody');
        tbody_new.setAttribute("id", "new_MA_modules_tbody_id");
        tbody_current.setAttribute("id", "current_MA_modules_tbody_id");
        table.appendChild(tbody_current);
        table.appendChild(tbody_new);
        var data = new FormData();
        data.append('json', JSON.stringify(dataPon))
         const column_name = ['type','modules_name','inv_number','serial_number','port','size','note'];
        fetch("/get_data_from_db/ma_add_modules",
            {
                method: "POST",
                body: data
            })
            .then(function(res){ return res.json(); })
            .then(function(data){
                console.log(data)
                if (data === null){ }
                else {
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
                        const i1 = document.createElement('i');
                        const i2 = document.createElement('i');
                        const div = document.createElement('div');
                        div.setAttribute('class','d-grid gap-1 d-md-flex');
                        a1.setAttribute('id','btn_edit_ma_mod_'+item['id']);
                        a1.setAttribute('class','btn btn-primary');
                        a2.setAttribute('id','btn_del_ma_mod_'+item['id']);
                        a2.setAttribute('class','btn btn-primary');
                        a1.onclick = function (){edit_row('ma_add_modules_edited', item['id'],'btn_edit_ma_mod_'+item['id'],'current_MA_modules_tbody_id',
                        this.closest("tr").rowIndex,7)}
                        a2.onclick = function (){delete_row('ma_add_modules', item['id'],'btn_del_ma_mod_'+item['id'],'current_MA_modules_tbody_id',
                        this.closest("tr").rowIndex)}
                        i1.setAttribute('class', "bi bi-pencil-square h7");
                        i2.setAttribute('class', "bi bi-trash3 h7");
                        a1.appendChild(i1)
                        a2.appendChild(i2)
                        div.appendChild(a1);
                        div.appendChild(a2)
                        td8.appendChild(div)
                        tr.appendChild(td8);
                        tbody_current.appendChild(tr);
                    })
                }
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