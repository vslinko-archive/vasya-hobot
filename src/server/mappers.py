# Vasya Hobot
#
# Copyright (c) 2013-2014 Vyacheslav Slinko
# Licensed under the MIT License

from thrift.Thrift import TType

from api.skype.ttypes import Chat, User, Message


__all__ = ['remap_chat_object', 'remap_user_object', 'remap_message_object']


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
message_mapper = mapper_factory(Message)


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


def remap_message_object(obj):
    new_obj = message_mapper(obj)
    new_obj.chat = remap_chat_object(obj.Chat)
    new_obj.sender = remap_user_object(obj.Sender)
    new_obj.users = map(remap_user_object, obj.Users)
    return new_obj
