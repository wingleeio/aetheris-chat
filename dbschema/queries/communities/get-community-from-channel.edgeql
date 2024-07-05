select Community {
    id,
}
filter .channels.id = <uuid>$channel_id
limit 1
