function buh_data_table_serch(){
    document.getElementById('flexSwitchCheckChecked').checked = false;
    var input, filter, table, tbodies, td;    
    input = document.getElementById("Input_for_buh_data_serch");    
    filter = input.value.toUpperCase();    
    const list_of_words= filter.split(" ")
    table = document.getElementById('buh_data_tbody');    
    tbodies = table.getElementsByTagName('table');
    for(var i = 0; i < tbodies.length; i++){
        tds = tbodies[i].getElementsByTagName('td');
        if (tds[0].querySelector('.form-check-input').checked) {
            console.log(tds[1])
            continue;}
        var flag = false;
        for(var j = 0; j < list_of_words.length; j++){
            var td = tds[1] 
            var word = list_of_words[j];
            if(td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
                flag =true;
                continue;
            } 
        }
        flag ? tbodies[i].removeAttribute("style"):tbodies[i].style.display = "none";
        number_of_records() ;
    }    
}

function myFunction() {
    document.getElementById('flexSwitchCheckChecked').checked = false;
    var rb1 = document.getElementById("inlineRadio1").checked
    var rb2 = document.getElementById("inlineRadio2").checked
    var input, filter, table, tr;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    const list_of_words= filter.split(" ")
    table = document.getElementById("tbody_main_table");
    tr = table.getElementsByTagName("tr");
    var number_of_records = 0;
    for (var i = 0; i < tr.length; i++) {
        var tds = tr[i].getElementsByTagName("td"); 
        if (tds[0].querySelector('.form-check-input').checked) {
            console.log(tds[1])
            continue;}       
        // поиск И
        if (rb1){
            var flag = [];
            list_of_words.forEach(word =>{
                for(var j = 0; j < tds.length; j++){
                    var td = tds[j];
                    console.log(td.style.display)
                    if (td.style.display === 'none') {continue;}
                    if (td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
                    flag.push(true);
                    return;
                    }
            }})
            flag.length >= list_of_words.length ? tr[i].removeAttribute("style"):tr[i].style.display = "none";
            }
        // поиск ИЛИ
        if (rb2){
            var flag = false;
            list_of_words.forEach(word =>{
                for(var j = 0; j < tds.length; j++){
                    var td = tds[j];
                    if (td.style.display === 'none') {continue;}
                    if (td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
                    flag = true;
                    return;
                    }
                }})
            flag ? tr[i].removeAttribute("style"):tr[i].style.display = "none";
        }
        number_of_records_main_table()
    }    
}

function storage_serch() {
    let input, filter, table_m, tr, table_u, tb;
    input = document.getElementById("storage_serch");
    filter = input.value.toUpperCase();
    let list_of_words = filter.split(" ")
    table_m = document.getElementById("current_MA_modules_tbody_storage_id");
    tr = table_m.getElementsByTagName("tr");
    table_u = document.getElementById("ma_unit_Modal_table");
    tb = table_u.getElementsByTagName("tbody");
    storage_serch_2(tb, list_of_words)
    storage_serch_2(tr, list_of_words)
}
function storage_serch_2(d,list_of_words){
    for (let i = 0; i < d.length; i++) {
        let tds = d[i].getElementsByTagName("td");
        let flag = [];
        list_of_words.forEach(word =>{
            for(let j = 0; j < tds.length; j++){
                let td = tds[j];
                if (td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
                    flag.push(true);
                    return;
                }
            }})
        flag.length >= list_of_words.length ? d[i].removeAttribute("style"):d[i].style.display = "none";
    }
}