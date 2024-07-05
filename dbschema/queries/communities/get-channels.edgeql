select Channel {
  id,
  name,
  owner_id := .community.owner.id,
  unread_count := count(
    .messages 
    filter .created_at > 
    (select .channel.read_status filter .user = <User>global current_user_id).last_read_at
  ),
}
filter .community.id = <uuid>$community_id