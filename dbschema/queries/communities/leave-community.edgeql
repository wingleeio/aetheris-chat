update Community
filter .id = <uuid>$community_id
set {
    members -= <User>global current_user_id
}
