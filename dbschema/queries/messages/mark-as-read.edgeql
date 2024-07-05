insert LastReadChannel {
    user := <User>global current_user_id,
    channel := <Channel><uuid>$channel_id,
}
unless conflict on (.user, .channel) 
else (
    update LastReadChannel
    set {
        last_read_at := datetime_current()
    }
)
