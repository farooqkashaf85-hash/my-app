$base = "https://my-app-1-1xuw.onrender.com"

Write-Host "Using base URL: $base"

try {
    Write-Host "1) Signup user (may fail if user already exists)"
    $signupBody = @{ name = 'Demo User'; email = 'demo@example.com'; password = 'password123' }
    $signup = Invoke-RestMethod -Method Post -Uri "$base/api/auth/signup" -Body ($signupBody | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
    Write-Host "Signup response:" ($signup | ConvertTo-Json -Depth 5)
} catch {
    Write-Warning "Signup failed (user may already exist): $_"
}

Write-Host "2) Login user"
$loginBody = @{ email = 'demo@example.com'; password = 'password123' }
$login = Invoke-RestMethod -Method Post -Uri "$base/api/auth/login" -Body ($loginBody | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop

$token = $null
if ($login -and $login.token) { $token = $login.token }
elseif ($login -and $login.authToken) { $token = $login.authToken }
elseif ($login -and $login.data -and $login.data.token) { $token = $login.data.token }

if (-not $token) { Write-Error "Could not find token in login response: $($login | ConvertTo-Json -Depth 5)"; exit 1 }

Write-Host "Received token (truncated): $($token.Substring(0,20))..."

Write-Host "3) Create a note"
$noteBody = @{ title = 'Demo note'; description = 'Created by demo script' }
$createdNote = Invoke-RestMethod -Method Post -Uri "$base/api/notes" -Headers @{ Authorization = "Bearer $token" } -Body ($noteBody | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
Write-Host "Created note:" ($createdNote | ConvertTo-Json -Depth 5)

Write-Host "4) List notes"
$notes = Invoke-RestMethod -Method Get -Uri "$base/api/notes" -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
Write-Host "Notes:" ($notes | ConvertTo-Json -Depth 5)

Write-Host "Demo finished"
