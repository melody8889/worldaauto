$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$assetDir = Join-Path $root "assets\videos"
$pptxPath = Join-Path $assetDir "uae-export-planning-video.pptx"
$mp4Path = Join-Path $assetDir "uae-export-planning.mp4"
$bgPath = Join-Path $assetDir "uae-export-planning-bg.png"
$logoPath = Join-Path $root "assets\logo.png"

New-Item -ItemType Directory -Force -Path $assetDir | Out-Null
if (Test-Path $pptxPath) { Remove-Item -LiteralPath $pptxPath -Force }
if (Test-Path $mp4Path) { Remove-Item -LiteralPath $mp4Path -Force }

$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue
$presentation = $ppt.Presentations.Add([Microsoft.Office.Core.MsoTriState]::msoFalse)
$presentation.PageSetup.SlideWidth = 1280
$presentation.PageSetup.SlideHeight = 720

function Add-TextBox {
  param(
    [object]$slide,
    [string]$text,
    [double]$left,
    [double]$top,
    [double]$width,
    [double]$height,
    [double]$size,
    [bool]$bold = $true,
    [int]$color = 16777215
  )
  $shape = $slide.Shapes.AddTextbox(1, $left, $top, $width, $height)
  $shape.TextFrame.TextRange.Text = $text
  $shape.TextFrame.TextRange.Font.Name = "Arial"
  $shape.TextFrame.TextRange.Font.Size = $size
  $shape.TextFrame.TextRange.Font.Bold = if ($bold) { -1 } else { 0 }
  $shape.TextFrame.TextRange.Font.Color.RGB = $color
  $shape.TextFrame.MarginLeft = 0
  $shape.TextFrame.MarginRight = 0
  $shape.TextFrame.MarginTop = 0
  $shape.TextFrame.MarginBottom = 0
  return $shape
}

function Add-BaseSlide {
  param([string]$title, [string]$subtitle, [string]$chip)
  $slide = $presentation.Slides.Add($presentation.Slides.Count + 1, 12)
  $slide.FollowMasterBackground = 0
  $bg = $slide.Shapes.AddPicture($bgPath, 0, -1, -28, -20, 1336, 752)
  $overlay = $slide.Shapes.AddShape(1, 0, 0, 1280, 720)
  $overlay.Fill.ForeColor.RGB = 1710610
  $overlay.Fill.Transparency = 0.18
  $overlay.Line.Visible = 0
  $band = $slide.Shapes.AddShape(1, 0, 0, 760, 720)
  $band.Fill.ForeColor.RGB = 855567
  $band.Fill.Transparency = 0.12
  $band.Line.Visible = 0
  $logo = $slide.Shapes.AddPicture($logoPath, 0, -1, 1040, 28, 185, 64)
  $logo.PictureFormat.TransparencyColor = 16777215
  Add-TextBox $slide "Destination: United Arab Emirates" 66 84 760 45 25 $true 5746136 | Out-Null
  Add-TextBox $slide $title 66 146 760 180 58 $true 16777215 | Out-Null
  Add-TextBox $slide $subtitle 70 404 760 95 31 $true 16777215 | Out-Null
  $chipShape = $slide.Shapes.AddShape(5, 70, 585, 340, 52)
  $chipShape.Fill.ForeColor.RGB = 5746136
  $chipShape.Fill.Transparency = 0.05
  $chipShape.Line.ForeColor.RGB = 5746136
  $chipShape.TextFrame.TextRange.Text = $chip
  $chipShape.TextFrame.TextRange.Font.Name = "Arial"
  $chipShape.TextFrame.TextRange.Font.Size = 21
  $chipShape.TextFrame.TextRange.Font.Bold = -1
  $chipShape.TextFrame.TextRange.Font.Color.RGB = 16777215
  $chipShape.TextFrame.HorizontalAnchor = 2
  $chipShape.TextFrame.VerticalAnchor = 3
  return $slide
}

$slides = @(
  @{ Title = "Regional Export Planning for UAE Buyers"; Subtitle = "Plan the route before placing the order."; Chip = "UAE Destination Planning" },
  @{ Title = "Route Planning by Destination Port"; Subtitle = "China to UAE shipment routes checked by port, schedule and quantity."; Chip = "Port Route + Delivery Time" },
  @{ Title = "Documents Checked Before Shipment"; Subtitle = "Invoice, packing list, export declaration and origin documents coordinated in advance."; Chip = "Export Document Review" },
  @{ Title = "Sea Freight and Land Transport Options"; Subtitle = "Shipment method selected by destination, delivery schedule and customs route."; Chip = "Transport Coordination" },
  @{ Title = "Clear Plan Before Order Execution"; Subtitle = "Worlda Global Auto supports UAE buyers from stock confirmation to shipment."; Chip = "WhatsApp: +86 13810710061" }
)

foreach ($s in $slides) {
  $slide = Add-BaseSlide $s.Title $s.Subtitle $s.Chip
  $transition = $slide.SlideShowTransition
  $transition.AdvanceOnTime = -1
  $transition.AdvanceTime = 3
}

$presentation.SaveAs($pptxPath)
$presentation.CreateVideo($mp4Path, $true, 3, 720, 30, 85)

$deadline = (Get-Date).AddMinutes(3)
while ((-not (Test-Path $mp4Path) -or ((Get-Item $mp4Path).Length -lt 100000)) -and (Get-Date) -lt $deadline) {
  Start-Sleep -Seconds 2
}

$presentation.Close()
$ppt.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($presentation) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null

if (-not (Test-Path $mp4Path)) {
  throw "MP4 export failed."
}

Get-Item $mp4Path | Select-Object FullName, Length
