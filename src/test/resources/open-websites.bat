@ECHO OFF

SET browser=%1

IF "%browser%"=="" (
	ECHO "Usage %0 <chrome|firefox|msedge>"
	EXIT /b 1
)

SET "urls="

FOR /F "tokens=*" %%A IN (websites.txt) DO CALL SET "urls=%%urls%% %%A"

START %browser% %urls%
