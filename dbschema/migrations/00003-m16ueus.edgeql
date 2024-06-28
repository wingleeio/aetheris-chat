CREATE MIGRATION m16ueushfej3lb6bwp6up2wfzitv7mqg5fojxzqonimrhzmi7tigba
    ONTO m1anbw4le3gmqeebwp6dgaxlyiys54xh65q6o32ykvcxziikqduipq
{
  CREATE TYPE default::Channel EXTENDING default::Base;
  CREATE TYPE default::Community EXTENDING default::Base {
      CREATE MULTI LINK members: default::User;
      CREATE REQUIRED LINK owner: default::User;
      CREATE REQUIRED PROPERTY name: std::str;
  };
  ALTER TYPE default::Channel {
      CREATE REQUIRED LINK community: default::Community;
  };
  ALTER TYPE default::Community {
      CREATE MULTI LINK channels := (.<community[IS default::Channel]);
  };
  CREATE TYPE default::Message EXTENDING default::Base {
      CREATE LINK channel: default::Channel;
      CREATE LINK community: default::Community;
      CREATE REQUIRED LINK sender: default::User;
      CREATE REQUIRED PROPERTY content: std::str;
  };
  ALTER TYPE default::Channel {
      CREATE MULTI LINK messages := (.<channel[IS default::Message]);
  };
  ALTER TYPE default::Community {
      CREATE MULTI LINK messages := (.<community[IS default::Message]);
  };
  CREATE SCALAR TYPE default::CommunityPermission EXTENDING enum<Admin, ManageRoles, ManageChannels, ManageMessages, ManageMembers, SendMessages, CreateInvites>;
  CREATE TYPE default::CommunityRole EXTENDING default::Base {
      CREATE REQUIRED LINK community: default::Community;
      CREATE REQUIRED PROPERTY color: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED MULTI PROPERTY permissions: default::CommunityPermission;
  };
  ALTER TYPE default::Community {
      CREATE MULTI LINK roles := (.<community[IS default::CommunityRole]);
  };
};
