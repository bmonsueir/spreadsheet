
function render_ui(){
  insert_menu_markup();
  insert_grid_markup();
  make_grid_component();
  add_new_tab();
  insert_open_dialog_markup();
  make_open_dialog();
}


  function requiredFieldValidator(value) {
    if (value == null || value == undefined || !value.length) {
      return {valid: false, msg: "This is a required field"};
    } else {
      return {valid: true, msg: null};
    }
  }
  
  function add_grid(grid_name, gridNumber){
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
      enableCellRangeSelection: true,
      asyncEditorLoading: true,
      multiSelect: true,
      autoEdit: true,
      leaveSpaceForNewRows: true,
      rerenderOnResize: true
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
    
    // file: resources/js/spreadsheet.js continued
      // Events
      grid.onCurrentCellChanged = function(){
          d = grid.getData();
          row  = grid.getCurrentCell().row;
          cell = grid.getCurrentCell().cell;
          this_cell_data = d[row][grid.getColumns()[cell].field];
      };
  
      grid.onBeforeCellEditorDestroy = function(){
          d = grid.getData();
          row  = grid.getCurrentCell().row;
          cell = grid.getCurrentCell().cell;
          this_cell_data = d[row][grid.getColumns()[cell].field];
  
          if(this_cell_data && this_cell_data[0] === "="){
              // evaluate JavaScript expression, don't use
              // in production!!!!
              eval("var result = " + this_cell_data.substring(1));
              d[row][grid.getColumns()[cell].field] = result;
          }
      };
      grid_references[grid_name] = grid;
  };


//ui functions

  function insert_menu_markup(){
    $("#outerDiv").prepend(
      '<input type = "text" id = "book" name = "book" value = "">');
    $("#outerDiv").prepend('<input type = "button" id = "save" value = "save">');  
    $("#outerDiv").prepend('<input type = "button" id = "open" value = "open">');
    $("#outerDiv").prepend('<input type = "button" id = "new" value = "new">');
  }
  
  function insert_grid_markup(){
      var work_book = '<div id = "tabs" class = "tabs-bottom"><ul><li></li></ul></div>';
      $('#outerDiv').append(work_book);
      
  }
  
  function make_grid_component(){
      $("#tabs").tabs();
      $(".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs_nav > *")
      .removeClass("ui-corner-all ui-corner-top")
      .addClass("ui-corner-bottom");
  }
  
  function add_new_tab(){
     $('#outerDiv').append('<input id = "new_tab_button" type = "button" value = "+" />');
      
  }
  
  function insert_open_dialog_markup(){
    var dlg = '<div id="dialog_form" title="Open">' +
    '<div id="dialog_form" title="Open">' +
    '<p>Select an archive.</p><form>'+
    '<select id="workbook_list" name="workbook_list">' +
    '</select></form></div>';
    $("#myGrid").append(dlg);
}

  function make_open_dialog(){
      $('#dialog_form').dialog({
          autoOpen: false,
          modal: true,
          buttons: {
              "OK":function(){
                  selected_wb = $('option:selected').attr('value');
                  $(this).dialog('close');
  
                  // remove grid, existing forms, and recreate
                  $('body').html('');
                  render_ui();
  
                  // load grids and create forms with invisible inputs
                  load_sheets(selected_wb);
  
                  // place workbook name in text field
                  $('#workbook_name').val(selected_wb);
              },
              "Cancel":function(){
                  $(this).dialog('close');
              }
          }
      });
  }
  
  function openTab(sheet_id) {
    numberOfTabs = $("#tabs").tabs("length");
    tab_name = "tabs_" + numberOfTabs;
  
    $("#tabs").tabs("add","#" + tab_name,"Sheet " + numberOfTabs, numberOfTabs);
    $("#" + tab_name).css("display","block");
    $("#tabs").tabs("select",numberOfTabs);
  
    $('#'+tab_name ).css('height','80%');
    $('#'+tab_name ).css('width','95%');
    $('#'+tab_name ).css('float','left');
    add_grid(tab_name, numberOfTabs);
  
    // add form for saving this tabs data
    if(!sheet_id){
     $('#myGrid').append(
     '<form method="post" action="?" id="'+tab_name +'_form" name="'+tab_name+'_form">'+
     '<input type="hidden" id="data'+numberOfTabs+'" name="data'+numberOfTabs+'" value="">'+
     '<input type="hidden" id="sheet_id" name="sheet_id" value="">' +
     '</form>');
    } else {
     $('#myGrid').append(
     '<form method="post" action="?" id="'+tab_name +'_form" name="'+tab_name+'_form">' +
    '<input type="hidden" id="data'+numberOfTabs +'" name="data'+numberOfTabs+'" value="">'+
     '<input type="hidden" id="sheet_id" name="sheet_id" value="'+sheet_id+'">' +
     '</form>');
    }
  }
  
  $('body').on('click', '#new', function(){
    // delete any existing references
    workbook = {};
    grid_references = {};

    // remove grid, existing forms, and recreate
    $('#myGrid').html('');

    // recreate
    render_ui();
    openTab();
});

$('body').on('click', '#save', function(){
    // Do a foreach on all the grids. The ^= operator gets all
    // the inputs with a name attribute that begins with data
    $("[name^='data']").each(function(index, value){
        var data_index = "data"+index;
        var sheet_id = $('#tabs_'+index+'_form').find('#sheet_id').val();
        if(sheet_id !== ''){
          sheet_id = eval(sheet_id);
        }

        // convenience variable for readability
        var data2post  = $.JSON.encode(workbook[data_index]);
        $("#"+data_index).val(data2post);

        $.post( '{% url index %}', {'app_action':'save', 'sheet_id': sheet_id,
                'workbook_name':$('#workbook_name').val(),
                'sheet':data_index, 'json_data':data2post});
    });
});

function load_sheets(workbook_name){
    $('#workbook_list').load('{% url index %}', 
        {'app_action':'get_sheets','workbook_name':workbook_name}, 
        function(sheets, resp, t){
        sheets = $.JSON.decode(sheets);

        workbook = {}; // reset
        grid_references = {};
        $.each(sheets, function(index, value){

            // add to workbook object
            var sheet_id = value["sheet_id"];
            openTab(sheet_id);

            // By calling eval, we translate value from
            // a string to a JavaScript object
            workbook[index] = eval(value["data"]);

            // insert data into hidden
            $("#data"+index).attr('value', workbook[index]);
            grid_references["tabs_"+index].setData(workbook[index]);
            grid_references["tabs_"+index].render();

        });
    });
}

$('body').on('click','#open', function(){
    // load is used for doing asynchronous loading of data
    $('#workbook_list').load('{% url index %}', {'app_action':'list'}, 
        function(workbooks,success){
        workbooks = $.JSON.decode(workbooks);
        $.each(workbooks, function(index, value){
            $('#workbook_list').append(
              '<option value="'+ value +'">'+value +'*lt;/option>');
        });
    });

    $('#dialog_form').dialog('open');
});

$(document).ready(function(){
    render_ui();
    add_grid();
});