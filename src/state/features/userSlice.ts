import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Role = 'student' | 'unauthorized' | 'admin'
export type Video = number
export type Comment = {
  text: string,
  video: Video
}
export type Playlist = {
  name: string,
  videos: Video[]
}

export type User = {
  role: Role,
  username: string,
  isAuth: boolean,
  likes: Video[],
  comments: Comment[],
  playlists: Playlist[]
}

const initialUserState: User = {
  role: 'unauthorized',
  username: 'Guest',
  isAuth: false,
  likes: [],
  comments: [],
  playlists: []
}

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {

  }
})

export default userSlice.reducer