with 
  community := (select Community filter .id = <uuid>$community_id),
  is_allowed := community.owner.id = global current_user_id,
select is_allowed