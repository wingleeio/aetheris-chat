select (insert Channel {
  name := <str>$name,
  community := <Community><uuid>$community_id,
}) {
  id
}