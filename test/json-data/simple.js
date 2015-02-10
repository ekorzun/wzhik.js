window.simpleData = {
    header:  "Header",
    header2: "Header2",
    header3: "Header3",
    header4: "Header4",
    header5: "Header5",
    header6: "if italic then need escaping",
    list: [
        '1',  '2', '3', '4', '5', '6', '7', '8', '9', '10'
    ]
}


window.simpleDataEscaped = {
    header:  "Header",
    header2: "Header2",
    header3: "Header3",
    header4: "Header4",
    header5: "Header5",
    header6: "\"'><i>if italic then need escaping",
    list: [
        '<b>if bold then need escaping', 
        '2', '3', '4', '5', '6', '7', '8', '9', '10'
    ]
}