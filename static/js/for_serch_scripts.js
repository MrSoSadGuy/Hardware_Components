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
        if(flag){tbodies[i].removeAttribute("style");}
        else {tbodies[i].style.display = "none";
        }
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
                if (td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
                flag.push(true);
                return;
                }
            }})
            if(flag.length >= list_of_words.length){tr[i].removeAttribute("style");
                
            }
            else {tr[i].style.display = "none";}}
        // поиск ИЛИ
        if (rb2){
            var flag = false;
            list_of_words.forEach(word =>{
                for(var j = 0; j < tds.length; j++){
                    var td = tds[j];
                    if (td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
                    flag = true;
                    return;
                    }
                }})
            if(flag){tr[i].removeAttribute("style");
                
            }           
            else {tr[i].style.display = "none";}
        }        
        number_of_records_main_table()
    }    
}

function serch_pon_table() {
    
    let ud_tbodies = document.getElementsByClassName('ud_tbody')
    let i = serch_ud_tbodies(ud_tbodies)
}
function serch_ud_tbodies(ud_tbodies){
    for(let i =0; i<ud_tbodies.length; i++){
        let olt_tbodies = ud_tbodies[i].getElementsByClassName('olt_tbody')
        if(serch_olt_tbodies(olt_tbodies)){
            ud_tbodies[i].removeAttribute("style");           
        } 
        else{
            ud_tbodies[i].style.display = "none"            
        } 
    }
}
function serch_olt_tbodies(olt_tbodies){
    var flag = [];
    for(let i =0; i<olt_tbodies.length; i++){
        let shassy = olt_tbodies[i].querySelector('.shassi_row')
        let platy = olt_tbodies[i].querySelector('.plata_tbody')
        let answ = serch_plata_tbodies(platy)
        flag.push(answ)
        if(!answ){
            let cells = shassy.getElementsByTagName('td')
            let answ2 = serch_cell_data(cells)
            // console.log("🚀 ~ serch_olt_tbodies ~ shassy:", shassy)
            flag.push(answ2)
            if(answ2){shassy.removeAttribute("style");}
            else{shassy.style.display = "none"}
            if(!answ2){ olt_tbodies[i].closest('tr').style.display = "none"}
            else {olt_tbodies[i].closest('tr').removeAttribute("style");
            }
        }
        else{
            shassy.removeAttribute("style");
            olt_tbodies[i].closest('tr').removeAttribute("style")}
    }
    // console.log("🚀 ~ serch_olt_tbodies ~ flag:", flag)
    if(flag.indexOf(true) > -1){
        return true
    } 
    else{
        return false
    } 
    
    
}
function serch_plata_tbodies(plata_tbody){
    
    let rows = plata_tbody.getElementsByTagName('tr')
    var flag = [];
    for(let i =0; i<rows.length; i++){
        let cells = rows[i].getElementsByTagName('td')
        if(serch_cell_data(cells)){
            flag.push(true)
            rows[i].removeAttribute("style");
        }
        else{
            flag.push(false)
            rows[i].style.display = "none";
        }
    }
    
    if(flag.indexOf(true) > -1){
        plata_tbody.removeAttribute("style");
        return true
    } 
    else{
        plata_tbody.style.display = "none"
        return false
    } 
}
function serch_cell_data(tds){
    document.getElementById('flexSwitchCheckChecked').checked = false;
    var rb1 = document.getElementById("inlineRadio1").checked
    var rb2 = document.getElementById("inlineRadio2").checked
    var input, filter;
    input = document.getElementById("serch_pon_table");
    filter = input.value.toUpperCase();
    const list_of_words= filter.split(" ")
    
    var flag = [];
    list_of_words.forEach(word =>{
        for(var j = 0; j < tds.length; j++){
        var td = tds[j];
        if (td.textContent.toUpperCase().indexOf(word.trim()) > -1) {
        flag.push(true);
        return;
        }
    }})
    if(flag.length >= list_of_words.length){
        // tds.removeAttribute("style");
        return true
        
        
    }
    else {
        // tds.style.display = "none"
        return false
    }           
}