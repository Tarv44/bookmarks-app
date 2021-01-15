import React from 'react'

const BookmarksContext = React.createContext({
  bookmarks: [],
  addBookmark: () => {},
  editBookmark: () => {},
  deleteBookmark: () => {},
})

export default BookmarksContext