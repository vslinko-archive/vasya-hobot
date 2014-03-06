# Vasya Hobot
# 
# Copyright (c) 2013-2014 Vyacheslav Slinko
# Licensed under the MIT License

import sys, os, argparse
sys.path.append('gen-py')

from skype import Skype
from skype.ttypes import Chat, User
from skype.ttypes import AuthenticationException

import Skype4Py
from thrift import Thrift
from thrift.Thrift import TType
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer


def mapper_factory(struct):
    fields = []

    for field in struct.thrift_spec:
        if field:
            dest_field_name = field[2]
            source_field_name = dest_field_name[0].upper() + dest_field_name[1:]
            field_type = field[1]
            fields.append((source_field_name, dest_field_name, field_type))

    def _mapper(obj):
        new_obj = struct()

        for field in fields:
            value = getattr(obj, field[0])

            if field[2] == TType.STRING and value:
                value = value.encode('utf8')

            setattr(new_obj, field[1], value)

        return new_obj

    return _mapper


chat_mapper = mapper_factory(Chat)
user_mapper = mapper_factory(User)


def remap_user_object(obj):
    if obj.Handle == "":
        return None

    new_obj = user_mapper(obj)
    return new_obj


def remap_chat_object(obj):
    new_obj = chat_mapper(obj)
    new_obj.activeMembers = map(remap_user_object, obj.ActiveMembers)
    new_obj.adder = remap_user_object(obj.Adder)
    new_obj.applicants = map(remap_user_object, obj.Applicants)
    new_obj.members = map(remap_user_object, obj.Members)
    new_obj.posters = map(remap_user_object, obj.Posters)
    return new_obj


class SkypeHandler:
  def __init__(self, skype):
    self.skype = skype

  def get_chats(self, auth):
    self._check_auth(auth)
    return map(remap_chat_object, self.skype.Chats)

  def get_chat(self, auth, name):
    self._check_auth(auth)
    return remap_chat_object(self.skype.Chat(name))

  def get_user(self, auth, handle):
    self._check_auth(auth)
    return remap_user_object(self.skype.User(handle))

  def _check_auth(self, auth):
    if auth.token != "token":
        raise AuthenticationException()


def main():
    parser = argparse.ArgumentParser(description='Skype via Apache Thrift.')
    parser.add_argument('--warmup', action='store_true', help='preload all chats from client')

    args = parser.parse_args()

    if sys.platform.startswith('linux'):
        skype = Skype4Py.Skype(Transport=os.environ.get('SKYPE_API_TRANSPORT', 'x11'))
    else:
        skype = Skype4Py.Skype()

    handler = SkypeHandler(skype)
    processor = Skype.Processor(handler)
    transport = TSocket.TServerSocket(port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    print("Attaching to Skype")
    skype.Attach()

    if args.warmup:
        print("Warming up chats")
        map(remap_chat_object, skype.Chats)

    print("Serving")
    server.serve()


if __name__ == '__main__':
    main()
