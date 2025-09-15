# Script para gerar ícone do app Quiosque Beach
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

# Criar bitmap 1024x1024 para o ícone principal
$size = 1024
$bitmap = New-Object System.Drawing.Bitmap($size, $size)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Criar gradiente de fundo
$rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(255, 102, 126, 234), [System.Drawing.Color]::FromArgb(255, 118, 75, 162), [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)

# Criar forma circular
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(50, 50, $size - 100, $size - 100)
$graphics.FillPath($brush, $path)

# Adicionar texto "QB" (Quiosque Beach)
$font = New-Object System.Drawing.Font("Arial", 300, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$text = "QB"
$textSize = $graphics.MeasureString($text, $font)
$x = ($size - $textSize.Width) / 2
$y = ($size - $textSize.Height) / 2
$graphics.DrawString($text, $font, $textBrush, $x, $y)

# Salvar ícone principal
$bitmap.Save("C:\Kiosk\QuiosqueBeach\resources\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Criar versões menores
$sizes = @(512, 192, 144, 96, 72, 48, 36)
foreach ($targetSize in $sizes) {
    $smallBitmap = New-Object System.Drawing.Bitmap($targetSize, $targetSize)
    $smallGraphics = [System.Drawing.Graphics]::FromImage($smallBitmap)
    $smallGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $smallGraphics.DrawImage($bitmap, 0, 0, $targetSize, $targetSize)
    $smallBitmap.Save("C:\Kiosk\QuiosqueBeach\resources\icon-${targetSize}.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $smallBitmap.Dispose()
    $smallGraphics.Dispose()
}

# Limpar recursos
$graphics.Dispose()
$bitmap.Dispose()
$brush.Dispose()
$font.Dispose()
$textBrush.Dispose()

Write-Host "Ícones gerados com sucesso!"
