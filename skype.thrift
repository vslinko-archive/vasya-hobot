/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

struct Authentication {
    1: required string token
}


struct Chat {
    # activeMembers
    # activityDatetime
    3: required i32 activityTimestamp,
    # adder
    # applicants
    6: required string blob,
    7: required bool bookmarked,
    # datetime
    9: required string description,
    10: required string dialogPartner,
    11: required string friendlyName,
    12: required string guideLines,
    # memberObjects
    # members
    # messages
    16: required string myRole,
    17: required string myStatus,
    18: required string name,
    19: required i16 options,
    20: required string passwordHint,
    # posters
    # recentMessages
    23: required string status,
    24: required i32 timestamp,
    25: required string topic,
    26: required string topicXML,
    27: required string type
}


struct User {
    1: required string about,
    # aliases
    # birthday
    4: required i16 buddyStatus,
    5: required bool canLeaveVoicemail,
    6: required string city,
    7: required string country,
    8: required string countryCode,
    9: required string displayName,
    10: required string fullName,
    11: required string handle,
    12: required bool hasCallEquipment,
    13: required string homepage,
    14: required bool isAuthorized,
    15: required bool isBlocked,
    16: required bool isCallForwardActive,
    17: required bool isSkypeOutContact,
    18: required bool isVideoCapable,
    19: required bool isVoicemailCapable,
    20: required string language,
    21: required string languageCode,
    22: required i32 lastOnline,
    # lastOnlineDatetime
    24: required string moodText,
    25: required i16 numberOfAuthBuddies,
    26: required string onlineStatus,
    27: required string phoneHome,
    28: required string phoneMobile,
    29: required string phoneOffice,
    30: required string province,
    31: required string receivedAuthRequest,
    32: required string richMoodText,
    33: required string sex,
    34: required string speedDial,
    35: required i32 timezone
}


exception AuthenticationException {}


service Skype {
    list<Chat> get_chats(1:required Authentication auth)
               throws (1:AuthenticationException ae),

    Chat get_chat(1:required Authentication auth,
                  2:required string name)
         throws (1:AuthenticationException ae),

    User get_user(1:required Authentication auth,
                  2:required string handle)
         throws (1:AuthenticationException ae)
}
