# Vasya Hobot
#
# Copyright (c) 2013-2014 Vyacheslav Slinko
# Licensed under the MIT License

import sys
import os

import Skype4Py


def init_skype4py():
    if sys.platform.startswith('linux'):
        skype = Skype4Py.Skype(Transport=os.environ.get('SKYPE_API_TRANSPORT', 'x11'))
    else:
        skype = Skype4Py.Skype()

    return skype
