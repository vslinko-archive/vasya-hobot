# Vasya Hobot
# 
# Copyright (c) 2013-2014 Vyacheslav Slinko
# Licensed under the MIT License

import sys, os
sys.path.append('gen-py')

from skype import Skype
from skype.ttypes import Chat, User

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


class SkypeHandler:
  def __init__(self, skype):
    self.skype = skype

  def get_chats(self):
    return map(chat_mapper, self.skype.Chats)

  def get_chat(self, name):
    return chat_mapper(self.skype.Chat(name))

  def get_user(self, handle):
    return user_mapper(self.skype.User(handle))


def main():
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

    skype.Attach()
    server.serve()


if __name__ == '__main__':
    main()
