insert_menu_markup();
insert_grid_markup();
//make_grid_component();
add_new_tab();


  function requiredFieldValidator(value) {
    if (value == null || value == undefined || !value.length) {
      return {valid: false, msg: "This is a required field"};
    } else {
      return {valid: true, msg: null};
    }
  }
  var grid;
  var data = [];
  //pull header information from db
  var columns = [
    {id: "title", name: "Title", field: "title", width: 120, cssClass: "cell-title", editor: Slick.Editors.Text, validator: requiredFieldValidator},
    {id: "desc", name: "Description", field: "description", width: 100, editor: Slick.Editors.LongText},
    {id: "duration", name: "Duration", field: "duration", editor: Slick.Editors.Text},
    {id: "%", name: "% Complete", field: "percentComplete", width: 80, resizable: false, formatter: Slick.Formatters.PercentCompleteBar, editor: Slick.Editors.PercentComplete},
    {id: "start", name: "Start", field: "start", minWidth: 60, editor: Slick.Editors.Date},
    {id: "finish", name: "Finish", field: "finish", minWidth: 60, editor: Slick.Editors.Date},
    {id: "effort-driven", name: "Effort Driven", width: 80, minWidth: 20, maxWidth: 80, cssClass: "cell-effort-driven", field: "effortDriven", formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox}
  ];
  var options = {
    editable: true,
    enableAddRow: true,
    enableCellNavigation: true,
    asyncEditorLoading: false,
    autoEdit: false
  };
  $(function () {
    for (var i = 0; i < 50; i++) {
      var d = (data[i] = {});
      d["title"] = "Task " + i;
      d["description"] = "This is a sample task description.\n  It can be multiline";
      d["duration"] = "5 days";
      d["percentComplete"] = Math.round(Math.random() * 100);
      d["start"] = "01/01/2009";
      d["finish"] = "01/05/2009";
      d["effortDriven"] = (i % 5 == 0);
    }
    grid = new Slick.Grid("#myGrid", data, columns, options);
    grid.setSelectionModel(new Slick.CellSelectionModel());
    grid.onAddNewRow.subscribe(function (e, args) {
      var item = args.item;
      grid.invalidateRow(data.length);
      data.push(item);
      grid.updateRowCount();
      grid.render();
    });
  })
  function insert_menu_markup(){
    $("body").prepend(
      '<input type = "text" id = "book" name = "book" value = "">');
    $("body").prepend('<input type = "button" id = "save" value = "save">');  
    $("body").prepend('<input type = "button" id = "open" value = "open">');
    $("body").prepend('<input type = "button" id = "new" value = "new">');
  }
  
  function insert_grid_markup(){
      var work_book = '<div id = "tabs" class = "tabs-bottom"><ul><li></li></ul></div>';
      $('body').append(work_book);
      
  }
  
  function make_grid_component(){
      $("#tabs").tabs();
      $(".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs_nav > *")
      .removeClass("ui-corner-all ui-corner-top")
      .addClass("ui-corner-bottom");
  }
  
  function add_new_tab(){
     $('body').append('<input id = "new_tab_button" type = "button" value = "+" />');
      
  }