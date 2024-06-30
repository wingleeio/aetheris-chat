with 
  community := (select Community filter .id = <uuid>$community_id),
  is_member := count(community.members filter .id = global current_user_id) > 0,
select is_member