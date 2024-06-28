// Function to convert tables to CSV
function _arrayToCsv(tables) {
    return tables.map(function (rows) {
        return rows.map(function (v) {
            if (typeof v === 'undefined' || v === null) {
                return '';
            }
            if (v.indexOf('"') >= 0) {
                v = v.replace(/"/g, '""');
            }
            if (v.indexOf('"') >= 0 || v.indexOf("\n") >= 0 || v.indexOf(",") >= 0) {
                v = '"' + v + '"';
            }
            return v;
        }).join(',');
    }).join("\n");
}




function parse_format(result) {
    // JSON result
    var jsonResult = JSON.stringify(result)


    // Variables to store HTML and CSV results
    var htmlResult = '';
    var csvResult = '';

    // All tables
    var allTables = [];

    while (page_tables = result.pageTables.shift()) {
        htmlResult += `<h3>Page ${page_tables.page}</h3>`;

        var tableDom = '<table border="1">';
        var tables = page_tables.tables;
        var mergeAlias = page_tables.merge_alias;
        var merges = page_tables.merges;

        for (var r = 0; r < tables.length; r++) {
            tableDom += '<tr>';
            for (var c = 0; c < tables[r].length; c++) {
                var r_c = [r, c].join('-');
                if (mergeAlias[r_c]) {
                    continue;
                }

                var tdDom = '<td';
                if (merges[r_c]) {
                    if (merges[r_c].width > 1) {
                        tdDom += ` colspan="${merges[r_c].width}"`;
                    }
                    if (merges[r_c].height > 1) {
                        tdDom += ` rowspan="${merges[r_c].height}"`;
                    }
                }
                tdDom += `>${tables[r][c]}</td>`;
                tableDom += tdDom;
            }
            tableDom += '</tr>';
        }
        tableDom += '</table>';
        htmlResult += tableDom;

        allTables = allTables.concat(tables);
    }

    csvResult = _arrayToCsv(allTables);

    return {jsonResult, htmlResult, csvResult}
}


module.exports = {
    parse_format
}
