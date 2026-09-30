$ErrorActionPreference = "Stop"

$outDir = Join-Path (Get-Location) "output"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$excelPath = "C:\Users\Melody\Documents\xwechat_files\wxid_8wcoee787oy711_bf61\msg\file\2026-09\MAEXTRO S800 2025 EREV Xingyao Executive Edition - 19 Units (EN).xlsx"
$heroPath = "C:\Users\Melody\AppData\Local\Temp\codex-clipboard-ccdbd6af-2cc1-4db0-a77a-48732f6a765e.png"
$detailPath = "C:\Users\Melody\AppData\Local\Temp\codex-clipboard-c8a3662f-55d3-4d9d-bdd3-19852de9bdc2.png"
$logoPath = (Get-ChildItem -LiteralPath "D:\1. Worlda Global Limited" -Recurse -Filter "logo(1).png" | Select-Object -First 1 -ExpandProperty FullName)
$logoCleanPath = Join-Path $outDir "worlda-global-auto-logo-clean.png"
$posterPath = Join-Path $outDir "maextro-s800-xingyao-executive-19-units-poster.png"
$posterJpgPath = Join-Path $outDir "maextro-s800-xingyao-executive-19-units-poster.jpg"

# Confirm the workbook metadata through Excel when available.
$modelText = "MAEXTRO S800"
$editionText = "2025 EREV Xingyao Executive Edition"
$stockText = "19 Units Available"
try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $book = $excel.Workbooks.Open($excelPath, $null, $true)
    $sheet = $book.Worksheets.Item(1)
    $used = $sheet.UsedRange
    $cells = @()
    for ($r = 1; $r -le [Math]::Min($used.Rows.Count, 20); $r++) {
        for ($c = 1; $c -le [Math]::Min($used.Columns.Count, 10); $c++) {
            $value = $used.Cells.Item($r, $c).Text
            if ($value) { $cells += [string]$value }
        }
    }
    $joined = ($cells -join " ")
    if ($joined -match "19") { $stockText = "19 Units Available" }
    $book.Close($false)
    $excel.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($used) | Out-Null
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($sheet) | Out-Null
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($book) | Out-Null
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
} catch {
    # The supplied filename already identifies the requested stock quantity.
}

Add-Type -AssemblyName System.Drawing

function New-CleanLogo {
    param([string]$Source, [string]$Destination)
    $src = [System.Drawing.Bitmap]::FromFile($Source)
    $dst = New-Object System.Drawing.Bitmap($src.Width, $src.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    for ($x = 0; $x -lt $src.Width; $x++) {
        for ($y = 0; $y -lt $src.Height; $y++) {
            $p = $src.GetPixel($x, $y)
            $max = [Math]::Max($p.R, [Math]::Max($p.G, $p.B))
            $min = [Math]::Min($p.R, [Math]::Min($p.G, $p.B))
            if (($max - $min) -lt 16 -and $min -gt 190) {
                $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
            } else {
                $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
            }
        }
    }
    $dst.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
    $src.Dispose()
    $dst.Dispose()
}

New-CleanLogo -Source $logoPath -Destination $logoCleanPath

function Fit-Crop {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Image]$Image,
        [int]$X, [int]$Y, [int]$Width, [int]$Height
    )
    $scale = [Math]::Max($Width / $Image.Width, $Height / $Image.Height)
    $drawW = [int]($Image.Width * $scale)
    $drawH = [int]($Image.Height * $scale)
    $drawX = $X + [int](($Width - $drawW) / 2)
    $drawY = $Y + [int](($Height - $drawH) / 2)
    $Graphics.DrawImage($Image, $drawX, $drawY, $drawW, $drawH)
}

function Fit-Contain {
    param(
        [System.Drawing.Graphics]$Graphics,
        [System.Drawing.Image]$Image,
        [int]$X, [int]$Y, [int]$Width, [int]$Height
    )
    $scale = [Math]::Min($Width / $Image.Width, $Height / $Image.Height)
    $drawW = [int]($Image.Width * $scale)
    $drawH = [int]($Image.Height * $scale)
    $drawX = $X + [int](($Width - $drawW) / 2)
    $drawY = $Y + [int](($Height - $drawH) / 2)
    $Graphics.DrawImage($Image, $drawX, $drawY, $drawW, $drawH)
}

function Draw-Text {
    param(
        [System.Drawing.Graphics]$Graphics,
        [string]$Text,
        [System.Drawing.Font]$Font,
        [System.Drawing.Brush]$Brush,
        [float]$X, [float]$Y,
        [System.Drawing.StringFormat]$Format = $null
    )
    if ($Format) { $Graphics.DrawString($Text, $Font, $Brush, $X, $Y, $Format) }
    else { $Graphics.DrawString($Text, $Font, $Brush, $X, $Y) }
}

$W = 1600
$H = 1200
$canvas = New-Object System.Drawing.Bitmap($W, $H, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$navy = [System.Drawing.Color]::FromArgb(12, 18, 27)
$ink = [System.Drawing.Color]::FromArgb(25, 31, 38)
$gold = [System.Drawing.Color]::FromArgb(190, 149, 80)
$softGold = [System.Drawing.Color]::FromArgb(236, 221, 190)
$white = [System.Drawing.Color]::White
$muted = [System.Drawing.Color]::FromArgb(190, 198, 206)

$g.Clear($navy)
$hero = [System.Drawing.Image]::FromFile($heroPath)
$cleanLogo = [System.Drawing.Image]::FromFile($logoCleanPath)

# Clean three-zone layout: brand header, undisturbed vehicle image, information footer.
$heroBackground = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(205, 211, 216))
$g.FillRectangle($heroBackground, 0, 190, $W, 610)
$heroBackground.Dispose()
Fit-Crop $g $hero 0 190 $W 610

$footer = New-Object System.Drawing.SolidBrush($navy)
$g.FillRectangle($footer, 0, 800, $W, 400)
$footer.Dispose()

$fontBrand = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
$fontTitle = New-Object System.Drawing.Font("Arial", 54, [System.Drawing.FontStyle]::Bold)
$fontEdition = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Regular)
$fontStock = New-Object System.Drawing.Font("Arial", 38, [System.Drawing.FontStyle]::Bold)
$fontStockBadge = New-Object System.Drawing.Font("Arial", 31, [System.Drawing.FontStyle]::Bold)
$fontLabel = New-Object System.Drawing.Font("Arial", 15, [System.Drawing.FontStyle]::Bold)
$fontContact = New-Object System.Drawing.Font("Arial", 19, [System.Drawing.FontStyle]::Regular)
$fontSmall = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Regular)
$fontCta = New-Object System.Drawing.Font("Arial", 19, [System.Drawing.FontStyle]::Bold)
$fontInventory = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Regular)
$brushWhite = New-Object System.Drawing.SolidBrush($white)
$brushGold = New-Object System.Drawing.SolidBrush($softGold)
$brushMuted = New-Object System.Drawing.SolidBrush($muted)
$brushInk = New-Object System.Drawing.SolidBrush($ink)

$g.DrawImage($cleanLogo, 68, 30, 270, 95)
Draw-Text $g "WORLD-CLASS LUXURY, READY TO EXPORT" $fontBrand $brushGold 70 132
Draw-Text $g $modelText $fontTitle $brushWhite 70 155
Draw-Text $g $editionText $fontEdition $brushMuted 750 175

# Stock badge.
$badge = New-Object System.Drawing.SolidBrush($gold)
$g.FillRectangle($badge, 1120, 48, 390, 106)
$badge.Dispose()
$badgeTextFormat = New-Object System.Drawing.StringFormat
$badgeTextFormat.Alignment = [System.Drawing.StringAlignment]::Center
$badgeTextFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
Draw-Text $g "IN STOCK" $fontLabel $brushInk 1315 62 $badgeTextFormat
Draw-Text $g $stockText $fontStockBadge $brushInk 1315 108 $badgeTextFormat
$badgeTextFormat.Dispose()

$contactLabel = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)
Draw-Text $g "INVENTORY OVERVIEW" $contactLabel $brushGold 72 943
Draw-Text $g "TOTAL STOCK: 19 UNITS" $fontStockBadge $brushWhite 72 976
Draw-Text $g "4-seat triple-motor EREV" $fontInventory $brushMuted 74 1025
Draw-Text $g "Inventory summary from stock sheet" $fontSmall $brushMuted 74 1060

# Compact inventory table: the poster shows the stock sheet summary directly.
$tableX = 72
$tableY = 1062
$col1 = 330
$col2 = 105
$rowH = 26
$tableBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(35, 46, 60))
$g.FillRectangle($tableBrush, $tableX, $tableY, 650, $rowH)
$tableBrush.Dispose()
$tablePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(95, 111, 126), 1)
$g.DrawRectangle($tablePen, $tableX, $tableY, 650, $rowH * 4)
$g.DrawLine($tablePen, $tableX + $col1, $tableY, $tableX + $col1, $tableY + $rowH * 4)
$g.DrawLine($tablePen, $tableX + $col1 + $col2, $tableY, $tableX + $col1 + $col2, $tableY + $rowH * 4)
for ($i = 1; $i -lt 4; $i++) {
    $g.DrawLine($tablePen, $tableX, $tableY + ($rowH * $i), $tableX + 650, $tableY + ($rowH * $i))
}
$tablePen.Dispose()
$fontTableHead = New-Object System.Drawing.Font("Arial", 13, [System.Drawing.FontStyle]::Bold)
$fontTable = New-Object System.Drawing.Font("Arial", 13, [System.Drawing.FontStyle]::Regular)
Draw-Text $g "EXTERIOR COLOR" $fontTableHead $brushGold ($tableX + 12) ($tableY + 6)
Draw-Text $g "UNITS" $fontTableHead $brushGold ($tableX + $col1 + 12) ($tableY + 6)
Draw-Text $g "PRODUCTION YEAR" $fontTableHead $brushGold ($tableX + $col1 + $col2 + 12) ($tableY + 6)
Draw-Text $g "Dawn Gold Black" $fontTable $brushWhite ($tableX + 12) ($tableY + $rowH + 6)
Draw-Text $g "7" $fontTable $brushWhite ($tableX + $col1 + 12) ($tableY + $rowH + 6)
Draw-Text $g "2026" $fontTable $brushWhite ($tableX + $col1 + $col2 + 12) ($tableY + $rowH + 6)
Draw-Text $g "Cloud Silver Purple" $fontTable $brushWhite ($tableX + 12) ($tableY + $rowH * 2 + 6)
Draw-Text $g "9" $fontTable $brushWhite ($tableX + $col1 + 12) ($tableY + $rowH * 2 + 6)
Draw-Text $g "2026" $fontTable $brushWhite ($tableX + $col1 + $col2 + 12) ($tableY + $rowH * 2 + 6)
Draw-Text $g "Wilderness Brown Gold" $fontTable $brushWhite ($tableX + 12) ($tableY + $rowH * 3 + 6)
Draw-Text $g "3" $fontTable $brushWhite ($tableX + $col1 + 12) ($tableY + $rowH * 3 + 6)
Draw-Text $g "2026" $fontTable $brushWhite ($tableX + $col1 + $col2 + 12) ($tableY + $rowH * 3 + 6)

Draw-Text $g "CONTACT WORLD A GLOBAL AUTO" $contactLabel $brushGold 760 943
Draw-Text $g "Web: www.worldaauto.com" $fontContact $brushWhite 760 980
Draw-Text $g "Email: sales01@worldaauto.com" $fontContact $brushWhite 760 1016
Draw-Text $g "WA / WeChat: +86 138 3266 6352  /  +86 138 1071 0061" $fontContact $brushWhite 760 1052
Draw-Text $g "Request quotation and shipping details" $fontCta $brushGold 760 1104

$canvas.Save($posterPath, [System.Drawing.Imaging.ImageFormat]::Png)
$canvas.Save($posterJpgPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$hero.Dispose()
$cleanLogo.Dispose()
$g.Dispose()
$canvas.Dispose()

Write-Output $posterPath
Write-Output $posterJpgPath
