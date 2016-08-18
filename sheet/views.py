from django.shortcuts import render
import simplejson as json
from .models import Workbook
from django.http import HttpResponse
from django.template.context import RequestContext

# def home(request):
#     return render(request, 'sheet/index.html')
    
    
# def save_book(request, data):
    
    
    
#     return render(request, 'sheet/index.html')
    
def index(request):
    template = 'sheet/index.html'

    app_action = request.POST.get('app_action')
    posted_data = request.POST.get('json_data')

    if posted_data is not None and app_action == 'save':
        this_sheet = request.POST.get("sheet")
        this_workbook = request.POST.get("workbook_name")
        sheet_id = request.POST.get("sheet_id")

        posted_data = json.dumps(posted_data)

        if(sheet_id):
            wb = Workbook(id=sheet_id, workbook_name=this_workbook, 
                   sheet_name=this_sheet, data=posted_data)
        else:
            wb = Workbook(workbook_name=this_workbook, 
                   sheet_name=this_sheet, data=posted_data)
        wb.save()

    elif app_action == 'get_sheets':
        wb_name = request.POST.get('workbook_name')
        sheets = Workbook.objects.filter(workbook_name=wb_name)

        # use list comprehension to create python list which is like a JSON object
        sheets = [{ "sheet_id":i.id, "workbook_name": i.workbook_name.encode("utf-8"),
                    "sheet_name": i.sheet_name.encode("utf-8"), 
                    "data": json.loads(i.data.encode("utf-8"))} for i in sheets ]

        # dumps -> serialize to JSON
        sheets = json.dumps(sheets)

        return HttpResponse( sheets, mimetype='application/javascript' )

    elif app_action == 'list':
        workbooks = Workbook.objects.values('workbook_name').distinct()

        # use list comprehension to make a list of just the work books names
        workbooks = [ i['workbook_name'] for i in workbooks ]

        # encode into json format before sending to page
        workbooks = json.dumps(workbooks)

        # We need to return an HttpResponse object in order to complete
        # the ajax call
        return HttpResponse( workbooks, mimetype='application/javascript' )

    return render(request, template, {})
