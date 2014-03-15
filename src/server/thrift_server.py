# Vasya Hobot
#
# Copyright (c) 2013-2014 Vyacheslav Slinko
# Licensed under the MIT License

import argparse
import os

import Skype4Py

from thrift import Thrift
from thrift.Thrift import TType
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

from api.skype import Skype
from api.skype.ttypes import Chat, User
from api.skype.ttypes import AuthenticationException

import helpers
import mappers


class SkypeHandler:
  def __init__(self, skype):
    self.skype = skype

  def get_chats(self, auth):
    self._check_auth(auth)
    return map(mappers.remap_chat_object, self.skype.Chats)

  def get_chat(self, auth, name):
    self._check_auth(auth)
    return mappers.remap_chat_object(self.skype.Chat(name))

  def get_user(self, auth, handle):
    self._check_auth(auth)
    return mappers.remap_user_object(self.skype.User(handle))

  def _check_auth(self, auth):
    if auth.token != os.environ['VASYA_TOKEN']:
        raise AuthenticationException()


def main():
    parser = argparse.ArgumentParser(description='Skype via Apache Thrift.')
    parser.add_argument('--warmup', action='store_true', help='preload all chats from client')

    args = parser.parse_args()

    skype = helpers.init_skype4py()

    handler = SkypeHandler(skype)
    processor = Skype.Processor(handler)
    transport = TSocket.TServerSocket(port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TThreadedServer(processor, transport, tfactory, pfactory, daemon=True)

    print("thrift_server: Attaching to Skype")
    skype.Attach()

    if args.warmup:
        print("thrift_server: Warming up chats")
        map(mappers.remap_chat_object, skype.Chats)

    print("thrift_server: Serving")
    server.serve()


if __name__ == '__main__':
    main()
