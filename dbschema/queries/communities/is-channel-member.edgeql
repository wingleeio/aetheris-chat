with 
  channel := (select Channel filter .id = <uuid>$channel_id),
  is_member := count(channel.community.members filter .id = global current_user_id) > 0,
select is_member