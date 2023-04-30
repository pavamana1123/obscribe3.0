npm run build
Get-ChildItem ..\..\release\ | Where-Object { $_.Name -ne "obscriber.exe" } | Remove-Item -Recurse -Force
Move-Item -Force .\build\* ..\..\release\