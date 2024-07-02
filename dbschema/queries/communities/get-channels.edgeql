select Channel {
  id,
  name,
  owner_id := .community.owner.id,
}
filter .community.id = <uuid>$community_id