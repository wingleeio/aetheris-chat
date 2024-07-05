module default {
    global current_user_id: uuid;

    abstract type Base {
        required created_at: datetime {
            default := datetime_current();
            readonly := true;
        };
        required updated_at: datetime {
            default := datetime_current();
            rewrite insert using (datetime_of_statement());
            rewrite update using (datetime_of_statement());
        };
    }

    type User extending Base {
        required email: str {
            constraint exclusive;
        };
        hashed_password: str;
        required email_verified: bool;
        single profile := .<user[is Profile];
    }

    type Profile extending Base {
        avatar_url: str;
        cover_url: str;
        bio: str;
        required display_name: str;
        required tag: str {
            constraint expression on (__subject__ LIKE '#%' AND __subject__[1:] NOT LIKE '%[^a-zA-Z0-9]%' AND __subject__[1:] NOT LIKE '#%');
        }
        constraint exclusive on ((.display_name, .tag));
        required user: User {
            constraint exclusive;
            on target delete delete source;
        };
    }

    type OAuth2Account extending Base {
        required user: User {
            on target delete delete source;
        };
        required provider: str;
        required provider_user_id: str {
            constraint exclusive;
        };
        index on (.provider);
        index on (.provider_user_id)
    }

    type Session extending Base {
        required user: User {
            on target delete delete source;
        };
        required expires_at: datetime;
        required session_id: str {
            constraint exclusive;
        };
        index on ((.session_id));
    }

    type EmailVerificationCode extending Base {
        required user: User {
            constraint exclusive;
            on target delete delete source;
        };
        required code: str;
        required expires_at: datetime;
        index on ((.user));
    }

    type Community extending Base {
        multi members: User {
            on target delete allow;
        };
        multi channels := .<community[is Channel];
        multi messages := .<community[is Message];
        multi roles := .<community[is CommunityRole];
        multi emojis := .<community[is Emoji];
        icon_url: str;
        cover_url: str;
        required about: str;
        required name: str;
        required owner: User;

        index fts::index on ((
            fts::with_options(
                .name,
                language := fts::Language.eng
            ),
            fts::with_options(
                .about,
                language := fts::Language.eng
            )
        ));
    }

    scalar type CommunityPermission extending enum<
        Admin,
        ManageRoles,
        ManageChannels,
        ManageMessages,
        ManageMembers,
        SendMessages,
        CreateInvites,
    >;

    type CommunityRole extending Base {
        required community: Community;
        required name: str;
        required color: str;
        required multi permissions: CommunityPermission;
    }

    type Channel extending Base {
        required name: str;
        required community: Community;
        multi messages := .<channel[is Message];
        multi allowed_roles: CommunityRole;
        multi read_status := .<channel[is LastReadChannel];
    }

    type Emoji extending Base {
        required community: Community;
        required code: str;
        required emoji_url: str;
        constraint exclusive on ((.community, .code));
    }

    type Message extending Base {
        required sender: User {
            on target delete delete source;
        };
        required content: str;
        community: Community;
        channel: Channel;
        multi reactions := .<message[is MessageReact];
    }

    type MessageReact extending Base {
        required message: Message {
            on target delete delete source;
        };
        required user: User {
            on target delete delete source;
        };
        required emoji: Emoji {
            on target delete delete source;
        };
        constraint exclusive on ((.message, .user, .emoji));
    }

    type LastReadChannel extending Base {
        required user: User {
            on target delete delete source;
        };
        required channel: Channel;
        required last_read_at: datetime {
            default := datetime_current();
        };
        constraint exclusive on ((.user, .channel));
    }
}
