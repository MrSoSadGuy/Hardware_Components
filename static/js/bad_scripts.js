 function downloadFile(file) {
            let name = document.getElementById('PON_id').value;
            let url = '/download/'+ file +'/'+name;
            console.log(url)
            var link = document.createElement("a");
            link.setAttribute('download', file + name);
            link.href=url;
            document.body.appendChild(link);
            link.click();
            link.remove();
        }

 function reload_page() {
                var serch_data = document.getElementById("myInput").value
                localStorage.setItem("serch",JSON.stringify(serch_data));
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


 function save_main_table_in_file(){
        var oTable = document.getElementById('tbody_main_table');
        console.log($('tr:visible').length)
        var rowLength = oTable.rows.length;
        var data = new FormData();
        var list_data = []
        for (i = 0; i < rowLength; i++){
            var style = oTable.rows.item(i).getAttribute("style")
            if(style == null){
            var oCells = oTable.rows.item(i).cells;
            list_data.push(oCells[0].textContent)
        }}
            data.append( "json", JSON.stringify(list_data ));
            fetch("/main_table_data",
                {
                    method: "POST",
                    body: data
                })
                .then(function(res){ return res.json(); })
                .then(function(data){
                    if (data === "SUCCESS"){
                        const link = document.createElement('a');
                        link.href = '/download/main_table';
                        document.body.appendChild(link);
                        link.click();
                        link.remove();}
                    else {alert("ERROR");
                        console.log(data)}
            })
        }
// Поиск по таблице
 function myFunction() {
              var rb1 = document.getElementById("inlineRadio1").checked
              var rb2 = document.getElementById("inlineRadio2").checked
              var input, filter, table, tr;
              input = document.getElementById("myInput");
              filter = input.value.toUpperCase();
              const list_of_words= filter.split(" ")
              table = document.getElementById("tbody_main_table");
              tr = table.getElementsByTagName("tr");
              for (var i = 0; i < tr.length; i++) {
                var tds = tr[i].getElementsByTagName("td");
                // поиск И
                if (rb1){
                    var flag = [];
                    list_of_words.forEach(word =>{
                      for(var j = 0; j < tds.length; j++){
                        var td = tds[j];
                        if (td.innerHTML.toUpperCase().indexOf(word.trim()) > -1) {
                        flag.push(true);
                        return;
                      }
                    }})
                    if(flag.length >= list_of_words.length){tr[i].removeAttribute("style");}
                    else {tr[i].style.display = "none";}}
                // поиск ИЛИ
                if (rb2){
                    var flag = false;
                    list_of_words.forEach(word =>{
                        for(var j = 0; j < tds.length; j++){
                            var td = tds[j];
                            if (td.innerHTML.toUpperCase().indexOf(word.trim()) > -1) {
                            flag = true;
                            return;
                         }
                        }})
                if(flag){tr[i].removeAttribute("style");}
                else {tr[i].style.display = "none";}
                }
              }
            }
//копирование в таблицу из Excel 2
 function paste_to_cells_like_excel(tbody_id, data, start_r, start_c,  cells_in_row){
                let value = data.split(/\r\n|\n|\r/);
                if (value[value.length-1] === ""){value.pop()}
                console.log(value)
                let start_row = start_r;
                let start_cell = start_c
              let oTable = document.getElementById(tbody_id);
              let rowLength = oTable.rows.length;
              console.log('1  ',rowLength, value.length);
                for (let j = 0; j < value.length; j++) {
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

 // function get_table_column_data(){
 //            const select = document.getElementsByTagName("select")
 //                while(select.length > 1){
 //                select[select.length-1] = null;
 //                }
 //            var oTable = document.getElementById('tbody_main_table');
 //            var list_rows = []
 //            var list_cells = []
 //            for (i = 0; i < oTable.rows.length; i++){
 //                var style = oTable.rows.item(i).getAttribute("style")
 //                if(style == null){
 //                    var oCells = oTable.rows.item(i).cells;
 //                    list_cells = [oCells[1],oCells[2],oCells[3],oCells[4]];
 //                    list_rows.push(list_cells);
 //                    list_cells=[];
 //                }
 //            }
 //            console.log(list_rows);
 //            }
 //
 //            // for (i = 0; i < list_rows.length; i++){
 //            //     const option = document.createElement("option");
 //            //     option.text = list_rows[i][0];
 //            //     option.value = list_rows[i][0];
 //            //     document.getElementById("select_1").appendChild(option);
 //            // }
 //            // }

//