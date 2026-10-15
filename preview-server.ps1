# Local preview server for the Middlebrook site.
# Serves this folder at http://localhost:8080 so the site behaves like it will online
# (YouTube videos play, fonts load). Close the window to stop it.
# Start it by double-clicking "Preview Site.cmd". This file is not part of the website.

$port = 8080
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
  $listener.Start()
} catch {
  Write-Host "Port $port is busy. The preview may already be running at http://localhost:$port" -ForegroundColor Yellow
  Start-Process "http://localhost:$port/index.html"
  Read-Host "Press Enter to close"
  exit
}

# Each request is answered on its own thread, so pages with many photos load fully
$handler = {
  param($context, $root)
  $types = @{
    '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'
    '.json' = 'application/json'; '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
    '.webp' = 'image/webp'; '.gif' = 'image/gif'; '.ico' = 'image/x-icon'; '.mp4' = 'video/mp4'; '.pdf' = 'application/pdf'
    '.woff' = 'font/woff'; '.woff2' = 'font/woff2'
  }
  $response = $context.Response
  try {
    $path = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath).TrimStart('/')
    if ($path -eq '') { $path = 'index.html' }
    $file = [IO.Path]::GetFullPath((Join-Path $root $path))

    if (-not $file.StartsWith($root) -or -not (Test-Path -LiteralPath $file -PathType Leaf)) {
      # Unknown pages get the site's 404 page, like the live host will show
      $response.StatusCode = 404
      $notFound = Join-Path $root '404.html'
      if ([IO.Path]::GetExtension($path) -in @('', '.html', '.htm') -and (Test-Path -LiteralPath $notFound)) {
        $response.ContentType = 'text/html; charset=utf-8'
        $bytes = [IO.File]::ReadAllBytes($notFound)
      } else {
        $bytes = [Text.Encoding]::UTF8.GetBytes('Not found')
      }
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ext = [IO.Path]::GetExtension($file).ToLower()
      $response.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { 'application/octet-stream' }
      # Always serve fresh files while previewing, so edits show up on a normal refresh
      $response.Headers.Add('Cache-Control', 'no-store')
      $stream = [IO.File]::Open($file, 'Open', 'Read', 'ReadWrite')
      $response.ContentLength64 = $stream.Length
      $stream.CopyTo($response.OutputStream)
      $stream.Dispose()
    }
  } catch {
    # Browsers often cancel video requests partway; ignore those
  } finally {
    try { $response.Close() } catch {}
  }
}

$pool = [RunspaceFactory]::CreateRunspacePool(1, 16)
$pool.Open()
$jobs = New-Object System.Collections.ArrayList

Write-Host "Middlebrook preview running at http://localhost:$port" -ForegroundColor Green
Write-Host "Leave this window open while you preview. Close it to stop."
Start-Process "http://localhost:$port/index.html"

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $ps = [PowerShell]::Create()
  $ps.RunspacePool = $pool
  [void]$ps.AddScript($handler).AddArgument($context).AddArgument($root)
  [void]$jobs.Add([pscustomobject]@{ ps = $ps; handle = $ps.BeginInvoke() })

  # Tidy up finished requests
  foreach ($job in @($jobs)) {
    if ($job.handle.IsCompleted) {
      try { $job.ps.EndInvoke($job.handle) } catch {}
      $job.ps.Dispose()
      [void]$jobs.Remove($job)
    }
  }
}
