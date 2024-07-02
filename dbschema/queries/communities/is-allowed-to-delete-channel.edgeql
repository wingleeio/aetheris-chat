with 
  channel := (select Channel filter .id = <uuid>$channel_id),
  is_allowed := channel.community.owner.id = global current_user_id,
select is_allowed