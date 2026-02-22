#!/bin/bash
rsync -avz index.html hostinger:/docker/adscalelabs-site/
echo "AdScale Labs deployed!"
