$ErrorActionPreference = "Stop"

$src = "C:\Users\Melody\Desktop\汽车外贸客户跟进管理表_分客户专属sheet_豆包AI生成.xlsx"
$out = "C:\Users\Melody\Desktop\汽车外贸客户跟进管理表_分客户专属sheet_自动宏版.xlsm"
$bas = "C:\Users\Melody\Desktop\汽车外贸客户跟进管理表_VBA宏代码.bas"

$vbaCode = @'
Attribute VB_Name = "客户跟进自动化"
Option Explicit

Const SHEET_OVERVIEW As String = "客户总览"
Const SHEET_TEMPLATE As String = "跟进模板"

' 初始化固定的客户总览与跟进模板结构。
Public Sub 初始化客户跟进表()
    Dim wsO As Worksheet
    Dim wsT As Worksheet
    
    Set wsO = GetOrCreateSheet(SHEET_OVERVIEW)
    Set wsT = GetOrCreateSheet(SHEET_TEMPLATE)
    
    Application.ScreenUpdating = False
    
    wsO.Cells.Clear
    wsO.Range("A1:J1").Value = Array("序号", "客户公司", "联系人", "国家", "WhatsApp", "邮箱", "意向车型", "客户等级", "跳转跟进页", "最后跟进日期")
    
    With wsO.Range("A1:J1")
        .Font.Bold = True
        .Font.Color = vbWhite
        .Interior.Color = RGB(31, 78, 121)
        .HorizontalAlignment = xlCenter
        .VerticalAlignment = xlCenter
        .Borders.LineStyle = xlContinuous
    End With
    
    wsO.Rows(1).RowHeight = 28
    wsO.Columns("A").ColumnWidth = 8
    wsO.Columns("B:C").ColumnWidth = 24
    wsO.Columns("D:F").ColumnWidth = 18
    wsO.Columns("G:I").ColumnWidth = 24
    wsO.Columns("J").ColumnWidth = 18
    wsO.Range("A2:J1000").Borders.LineStyle = xlContinuous
    
    With wsO.Range("H2:H1000").Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, Operator:=xlBetween, Formula1:="A高意向,B意向,C潜在,D沉睡"
        .IgnoreBlank = True
        .InCellDropdown = True
    End With
    
    With wsO.Range("G2:G1000").Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, Operator:=xlBetween, Formula1:="Deepal S07,Deepal S05,Deepal SL03,ROX ADAMAS"
        .IgnoreBlank = True
        .InCellDropdown = True
    End With
    
    wsT.Cells.Clear
    wsT.Range("A1").Value = "客户公司："
    wsT.Range("A2").Value = "对接人："
    wsT.Range("A3").Value = "目标车型："
    wsT.Range("A4").Value = "国家："
    wsT.Range("A5").Value = "客户等级："
    wsT.Range("A7:E7").Value = Array("跟进日期", "跟进渠道", "跟进内容详情", "客户反馈", "下次跟进计划")
    
    With wsT.Range("A1:F5")
        .Font.Bold = True
        .Interior.Color = RGB(242, 242, 242)
        .Borders.LineStyle = xlContinuous
        .VerticalAlignment = xlCenter
    End With
    
    With wsT.Range("A7:E7")
        .Font.Bold = True
        .Font.Color = vbWhite
        .Interior.Color = RGB(166, 124, 82)
        .HorizontalAlignment = xlCenter
        .VerticalAlignment = xlCenter
        .Borders.LineStyle = xlContinuous
    End With
    
    wsT.Columns("A:B").ColumnWidth = 20
    wsT.Columns("C:E").ColumnWidth = 34
    wsT.Rows(7).RowHeight = 26
    wsT.Range("A8:E1000").Borders.LineStyle = xlContinuous
    
    With wsT.Range("B8:B1000").Validation
        .Delete
        .Add Type:=xlValidateList, AlertStyle:=xlValidAlertStop, Operator:=xlBetween, Formula1:="WhatsApp,邮件,电话,IG/Facebook社媒"
        .IgnoreBlank = True
        .InCellDropdown = True
    End With
    
    Application.ScreenUpdating = True
    MsgBox "客户跟进表初始化完成。", vbInformation
End Sub

' 批量读取客户总览，自动生成每个客户的专属跟进页并创建跳转链接。
Public Sub 一键生成客户跟进页()
    Dim wsO As Worksheet
    Dim wsT As Worksheet
    Dim wsNew As Worksheet
    Dim lastRow As Long
    Dim r As Long
    Dim companyName As String
    Dim contactName As String
    Dim sheetName As String
    Dim skipped As String
    
    Set wsO = Worksheets(SHEET_OVERVIEW)
    Set wsT = Worksheets(SHEET_TEMPLATE)
    
    lastRow = wsO.Cells(wsO.Rows.Count, "B").End(xlUp).Row
    Application.ScreenUpdating = False
    
    For r = 2 To lastRow
        companyName = Trim(CStr(wsO.Cells(r, "B").Value))
        contactName = Trim(CStr(wsO.Cells(r, "C").Value))
        
        If companyName <> "" Or contactName <> "" Then
            sheetName = companyName & "-" & contactName
            
            If Not IsValidSheetName(sheetName) Then
                skipped = skipped & vbCrLf & "第 " & r & " 行：" & sheetName
                GoTo NextRow
            End If
            
            If Not SheetExists(sheetName) Then
                wsT.Copy After:=Worksheets(Worksheets.Count)
                Set wsNew = ActiveSheet
                wsNew.Name = sheetName
            Else
                Set wsNew = Worksheets(sheetName)
            End If
            
            wsNew.Range("B1").Value = wsO.Cells(r, "B").Value
            wsNew.Range("B2").Value = wsO.Cells(r, "C").Value
            wsNew.Range("B3").Value = wsO.Cells(r, "G").Value
            wsNew.Range("B4").Value = wsO.Cells(r, "D").Value
            wsNew.Range("B5").Value = wsO.Cells(r, "H").Value
            
            wsO.Cells(r, "I").Hyperlinks.Delete
            wsO.Hyperlinks.Add Anchor:=wsO.Cells(r, "I"), Address:="", SubAddress:="'" & sheetName & "'!A1", TextToDisplay:="进入跟进页"
        End If
NextRow:
    Next r
    
    Application.ScreenUpdating = True
    
    If skipped <> "" Then
        MsgBox "以下客户名称含非法字符或长度超过31字符，已跳过：" & skipped, vbExclamation
    End If
    
    MsgBox "全部客户跟进页创建完成，链接已自动生成。", vbInformation
End Sub

' 删除所有客户专属sheet，只保留客户总览与跟进模板。
Public Sub 一键清空客户跟进页()
    Dim ws As Worksheet
    Dim i As Long
    
    Application.ScreenUpdating = False
    Application.DisplayAlerts = False
    
    For i = Worksheets.Count To 1 Step -1
        Set ws = Worksheets(i)
        If ws.Name <> SHEET_OVERVIEW And ws.Name <> SHEET_TEMPLATE Then
            ws.Delete
        End If
    Next i
    
    Application.DisplayAlerts = True
    Worksheets(SHEET_OVERVIEW).Range("I2:I1000").ClearContents
    Application.ScreenUpdating = True
    
    MsgBox "所有客户跟进页已清空，仅保留客户总览和跟进模板。", vbInformation
End Sub

Private Function GetOrCreateSheet(ByVal sheetName As String) As Worksheet
    If SheetExists(sheetName) Then
        Set GetOrCreateSheet = Worksheets(sheetName)
    Else
        Set GetOrCreateSheet = Worksheets.Add(After:=Worksheets(Worksheets.Count))
        GetOrCreateSheet.Name = sheetName
    End If
End Function

Private Function SheetExists(ByVal sheetName As String) As Boolean
    Dim ws As Worksheet
    SheetExists = False
    For Each ws In Worksheets
        If ws.Name = sheetName Then
            SheetExists = True
            Exit Function
        End If
    Next ws
End Function

Private Function IsValidSheetName(ByVal sheetName As String) As Boolean
    Dim illegalChars As Variant
    Dim ch As Variant
    
    illegalChars = Array("/", "\", "?", "*", "[", "]", ":")
    
    If Len(sheetName) = 0 Or Len(sheetName) > 31 Then
        IsValidSheetName = False
        Exit Function
    End If
    
    For Each ch In illegalChars
        If InStr(sheetName, ch) > 0 Then
            IsValidSheetName = False
            Exit Function
        End If
    Next ch
    
    IsValidSheetName = True
End Function
'@

Set-Content -LiteralPath $bas -Value $vbaCode -Encoding UTF8

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($src)
    
    while ($wb.Worksheets.Count -lt 2) {
        [void]$wb.Worksheets.Add([System.Type]::Missing, $wb.Worksheets.Item($wb.Worksheets.Count))
    }
    
    $ws1 = $wb.Worksheets.Item(1)
    $ws2 = $wb.Worksheets.Item(2)
    $ws1.Name = "客户总览"
    $ws2.Name = "跟进模板"
    
    for ($i = $wb.Worksheets.Count; $i -ge 3; $i--) {
        $wb.Worksheets.Item($i).Delete()
    }
    
    $ws1.Cells.Clear()
    $headers = @("序号","客户公司","联系人","国家","WhatsApp","邮箱","意向车型","客户等级","跳转跟进页","最后跟进日期")
    for ($i = 0; $i -lt $headers.Count; $i++) {
        $ws1.Cells.Item(1, $i + 1).Value2 = $headers[$i]
    }
    $headerRange = $ws1.Range("A1:J1")
    $headerRange.Font.Bold = $true
    $headerRange.Font.Color = 16777215
    $headerRange.Interior.Color = 7944735
    $headerRange.HorizontalAlignment = -4108
    $headerRange.Borders.LineStyle = 1
    $ws1.Rows.Item(1).RowHeight = 28
    $ws1.Columns.Item("A").ColumnWidth = 8
    $ws1.Columns.Item("B:C").ColumnWidth = 24
    $ws1.Columns.Item("D:F").ColumnWidth = 18
    $ws1.Columns.Item("G:I").ColumnWidth = 24
    $ws1.Columns.Item("J").ColumnWidth = 18
    $ws1.Range("A2:J1000").Borders.LineStyle = 1
    
    $ws1.Range("H2:H1000").Validation.Delete()
    $ws1.Range("H2:H1000").Validation.Add(3, 1, 1, "A高意向,B意向,C潜在,D沉睡")
    $ws1.Range("G2:G1000").Validation.Delete()
    $ws1.Range("G2:G1000").Validation.Add(3, 1, 1, "Deepal S07,Deepal S05,Deepal SL03,ROX ADAMAS")
    
    $ws2.Cells.Clear()
    $ws2.Range("A1").Value2 = "客户公司："
    $ws2.Range("A2").Value2 = "对接人："
    $ws2.Range("A3").Value2 = "目标车型："
    $ws2.Range("A4").Value2 = "国家："
    $ws2.Range("A5").Value2 = "客户等级："
    $templateHeaders = @("跟进日期","跟进渠道","跟进内容详情","客户反馈","下次跟进计划")
    for ($i = 0; $i -lt $templateHeaders.Count; $i++) {
        $ws2.Cells.Item(7, $i + 1).Value2 = $templateHeaders[$i]
    }
    $ws2.Range("A1:F5").Font.Bold = $true
    $ws2.Range("A1:F5").Interior.Color = 15921906
    $ws2.Range("A1:F5").Borders.LineStyle = 1
    $ws2.Range("A7:E7").Font.Bold = $true
    $ws2.Range("A7:E7").Font.Color = 16777215
    $ws2.Range("A7:E7").Interior.Color = 5405862
    $ws2.Range("A7:E7").HorizontalAlignment = -4108
    $ws2.Range("A7:E1000").Borders.LineStyle = 1
    $ws2.Columns.Item("A:B").ColumnWidth = 20
    $ws2.Columns.Item("C:E").ColumnWidth = 34
    $ws2.Rows.Item(7).RowHeight = 26
    $ws2.Range("B8:B1000").Validation.Delete()
    $ws2.Range("B8:B1000").Validation.Add(3, 1, 1, "WhatsApp,邮件,电话,IG/Facebook社媒")
    
    try {
        $module = $wb.VBProject.VBComponents.Add(1)
        $module.Name = "客户跟进自动化"
        $module.CodeModule.AddFromString($vbaCode -replace 'Attribute VB_Name = "客户跟进自动化"', '')
        $macroInjected = $true
    } catch {
        $macroInjected = $false
    }
    
    $wb.SaveAs($out, 52)
    $wb.Close($true)
} finally {
    $excel.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
}

if ($macroInjected) {
    Write-Output "OK_MACRO:$out"
} else {
    Write-Output "NO_MACRO_ACCESS:$out"
    Write-Output "BAS_FILE:$bas"
}

