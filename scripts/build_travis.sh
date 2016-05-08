#!/bin/bash
# Created by skaldo on 08.05.2016
# This script decides which build does have to start according to the build matrix.
set -ev
if [ $JOB = "unit" ]; then
  gulp test
elif [ $JOB = "build-ios" ]; then
  ionic build ios
elif [ $JOB = "build-android" ]; then
  ionic build android
elif [ $JOB = "build-web" ]; then
  gulp build
else
  echo "Only supported jobs are: unit, build-ios, build-android, build-web"
fi