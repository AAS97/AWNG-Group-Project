// Function used to filter individually, it doesn't take care of the other fields of the filtering
// This function is used to compare chains of characters
function filterIndividuel(tablePosition, Id) {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(Id); //Take the input string
    filter = input.value.toUpperCase(); // to compare we use Uppercase in our case it's not case sensitive
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        //takes the element in the i position
        td = tr[i].getElementsByTagName("td")[tablePosition];
        if (td) {
            // takes the String in that element
            txtValue = td.textContent || td.innerText;
            //Compare with the filter parameter
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                //if it's the same show it
                tr[i].style.display = "";
            } else {
                //it it's not hide it
                tr[i].style.display = "none";
            }
        }
    }
}

// Function used in the colective function  to filter the differents elemetns of the table
// it is used in the colective function
function filterIndividuelV2(tablePosition, Id, iter) {
    var input, filter, table, tr, td, txtValue;
    input = document.getElementById(Id);
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    td = tr[iter].getElementsByTagName("td")[tablePosition];
    if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            return true;
        } else {
            return false;
        }
    }

}

// Function used to filter the date. Individual filter not used for the collective filter
function dateFiltering(tablePosition, Id, selector) {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(Id);
    filter = input.value;
    var dateFilter = Date.parse(filter);
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[tablePosition];
        if (td && selector === "biggerThan") {
            var date = Date.parse(td.textContent);
            if (date >= dateFilter || Number.isNaN(dateFilter)) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }

        if (td && selector === "smallerThan") {
            var date = Date.parse(td.textContent);
            if (date <= dateFilter || Number.isNaN(dateFilter)) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }

}


// Function used to filter the date. Individual filter not used for the collective filter
function dateFilteringV2(tablePosition, Id, selector, iter) {
    var input, filter, table, tr, td;
    input = document.getElementById(Id);
    filter = input.value;
    var dateFilter = Date.parse(filter);
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    td = tr[iter].getElementsByTagName("td")[tablePosition];

    if (td && selector === "biggerThan") {
        var date = Date.parse(td.textContent);
        if (date >= dateFilter || Number.isNaN(dateFilter)) {
            return true;
        } else {
            return false;
        }
    }

    if (td && selector === "smallerThan") {
        var date = Date.parse(td.textContent);
        if (date <= dateFilter || Number.isNaN(dateFilter)) {
            return true;
        } else {
            return false;
        }
    }
}


// Function used to filter the table. it marge the results of the differents filters.
function filterColective(tablePosTask, IdTask, tablePosAssignee, IdAssignee, tablePosStatus, IdStatus, tablePosStart, IdStartDate, tablePosDue, IdDueDate) {
    var table, tr, i;

    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        let taskName = filterIndividuelV2(tablePosTask, IdTask, i);
        let assigneeName = filterIndividuelV2(tablePosAssignee, IdAssignee, i);
        let statusName = filterIndividuelV2(tablePosStatus, IdStatus, i);
        let startDate = dateFilteringV2(tablePosStart, IdStartDate, 'biggerThan', i);
        let dueDate = dateFilteringV2(tablePosDue, IdDueDate, 'smallerThan', i);

        if (taskName && assigneeName && statusName && startDate && dueDate) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }


    }
}


