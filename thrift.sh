#!/bin/sh
# Vasya Hobot
# 
# Copyright (c) 2013-2014 Vyacheslav Slinko
# Licensed under the MIT License

thrift --gen js:node skype.thrift
thrift --gen py skype.thrift
