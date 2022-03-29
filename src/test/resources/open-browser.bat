@echo off

SET browser=%1

IF "%browser%"=="" (
	ECHO "Usage %0 <chrome|firefox|msedge>"
	EXIT /b 1
)

for /F "tokens=*" %%A in (websites.txt) do ping 127.0.0.1 -n 1 -w 100 > nul && start %browser% %%A