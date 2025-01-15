function serch_pon_table() {
    [].forEach.call(document.getElementsByClassName('ud_tbody'), function (ud_tb) {
        serch_olt_tbodies(ud_tb.getElementsByClassName('olt_tbody')) ? ud_tb.removeAttribute("style") : ud_tb.style.display = "none"
    });
}
function serch_olt_tbodies(olt_tbodies){
    var flag = [];

    for(let i =0; i<olt_tbodies.length; i++){
        let shassy = olt_tbodies[i].querySelector('.shassi_row')
        let platy = olt_tbodies[i].querySelector('.plata_tbody')
        let btn = olt_tbodies[i].querySelectorAll('img')
        let answ = serch_plata_tbodies(btn[0], platy)
        let cells = shassy.getElementsByTagName('td')
        let answ2 = serch_cell_data(cells)
        flag.push(answ)
        answ2 ? shassy.classList.add('for_file_download'): shassy.classList.remove('for_file_download')
        flag.push(answ2)
        !answ && !answ2 ? olt_tbodies[i].closest('tr').style.display = "none" : olt_tbodies[i].closest('tr').removeAttribute("style")
        
    }
    
    
    return flag.indexOf(true) > -1 
}
function serch_plata_tbodies(btn, plata_tbody){
    let rows = plata_tbody.getElementsByTagName('tr')
    var flag = [];
    for(let i =0; i<rows.length; i++){
        let cells = rows[i].getElementsByTagName('td')
        if(serch_cell_data(cells)){
            flag.push(true)
            show_rows(rows[i])
        }
        else{
            flag.push(false)
            hide_rows(rows[i])
        }
    }
    flag.indexOf(false) > -1? colaps_btn_chng(btn,true):colaps_btn_chng(btn,false);
    return flag.indexOf(true) > -1
}
function serch_cell_data(tds){
    document.getElementById('flexSwitchCheckChecked').checked = false;
    var rb1 = document.getElementById("inlineRadio1").checked
    var rb2 = document.getElementById("inlineRadio2").checked
    var input, filter;
    input = document.getElementById("serch_pon_table");
    filter = input.value.toUpperCase();
    const list_of_words= filter.split(" ")
    let result = rb1? serch_and(list_of_words, tds):serch_or(list_of_words, tds)
    return result
}
function serch_and(list_of_words, tds){
    var flag = [];
    list_of_words.forEach(word =>{
        for(var j = 0; j < tds.length; j++){
            var td = tds[j];
            if (td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
                flag.push(true);
                return;
            }
        }})
    return flag.length >= list_of_words.length;
}
function serch_or(list_of_words, tds){
    var flag = false;
    list_of_words.forEach(word =>{
        for(var j = 0; j < tds.length; j++){
            var td = tds[j];
            if (td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
            flag = true;
            return;
            }
        }})
    return flag
}

async function save_main_table_in_file(){
    let list_data =[];
    
    [].forEach.call(document.getElementsByClassName('for_file_download'), function (row) {
        list_data.push([row.dataset.id, row.dataset.db])
    })
    console.log("🚀 ~ save_main_table_in_file ~ list_data:", list_data)
    const data = await fetch_data_2(list_data, "/main_table_data", "POST")
    if (data.ok){
        const link = document.createElement('a');
        link.href = '/download/main_table';
        document.body.appendChild(link);
        link.click();
        link.remove();}
    else {alert("ERROR");}
    }