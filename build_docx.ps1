$ErrorActionPreference = 'Stop'

$source = 'c:\games and programs\IV курс СТЕТІ\studentplatform\zvit_predyplomna_tymtsiv.md'
$output = 'c:\games and programs\IV курс СТЕТІ\studentplatform\zvit_predyplomna_tymtsiv.docx'

function Escape-Xml([string]$text) {
    [System.Security.SecurityElement]::Escape($text)
}

function Add-Entry {
    param(
        [System.IO.Compression.ZipArchive]$Zip,
        [string]$Path,
        [string]$Content
    )

    $entry = $Zip.CreateEntry($Path)
    $stream = $entry.Open()
    $writer = New-Object System.IO.StreamWriter($stream, [System.Text.Encoding]::UTF8)
    $writer.Write($Content)
    $writer.Flush()
    $writer.Dispose()
    $stream.Dispose()
}

$lines = Get-Content -LiteralPath $source
$paragraphs = New-Object System.Collections.Generic.List[string]

foreach ($line in $lines) {
    $trimmed = $line.TrimEnd()

    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        $paragraphs.Add('<w:p/>')
        continue
    }

    if ($trimmed -eq '---') {
        $paragraphs.Add('<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="999999"/></w:pBdr></w:pPr></w:p>')
        continue
    }

    if ($trimmed.StartsWith('# ')) {
        $text = Escape-Xml($trimmed.Substring(2))
        $paragraphs.Add("<w:p><w:pPr><w:pStyle w:val='Heading1'/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val='32'/></w:rPr><w:t>$text</w:t></w:r></w:p>")
        continue
    }

    if ($trimmed.StartsWith('## ')) {
        $text = Escape-Xml($trimmed.Substring(3))
        $paragraphs.Add("<w:p><w:pPr><w:pStyle w:val='Heading2'/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val='28'/></w:rPr><w:t>$text</w:t></w:r></w:p>")
        continue
    }

    if ($trimmed.StartsWith('### ')) {
        $text = Escape-Xml($trimmed.Substring(4))
        $paragraphs.Add("<w:p><w:pPr><w:pStyle w:val='Heading3'/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val='24'/></w:rPr><w:t>$text</w:t></w:r></w:p>")
        continue
    }

    if ($trimmed.StartsWith('- ')) {
        $text = Escape-Xml($trimmed.Substring(2))
        $paragraphs.Add("<w:p><w:pPr><w:ind w:left='720'/><w:numPr><w:ilvl w:val='0'/><w:numId w:val='1'/></w:numPr></w:pPr><w:r><w:t>$text</w:t></w:r></w:p>")
        continue
    }

    if ($trimmed -match '^[0-9]+\.\s+') {
        $text = Escape-Xml(($trimmed -replace '^[0-9]+\.\s+', ''))
        $paragraphs.Add("<w:p><w:pPr><w:ind w:left='720'/><w:numPr><w:ilvl w:val='0'/><w:numId w:val='2'/></w:numPr></w:pPr><w:r><w:t>$text</w:t></w:r></w:p>")
        continue
    }

    $text = Escape-Xml($trimmed)
    $paragraphs.Add("<w:p><w:r><w:t xml:space='preserve'>$text</w:t></w:r></w:p>")
}

$documentBody = ($paragraphs -join "`n")

$documentXml = @"
<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<w:document xmlns:wpc='http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas' xmlns:mc='http://schemas.openxmlformats.org/markup-compatibility/2006' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:r='http://schemas.openxmlformats.org/officeDocument/2006/relationships' xmlns:m='http://schemas.openxmlformats.org/officeDocument/2006/math' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:wp14='http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing' xmlns:wp='http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing' xmlns:w10='urn:schemas-microsoft-com:office:word' xmlns:w='http://schemas.openxmlformats.org/wordprocessingml/2006/main' xmlns:w14='http://schemas.microsoft.com/office/word/2010/wordml' xmlns:wpg='http://schemas.microsoft.com/office/word/2010/wordprocessingGroup' xmlns:wpi='http://schemas.microsoft.com/office/word/2010/wordprocessingInk' xmlns:wne='http://schemas.microsoft.com/office/word/2006/wordml' xmlns:wps='http://schemas.microsoft.com/office/word/2010/wordprocessingShape' mc:Ignorable='w14 wp14'>
  <w:body>
    $documentBody
    <w:sectPr>
      <w:pgSz w:w='11906' w:h='16838'/>
      <w:pgMar w:top='1440' w:right='1440' w:bottom='1440' w:left='1440' w:header='708' w:footer='708' w:gutter='0'/>
      <w:cols w:space='708'/>
      <w:docGrid w:linePitch='360'/>
    </w:sectPr>
  </w:body>
</w:document>
"@

$stylesXml = @"
<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<w:styles xmlns:w='http://schemas.openxmlformats.org/wordprocessingml/2006/main'>
  <w:style w:type='paragraph' w:default='1' w:styleId='Normal'>
    <w:name w:val='Normal'/>
    <w:qFormat/>
    <w:rPr>
      <w:rFonts w:ascii='Times New Roman' w:hAnsi='Times New Roman'/>
      <w:sz w:val='24'/>
    </w:rPr>
  </w:style>
  <w:style w:type='paragraph' w:styleId='Heading1'>
    <w:name w:val='heading 1'/>
    <w:basedOn w:val='Normal'/>
    <w:next w:val='Normal'/>
    <w:qFormat/>
    <w:rPr><w:b/><w:sz w:val='32'/></w:rPr>
  </w:style>
  <w:style w:type='paragraph' w:styleId='Heading2'>
    <w:name w:val='heading 2'/>
    <w:basedOn w:val='Normal'/>
    <w:next w:val='Normal'/>
    <w:qFormat/>
    <w:rPr><w:b/><w:sz w:val='28'/></w:rPr>
  </w:style>
  <w:style w:type='paragraph' w:styleId='Heading3'>
    <w:name w:val='heading 3'/>
    <w:basedOn w:val='Normal'/>
    <w:next w:val='Normal'/>
    <w:qFormat/>
    <w:rPr><w:b/><w:sz w:val='24'/></w:rPr>
  </w:style>
</w:styles>
"@

$contentTypes = @"
<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Types xmlns='http://schemas.openxmlformats.org/package/2006/content-types'>
  <Default Extension='rels' ContentType='application/vnd.openxmlformats-package.relationships+xml'/>
  <Default Extension='xml' ContentType='application/xml'/>
  <Override PartName='/word/document.xml' ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml'/>
  <Override PartName='/word/styles.xml' ContentType='application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml'/>
</Types>
"@

$rels = @"
<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'>
  <Relationship Id='R1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument' Target='word/document.xml'/>
</Relationships>
"@

$docRels = @"
<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'></Relationships>
"@

$temp = [System.IO.Path]::GetTempFileName()
Remove-Item -LiteralPath $temp
[System.IO.Compression.ZipFile]::Open($temp, [System.IO.Compression.ZipArchiveMode]::Create).Dispose()
$zip = [System.IO.Compression.ZipFile]::Open($temp, [System.IO.Compression.ZipArchiveMode]::Update)

Add-Entry -Zip $zip -Path '[Content_Types].xml' -Content $contentTypes
Add-Entry -Zip $zip -Path '_rels/.rels' -Content $rels
Add-Entry -Zip $zip -Path 'word/document.xml' -Content $documentXml
Add-Entry -Zip $zip -Path 'word/styles.xml' -Content $stylesXml
Add-Entry -Zip $zip -Path 'word/_rels/document.xml.rels' -Content $docRels

$zip.Dispose()

if (Test-Path $output) {
    Remove-Item -LiteralPath $output -Force
}
Move-Item -LiteralPath $temp -Destination $output -Force
Write-Output "Created $output"
