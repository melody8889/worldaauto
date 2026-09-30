$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$storyDir = Join-Path $root "assets\videos\uae-storyboard"
$assetDir = Join-Path $root "assets\videos"
$pptxPath = Join-Path $assetDir "uae-export-storyboard-video.pptx"
$mp4Path = Join-Path $assetDir "uae-export-storyboard.mp4"
$logoPath = Join-Path $root "assets\logo.png"

if (Test-Path $pptxPath) { Remove-Item -LiteralPath $pptxPath -Force }
if (Test-Path $mp4Path) { Remove-Item -LiteralPath $mp4Path -Force }

$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue
$presentation = $ppt.Presentations.Add([Microsoft.Office.Core.MsoTriState]::msoFalse)
$presentation.PageSetup.SlideWidth = 1280
$presentation.PageSetup.SlideHeight = 720

function Add-CoverImage {
  param([object]$slide, [string]$imagePath)
  Add-Type -AssemblyName System.Drawing
  $img = [System.Drawing.Image]::FromFile($imagePath)
  $iw = $img.Width
  $ih = $img.Height
  $img.Dispose()
  $sw = 1280
  $sh = 720
  $scale = [Math]::Max($sw / $iw, $sh / $ih)
  $w = $iw * $scale
  $h = $ih * $scale
  $left = ($sw - $w) / 2
  $top = ($sh - $h) / 2
  return $slide.Shapes.AddPicture($imagePath, 0, -1, $left, $top, $w, $h)
}

function Add-Text {
  param(
    [object]$slide,
    [string]$text,
    [double]$left,
    [double]$top,
    [double]$width,
    [double]$height,
    [double]$size
  )
  $shape = $slide.Shapes.AddTextbox(1, $left, $top, $width, $height)
  $shape.TextFrame.TextRange.Text = $text
  $shape.TextFrame.TextRange.Font.Name = "Arial"
  $shape.TextFrame.TextRange.Font.Size = $size
  $shape.TextFrame.TextRange.Font.Bold = -1
  $shape.TextFrame.TextRange.Font.Color.RGB = 16777215
  $shape.TextFrame.MarginLeft = 0
  $shape.TextFrame.MarginRight = 0
  $shape.TextFrame.MarginTop = 0
  $shape.TextFrame.MarginBottom = 0
  return $shape
}

$shots = @(
  @{ Image = "01-vehicle-stock-ready.png"; Title = "Vehicle Stock Ready for Export"; Line = "Available units prepared for overseas buyers." },
  @{ Image = "02-uae-destination-map.png"; Title = "Destination: United Arab Emirates"; Line = "Route planning by destination country and port." },
  @{ Image = "03-port-container-loading.png"; Title = "Port Loading and Shipment Coordination"; Line = "Sea freight and loading schedule arranged in advance." },
  @{ Image = "04-export-documents-check.png"; Title = "Export Documents Checked Before Shipment"; Line = "Invoice, packing list, COC and export declaration reviewed." },
  @{ Image = "05-vehicles-ready-to-ship.png"; Title = "Vehicles Ready for Global Shipment"; Line = "Clear export plan before order execution." }
)

foreach ($shot in $shots) {
  $slide = $presentation.Slides.Add($presentation.Slides.Count + 1, 12)
  $slide.FollowMasterBackground = 0
  $imagePath = Join-Path $storyDir $shot.Image
  Add-CoverImage $slide $imagePath | Out-Null

  $topShade = $slide.Shapes.AddShape(1, 0, 0, 1280, 145)
  $topShade.Fill.ForeColor.RGB = 0
  $topShade.Fill.Transparency = 0.55
  $topShade.Line.Visible = 0

  $bottomShade = $slide.Shapes.AddShape(1, 0, 485, 1280, 235)
  $bottomShade.Fill.ForeColor.RGB = 0
  $bottomShade.Fill.Transparency = 0.28
  $bottomShade.Line.Visible = 0

  $logo = $slide.Shapes.AddPicture($logoPath, 0, -1, 1038, 26, 188, 64)
  $logo.PictureFormat.TransparencyColor = 16777215

  Add-Text $slide "Worlda Global Auto" 58 42 520 34 24 | Out-Null
  Add-Text $slide $shot.Title 58 532 910 54 39 | Out-Null
  Add-Text $slide $shot.Line 60 594 930 40 24 | Out-Null

  $contact = Add-Text $slide "WhatsApp: +86 13810710061" 842 628 360 32 21
  $contact.TextFrame.TextRange.ParagraphFormat.Alignment = 3

  $transition = $slide.SlideShowTransition
  $transition.AdvanceOnTime = -1
  $transition.AdvanceTime = 3
}

$presentation.SaveAs($pptxPath)
$presentation.CreateVideo($mp4Path, $true, 3, 720, 30, 90)

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
