function downloadFile(file, id) {
    let url = '/download/'+ file +'/'+id;
    console.log(url)
    var link = document.createElement("a");
    link.setAttribute('download', file);
    link.href=url;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function popover_func(table_id){
    const table_current = document.getElementById(table_id);
    const popoverTriggerList = table_current.querySelectorAll('[data-bs-toggle="popover-bg"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
    
    }
function tooltip_func(table_id){
    const table_current = document.getElementById(table_id);
    const tooltipTriggerList = table_current.querySelectorAll('[data-toggle="tooltip2"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

function reload_page() {
    location.reload();
}

function add_new_row(table_id, cells){
    var table = document.getElementById(table_id);
    var row = table.insertRow();
    for (let i = 0; i < cells; i++ ){
        row.insertCell(i).contentEditable = true;
    }
}

function del_row(tbody_id) {
    document.getElementById(tbody_id).deleteRow(-1);
    }

async function save_color_in_db(db_table, id, color){
    const data = {id: id, color: color}
    const fetch_color = await fetch_data(data, "change_color/"+db_table,'POST')
    console.log("🚀 ~ save_color_in_db ~ data:", data)
}

//копирование в таблицу из Excel 
function paste_to_cells_like_excel(tbody_id, data, start_r, start_c,  cells_in_row){
    let value = data.split(/\r\n|\n|\r/);
    if (value[value.length-1] === ""){value.pop()}
    let start_row = start_r;
    let start_cell = start_c
    let oTable = document.getElementById(tbody_id);
    let rowLength = oTable.rows.length;
    for (let j = 0; j < value.length; j++) {
        var oCells = oTable.rows.item(start_row).cells;
        var words = value[j].split(/\t/);
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

function liveToast(status, data){
    let theme
    status ? theme = 'success': theme = 'danger'
    new Toast({
        title: false,
        text: data,
        theme: theme,
        autohide: true,
        interval: 5000
    });
}
