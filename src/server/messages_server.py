# Vasya Hobot
#
# Copyright (c) 2013-2014 Vyacheslav Slinko
# Licensed under the MIT License

import asyncore
import socket
import struct

import Skype4Py

from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol

from api.skype.ttypes import Message

import helpers
import mappers


class MessagesServer(asyncore.dispatcher):
    def __init__(self, address):
        asyncore.dispatcher.__init__(self)
        self.create_socket(socket.AF_INET, socket.SOCK_STREAM)
        self.set_reuse_addr()
        self.bind(address)
        self.listen(5)

        self.connections = []

    def handle_accept(self):
        pair = self.accept()
        if pair is not None:
            connection, address = pair
            self.connections.append(connection)

    def sendall(self, message):
        active_connections = []

        for connection in self.connections:
            try:
                connection.sendall(message)
            except socket.error, e:
                pass
            else:
                active_connections.append(connection)

        self.connections = active_connections


def main():
    skype = helpers.init_skype4py()

    server = MessagesServer(('', 9091))

    def on_message(message, status):
        msg = mappers.remap_message_object(message)

        transport = TTransport.TMemoryBuffer()
        protocol = TBinaryProtocol.TBinaryProtocol(transport)
        msg.write(protocol)
        serialized = transport.getvalue()

        server.sendall(struct.pack('!i', len(serialized)))
        server.sendall(serialized)

    print("messages_server: Attaching to Skype")
    skype.OnMessageStatus = on_message
    skype.Attach()

    print("messages_server: Serving")
    asyncore.loop()


if __name__ == '__main__':
    main()
