with 
  message := (select Message filter .id = <uuid>$message_id),
  is_member := count(message.channel.community.members filter .id = global current_user_id) > 0,
select is_member